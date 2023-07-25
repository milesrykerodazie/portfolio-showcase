"use client";

import { formatCompactNumber } from "@/lib/helpers";
import { ProjectInterface, SessionInterface } from "@/types";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { AiFillHeart, AiOutlineEye, AiOutlineHeart } from "react-icons/ai";

const ProjectCard = ({
  project,
  session,
}: {
  project: ProjectInterface;
  session?: SessionInterface;
}) => {
  const hasLiked = project?.likes?.filter(
    (like) => like?.userId === session?.user?.id
  );

  //project view
  const viewProject = async (id: string) => {
    try {
      await axios.patch(`/api/project-view/${id}`);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="flexCenter flex-col bg-white rounded-lg sm:rounded-xl drop-shadow-md w-full">
      <Link
        href={`/project/${project.title_slug}`}
        onClick={() => {
          viewProject(project?.id);
        }}
        className="flexCenter group relative w-full h-full"
      >
        <Image
          src={project?.images[0].url}
          width={414}
          height={314}
          className="w-full h-full object-cover rounded-t-lg sm:rounded-t-2xl"
          alt="project image"
        />

        <div className="profile_card-title ">
          <p className="w-full tracking-wider font-semibold">{project.title}</p>
        </div>
      </Link>

      <div className="flexBetween p-1 sm:p-2 mt-3 font-semibold text-sm space-x-2">
        <Link href={`/profile/${project.owner_id}`}>
          <div className="flexCenter gap-2">
            <img
              src={project?.User?.image}
              className="rounded-full w-4 h-4 lg:w-5 lg:h-5"
              alt="profile image"
            />
            <p className="text-[10px] sm:text-xs text-primary truncate">
              {project?.User?.name}
            </p>
          </div>
        </Link>

        <div className="flexCenter gap-2">
          <div className="flexCenter gap-1">
            {hasLiked?.length > 0 ? (
              <AiFillHeart className="w-3 h-3 sm:w-4 sm:h-4 text-primary" />
            ) : (
              <AiOutlineHeart className="w-3 h-3 sm:w-4 sm:h-4 text-primary" />
            )}
            <p className="text-[10px] sm:text-xs text-primary">
              {project?.likes?.length}
            </p>
          </div>
          <div className="flexCenter gap-1">
            <AiOutlineEye className="text-primary" />
            <p className="text-[10px] sm:text-xs text-primary">
              {formatCompactNumber(project?.views)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
