import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import { AppIcon } from "@/components/AppIcon";
import { theme } from "@/theme";

type OfferCarouselProps = {
  title: string;
  action: string;
  image: string;
};

export function OfferCarousel({ title, action, image }: OfferCarouselProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.content}
    >
      <OfferItem title={title} action={action} image={image} />
      <OfferItem title={title} action={action} image={image} />
    </ScrollView>
  );
}

function OfferItem({ title, action, image }: OfferCarouselProps) {
  return (
    <View style={styles.card}>
      <Image source={{ uri: image }} style={styles.image} />
      <View style={styles.cardContent}>
        <View style={styles.row}>
          <Text style={styles.title}>{title}</Text>
          <AppIcon
            name="closeMini"
            size={16}
            color={theme.colors.nudsContentSecondary}
          />
        </View>
        <Text style={styles.action}>{action}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: theme.spacing.x4,
    paddingBottom: theme.spacing.x3,
    gap: theme.spacing.x3,
  },
  card: {
    width: 299,
    height: 116,
    borderRadius: theme.radii.large,
    borderWidth: 1,
    borderColor: theme.colors.nudsBorderSubtle,
    backgroundColor: theme.colors.nudsBackgroundPrimary,
    ...theme.elevation.defaultCard,
    overflow: "hidden",
    flexDirection: "row",
    alignItems: "stretch",
  },
  image: {
    width: 80,
    height: 100,
    marginLeft: 8,
    marginTop: 8,
    borderRadius: theme.radii.medium,
  },
  cardContent: {
    flex: 1,
    paddingTop: 16,
    paddingRight: 16,
    paddingLeft: 12,
    paddingBottom: 16,
    justifyContent: "space-between",
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: theme.spacing.x2,
  },
  title: {
    flex: 1,
    color: theme.colors.nudsContentPrimary,
    ...theme.typography.labelSmallStrong,
  },
  action: {
    color: theme.colors.nudsMain,
    ...theme.typography.labelSmallStrong,
  },
});
