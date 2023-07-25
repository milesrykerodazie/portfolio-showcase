"use client";
import { ProjectInterface, SessionInterface } from "@/types";
import Image from "next/image";
import React from "react";
import GeneralModal from "./modals/GeneralModal";
import Link from "next/link";
import { BsDot } from "react-icons/bs";
import {
  AiFillGithub,
  AiOutlineHeart,
  AiFillHeart,
  AiOutlineEye,
} from "react-icons/ai";
import ProjectActions from "./ProjectActions";
import RelatedProjects from "./RelatedProjects";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { formatCompactNumber } from "@/lib/helpers";

const ProjectDetails = ({
  projectDetails,
  session,
  relatedProjects,
}: {
  projectDetails: ProjectInterface;
  session: SessionInterface;
  relatedProjects: ProjectInterface[];
}) => {
  const route = useRouter();
  const hasLiked = projectDetails?.likes?.filter(
    (like) => like?.userId === session?.user?.id
  );

  //like project
  const handleLike = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    try {
      if (!session?.user) {
        toast.error("Login to like.");
        return;
      }
      const response = await axios.post(
        `/api/like-project/${projectDetails?.id}`,
        {
          userId: session?.user?.id,
        }
      );
      if (response?.data) {
        if (response?.data?.success === true) {
          toast.success(response?.data?.message);
          route.refresh();
        }
        if (response?.data?.success === false) {
          toast.error(response?.data?.message);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <GeneralModal>
      <div className="w-[95%] lg:w-[80%] mx-auto">
        <section className="flexBetween gap-y-8 max-xs:flex-col w-full">
          <div className="flex-1 flex items-start gap-5 w-full">
            <Link
              href={`/profile/${projectDetails?.owner_id}`}
              className="w-7 h-7 sm:w-10 sm:h-10"
            >
              <Image
                src={projectDetails?.User?.image}
                width={50}
                height={50}
                alt="profile"
                className="rounded-full"
              />
            </Link>

            <div className="flex-1 flexStart flex-col gap-1">
              <p className="self-start text-sm md:text-base lg:text-lg font-semibold text-primary capitalize flex-wrap">
                {projectDetails?.title}
              </p>
              <div className="user-info">
                <Link href={`/profile/${projectDetails?.owner_id}`}>
                  {projectDetails?.User?.name}
                </Link>
                <BsDot className="w-5 h-5" />
                <Link
                  href={`/?category=${projectDetails.category}`}
                  className="font-semibold"
                >
                  {projectDetails?.category}
                </Link>
              </div>
            </div>
          </div>

          {session?.user?.id === projectDetails?.owner_id && (
            <div className="flex justify-end items-center gap-2">
              <ProjectActions parameter={projectDetails?.title_slug} />
            </div>
          )}
        </section>

        <section className="mt-10 md:mt-14">
          <div className="pb-3 flex justify-between items-center">
            <div className="flexCenter gap-1">
              <span className="text-[10px] sm:text-xs text-primary font-semibold">
                Views
              </span>
              <AiOutlineEye className="text-primary" />
              <span className="text-[10px] sm:text-xs text-primary">
                {formatCompactNumber(projectDetails?.views)}
              </span>
            </div>
            <button onClick={handleLike}>
              {hasLiked?.length > 0 ? (
                <AiFillHeart className="w-5 h-5 text-primary" />
              ) : (
                <AiOutlineHeart className="w-5 h-5 text-primary" />
              )}
            </button>
          </div>

          <Carousel infiniteLoop={true}>
            {projectDetails?.images.map((image) => (
              <div key={image?.id}>
                <img
                  src={image?.url}
                  className="object-cover rounded-lg w-full"
                  alt="poster"
                />
              </div>
            ))}
          </Carousel>
        </section>

        <section className="flexCenter flex-col mt-10 md:mt-20">
          <p className="max-w-5xl text-xs lg:text-sm leading-relaxed">
            {projectDetails?.description}
          </p>

          <div className="flex flex-wrap mt-5 gap-5">
            <Link
              href={projectDetails?.githubUrl}
              target="_blank"
              rel="noreferrer"
              className=" tracking-wide flexCenter gap-2 text-xs lg:tex-sm font-medium text-primary"
            >
              <AiFillGithub className="text-black w-4 h-4" />{" "}
              <span className="underline">Github</span>
            </Link>
            <BsDot className="w-5 h-5 text-primary" />
            <Link
              href={projectDetails?.liveSiteUrl}
              target="_blank"
              rel="noreferrer"
              className="tracking-wide flexCenter gap-2 text-xs lg:tex-sm font-medium text-primary"
            >
              🌐︎ <span className="underline">Live Site</span>
            </Link>
          </div>
        </section>

        <section className="flexCenter w-full gap-8 mt-12 md:mt-28">
          <span className="w-full h-0.5 bg-light-white-200" />
          <Image
            src={projectDetails?.User?.image}
            className="rounded-full"
            width={50}
            height={50}
            alt="profile image"
          />
          <span className="w-full h-0.5 bg-light-white-200" />
        </section>

        <RelatedProjects
          relatedProjects={relatedProjects}
          name={projectDetails?.User?.name}
          id={projectDetails?.owner_id}
          session={session}
        />
      </div>
    </GeneralModal>
  );
};

export default ProjectDetails;
