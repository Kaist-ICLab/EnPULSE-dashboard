// app/campaigns/[id]/page.tsx
import { redirect } from 'next/navigation';

type Props = {
  params: { id: string };
};

export default function Page({ params }: Props) {
  redirect(`/campaigns/${params.id}/dashboard`);
}
