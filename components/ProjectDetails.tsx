"use client";
import { ProjectInterface, SessionInterface } from "@/types";
import Image from "next/image";
import React from "react";
import GeneralModal from "./modals/GeneralModal";
import Link from "next/link";
import { BsDot } from "react-icons/bs";
import { AiFillGithub } from "react-icons/ai";
import ProjectActions from "./ProjectActions";

const ProjectDetails = ({
  projectDetails,
  session,
}: {
  projectDetails: ProjectInterface;
  session: SessionInterface;
}) => {
  return (
    <GeneralModal>
      <section className="flexBetween gap-y-8 max-w-4xl max-xs:flex-col w-full">
        <div className="flex-1 flex items-start gap-5 w-full">
          <Link href="">
            <Image
              src={projectDetails?.User?.image}
              width={50}
              height={50}
              alt="profile"
              className="rounded-full"
            />
          </Link>

          <div className="flex-1 flexStart flex-col gap-1">
            <p className="self-start text-sm md:text-base lg:text-lg font-semibold text-primary">
              {projectDetails?.title}
            </p>
            <div className="user-info">
              <Link href="">{projectDetails?.User?.name}</Link>
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
            <ProjectActions projectSlug={projectDetails?.title_slug} />
          </div>
        )}
      </section>

      <section className="mt-14">
        <Image
          src={`${projectDetails?.images[0].url}`}
          className="object-cover rounded-2xl"
          width={1064}
          height={798}
          alt="poster"
        />
      </section>

      <section className="flexCenter flex-col mt-20">
        <p className="max-w-5xl text-sm lg:text-base">
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

      <section className="flexCenter w-full gap-8 mt-28">
        <span className="w-full h-0.5 bg-light-white-200" />
        <Link href="" className="min-w-[82px] h-[82px]">
          <Image
            src={projectDetails?.User?.image}
            className="rounded-full"
            width={82}
            height={82}
            alt="profile image"
          />
        </Link>
        <span className="w-full h-0.5 bg-light-white-200" />
      </section>

      {/* <RelatedProjects userId={projectDetails?.createdBy?.id} projectId={projectDetails?.id} /> */}
    </GeneralModal>
  );
};

export default ProjectDetails;
