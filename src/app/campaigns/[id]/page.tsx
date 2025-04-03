// app/campaigns/[id]/page.tsx
import { redirect } from 'next/navigation';
import React from 'react';

type Props = {
  params: { id: string };
};

const Page: React.FC<Props> = async ({
  params
}) => {
  redirect(`/campaigns/${params.id}/dashboard`);
}

export default Page;