"use server";

import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { fetchUser } from "@/utils/supabase/authActions";
import { SupabaseClient, User } from "@supabase/supabase-js";
import { getAdminClient } from "@/utils/supabase/admin";

export const updateUserFirstName = async (
  first_name: string
): Promise<boolean> => {
  "use server";

  const user = await fetchUser();
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { data, error } = await supabase
    .from("profiles")
    .upsert({ user_id: user?.id, first_name: first_name })
    .select();

  if (error) {
    return false;
  }

  console.log(data);

  return true;
};

export const updateUserLastName = async (
  last_name: string
): Promise<boolean> => {
  "use server";

  const user = await fetchUser();
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { data, error } = await supabase
    .from("profiles")
    .upsert({ user_id: user?.id, last_name: last_name })
    .select();

  if (error) {
    return false;
  }

  console.log(data);

  return true;
};

export const updateUserProgram = async (program: string): Promise<boolean> => {
  "use server";

  const user = await fetchUser();
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { data, error } = await supabase
    .from("profiles")
    .upsert({ user_id: user?.id, program: program })
    .select();

  if (error) {
    return false;
  }

  console.log(data);

  return true;
};

export const getUserData = async (): Promise<any> => {
  "use server";

  const user = await fetchUser();
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", user?.id);

  if (error) {
    return null;
  }
  return data;
};

export const deleteUserAccount = async (): Promise<any> => {
  "use server";

  const user = await fetchUser();
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  await deleteUserCourseReviews(supabase, user?.id!);

  await deleteUserInstructorReviews(supabase, user?.id!);

  await deleteUserProfile(supabase, user?.id!);

  await getAdminClient.deleteUser(user?.id!);
};

// Helper functions

const deleteUserCourseReviews = async (
  supabase: SupabaseClient,
  userID: string
): Promise<boolean> => {
  "use server";
  const { data, error } = await supabase
    .from("course_reviews")
    .delete()
    .eq("user_id_fk", userID);
  if (error) {
    return false;
  }
  return true;
};

const deleteUserInstructorReviews = async (
  supabase: SupabaseClient,
  userID: string
): Promise<boolean> => {
  "use server";
  const { data, error } = await supabase
    .from("instructor_reviews")
    .delete()
    .eq("user_id_fk", userID);
  if (error) {
    return false;
  }
  return true;
};

const deleteUserProfile = async (
  supabase: SupabaseClient,
  userID: string
): Promise<any> => {
  "use server";
  const { data, error } = await supabase
    .from("profiles")
    .delete()
    .eq("user_id", userID);
  if (error) {
    return error;
  }
  return data;
};
