// app/campaigns/[id]/page.tsx
import { redirect } from 'next/navigation';
import React from 'react';

type Props = {
  params: { id: string };
};

const Page: React.FC<Props> = async ({
  params
}) => {
  const { id } = await params
  redirect(`/campaigns/${id}/dashboard`);
}

export default Page;