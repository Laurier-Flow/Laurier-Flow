import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOut } from "@/utils/supabase/authActions";

import { User } from "@supabase/supabase-js";
import Link from "next/link";

export function UserNav({ user }: { user: User }) {
  const handleSignOut = async () => {
    const result = await signOut();
  };

  return (
    <div className="z-[200]">
      <DropdownMenu modal={false}>
        {" "}
        {/* Add modal=false to the DropdownMenu component to keep scrolling enabled */}
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-8 w-8">
              <AvatarFallback>
                {user.user_metadata.first_name?.charAt(0)}
                {user.user_metadata.last_name?.charAt(0)}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56 z-[200]" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">
                {user.user_metadata.first_name} {user.user_metadata.last_name}
              </p>
              <p className="text-xs leading-none text-muted-foreground">
                {user.email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup className="z-[200]">

            <Link href={"/profile"} className="z-[200]">

              <DropdownMenuItem className="hover:bg-accent z-[200] cursor-pointer">
                User Reviews
              </DropdownMenuItem>
            </Link>
          </DropdownMenuGroup>

          <DropdownMenuSeparator />
          <DropdownMenuGroup className="z-[200]">
            <DropdownMenuItem className="hover:bg-accent z-[200]">
              <Link href={"/edit-user"} className="z-[200]">
                Edit User Details
              </Link>
            </DropdownMenuItem>

          </DropdownMenuGroup>

          <DropdownMenuSeparator />
          <DropdownMenuGroup className="z-[200]">
            <DropdownMenuItem className="hover:bg-accent z-[200]">
              <Link href={"/change-password"} className="z-[200]">
                Change Password
              </Link>
            </DropdownMenuItem>
          </DropdownMenuGroup>

          <DropdownMenuSeparator />

          <DropdownMenuItem onClick={handleSignOut} className="hover:bg-destructive z-[200] cursor-pointer">
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
