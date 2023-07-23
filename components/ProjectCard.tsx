"use client";

import { ProjectInterface } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AiOutlineEye, AiOutlineHeart } from "react-icons/ai";

const ProjectCard = ({ project }: { project: ProjectInterface }) => {
  const [randomLikes, setRandomLikes] = useState(0);
  const [randomViews, setRandomViews] = useState("");

  useEffect(() => {
    setRandomLikes(Math.floor(Math.random() * 10000));
    setRandomViews(
      String((Math.floor(Math.random() * 10000) / 1000).toFixed(1) + "k")
    );
  }, []);

  return (
    <div className="flexCenter flex-col rounded-2xl drop-shadow-card">
      <Link
        href={`/project/${project.title_slug}`}
        className="flexCenter group relative w-full h-full"
      >
        <Image
          src={project?.images[0].url}
          width={414}
          height={314}
          className="w-full h-full object-cover rounded-2xl"
          alt="project image"
        />

        <div className="hidden group-hover:flex profile_card-title transition-all duration-300 ease-out">
          <p className="w-full text-sm lg:text-base text-primary tracking-wider font-semibold">
            {project.title}
          </p>
        </div>
      </Link>

      <div className="flexBetween w-full px-2 mt-3 font-semibold text-sm space-x-2">
        <Link href={`/profile/${project.owner_id}`}>
          <div className="flexCenter gap-2">
            <Image
              src={project?.User?.image}
              width={24}
              height={24}
              className="rounded-full"
              alt="profile image"
            />
            <p className="text-xs text-primary truncate">
              {project?.User?.name}
            </p>
          </div>
        </Link>

        <div className="flexCenter gap-3">
          <div className="flexCenter gap-1">
            <AiOutlineHeart className="text-primary" />
            <p className="text-xs text-primary">{randomLikes}</p>
          </div>
          <div className="flexCenter gap-2">
            <AiOutlineEye className="text-primary" />
            <p className="text-xs text-primary">{randomViews}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
