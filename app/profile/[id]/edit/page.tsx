import EditUserForm from "@/components/EditUserForm";
import GeneralModal from "@/components/modals/GeneralModal";
import { getUserBasicDetails } from "@/lib/actions";
import { UserBasicDetails } from "@/types";
import React from "react";

interface UserParams {
  id: string;
}

const EditProfilePage = async ({ params }: { params: UserParams }) => {
  //get user basic details
  const getUser = (await getUserBasicDetails(params)) as UserBasicDetails;
  return (
    <GeneralModal>
      <div className="w-[95%] lg:w-[80%] mx-auto">
        <h3 className="modal-head-text">Edit Profile</h3>

        <EditUserForm userData={getUser} />
      </div>
    </GeneralModal>
  );
};

export default EditProfilePage;
