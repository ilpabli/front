export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Fujitec Argentina - Sistema de reclamos",
  description: "App desarollada por Pablo Gonzalez - Service",
  navItems: [
    {
      label: "Generar Ticket",
      href: "/tickets/create",
    },
    {
      label: "Tickets",
      href: "/tickets",
    },
    {
      label: "Monitor",
      href: "/monitor",
    },
  ],
  links: {
    profile: "/profile",
  },
};
