'use server'
 
import { RedirectType, redirect } from 'next/navigation'
 
export async function redirectToExploreAll () {
  redirect(`/explore`)
}