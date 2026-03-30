import { colors } from "./colors";
import { elevation } from "./elevation";
import { radii } from "./radii";
import { spacing } from "./spacing";
import { typography } from "./typography";

export const theme = {
  colors,
  spacing,
  radii,
  typography,
  elevation,
} as const;

export type Theme = typeof theme;
