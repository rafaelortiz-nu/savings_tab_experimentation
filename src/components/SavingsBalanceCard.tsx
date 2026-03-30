import { Image, StyleSheet, Text, View } from "react-native";
import { theme } from "@/theme";

type SavingsBalanceCardProps = {
  title: string;
  amount: string;
  apy: string;
  image: string;
};

export function SavingsBalanceCard({ title, amount, apy, image }: SavingsBalanceCardProps) {
  return (
    <View style={styles.wrapper}>
      <View style={styles.card}>
        <View style={styles.left}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.amount}>{amount}</Text>
          <Text style={styles.apy}>{apy}</Text>
        </View>
        <Image source={{ uri: image }} style={styles.image} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: theme.spacing.x4,
    paddingBottom: theme.spacing.x3,
  },
  card: {
    height: 104,
    borderRadius: theme.radii.large,
    borderWidth: 1,
    borderColor: theme.colors.nudsBorderSubtle,
    backgroundColor: theme.colors.nudsBackgroundPrimary,
    ...theme.elevation.defaultCard,
    flexDirection: "row",
    overflow: "hidden",
  },
  left: {
    flex: 1,
    paddingLeft: 16,
    paddingVertical: 16,
    justifyContent: "center",
    gap: 2,
  },
  title: {
    color: theme.colors.nudsContentSecondary,
    ...theme.typography.labelSmall,
    fontFamily: "NuSansTextRegular",
  },
  amount: {
    color: theme.colors.nudsContentPrimary,
    ...theme.typography.subtitleMediumStrong,
  },
  apy: {
    color: theme.colors.nudsPositive,
    ...theme.typography.labelSmall,
    fontFamily: "NuSansTextRegular",
  },
  image: {
    width: 149,
    height: 88,
    margin: 8,
    borderRadius: theme.radii.medium,
  },
});
