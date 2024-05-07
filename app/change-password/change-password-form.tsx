"use client";

import { useState } from "react";

interface ChangePasswordFormProps {
  user: any;
  resetUserPasswordFunction: (newPassword: string) => Promise<boolean>;
}

const ChangePasswordForm: React.FC<ChangePasswordFormProps> = ({
  user,
  resetUserPasswordFunction,
}) => {
  const [hidePasswords, setHidePasswords] = useState(true);
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmNewPassword, setConfirmNewPassword] = useState<string>();

  const [requestSent, setRequestSent] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [passwordsMatch, setPasswordsMatch] = useState<boolean>(true);

  const handleNewPassword = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewPassword(event.target.value);
  };
  const handleConfirmNewPassword = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setConfirmNewPassword(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (newPassword === confirmNewPassword && newPassword.length >= 8) {
      resetUserPasswordFunction(newPassword)
        .then((attempt: boolean) => {
          setSuccess(true);
        })
        .catch((err: any) => {
          console.log(err);
          setSuccess(false);
        });

      setTimeout(() => {
        setPasswordsMatch(true);
        setRequestSent(true);
      }, 3000);
    } else {
      setPasswordsMatch(false);
    }
  };

  return (
    <div>
      {requestSent ? (
        success ? (
          <div
            className="mt-2 bg-teal-500 text-sm text-white rounded-lg p-4"
            role="alert">
            <span className="font-bold">Success!</span> Your password has
            successfully been changed!
          </div>
        ) : (
          <div
            className="mt-2 bg-red-500 text-sm text-white rounded-lg p-4"
            role="alert">
            <span className="font-bold">Error!</span> There was an error when
            attempting to change your password.
          </div>
        )
      ) : null}
      {passwordsMatch ? null : (
        <div
          className="mt-2 bg-yellow-500 text-sm text-white rounded-lg p-4"
          role="alert">
          <span className="font-bold">Error!</span> Please make sure your
          passwords match and that your new password is at least 8 characters!
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <label
          className="block text-lg font-medium mb-2 dark:text-white mt-5"
          style={{ marginLeft: "5px" }}>
          Enter new password
        </label>
        <input
          type={hidePasswords ? "password" : "text"}
          className="py-3 px-4 block w-full border-gray-200 rounded-lg text-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
          required
          value={newPassword}
          onChange={handleNewPassword}
        />

        <label
          className="block text-lg font-medium mb-2 dark:text-white mt-5"
          style={{ marginLeft: "5px" }}>
          Confirm new password
        </label>
        <input
          type={hidePasswords ? "password" : "text"}
          className="py-3 px-4 block w-full border-gray-200 rounded-lg text-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
          required
          value={confirmNewPassword}
          onChange={handleConfirmNewPassword}
        />

        <button
          onClick={(e) => {
            e.preventDefault();
            setHidePasswords(!hidePasswords);
            console.log(user);
          }}
          className="flex flex-row items-center justify-center gap-2 w-full mt-4 py-2 px-3 text-sm font-small rounded-lg bg-secondary hover:bg-secondary-dark text-black dark:text-white">
          <h1>Show Passwords</h1>
        </button>

        <button
          type="submit"
          className="flex flex-row items-center justify-center gap-2 w-full mt-8 py-4 px-6 text-lg font-semibold rounded-lg bg-primary hover:bg-primary-dark text-white dark:text-white">
          <h1>Change Password</h1>
        </button>
      </form>
    </div>
  );
};

export default ChangePasswordForm;
