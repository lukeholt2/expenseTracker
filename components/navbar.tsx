'use client'
import {
  Navbar as HeroUINavbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from "@heroui/navbar";

import { Avatar, Image } from "@heroui/react";
import { useSession } from "next-auth/react";

export const Navbar = () => {

  const { data } = useSession({ required: true })
  
  return (
    <HeroUINavbar maxWidth="xl" isBordered>
      <NavbarBrand>
        <Image src="/favicon.png" radius="sm" style={{paddingRight: '0.25em'}}></Image>
        <p className="font-bold text-inherit">Expense Tracker</p>
      </NavbarBrand>
      <NavbarContent className="basis-1/5 sm:basis-full" justify="end">
            <NavbarItem>
              <Avatar size="md" name={data?.user?.name ?? 'user'}></Avatar>
            </NavbarItem>
      </NavbarContent>
    </HeroUINavbar>
  );
};
