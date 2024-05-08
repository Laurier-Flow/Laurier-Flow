"use client";

import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { programOptions } from "@/components/SignUpPopup";

interface UserDetailsProps {
  getUserDetailsFunction: () => Promise<any>;
  email: string;
  updateUserFirstName: (new_first_name: string) => Promise<any>;
  updateUserLastName: (new_last_name: string) => Promise<any>;
  updateUserProgram: (new_program: string) => Promise<any>;
  deleteUserAccount: () => Promise<any>;
}

const UserDetails: React.FC<UserDetailsProps> = ({
  getUserDetailsFunction,
  email,
  updateUserFirstName,
  updateUserLastName,
  updateUserProgram,
  deleteUserAccount,
}) => {
  const [newFirstName, setNewFirstName] = useState<string>();
  const [newLastName, setNewLastName] = useState<string>();

  const [newProgram, setNewProgram] = useState<string>();

  const [isVisible, setIsVisible] = useState<boolean>(false);

  const [originalFirstName, setOriginalFirstName] = useState<string>();
  const [originalLastName, setOriginalLastName] = useState<string>();
  const [originalProgram, setOriginalProgram] = useState<string>();

  const [errorMsg, setErrorMsg] = useState<string>("Error! ");
  const [error, setError] = useState<boolean>(false);

  const [update, setUpdate] = useState<boolean>(false);

  const [sizeOfInputFields, setSizeOfInputFields] = useState<number>(50);

  useEffect(() => {
    const getUserData = async () => {
      const data = await getUserDetailsFunction();

      const fName: string = data[0]["first_name"];
      const lName: string = data[0]["last_name"];
      const program: string = data[0]["program"];

      setNewFirstName(fName);
      setNewLastName(lName);
      setNewProgram(program);
      setOriginalFirstName(fName);
      setOriginalLastName(lName);
      setOriginalProgram(program);
      var max: number = fName.length;

      if (max < lName.length) {
        max = lName.length;
      }
      if (max < program.length) {
        max = program.length;
      }
      if (max < email.length) {
        max = email.length;
      }

      max *= 1.5;
      setSizeOfInputFields(max);
    };
    getUserData();
  }, [update]);

  const handleFirstNameChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setNewFirstName(event.target.value);
  };

  const handleLastNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewLastName(event.target.value);
  };

  const handleProgramChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setNewProgram(event.target.value);
  };

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Determine what changed and update it accordingly
    if (
      originalFirstName !== newFirstName &&
      newFirstName !== undefined &&
      newFirstName?.length > 0
    ) {
      updateUserFirstName(newFirstName)
        .catch(() => {
          setErrorMsg(
            (errorMsg) =>
              errorMsg +
              "An unexpected error has occured when attempting to update your first name.\n"
          );
          setError(true);
        })
        .then(() => {
          setError(false);
          setUpdate(true);
        });
    }
    if (
      originalLastName !== newLastName &&
      newLastName !== undefined &&
      newLastName?.length > 0
    ) {
      updateUserLastName(newLastName)
        .catch(() => {
          setErrorMsg(
            (errorMsg) =>
              errorMsg +
              "An unexpected error has occured when attempting to update your last name.\n"
          );
          setError(true);
        })
        .then(() => {
          setError(false);
          setUpdate(true);
        });
    }
    if (
      originalProgram !== newProgram &&
      newProgram !== undefined &&
      newProgram?.length > 0
    ) {
      updateUserProgram(newProgram)
        .catch(() => {
          setErrorMsg(
            (errorMsg) =>
              errorMsg +
              "An unexpected error has occured when attempting to update your program.\n"
          );
          setError(true);
        })
        .then(() => {
          setError(false);
          setUpdate(true);
        });
    }
  };

  const handleAccountDeletion = async () => {
    await deleteUserAccount()
      .catch((err) => {
        setError(true);
        setErrorMsg("Error in user account deletion!");
        console.log(err);
      })
      .then((data) => {
        console.log(data);
        window.location.reload();
      });
  };

  return (
    <div className="card">
      <div>
        {update ? (
          error ? (
            <div
              className="mt-2 bg-red-500 text-sm text-white rounded-lg p-4"
              role="alert">
              <span className="font-bold">Error!</span> {errorMsg}
            </div>
          ) : (
            <div
              className="mt-2 bg-teal-500 text-sm text-white rounded-lg p-4"
              role="alert">
              <span className="font-bold">Success!</span> Your information has
              been updated!
            </div>
          )
        ) : null}

        <form onSubmit={handleFormSubmit}>
          <div className="p-4 mt-4">
            <label className="text-lg font-medium dark:text-white">
              Email
            </label>
            <input type="text" className="mt-2 py-3 px-4 block w-full border-gray-200 rounded-lg text-md focus:border-blue-500 focus:ring-blue-500 disabled:opacity-100 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600" placeholder={email} disabled={true} />
            <h1 className="text-lg font-medium dark:text-white mt-8">
              First Name
            </h1>
            <input
              onChange={handleFirstNameChange}
              type="text"
              className="mt-4 py-3 px-4 block w-full border-gray-200 rounded-lg text-md focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
              value={newFirstName}
            />
            <h1 className="block text-lg font-medium mb-2 dark:text-white mt-8">
              Last Name
            </h1>
            <input
              onChange={handleLastNameChange}
              type="text"
              className="mt-2 py-3 px-4 block w-full border-gray-200 rounded-lg text-md focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
              value={newLastName}
            />
            <h1 className="block text-lg font-medium mb-2 dark:text-white mt-8">
              Program
            </h1>
            <select
              className="mb-2 rounded-md px-4 py-2 dark:bg-gray-900 border-neutral-300 dark:border-slate-800 focus:border-2 focus:border-secondary focus:outline-none focus:ring-0 text-stone-600 dark:text-gray-400 placeholder-stone-400 dark:placeholder-gray-400 w-full"
              name="program"
              value={newProgram}
              onChange={handleProgramChange}
              required>
              <option value="" disabled>
                Select your program
              </option>
              {programOptions.map((program) => (
                <option className="" key={program} value={program}>
                  {program}
                </option>
              ))}
            </select>
          </div>

          <div className="p-4">
            <button type="submit" className="mt-6 w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-secondary text-black dark:text-white disabled:opacity-50 disabled:pointer-events-none">
              Save Changes
            </button>
          </div>
        </form>

        <hr className="mt-8 mb-8 border-gray-300 dark:border-gray-800"></hr>
        
        <div className="p-4">
        <button
          type="submit"
          onClick={(e) => {
            e.preventDefault();
            setIsVisible(true);
          }}
          className="flex flex-row items-center justify-center gap-2 w-full mt-4 mb-5 py-4 px-6 text-md font-semibold rounded-lg bg-red-500 hover:bg-red-dark text-white dark:text-white">
          <h1>Delete Account</h1>
        </button>
        </div>
      </div>

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
              handleAccountDeletion();
            }}
            className="flex flex-row items-center justify-center gap-2 w-full mt-4 mb-5 py-4 px-6 text-lg font-semibold rounded-lg bg-red-500 hover:bg-red-dark text-white dark:text-white">
            <h1>Yes I want to delete my account</h1>
          </button>

          <button
            type="submit"
            onClick={(e) => {
              e.preventDefault();
              setIsVisible(false);
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
