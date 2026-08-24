import { redirect } from "next/navigation";

const Page: React.FC<{ params: { id: string } }> = ({ params }) => {
  const { id } = params;
  redirect(`/campaigns/${id}/settings/general`);
};

export default Page;
