"use client";

import React, { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import FormField from "./FormField";

import CustomMenu from "./CustomMenu";
import { categoryFilters } from "@/constant";
import { FormState, SessionInterface } from "@/types";
import { AiFillCloseCircle, AiOutlinePlus } from "react-icons/ai";
import { toast } from "react-hot-toast";
import { BiUpload } from "react-icons/bi";
import { FaSpinner } from "react-icons/fa";
import axios from "axios";

type Props = {
  session: SessionInterface;
};

const ProjectForm = ({ session }: Props) => {
  const route = useRouter();

  const [submitting, setSubmitting] = useState<boolean>(false);
  const [form, setForm] = useState<FormState>({
    title: "",
    description: "",
    images: [],
    liveSiteUrl: "",
    githubUrl: "",
    category: "",
  });

  const handleStateChange = (fieldName: keyof FormState, value: string) => {
    setForm((prevForm) => ({ ...prevForm, [fieldName]: value }));
  };

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

  const newProjectData = {
    title: form.title,
    description: form.description,
    images: form.images,
    liveSiteUrl: form.liveSiteUrl,
    githubUrl: form.githubUrl,
    category: form.category,
  };

  const canSubmit = [...Object.values(form)].every(Boolean);

  const handleFormSubmit = async (e: FormEvent) => {
    e.preventDefault();

    setSubmitting(true);
    if (!canSubmit) {
      toast.error("Check all fields.");
      return;
    }
    if (newProjectData.images.length > 5) {
      toast.error("Images can not be more than 5.");
      return;
    }

    try {
      const response = await axios.post("/api/create-project", newProjectData);
      if (response?.data) {
        if (response?.data?.success === true) {
          toast.success(response?.data?.message);
          setForm({
            title: "",
            description: "",
            images: [],
            liveSiteUrl: "",
            githubUrl: "",
            category: "",
          });
        }
        if (response?.data?.success === false) {
          toast.error(response?.data?.message);
        }
      }
    } catch (error) {
      console.log("create error => ", error);

      toast.error("Something went wrong.");
    } finally {
      setSubmitting(false);
      route.refresh();
    }
  };

  return (
    <form onSubmit={handleFormSubmit} className="flexStart form">
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
          required
          hidden
          className="form_image-input"
          onChange={(e) => handleFileChange(e)}
        />
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
                  onClick={() => removeImage(index)}
                />
              </div>
            ))}
          </div>
        )}
      </div>

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
              <span className="text-sm animate-pulse">Creating...</span>
              <FaSpinner className="animate-spin" />
            </div>
          ) : (
            <>
              <AiOutlinePlus className="text-white" />
              Create
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default ProjectForm;
