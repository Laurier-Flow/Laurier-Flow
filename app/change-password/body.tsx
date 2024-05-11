"use server";

import Header from "@/components/Header";
import Spinner from "@/components/Spinner";
import { fetchUser } from "@/utils/supabase/authActions";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import ChangePasswordForm from "./change-password-form";
import { resetUserPassword } from "./reset-password-func";
import Footer from "@/components/Footer";


export default async function ChangePassword() {
  const user = await fetchUser();
  if (!user) redirect("/");

  return (
    <>
      <Header user={user} />
      <Suspense
        fallback={
          <div className="w-full h-full">
            <Spinner />
          </div>
        }>
        <div className="min-w-full flex flex-col p-4 dark:bg-[url('/banner-sm.jpg')] bg-[url('/banner-sm-light.jpg')] md:dark:bg-[url('/banner-md.jpg')] md:bg-[url('/banner-md-light.jpg')] lg:dark:bg-[url('/banner.jpg')] lg:bg-[url('/banner-light.jpg')] md:flex-row md:justify-center">
          <div className="flex flex-1 pt-20 flex-row justify-between w-f max-w-6xl">
            <div className="flex flex-1 flex-col justify-end pl-4">
              <h1 className="mb-2 text-2xl font-bold md:text-5xl text-white">
                Change Password
              </h1>
            </div>
          </div>
        </div>
      </Suspense>
      <ChangePasswordForm
        user={user}
        resetUserPasswordFunction={resetUserPassword}
      />
      <Footer />
    </>
  );
}
