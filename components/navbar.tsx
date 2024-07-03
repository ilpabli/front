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
import { link as linkStyles } from "@nextui-org/theme";
import NextLink from "next/link";
import clsx from "clsx";
import { useAuth } from "@/contexts/authContext";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/config/site";
import { ThemeSwitch } from "@/components/theme-switch";
import { Logo, ProfileIcon } from "@/components/icons";

export const Navbar = () => {
  const path = usePathname();
  if (path === "/login") {
    return null;
  }
  const { user } = useAuth();
  return (
    <NextUINavbar maxWidth="xl" position="sticky">
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <NavbarBrand as="li" className="gap-3 max-w-fit">
          <NextLink className="flex justify-start items-center gap-1" href="/">
            <Logo />
          </NextLink>
        </NavbarBrand>
      </NavbarContent>
      <NavbarContent className="hidden md:flex gap-4 mt-9 justify-center ml-20">
        <ul className="flex gap-4">
          {siteConfig.navItems.map((item) => (
            <NavbarItem key={item.href}>
              <NextLink
                className={clsx(
                  linkStyles({
                    color: "foreground",
                    size: "lg",
                    isBlock: true,
                  }),
                  "data-[active=true]:text-primary data-[active=true]:font-medium"
                )}
                color="foreground"
                href={item.href}
              >
                {item.label}
              </NextLink>
            </NavbarItem>
          ))}
          {user?.role === "admin" && (
            <NavbarItem key="admin">
              <NextLink
                className={clsx(
                  linkStyles({
                    color: "foreground",
                    size: "lg",
                    isBlock: true,
                  }),
                  "data-[active=true]:text-primary data-[active=true]:font-medium"
                )}
                color="foreground"
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
          <NextLink aria-label="Profile" href={siteConfig.links.profile}>
            <ProfileIcon className="text-default-500" />
          </NextLink>
          <ThemeSwitch />
        </NavbarItem>
      </NavbarContent>
      <NavbarContent className="sm:hidden basis-1 pl-4" justify="end">
        <ThemeSwitch />
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
          {user?.role === "admin" && (
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
