import { Pressable, StyleSheet, Text, View } from "react-native";
import { AppIcon } from "@/components/AppIcon";
import { theme } from "@/theme";

type TopBarProps = {
  title: string;
};

export function TopBar({ title }: TopBarProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.actions}>
        <Pressable style={styles.iconButton}>
          <AppIcon
            name="visibilityOn"
            size={20}
            color={theme.colors.nudsContentSecondary}
          />
        </Pressable>
        <Pressable style={styles.iconButton}>
          <AppIcon
            name="sparkle"
            size={20}
            color={theme.colors.nudsContentSecondary}
          />
        </Pressable>
        <Pressable style={styles.iconButton}>
          <AppIcon
            name="moreVertical"
            size={20}
            color={theme.colors.nudsContentSecondary}
          />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 64,
    paddingLeft: theme.spacing.x5,
    paddingRight: theme.spacing.x4,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    color: theme.colors.nudsContentPrimary,
    ...theme.typography.titleXSmall,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: theme.radii.jumbo,
    alignItems: "center",
    justifyContent: "center",
  },
});
