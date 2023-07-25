"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { AiFillDelete, AiFillEdit } from "react-icons/ai";
import Delete from "./modals/Delete";
import axios from "axios";
import { toast } from "react-hot-toast";
import { signOut } from "next-auth/react";

type Props = {
  parameter: string;
  user?: boolean;
};

const ProjectActions = ({ parameter, user }: Props) => {
  const [openModal, setOpenModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [deleteParam, setDeleteParam] = useState("");
  const route = useRouter();

  //the delete function
  const handleDelete = async () => {
    setIsDeleting(true);

    if (user) {
      try {
        const deleteRes = await axios.delete(`/api/user/${deleteParam}/delete`);
        if (deleteRes?.data) {
          if (deleteRes?.data?.success === true) {
            toast.success(deleteRes?.data?.message);
            setIsDeleting(false);
            signOut();
            route.push("/");
          }
          if (deleteRes?.data?.success === false) {
            toast.error(deleteRes?.data?.message);
          }
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsDeleting(false);
        setOpenModal(false);
      }
    } else {
      try {
        const deleteRes = await axios.delete(
          `/api/project/${deleteParam}/delete`
        );
        if (deleteRes?.data) {
          if (deleteRes?.data?.success === true) {
            toast.success(deleteRes?.data?.message);
          }
          if (deleteRes?.data?.success === false) {
            toast.error(deleteRes?.data?.message);
          }
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsDeleting(false);
        setOpenModal(false);
        route.push("/");
      }
    }
  };

  return (
    <div className="relative flex items-center flex-nowrap space-x-3 w-full h-full">
      <Link
        href={
          user ? `/profile/${parameter}/edit` : `/project/${parameter}/edit`
        }
        className="flexCenter edit-action_btn"
      >
        <AiFillEdit className="text-primary" />
      </Link>

      <button
        type="button"
        className={`flexCenter delete-action_btn ${
          isDeleting ? "opacity-40 drop-shadow-md" : "bg-white drop-shadow-md"
        }`}
        onClick={() => {
          setOpenModal(true);
          setDeleteParam(parameter);
        }}
      >
        <AiFillDelete className="text-red-600" />
      </button>
      {openModal && (
        <Delete
          deleteEntry={handleDelete}
          setOpenModal={setOpenModal}
          deleting={isDeleting}
        />
      )}
    </div>
  );
};

export default ProjectActions;
