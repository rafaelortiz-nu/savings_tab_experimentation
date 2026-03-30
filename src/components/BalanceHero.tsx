import { Pressable, StyleSheet, Text, View } from "react-native";
import { AppIcon } from "@/components/AppIcon";
import { theme } from "@/theme";

type BalanceHeroProps = {
  label: string;
  total: string;
  trend: string;
  action: string;
};

export function BalanceHero({ label, total, trend, action }: BalanceHeroProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.total}>{total}</Text>
      <Text style={styles.trend}>{trend}</Text>

      <Pressable style={styles.cta}>
        <AppIcon name="add" size={20} color={theme.colors.nudsContentPrimary} />
        <Text style={styles.ctaLabel}>{action}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: theme.spacing.x5,
    paddingTop: 20,
    paddingBottom: 20,
    alignItems: "center",
    gap: 4,
  },
  label: {
    color: theme.colors.nudsContentSecondary,
    ...theme.typography.labelMedium,
  },
  total: {
    color: theme.colors.nudsContentPrimary,
    ...theme.typography.titleLarge,
  },
  trend: {
    color: theme.colors.nudsPositive,
    ...theme.typography.labelSmall,
  },
  cta: {
    marginTop: 20,
    height: 62,
    minWidth: 108,
    borderRadius: theme.radii.jumbo,
    borderWidth: 1,
    borderColor: theme.colors.nudsBorderSubtle,
    backgroundColor: theme.colors.nudsBackgroundPrimary,
    paddingHorizontal: 24,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
    ...theme.elevation.defaultCard,
  },
  ctaLabel: {
    color: theme.colors.nudsContentPrimary,
    ...theme.typography.subtitleMediumStrong,
  },
});
