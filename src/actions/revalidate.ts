"use server";

import { revalidatePath } from "next/cache";

export async function revalidateCampaigns() {
  revalidatePath("/campaigns", "layout");
}
