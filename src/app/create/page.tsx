import { redirect } from "next/navigation";

const Page: React.FC = async () => {
  redirect("/create/general");
};

export default Page;
