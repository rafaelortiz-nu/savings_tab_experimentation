import { Image, StyleSheet, Text, View } from "react-native";
import { theme } from "@/theme";

type Tile = {
  title: string;
  amount: string;
  performance: string;
  image: string;
};

type Widget2x2GridProps = {
  tiles: readonly Tile[];
};

export function Widget2x2Grid({ tiles }: Widget2x2GridProps) {
  return (
    <View style={styles.wrapper}>
      <View style={styles.grid}>
        {tiles.map((tile) => (
          <View key={tile.title} style={styles.card}>
            <View style={styles.imageFrame}>
              <Image source={{ uri: tile.image }} style={styles.image} />
            </View>
            <View style={styles.content}>
              <Text style={styles.overline}>{tile.title}</Text>
              <Text style={styles.amount}>{tile.amount}</Text>
              <Text style={styles.performance}>{tile.performance}</Text>
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
    paddingBottom: theme.spacing.x3,
  },
  grid: {
    flexDirection: "row",
    gap: theme.spacing.x3,
  },
  card: {
    flex: 1,
    borderRadius: theme.radii.large,
    borderWidth: 1,
    borderColor: theme.colors.nudsBorderSubtle,
    backgroundColor: theme.colors.nudsBackgroundPrimary,
    ...theme.elevation.defaultCard,
    overflow: "hidden",
  },
  imageFrame: {
    marginTop: theme.spacing.x2,
    marginHorizontal: theme.spacing.x2,
    height: 62,
    borderRadius: theme.radii.medium,
    borderWidth: 1,
    borderColor: theme.colors.nudsBorderSubtle,
    overflow: "hidden",
    backgroundColor: theme.colors.nudsBackgroundPrimary,
  },
  image: {
    width: "100%",
    height: 62,
  },
  content: {
    paddingHorizontal: theme.spacing.x3,
    paddingTop: theme.spacing.x2,
    paddingBottom: theme.spacing.x3,
    gap: 2,
  },
  overline: {
    color: theme.colors.nudsContentSecondary,
    ...theme.typography.labelSmall,
    fontFamily: "NuSansTextRegular",
  },
  amount: {
    color: theme.colors.nudsContentPrimary,
    ...theme.typography.subtitleMediumStrong,
  },
  performance: {
    color: theme.colors.nudsPositive,
    ...theme.typography.labelSmall,
  },
});
