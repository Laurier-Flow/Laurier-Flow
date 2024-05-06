"use client";

import React, { useEffect, useState } from "react";
import { X } from "lucide-react";

interface UserDetailsProps {
  getUserDetailsFunction: () => Promise<any>;
  email: string;
}

const UserDetails: React.FC<UserDetailsProps> = ({
  getUserDetailsFunction,
  email,
}) => {
  const [newName, setNewName] = useState<string>();
  const [newProgram, setNewProgram] = useState<string>();

  const [isVisible, setIsVisible] = useState<boolean>(false);

  useEffect(() => {
    const getUserData = async () => {
      const data = await getUserDetailsFunction();
      setNewName(data[0]["first_name"] + " " + data[0]["last_name"]);
      setNewProgram(data[0]["program"]);
    };
    getUserData();
  }, []);

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewName(event.target.value);
  };

  const handleProgramChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewProgram(event.target.value);
  };

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  return (
    <div>
      <form
        style={{ opacity: isVisible ? "0.5" : "1.0" }}
        onSubmit={handleFormSubmit}>
        <div className="container mx:auto mt-5">
          <label
            className="block text-lg font-medium mb-2 dark:text-white mt-5"
            style={{ marginLeft: "5px" }}>
            Email
          </label>
          <input
            readOnly
            type="email"
            id="input-label"
            className="py-3 px-4 block w-full border-gray-200 rounded-lg text-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
            value={email}
            onClick={() => {
              alert("You cannot change your email address!");
            }}
          />
          <label
            className="block text-lg font-medium mb-2 dark:text-white mt-5"
            style={{ marginLeft: "5px" }}>
            Name
          </label>
          <input
            onChange={handleNameChange}
            type="text"
            className="py-3 px-4 block w-full border-gray-200 rounded-lg text-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
            value={newName}
          />
          <label
            className="block text-lg font-medium mb-2 dark:text-white mt-5"
            style={{ marginLeft: "5px" }}>
            Program
          </label>
          <input
            onChange={handleProgramChange}
            type="text"
            id="input-label"
            className="py-3 px-4 block w-full border-gray-200 rounded-lg text-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
            value={newProgram}
          />
        </div>

        <button
          type="submit"
          className="flex flex-row items-center justify-center gap-2 w-full mt-8 py-4 px-6 text-lg font-semibold rounded-lg bg-secondary hover:bg-secondary-dark text-black dark:text-white">
          <h1>Save Changes</h1>
        </button>
      </form>

      <hr className="mt-5" style={{ border: "2px solid gray" }} />

      <button
        type="submit"
        onClick={(e) => {
          e.preventDefault();
          setIsVisible(true);
        }}
        className="flex flex-row items-center justify-center gap-2 w-full mt-4 mb-5 py-4 px-6 text-lg font-semibold rounded-lg bg-red-500 hover:bg-red-dark text-white dark:text-white">
        <h1>Delete Account</h1>
      </button>
      <div
        style={{ display: isVisible ? "block" : "none" }}
        className={`transform transition-all duration-500 opacity-100 -translate-y-1/2 overflow-y-auto max-h-[90vh] border-2 dark:border-secondary fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-background dark:bg-background/80 backdrop-blur rounded-md max-w-md p-8 w-11/12`}>
        <form className="flex flex-col gap-4 text-foreground">
          <label className="flex flex-row items-center justify-between text-3xl font-bold mb-5 text-foreground">
            <h1>Are you sure?</h1>
            <X
              className="cursor-pointer"
              onClick={() => {
                setIsVisible(false);
              }}
            />
          </label>
          <button
            type="submit"
            onClick={(e) => {
              e.preventDefault();
            }}
            className="flex flex-row items-center justify-center gap-2 w-full mt-4 mb-5 py-4 px-6 text-lg font-semibold rounded-lg bg-red-500 hover:bg-red-dark text-white dark:text-white">
            <h1>Yes I want to delete my account</h1>
          </button>
          <button
            type="submit"
            onClick={(e) => {
              e.preventDefault();
              setIsVisible(true);
            }}
            className="flex flex-row items-center justify-center gap-2 w-full mt-4 mb-5 py-4 px-6 text-lg font-semibold rounded-lg bg-teal-500 hover:bg-teal-dark text-white dark:text-white">
            <h1>NO WAY ITS A MISCLICK</h1>
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserDetails;
