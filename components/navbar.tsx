'use client'
import {
  Navbar as HeroUINavbar,
  NavbarContent,
  NavbarItem,
} from "@heroui/navbar";

import { Avatar } from "@heroui/react";
import { useSession } from "next-auth/react";

export const Navbar = () => {

  const { update, data, status } = useSession({ required: true })
  
  return (
    <HeroUINavbar maxWidth="xl" position="sticky">
      <NavbarContent className="basis-1/5 sm:basis-full" justify="end">
        <ul className="hidden lg:flex gap-4 justify-start ml-2">
            <NavbarItem>
              <Avatar size="md" name={data?.user?.name ?? 'user'}></Avatar>
            </NavbarItem>
        </ul>
      </NavbarContent>
    </HeroUINavbar>
  );
};
