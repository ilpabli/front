"use client";
import {
  Navbar as NextUINavbar,
  NavbarContent,
  NavbarMenuToggle,
  NavbarBrand,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
} from "@nextui-org/navbar";
import {
  Dropdown,
  DropdownItem,
  DropdownTrigger,
  DropdownMenu,
  Avatar,
} from "@nextui-org/react";
import { link as linkStyles } from "@nextui-org/theme";
import NextLink from "next/link";
import clsx from "clsx";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/config/site";
import { Logo } from "@/components/icons";

export const Navbar = () => {
  const { data: session, status } = useSession();
  const path = usePathname();
  if (path === "/login") {
    return null;
  }
  if (status === "unauthenticated") {
    return null;
  }
  
  return (
    <NextUINavbar maxWidth="xl" position="sticky" className="pb-5">
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <NavbarBrand as="li" className="gap-3 max-w-fit">
          <NextLink
            className="flex justify-start items-center gap-1"
            href="/monitor"
          >
            <Logo />
          </NextLink>
        </NavbarBrand>
      </NavbarContent>
      <NavbarContent className="hidden md:flex gap-4 mt-9 justify-center ml-20">
        <ul className="flex gap-4">
          {siteConfig.navItems.map((item) => (
            <NavbarItem key={item.href} isActive={path === item.href}>
              <NextLink
                className={clsx(
                  linkStyles({
                    color: path === item.href ? "danger" : "foreground",
                    size: "lg",
                    isBlock: true,
                  }),
                )}
                href={item.href}
              >
                {item.label}
              </NextLink>
            </NavbarItem>
          ))}
          {session?.user?.role === "admin" && (
            <NavbarItem key="admin" isActive={path === "/admin"}>
              <NextLink
                className={clsx(
                  linkStyles({
                    color: path === "/admin" ? "danger" : "foreground",
                    size: "lg",
                    isBlock: true,
                  }),
                )}
                href="/admin"
              >
                Admin
              </NextLink>
            </NavbarItem>
          )}
        </ul>
      </NavbarContent>
      <NavbarContent
        className="hidden sm:flex basis-1/5 sm:basis-full"
        justify="end"
      >
        <NavbarItem className="hidden sm:flex gap-2 mt-9">
          {session?.user && (
            <Dropdown placement="bottom-end">
              <DropdownTrigger>
                <Avatar
                  isBordered
                  as="button"
                  className="transition-transform"
                  color="success"
                  name={session?.user?.user}
                  size="md"
                  src={session?.user?.img}
                />
              </DropdownTrigger>
              <DropdownMenu aria-label="Profile Actions" variant="flat">
                <DropdownItem
                  key="profile"
                  className="h-14 gap-2"
                  href="/profile"
                  textValue="profile"
                >
                  <p className="font-semibold">
                    {session?.user?.first_name} {session?.user?.last_name}
                  </p>
                  <p className="font-semibold">Perfil: {session?.user.role}</p>
                </DropdownItem>
                <DropdownItem key="notifications" textValue="notifications">
                  Notificaciones
                </DropdownItem>
                <DropdownItem
                  key="logout"
                  value="logout"
                  onPress={() => signOut()}
                  color="danger"
                  textValue="logout"
                >
                  Desconectarse
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          )}
        </NavbarItem>
      </NavbarContent>
      <NavbarContent className="sm:hidden basis-1 pl-4" justify="end">
        <NavbarMenuToggle />
        <NavbarMenu>
          {siteConfig.navItems.map((item) => (
            <NavbarMenuItem key={item.href}>
              <NextLink
                className={clsx(
                  linkStyles({ color: "foreground" }),
                  "data-[active=true]:text-primary data-[active=true]:font-medium"
                )}
                color="foreground"
                href={item.href}
              >
                {item.label}
              </NextLink>
            </NavbarMenuItem>
          ))}
          {session?.user?.role === "admin" && (
            <NavbarMenuItem key="admin">
              <NextLink
                className={clsx(
                  linkStyles({ color: "foreground" }),
                  "data-[active=true]:text-primary data-[active=true]:font-medium"
                )}
                color="foreground"
                href="/admin"
              >
                Admin
              </NextLink>
            </NavbarMenuItem>
          )}
        </NavbarMenu>
      </NavbarContent>
    </NextUINavbar>
  );
};
