import { supabase } from "@/lib/supabase";
import { AuthAccountInfo } from "@/types/account";
import { normalizeAccountEmail } from "@/utils/participantAccount";

const LIST_PAGE_SIZE = 1000;

/** Sign-in details of every Supabase Auth user, by user id. Profiles do not store these. */
export const getAuthAccountInfo = async (): Promise<Map<string, AuthAccountInfo>> => {
  const accounts = new Map<string, AuthAccountInfo>();
  for (let page = 1; ; page++) {
    const { data, error } = await supabase.auth.admin.listUsers({ page, perPage: LIST_PAGE_SIZE });
    if (error) throw new Error(error.message);
    data.users.forEach((user) =>
      accounts.set(user.id, {
        createdAt: user.created_at,
        lastSignInAt: user.last_sign_in_at ?? null,
      }),
    );
    if (data.users.length < LIST_PAGE_SIZE) break;
  }
  return accounts;
};

/**
 * Create an email/password account that is already in the campaign, and return its PID.
 *
 * The participant signs in to the app with it and lands in the campaign without entering
 * the campaign password: the app skips onboarding when the profile has a campaign_id. The
 * account is created already confirmed, so the address does not need a working inbox.
 *
 * The join goes through join_campaign_with_pid, as the join-campaign edge function does, so
 * the PID and campaign_join_log row match an in-app join. If any step after creating the
 * user fails, the user is deleted again; otherwise retrying would fail with "already exists".
 */
export const createCampaignAccount = async (campaignId: number, email: string, password: string): Promise<number> => {
  const normalizedEmail = normalizeAccountEmail(email);

  const { data, error } = await supabase.auth.admin.createUser({
    email: normalizedEmail,
    password,
    email_confirm: true,
  });
  if (error) {
    if (error.code === "email_exists") throw new Error("An account with this email address already exists.");
    throw new Error(error.message);
  }
  const uuid = data.user.id;

  try {
    // The app only creates a profile when none exists, so it keeps this one. Upsert in case a
    // database trigger already created the row for the new user.
    const { error: profileError } = await supabase
      .from("profiles")
      .upsert({ uuid, email: normalizedEmail }, { onConflict: "uuid" });
    if (profileError) throw new Error(profileError.message);

    const { data: pid, error: joinError } = await supabase.rpc("join_campaign_with_pid", {
      p_uuid: uuid,
      p_campaign_id: campaignId,
    });
    if (joinError) throw new Error(joinError.message);

    return pid;
  } catch (e) {
    const cause = e instanceof Error ? e.message : String(e);
    const { error: profileDeleteError } = await supabase.from("profiles").delete().eq("uuid", uuid);
    const { error: userDeleteError } = await supabase.auth.admin.deleteUser(uuid);
    if (profileDeleteError || userDeleteError) {
      throw new Error(
        `${cause} The account ${normalizedEmail} was created but could not be removed again; delete it in Supabase before retrying.`,
      );
    }
    throw new Error(cause);
  }
};

/**
 * Delete an account that has never signed in, with its profile and join log entry.
 *
 * Accounts that have signed in may have collected data, which would be left without a
 * participant (sensor tables) or block the delete (tables linked to profiles), so they are
 * refused. The sign-in time is read again here rather than trusted
 * from the page, in case the participant signed in after it loaded.
 */
export const deleteUnusedAccount = async (uuid: string): Promise<void> => {
  const { data, error } = await supabase.auth.admin.getUserById(uuid);
  if (error) throw new Error(error.message);
  if (data.user.last_sign_in_at) {
    throw new Error("This account has already signed in, so it may have collected data and can't be deleted.");
  }

  // Children first: campaign_join_log references the profile.
  const { error: joinLogError } = await supabase.from("campaign_join_log").delete().eq("uuid", uuid);
  if (joinLogError) throw new Error(joinLogError.message);
  const { error: profileError } = await supabase.from("profiles").delete().eq("uuid", uuid);
  if (profileError) throw new Error(profileError.message);
  const { error: userError } = await supabase.auth.admin.deleteUser(uuid);
  if (userError) {
    throw new Error(
      `Removed the participant from the campaign, but could not delete the sign-in account: ${userError.message}`,
    );
  }
};
