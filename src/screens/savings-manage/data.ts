export const savingsManageData = {
  title: "Savings",
  totalBalanceLabel: "Total balance",
  totalBalance: "$4,403.18",
  balanceTrend: "+ $2.00 today",
  cta: "Save",
  savingsSectionTitle: "Savings balances",
  moneybox: {
    title: "Turbo moneybox",
    amount: "$2,100.00",
    apy: "4.5% APY",
    image:
      "https://www.figma.com/api/mcp/asset/0fd79614-345a-439a-972a-f0e9cc4b230f",
  },
  savingsTiles: [
    {
      title: "Take a trip",
      amount: "$2,101.06",
      performance: "+$1.79",
      image:
        "https://www.figma.com/api/mcp/asset/bbff8fb7-8785-4455-8e4c-10901a713c6c",
    },
    {
      title: "Emergency fund",
      amount: "$202.12",
      performance: "+$0.21",
      image:
        "https://www.figma.com/api/mcp/asset/92f4b4c7-58e5-42b3-bc22-2a920ef3a8c9",
    },
  ],
  offersSectionTitle: "Offers",
  offer: {
    title: "This is a cross-sell message of up to three lines",
    action: "Action",
    image:
      "https://www.figma.com/api/mcp/asset/6006078e-6474-40cb-89c7-6679b32b0fc6",
  },
  educationSectionTitle: "Financial education",
  educationItems: [
    {
      title: "Is everything okay with your finances?",
      subtitle: "Go to Payment Assistant",
    },
    {
      title: "Financial summary",
      subtitle: "A simplified summary of what you received, spent, and invested.",
    },
  ],
  navItems: [
    { key: "home", label: "Home", icon: "house", active: false },
    { key: "savings", label: "Savings", icon: "moneyBox", active: true },
    { key: "loans", label: "Loans", icon: "lending", active: false },
    { key: "nucel", label: "NuCel", icon: "smartphone", active: false },
    { key: "benefits", label: "Benefits", icon: "rewards", active: false },
  ],
} as const;
