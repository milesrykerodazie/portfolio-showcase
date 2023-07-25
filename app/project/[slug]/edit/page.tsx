import EditProjectForm from "@/components/EditProjectForm";
import GeneralModal from "@/components/modals/GeneralModal";
import { getProjectDetails } from "@/lib/actions";
import { ProjectInterface } from "@/types";
import React from "react";

interface ProjectParams {
  slug: string;
}

const EditProjectPage = async ({ params }: { params: ProjectParams }) => {
  //getting the particular project
  const projectDetails = (await getProjectDetails(params)) as ProjectInterface;
  return (
    <GeneralModal>
      <div className="w-[95%] lg:w-[80%] mx-auto">
        <h3 className="modal-head-text">Edit Project</h3>

        <EditProjectForm projectDetails={projectDetails} />
      </div>
    </GeneralModal>
  );
};

export default EditProjectPage;
