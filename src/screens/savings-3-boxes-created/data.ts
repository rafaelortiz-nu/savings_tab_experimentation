import type { IconName } from "@/components/AppIcon";
import type { ImageStyle } from "react-native";

type SavingsTile = {
  title: string;
  amount: string;
  performance: string;
  image: string;
  overlayImage?: string;
  imageStyle?: ImageStyle;
};

type BoostItem = {
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

export const savings3BoxesCreatedData = {
  title: "Savings",
  promoTitle: "Bring your $5,902 on Caixa and earn up to +$269 per month",
  promoPrimaryAction: "Bring money",
  promoSecondaryAction: "Not now",
  totalBalanceLabel: "Total balance",
  totalBalance: "$2,802.30",
  yieldStart: 25.0,
  yieldTarget: 31.18,
  primaryActionLabel: "Save",
  primaryActionIcon: "moneyAdd" as const,
  secondaryActionLabel: "Withdraw",
  secondaryActionIcon: "moneyIn" as const,
  yourSavingsTitle: "Your savings",
  savingsTiles: [
    {
      title: "Emergency fund",
      amount: "$2,100.00",
      performance: "+ $17.08 today",
      image:
        "https://www.figma.com/api/mcp/asset/16102102-9b1b-44b1-ab09-36c94cebb8a8",
      imageStyle: {
        width: "135.24%",
        height: "325.43%",
        left: "-4.57%",
        top: "-47.45%",
      },
    },
    {
      title: "Take a trip",
      amount: "$2,101.06",
      performance: "+ $11.20 today",
      image:
        "https://www.figma.com/api/mcp/asset/445f989b-2c4e-4eea-91b2-ac9b54e7ef02",
      overlayImage:
        "https://www.figma.com/api/mcp/asset/878be010-30f2-47e6-9123-69061f3dcb96",
    },
    {
      title: "New Cell Phone",
      amount: "$202.12",
      performance: "+ R$ 2,90 today",
      image:
        "https://www.figma.com/api/mcp/asset/724fab67-f535-4e8d-acda-cb8c4e164a58",
      imageStyle: {
        width: "100%",
        height: "185.79%",
        left: 0,
        top: "-64.79%",
      },
    },
  ] as readonly SavingsTile[],
  createTileTitle: "Create new box",
  createTileSubtitle: "up to 104% CDI",
  boostTitle: "Boost your earnings",
  boostItems: [
    {
      title: "NuCel",
      subtitle: "By subscribing to our mobile plan, you unlock 120% CDI in earnings.",
      icon: "smartphone" as const,
    },
    {
      title: "Open Finance",
      subtitle: "Maximize up to 104% CDI by connecting an account.",
      icon: "openFinance" as const,
    },
  ] as readonly BoostItem[],
  navItems: [
    { key: "home", label: "Home", icon: "house", active: false },
    { key: "savings", label: "Savings", icon: "moneyBox", active: true },
    { key: "loans", label: "Loans", icon: "lending", active: false },
    { key: "nucel", label: "NuCel", icon: "smartphone", active: false },
    { key: "benefits", label: "Benefits", icon: "rewards", active: false },
  ] as readonly BottomNavItem[],
} as const;
