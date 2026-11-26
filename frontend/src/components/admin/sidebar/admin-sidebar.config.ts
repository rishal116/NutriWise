import {
  LayoutDashboard,
  Users,
  Stethoscope,
  BadgeDollarSign,
  Trophy,
  CreditCard,
  BookOpen,
  Newspaper,
  Layers,
  type LucideIcon,
} from "lucide-react";

export interface NavChild {
  name: string;
  path: string;
}

export type NavItem =
  | {
      name: string;
      icon: LucideIcon;
      path: string;
      children?: never;
    }
  | {
      name: string;
      icon: LucideIcon;
      children: NavChild[];
      path?: never;
    };

export interface NavSection {
  title: string;
  items: NavItem[];
}

export const NAV_SECTIONS: NavSection[] = [
  {
    title: "Overview",
    items: [
      {
        name: "Dashboard",
        icon: LayoutDashboard,
        path: "/admin/dashboard",
      },
    ],
  },
  {
    title: "Management",
    items: [
      { name: "Users", icon: Users, path: "/admin/users" },
      {
        name: "Nutritionists",
        icon: Stethoscope,
        children: [
          { name: "All Nutritionists", path: "/admin/nutritionists" },
          {
            name: "Applications",
            path: "/admin/nutritionists/applications",
          },
        ],
      },
      { name: "Challenges", icon: Trophy, path: "/admin/challenges" },
      { name: "Plans", icon: BadgeDollarSign, path: "/admin/plans" },
      {
        name: "Subscription Plans",
        icon: Layers,
        path: "/admin/subscription-plans",
      },
    ],
  },
  {
    title: "Content",
    items: [
      { name: "Posts", icon: Newspaper, path: "/admin/posts" },
      { name: "Resources", icon: BookOpen, path: "/admin/resources" },
    ],
  },
  {
    title: "Finance",
    items: [{ name: "Payments", icon: CreditCard, path: "/admin/payments" }],
  },
];
