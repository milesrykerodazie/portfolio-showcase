import ProjectDetails from "@/components/ProjectDetails";
import { getProjectDetails } from "@/lib/actions";
import { getCurrentUser } from "@/lib/auth";
import { ProjectInterface } from "@/types";
import React from "react";

interface ProjectParams {
  slug: string;
}

const ProjectPage = async ({ params }: { params: ProjectParams }) => {
  //get the current user
  const session = await getCurrentUser();
  //getting the particular project
  const projectDetails = (await getProjectDetails(params)) as ProjectInterface;

  return (
    <>
      {projectDetails === null ? (
        <section>no project</section>
      ) : (
        <ProjectDetails projectDetails={projectDetails} session={session} />
      )}
    </>
  );
};

export default ProjectPage;
