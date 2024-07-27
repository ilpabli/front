export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Fujitec Argentina - Sistema de reclamos",
  description: "App desarollada por Pablo González - Service",
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
      label: "Mapa",
      href: "/map",
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
