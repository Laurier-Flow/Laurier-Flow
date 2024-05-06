"use server";

import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { fetchUser } from "@/utils/supabase/authActions";

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
