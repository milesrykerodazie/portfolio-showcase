"use client";
import React, { FormEvent, useState } from "react";
import { BiUpload } from "react-icons/bi";
import FormField from "./FormField";
import { FaSpinner } from "react-icons/fa";
import { AiFillCloseCircle, AiFillEdit } from "react-icons/ai";
import { UserBasicDetails, UserForm } from "@/types";
import { toast } from "react-hot-toast";
import axios from "axios";
import { useRouter } from "next/navigation";

const EditUserForm = ({ userData }: { userData: UserBasicDetails }) => {
  const route = useRouter();
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [form, setForm] = useState<UserForm>({
    name: userData?.name,
    username: userData?.username ? userData?.username : "",
    profession: userData?.profession ? userData?.profession : "",
    shortDescription: userData?.shortDescription
      ? userData?.shortDescription
      : "",
    portfolioImage: "",
    linkedinUrl: userData?.linkedinUrl ? userData?.linkedinUrl : "",
    email: userData?.email,
    image: "",
  });

  const [count, setCount] = useState(
    form.shortDescription.length > 0 ? form.shortDescription.length : 0
  );

  const handleStateChange = (fieldName: keyof UserForm, value: string) => {
    // setForm((prevForm) => ({ ...prevForm, [fieldName]: value }));
    setForm((prevForm) => {
      const updatedForm = { ...prevForm, [fieldName]: value };
      if (fieldName === "shortDescription") {
        setCount(value.length);
      }
      return updatedForm;
    });
  };

  //image on change
  const handleProfilePicChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (file) {
      const reader = new FileReader();

      reader.onloadend = () => {
        const base64String = reader.result as string;
        setForm((prevFormData) => ({
          ...prevFormData,
          image: base64String,
        }));
      };

      reader.readAsDataURL(file);
    }
  };

  const handlePortfolioPicChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (file) {
      const reader = new FileReader();

      reader.onloadend = () => {
        const base64String = reader.result as string;
        setForm((prevFormData) => ({
          ...prevFormData,
          portfolioImage: base64String,
        }));
      };

      reader.readAsDataURL(file);
    }
  };

  const canSubmit = form?.name !== "" && form?.profession !== "";

  const userUpdateData = {
    name: form?.name,
    username: form?.username,
    profession: form?.profession,
    shortDescription: form?.shortDescription,
    linkedinUrl: form?.linkedinUrl,
    image: form?.image,
    portfolioImage: form?.portfolioImage,
  };

  const handleUpdate = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (!canSubmit) {
        toast.error("Check fields.");
        return;
      }

      const response = await axios.patch(
        `/api/user/${userData?.id}/edit`,
        userUpdateData
      );
      if (response?.data) {
        if (response?.data?.success === true) {
          toast.success(response?.data?.message);
          route.push(`/profile/${response?.data?.userId}`);
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
    <form onSubmit={handleUpdate} className="space-y-3 form">
      {/* image display */}
      <div className="flex flex-col space-y-10 md:space-y-0 md:flex-row w-full md:justify-between pb-10">
        <div className="space-y-2 relative flex flex-col items-center h-full w-full">
          <span className="text-primary text-sm">Profile Picture</span>
          <img
            src={
              form?.image ? form?.image : userData?.image ? userData?.image : ""
            }
            alt="profile-pic"
            className="w-24 h-24 md:w-44 md:h-44 object-cover rounded-full"
          />
          {form?.image && (
            <AiFillCloseCircle
              className="absolute top-5 ml-16  text-red-600 w-6 h-6 cursor-pointer"
              onClick={() =>
                setForm((prev) => ({
                  ...prev,
                  image: "",
                }))
              }
            />
          )}

          <div className="absolute -bottom-6 flex flex-col space-y-3 items-center">
            <label
              htmlFor="image"
              className="text-primary flex items-center space-x-1 cursor-pointer"
            >
              <BiUpload className="w-4 h-4" />
              <span className="font-semibold text-xs">Change Pic</span>
            </label>
            <input
              id="image"
              type="file"
              accept="image/*"
              hidden
              onChange={(e) => handleProfilePicChange(e)}
            />
          </div>
        </div>
        <div className="space-y-2 relative flex flex-col items-center h-full w-full">
          <span className="text-primary text-sm">Portfolio Poster</span>
          <img
            src={
              form?.portfolioImage
                ? form?.portfolioImage
                : userData?.portfolioImage
                ? userData?.portfolioImage
                : "/images/no_image.jpg"
            }
            alt="portfolio-pic"
            className="w-full object-cover rounded-md"
          />
          {form?.portfolioImage && (
            <AiFillCloseCircle
              className="absolute top-3 -right-2  text-red-600 w-6 h-6 cursor-pointer"
              onClick={() =>
                setForm((prev) => ({
                  ...prev,
                  portfolioImage: "",
                }))
              }
            />
          )}

          <div className="absolute -bottom-6 flex flex-col w-full space-y-3 items-center">
            <label
              htmlFor="portfolio-poster"
              className="text-primary flex items-center space-x-1 cursor-pointer"
            >
              <BiUpload className="w-4 h-4" />
              <span className="font-semibold text-xs">Change Poster</span>
            </label>
            <input
              id="portfolio-poster"
              type="file"
              accept="image/*"
              hidden
              onChange={(e) => handlePortfolioPicChange(e)}
            />
          </div>
        </div>
      </div>

      <FormField
        title="Name"
        state={form?.name}
        placeholder="Your name"
        require={true}
        setState={(value) => handleStateChange("name", value)}
      />

      <FormField
        title="Username"
        state={form?.username ? form?.username : ""}
        placeholder="Username"
        require={false}
        setState={(value) => handleStateChange("username", value)}
      />

      <div>
        <label className="w-full text-primary text-sm lg:text-base">
          Email
        </label>
        <p className="form_field-input">{form?.email}</p>
      </div>

      <FormField
        type="url"
        title="LinkedIn URL"
        state={form?.linkedinUrl}
        placeholder="LinkedIn url"
        require={false}
        setState={(value) => handleStateChange("linkedinUrl", value)}
      />

      <FormField
        title="Profession"
        state={form?.profession ? form?.profession : ""}
        placeholder="Profession / skill"
        require={true}
        setState={(value) => handleStateChange("profession", value)}
      />

      <FormField
        title="Bio"
        state={form?.shortDescription ? form?.shortDescription : ""}
        placeholder="Bio"
        isTextArea
        bio
        count={count}
        require={false}
        setState={(value) => handleStateChange("shortDescription", value)}
      />

      <div className="flexStart w-full">
        <button
          type="submit"
          disabled={!canSubmit}
          className={`flexCenter gap-2 p-2 lg:px-4 lg:py-3 text-xs lg:text-sm 
        text-white bg-primary rounded-md disabled:opacity-25 disabled:cursor-not-allowed w-full`}
        >
          {submitting ? (
            <div className="gap-2 flex items-center justify-center">
              <span className="text-sm animate-pulse">Updating...</span>
              <FaSpinner className="animate-spin" />
            </div>
          ) : (
            <>
              <AiFillEdit className="text-white" />
              Update
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default EditUserForm;
