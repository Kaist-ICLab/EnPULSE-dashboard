import { redirect } from 'next/navigation';
import React from 'react';

const Page: React.FC = async () => {
  redirect("/campaigns")
}

export default Page;