"use server";

import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { fetchUser } from "@/utils/supabase/authActions";

export const updateUser = async (
  name: string,
  program: string
): Promise<boolean> => {
  "use server";

  const user = await fetchUser();
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { data, error } = await supabase
    .from("course_reviews")
    .select()
    .eq("id", user?.id);

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
