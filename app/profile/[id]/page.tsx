import ProfilePage from "@/components/ProfilePage";
import { getUser } from "@/lib/actions";
import { getCurrentUser } from "@/lib/auth";
import { UserProfile } from "@/types";
import React from "react";

interface UserParams {
  id: string;
}

const UserProfileDetails = async ({ params }: { params: UserParams }) => {
  //get current user
  const currentUser = await getCurrentUser();
  //get user
  const user = (await getUser(params)) as UserProfile;

  return (
    <>
      {user === null ? (
        <section className="flex items-center justify-center py-10 text-primary lg:text-lg">
          User Not Found!!
        </section>
      ) : (
        <ProfilePage user={user} session={currentUser} />
      )}
    </>
  );
};

export default UserProfileDetails;
