import React from "react";
import type { SvgProps } from "react-native-svg";
import AddIcon from "../../assets/icons/add.svg";
import ArrowRightIcon from "../../assets/icons/arrow_right.svg";
import CheckCircleIcon from "../../assets/icons/check_circle.svg";
import CloseMiniIcon from "../../assets/icons/close_mini.svg";
import CreditLetterIcon from "../../assets/icons/credit_letter.svg";
import HouseIcon from "../../assets/icons/house.svg";
import LendingIcon from "../../assets/icons/lending.svg";
import MoneyBoxIcon from "../../assets/icons/money_box.svg";
import MoneyAddIcon from "../../assets/icons/money_add.svg";
import MoneyInIcon from "../../assets/icons/money_in.svg";
import MoreVerticalIcon from "../../assets/icons/more_vertical.svg";
import OpenFinanceIcon from "../../assets/icons/open_finance.svg";
import PigIcon from "../../assets/icons/pig.svg";
import PigInIcon from "../../assets/icons/pig_in.svg";
import RewardsIcon from "../../assets/icons/rewards.svg";
import SmartPhoneIcon from "../../assets/icons/smartphone.svg";
import SparkleIcon from "../../assets/icons/sparkle.svg";
import VisibilityOnIcon from "../../assets/icons/visibility_on.svg";
import YieldIcon from "../../assets/icons/yield.svg";
import CaixaLogo from "../../assets/logos/caixa.svg";

const ICONS = {
  add: AddIcon,
  arrowRight: ArrowRightIcon,
  checkCircle: CheckCircleIcon,
  closeMini: CloseMiniIcon,
  creditLetter: CreditLetterIcon,
  house: HouseIcon,
  lending: LendingIcon,
  logoCaixa: CaixaLogo,
  moneyAdd: MoneyAddIcon,
  moneyIn: MoneyInIcon,
  moneyBox: MoneyBoxIcon,
  moreVertical: MoreVerticalIcon,
  openFinance: OpenFinanceIcon,
  pig: PigIcon,
  pigIn: PigInIcon,
  rewards: RewardsIcon,
  smartphone: SmartPhoneIcon,
  sparkle: SparkleIcon,
  visibilityOn: VisibilityOnIcon,
  yield: YieldIcon,
} as const;

export type IconName = keyof typeof ICONS;

type AppIconProps = {
  name: IconName;
  size?: number;
  color?: string;
} & Omit<SvgProps, "width" | "height" | "color">;

export function AppIcon({ name, size = 20, color, ...props }: AppIconProps) {
  const IconComponent = ICONS[name];

  return (
    <IconComponent
      width={size}
      height={size}
      color={color}
      fill={color}
      {...props}
    />
  );
}
