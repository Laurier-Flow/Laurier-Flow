"use client";

import { Suspense, useEffect, useState } from "react";
import UserDetails from "./user-details";
import {
  getUserData,
  updateUserFirstName,
  updateUserLastName,
  updateUserProgram,
  deleteUserAccount,
  deleteSpecificClassFromSchedule,
  addClassesToSchedule,
  updateUserClass,
} from "./user-data-functions";
import { getUserReviewsInterface } from "./UserReviews";
import { User } from "@supabase/supabase-js";
import Schedule from "./userSchedule";

interface PageContentProps {
  userReviews: any;
  user: User;
}

const PageContent: React.FC<PageContentProps> = ({ userReviews, user }) => {
  const [profileTabSelected, setProfileTabSelected] = useState<boolean>(true);
  const [myScheduleTabSelected, setMyScheduleTabSelected] =
    useState<boolean>(false);
  const [editUserDetailsTabSelected, setEditUserDetailsTabSelected] =
    useState<boolean>(false);

  const [userFirstName, setUserFirstName] = useState<string>();
  const [userLastName, setUserLastName] = useState<string>();
  const [userProgram, setUserProgram] = useState<string>();

  const [screenWidth, setScreenWidth] = useState<number>();

  useEffect(() => {
    const getData = async () => {
      const data = await getUserData();
      setUserFirstName(data[0]["first_name"]);
      setUserLastName(data[0]["last_name"]);
      setUserProgram(data[0]["program"]);
    };
    setScreenWidth(window.screen.width);
    getData();
  }, []);

  const handleProfileTabClick = () => {
    setProfileTabSelected(true);
    setMyScheduleTabSelected(false);
    setEditUserDetailsTabSelected(false);
  };

  const handleMyScheduleTabClick = () => {
    setProfileTabSelected(false);
    setMyScheduleTabSelected(true);
    setEditUserDetailsTabSelected(false);
  };

  const handleEditUserDetailsTabSelected = () => {
    setMyScheduleTabSelected(false);
    setEditUserDetailsTabSelected(true);
    setProfileTabSelected(false);
  };

  return (
    <>
      <div className="min-w-full flex flex-col p-4 dark:bg-[url('/banner-sm.jpg')] bg-[url('/banner-sm-light.jpg')] md:dark:bg-[url('/banner-md.jpg')] md:bg-[url('/banner-md-light.jpg')] lg:dark:bg-[url('/banner.jpg')] lg:bg-[url('/banner-light.jpg')] md:flex-row md:justify-center">
        <div className="flex flex-1 pt-20 flex-row justify-between w-f max-w-6xl">
          <div className="flex flex-1 flex-col pl-4">
            <h1 className="mb-2 text-2xl font-bold md:text-5xl text-white">
              Welcome <span className="text-purple-200">{userFirstName}</span>{" "}
              <span className="text-yellow-200">{userLastName}</span>
            </h1>
            <h4 className="mb-2 text-lg font-bold text-white italic">
              {userProgram}
            </h4>
          </div>
        </div>
      </div>
      <ul
        style={{
          width: "50vw",
        }}
        className="mt-5 mb-5 text-center text-base text-gray-500 rounded-lg shadow flex justify-center">
        <li className="w-full focus-within:z-10">
          <a
            onClick={handleProfileTabClick}
            className={`inline-block w-full p-4 ${profileTabSelected ? `bg-gray-300 dark:bg-gray-700 dark:text-white` : `bg-white dark:bg-gray-100 dark:text-black`} border-r border-gray-200 rounded-l-lg focus:ring-4 focus:ring-blue-300 active focus:outline-none`}>
            My Profile
          </a>
        </li>
        <li className="w-full focus-within:z-10">
          <a
            onClick={handleMyScheduleTabClick}
            className={`inline-block w-full p-4 ${myScheduleTabSelected ? `bg-gray-300 dark:bg-gray-700 dark:text-white` : `bg-white dark:bg-gray-100 dark:text-black`} border-r border-gray-200  hover:text-gray-700 hover:bg-gray-50 focus:ring-4 focus:ring-blue-300 focus:outline-none`}>
            My Schedule
          </a>
        </li>
        <li className="w-full focus-within:z-10">
          <a
            onClick={handleEditUserDetailsTabSelected}
            className={`inline-block w-full p-4 ${editUserDetailsTabSelected ? `bg-gray-300 dark:bg-gray-700 dark:text-white` : `bg-white dark:bg-gray-100 dark:text-black`} border-s-0 border-gray-200  rounded-r-lg hover:text-gray-700 hover:bg-gray-50 focus:ring-4 focus:outline-none focus:ring-blue-300`}>
            User Details
          </a>
        </li>
      </ul>

      {profileTabSelected ? userReviews : null}
      {myScheduleTabSelected ? <Schedule /> : null}
      {editUserDetailsTabSelected ? (
        <UserDetails
          getUserDetailsFunction={getUserData}
          email={user.email!}
          updateUserFirstName={updateUserFirstName}
          updateUserLastName={updateUserLastName}
          updateUserProgram={updateUserProgram}
          deleteUserAccount={deleteUserAccount}
        />
      ) : null}
    </>
  );
};

export default PageContent;
