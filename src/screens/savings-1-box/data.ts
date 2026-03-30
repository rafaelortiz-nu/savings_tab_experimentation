import type { IconName } from "@/components/AppIcon";

type HeroCard = {
  title: string;
  image: "newTrip" | "newCellPhone" | "technicalCourse";
  ctaLabel?: string;
};

type ListItem = {
  title: string;
  subtitle: string;
  icon: IconName;
};

type BottomNavItem = {
  key: string;
  label: string;
  icon: IconName;
  active: boolean;
};

export const savings1BoxData = {
  title: "Savings",
  badgeLabel: "100% CDI",
  heroTitle: "Save for the future",
  heroCards: [
    { title: "New trip", image: "newTrip", ctaLabel: "Start this goal" },
    { title: "New cell phone", image: "newCellPhone", ctaLabel: "Start this goal" },
    { title: "Technical course", image: "technicalCourse", ctaLabel: "Start this goal" },
  ] as readonly HeroCard[],
  yourSavingsTitle: "Your savings",
  savingsItem: {
    title: "Emergency fund",
    amount: "$300.00",
    performance: "+ $4.08 today",
  },
  createTileTitle: "Create new box",
  createTileSubtitle: "up to 104% CDI",
  organizeTitle: "Organize your finances",
  organizeItems: [
    {
      title: "Payment Assistant",
      subtitle: "Have more free time for the things that truly matter in your life.",
      icon: "creditLetter",
    },
    {
      title: "Financial summary",
      subtitle: "Understand where you are spending the most and learn how to save more.",
      icon: "yield",
    },
  ] as readonly ListItem[],
  navItems: [
    { key: "home", label: "Home", icon: "house", active: false },
    { key: "savings", label: "Savings", icon: "moneyBox", active: true },
    { key: "loans", label: "Loans", icon: "lending", active: false },
    { key: "nucel", label: "NuCel", icon: "smartphone", active: false },
    { key: "benefits", label: "Benefits", icon: "rewards", active: false },
  ] as readonly BottomNavItem[],
} as const;
