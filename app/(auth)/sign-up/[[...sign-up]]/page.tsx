import { SignUp } from "@clerk/nextjs";

const Page = () => {
  return (
    <div className="bg-[rbga(6, 3, 3, 0.711)] absolute z-20 flex h-screen w-full flex-col items-center justify-center backdrop-blur-sm">
      <SignUp />
    </div>
  );
};

export default Page;
