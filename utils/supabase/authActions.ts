'use server';

import { headers, cookies } from 'next/headers';
import { createClient } from './server';
import { redirect } from 'next/dist/server/api-utils';

export const signIn = async (formData: FormData) => {

  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { success: false, message: error.message };
  }

  return { success: true, message: 'Login successful' };
};

export const signUp = async (formData: FormData) => {

  const origin = headers().get('origin');
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const first_name = formData.get('first name') as string;
  const last_name = formData.get('last name') as string;
  const program = formData.get('program') as string;
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        first_name,
        last_name,
        program,
      },
      emailRedirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) {
    console.log(error);
    return { success: false, message: error.message };
  }

  return { success: true, message: 'Check email to continue sign-in process' };
};

export const fetchUser = async () => {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { data: { user } } = await supabase.auth.getUser();
  return user;
};

export const signOut = async () => {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  try {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error signing out:', error);
      return { success: false, message: 'Error signing out' };
    }

    return { success: true, message: 'Sign out successful' };
  } catch (error) {
    console.error('Error signing out:', error);
    return { success: false, message: 'Error signing out' };
  }
};

export const handleResetPassword = async (window_location: string, formData: FormData) => {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const email = formData.get('email') as string;

  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window_location}/change-password`
  });

  if (error) {
    return { success: false, message: error.message }
  }

  return { success: true, message: 'Please check your email' };
};