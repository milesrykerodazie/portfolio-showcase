import ProjectDetails from "@/components/ProjectDetails";
import { getProjectDetails, getRelatedProjects } from "@/lib/actions";
import { getCurrentUser } from "@/lib/auth";
import { ProjectInterface } from "@/types";
import React from "react";

interface ProjectParams {
  slug: string;
}

export const dynamic = "force-dynamic";
export const dynamicParams = true;
export const revalidate = 0;

const ProjectPage = async ({ params }: { params: ProjectParams }) => {
  //get the current user
  const session = await getCurrentUser();
  //getting the particular project
  const projectDetails = (await getProjectDetails(params)) as ProjectInterface;

  const relatedProjects = (await getRelatedProjects(
    projectDetails?.owner_id,
    projectDetails?.id
  )) as ProjectInterface[];

  return (
    <>
      {projectDetails === null ? (
        <section className=" text-center text-primary text-sm lg:text-base">
          Project Not found.
        </section>
      ) : (
        <ProjectDetails
          projectDetails={projectDetails}
          relatedProjects={relatedProjects}
          session={session}
        />
      )}
    </>
  );
};

export default ProjectPage;
