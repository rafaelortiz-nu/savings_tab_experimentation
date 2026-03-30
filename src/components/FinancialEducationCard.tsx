import { StyleSheet, Text, View } from "react-native";
import { AppIcon } from "@/components/AppIcon";
import { theme } from "@/theme";

type EducationItem = {
  title: string;
  subtitle: string;
};

type FinancialEducationCardProps = {
  items: readonly EducationItem[];
};

export function FinancialEducationCard({ items }: FinancialEducationCardProps) {
  return (
    <View style={styles.wrapper}>
      <View style={styles.card}>
        {items.map((item, index) => (
          <View key={item.title}>
            {index > 0 ? <View style={styles.divider} /> : null}
            <View style={styles.row}>
              <View style={styles.iconCircle}>
                <AppIcon
                  name={index === 0 ? "yield" : "creditLetter"}
                  size={16}
                  color={theme.colors.nudsContentPrimary}
                />
              </View>
              <View style={styles.texts}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.subtitle}>{item.subtitle}</Text>
              </View>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: theme.spacing.x4,
    paddingBottom: 24,
  },
  card: {
    borderRadius: theme.radii.large,
    borderWidth: 1,
    borderColor: theme.colors.nudsBorderSubtle,
    backgroundColor: theme.colors.nudsBackgroundPrimary,
    ...theme.elevation.defaultCard,
    overflow: "hidden",
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: theme.radii.jumbo,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.nudsBackgroundSecondary,
  },
  texts: {
    flex: 1,
    gap: 4,
  },
  title: {
    color: theme.colors.nudsContentPrimary,
    ...theme.typography.labelSmallStrong,
  },
  subtitle: {
    color: theme.colors.nudsContentSecondary,
    ...theme.typography.labelSmall,
    lineHeight: 21,
  },
  divider: {
    marginHorizontal: 16,
    height: StyleSheet.hairlineWidth,
    backgroundColor: theme.colors.nudsBorderHairline,
  },
});
