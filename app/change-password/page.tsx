import { Metadata } from "next";
import ChangePassword from './body'

export const metadata : Metadata = {
  title: "Change Password",
  description: "Change your password for your account on Laurier Flow",
}


export default function ChangePasswordPage() {
  return (
    <ChangePassword />
  )
}