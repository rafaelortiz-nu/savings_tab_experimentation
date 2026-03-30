import { colors } from "./colors";

export const elevation = {
  defaultCard: {
    shadowColor: colors.nudsContentPrimary,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 1,
    elevation: 1,
  },
} as const;
