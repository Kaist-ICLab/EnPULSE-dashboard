import { redirect } from "next/navigation";

// Next 16 passes `params` as a Promise; reading it synchronously redirected to
// /campaigns/undefined/... and showed a 404.
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  redirect(`/campaigns/${id}/settings/general`);
}
