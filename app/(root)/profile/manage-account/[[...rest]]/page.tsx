import { UserProfile } from "@clerk/nextjs";

const UserProfilePage = () => (
  <div className="mx-auto flex w-full items-center justify-center pt-12">
    <UserProfile path="/profile/manage-account" />
  </div>
);

export default UserProfilePage;
