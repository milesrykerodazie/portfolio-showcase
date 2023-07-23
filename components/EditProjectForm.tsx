"use client";

import React, { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import FormField from "./FormField";

import CustomMenu from "./CustomMenu";
import { categoryFilters } from "@/constant";
import { FormState, ProjectInterface, SessionInterface } from "@/types";
import {
  AiFillCloseCircle,
  AiFillDelete,
  AiFillEye,
  AiFillEyeInvisible,
  AiOutlinePlus,
} from "react-icons/ai";
import { toast } from "react-hot-toast";
import { BiUpload } from "react-icons/bi";
import { FaSpinner } from "react-icons/fa";
import axios from "axios";

const EditProjectForm = ({
  projectDetails,
}: {
  projectDetails: ProjectInterface;
}) => {
  const route = useRouter();

  const [submitting, setSubmitting] = useState<boolean>(false);
  const [image, setImage] = useState("");
  const [selectedImage, setSelectedImage] = useState("");
  const [deletingImg, setDeletingImg] = useState(false);
  const [form, setForm] = useState<FormState>({
    title: projectDetails?.title,
    description: projectDetails?.description,
    images: [],
    liveSiteUrl: projectDetails?.liveSiteUrl,
    githubUrl: projectDetails?.githubUrl,
    category: projectDetails?.category,
  });

  const handleStateChange = (fieldName: keyof FormState, value: string) => {
    setForm((prevForm) => ({ ...prevForm, [fieldName]: value }));
  };

  //handling the onChange of the images,
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const selectedImages = Array.from(files);

      // Convert selected images to base64
      const imagePromises = selectedImages.map((image: File) => {
        return new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            const base64String = reader.result as string;
            resolve(base64String);
          };
          reader.readAsDataURL(image);
        });
      });

      // Wait for all images to be converted to base64
      Promise.all(imagePromises)
        .then((base64Images: string[]) => {
          setForm((prevFormData) => ({
            ...prevFormData,
            images: [...prevFormData.images, ...base64Images],
          }));
        })
        .catch((error) => {
          // Handle any errors that occurred during base64 conversion
          console.error("Error converting images to base64:", error);
        });
    }
  };

  //removing specific image fom the selected images
  const removeImage = (index: number) => {
    setForm((prevFormData) => {
      const updatedImages = [...prevFormData.images];
      updatedImages.splice(index, 1);
      return {
        ...prevFormData,
        images: updatedImages,
      };
    });
  };

  //delete any of the nexisting images
  const deleteImage = async (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    e.preventDefault();
    setDeletingImg(true);

    if (!selectedImage) {
      return;
    }
    //the deleting starts here
    try {
      const deleteResponse = await axios.delete(
        `/api/project/delete-image/${selectedImage}`
      );
      if (deleteResponse?.data) {
        if (deleteResponse?.data?.success === true) {
          toast.success(deleteResponse?.data?.message);
        }
        if (deleteResponse?.data?.success === false) {
          toast.error(deleteResponse?.data?.message);
        }
      }
      setImage("");
    } catch (error) {
      console.log(error);

      setImage("");
    } finally {
      setDeletingImg(false);
      route.refresh();
    }
  };

  const canSubmit = [...Object.values(form)].every(Boolean);

  //strict number of images
  const numOfImgs = projectDetails?.images?.length + form?.images.length > 5;

  const newProjectData = {
    title: form.title,
    description: form.description,
    images: form.images,
    liveSiteUrl: form.liveSiteUrl,
    githubUrl: form.githubUrl,
    category: form.category,
  };

  //update or edit the project details
  const handleFormSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (numOfImgs) {
        toast.error("Total project images can not be more than 5.");
        return;
      }

      if (!canSubmit) {
        toast.error("Check fields.");
        return;
      }
      const response = await axios.patch(
        `/api/project/${projectDetails?.title_slug}/edit`,
        newProjectData
      );
      if (response?.data) {
        if (response?.data?.success === true) {
          toast.success(response?.data?.message);
          route.push(`/project/${response?.data?.slug}`);
        }
        if (response?.data?.success === false) {
          toast.error(response?.data?.message);
        }
      }
      setSubmitting(false);
    } catch (error: any) {
      console.log("error => ", error?.response?.data);
      setSubmitting(false);
    } finally {
      setSubmitting(false);
      route.refresh();
    }
  };

  return (
    <form onSubmit={handleFormSubmit} className="flexStart form">
      {projectDetails?.images?.length > 0 && (
        <>
          <p className="text-xs lg:text-sm text-primary">Existing Images</p>
          <div className="form_image">
            {projectDetails?.images?.map((img) => (
              <div
                className="relative w-full"
                key={img?.id}
                onClick={(e) => {
                  e.preventDefault();
                  setImage(img?.url), setSelectedImage(img?.id);
                }}
              >
                <img
                  src={img?.url}
                  alt="img"
                  className=" object-contain rounded-md relative"
                />
                <div className="absolute bg-black/40 inset-0 rounded-md w-full h-full cursor-pointer flex justify-center items-center">
                  {image && image === img?.url ? (
                    <AiFillEyeInvisible className="w-10 h-10" />
                  ) : (
                    <AiFillEye className="w-10 h-10" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {image && (
        <div className="w-full rounded-sm space-y-1">
          <p className="text-center text-sm lg:text-base text-primary">
            Image Preview
          </p>
          <div className="relative">
            <img
              src={image}
              alt="Preview"
              className="w-full rounded-md object-contain"
            />
            <AiFillCloseCircle
              className="absolute -top-3 text-red-600 w-6 h-6 -right-2 cursor-pointer"
              onClick={() => setImage("")}
            />
          </div>
          <div
            onClick={deleteImage}
            className="flex items-center justify-center gap-x-2 py-2 bg-primary rounded-md cursor-pointer hover:bg-opacity-80 trans"
          >
            <AiFillDelete
              className={
                deletingImg ? "text-red-600 animate-pulse" : "text-red-600"
              }
            />
            <span className="text-white">
              {deletingImg ? <FaSpinner className="animate-spin" /> : "Delete"}
            </span>
          </div>
        </div>
      )}
      <div className="flex flex-col w-full space-y-3">
        <label
          htmlFor="image"
          className="text-sm lg:text-base text-white justify-center p-1 rounded-md flex items-center space-x-3 bg-primary"
        >
          <BiUpload />
          <span>Select Project Images</span>
          <span>({form.images.length})</span>
        </label>
        <input
          id="image"
          type="file"
          accept="image/*"
          multiple
          hidden
          className="form_image-input"
          onChange={(e) => handleFileChange(e)}
        />
      </div>
      {form.images.length > 0 && (
        <div className="form_image-label">
          {form.images.map((image, index) => (
            <div className="relative" key={index}>
              <img
                src={image}
                alt="img"
                className="w-full h-24 object-contain rounded-sm"
              />
              <AiFillCloseCircle
                className="absolute -top-3 text-red-600 w-6 h-6 -right-1 cursor-pointer"
                onClick={(e) => {
                  e.preventDefault();
                  removeImage(index);
                }}
              />
            </div>
          ))}
        </div>
      )}

      <FormField
        title="Title"
        state={form.title}
        placeholder="Project Title"
        setState={(value) => handleStateChange("title", value)}
      />

      <FormField
        title="Description"
        state={form.description}
        placeholder="Showcase and discover remarkable developer projects."
        isTextArea
        setState={(value) => handleStateChange("description", value)}
      />

      <FormField
        type="url"
        title="Website URL"
        state={form.liveSiteUrl}
        placeholder="Build url"
        setState={(value) => handleStateChange("liveSiteUrl", value)}
      />

      <FormField
        type="url"
        title="GitHub URL"
        state={form.githubUrl}
        placeholder="Github url"
        setState={(value) => handleStateChange("githubUrl", value)}
      />

      <CustomMenu
        title="Category"
        state={form.category}
        filters={categoryFilters}
        setState={(value) => handleStateChange("category", value)}
      />

      <div className="flexStart w-full">
        <button
          type="submit"
          disabled={submitting}
          className={`flexCenter gap-2 p-2 lg:px-4 lg:py-3 text-xs lg:text-sm 
            text-white bg-primary rounded-md disabled:opacity-25 disabled:cursor-not-allowed`}
        >
          {submitting ? (
            <div className="gap-2 flex items-center justify-center">
              <span className="text-sm animate-pulse">Updating...</span>
              <FaSpinner className="animate-spin" />
            </div>
          ) : (
            <>
              <AiOutlinePlus className="text-white" />
              Edit
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default EditProjectForm;
