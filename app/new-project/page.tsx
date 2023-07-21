import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/auth";
import GeneralModal from "@/components/modals/GeneralModal";
import ProjectForm from "@/components/ProjectForm";

const CreateProject = async () => {
  const session = await getCurrentUser();

  if (!session?.user) redirect("/");

  return (
    <GeneralModal>
      <h3 className="modal-head-text">Create a New Project</h3>

      <ProjectForm session={session} />
    </GeneralModal>
  );
};

export default CreateProject;
