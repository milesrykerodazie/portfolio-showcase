"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { AiFillDelete, AiFillEdit } from "react-icons/ai";

type Props = {
  projectSlug: string;
};

const ProjectActions = ({ projectSlug }: Props) => {
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const router = useRouter();

  const handleDeleteProject = async () => {
    setIsDeleting(true);

    try {
    } catch (error) {
      console.error(error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <Link
        href={`/project/${projectSlug}/edit`}
        className="flexCenter edit-action_btn"
      >
        <AiFillEdit className="text-primary" />
      </Link>

      <button
        type="button"
        disabled={isDeleting}
        className={`flexCenter delete-action_btn ${
          isDeleting ? "bg-gray drop-shadow-md" : "bg-white drop-shadow-md"
        }`}
        onClick={handleDeleteProject}
      >
        <AiFillDelete className="text-red-600" />
      </button>
    </>
  );
};

export default ProjectActions;
