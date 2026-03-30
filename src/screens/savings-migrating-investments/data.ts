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

type InlineAction = {
  label: string;
  icon: IconName;
  variant: "primary" | "secondary";
  badgeLabel?: string;
};

type LevelUpCard = {
  topLabel: string;
  badgeLabel: string;
  badgeVariant: "purple" | "green";
  title: string;
  subtitle: string;
  stripeVariant: "purple" | "green";
};

type BottomNavItem = {
  key: string;
  label: string;
  icon: IconName;
  active: boolean;
};

type BottomSheetRow = {
  title: string;
  subtitle?: string;
  icon: IconName;
  disabled?: boolean;
};

export const savingsMigratingInvestmentsData = {
  title: "Savings",
  totalBalanceLabel: "Total balance",
  totalBalance: "$42,305.12",
  yieldTarget: 237.55,
  yourSavingsTitle: "Your savings",
  savingsTiles: [
    {
      title: "Emergency fund",
      amount: "$25,100.00",
      performance: "+ $ 89.11 today",
      image:
        "https://www.figma.com/api/mcp/asset/72f931f1-2ad5-4b92-845b-a208a3bf324a",
    },
    {
      title: "Take a trip",
      amount: "$12,101.06",
      performance: "+ $ 45.20 today",
      image:
        "https://www.figma.com/api/mcp/asset/5202a0e3-193f-4468-b420-897427c4021e",
      overlayImage:
        "https://www.figma.com/api/mcp/asset/1d10a7fe-3166-4fd2-8f8d-adb5107eecdd",
    },
    {
      title: "New Cell Phone",
      amount: "$202.12",
      performance: "+ R$ 2,90 today",
      image:
        "https://www.figma.com/api/mcp/asset/5c28fe83-2ceb-469b-bd66-ecd5a6041578",
      imageStyle: {
        width: "100%",
        height: "185.79%",
        left: 0,
        top: "-64.79%",
      },
    },
  ] as readonly SavingsTile[],
  createTileTitle: "Save money",
  createTileSubtitle: "up to 130% CDI",
  inlineActions: [
    { label: "Save", icon: "moneyAdd", variant: "secondary" },
    { label: "Withdraw", icon: "moneyIn", variant: "secondary" },
    { label: "Invest", icon: "yield", variant: "primary", badgeLabel: "130% CDI" },
  ] as readonly InlineAction[],
  levelUpTitle: "Level up your savings",
  levelUpTrailingLabel: "All",
  levelUpCards: [
    {
      topLabel: "FGC protecion",
      badgeLabel: "CDB",
      badgeVariant: "purple",
      title: "117,5% of CDI",
      subtitle: "Aug 2027",
      stripeVariant: "purple",
    },
    {
      topLabel: "",
      badgeLabel: "Investment Fund",
      badgeVariant: "green",
      title: "Nu Planned Reserve",
      subtitle: "13,98% in the last 12 months",
      stripeVariant: "green",
    },
    {
      topLabel: "IR Isento · Proteção FGC",
      badgeLabel: "CDB",
      badgeVariant: "purple",
      title: "94,5% of CDI",
      subtitle: "CDB equivalent 111% of CDI · Jul 2027",
      stripeVariant: "purple",
    },
  ] as readonly LevelUpCard[],
  bottomSheet: {
    title: "You've built something solid",
    description: "Ready to make your money work even harder?",
    rows: [
      { title: "Create emergency Fund", icon: "pigIn", disabled: true },
      { title: "Saved over $15,000.00", icon: "moneyBox", disabled: true },
      { title: "Start investing", subtitle: "It's time to make your money work harder for you.", icon: "yield" },
    ] as readonly BottomSheetRow[],
  },
  navItems: [
    { key: "home", label: "Home", icon: "house", active: false },
    { key: "savings", label: "Savings", icon: "moneyBox", active: true },
    { key: "loans", label: "Loans", icon: "lending", active: false },
    { key: "nucel", label: "NuCel", icon: "smartphone", active: false },
    { key: "benefits", label: "Benefits", icon: "rewards", active: false },
  ] as readonly BottomNavItem[],
} as const;
