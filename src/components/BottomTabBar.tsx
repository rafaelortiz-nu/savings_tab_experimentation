import { BlurView } from "expo-blur";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { AppIcon, type IconName } from "@/components/AppIcon";
import { theme } from "@/theme";

type NavItem = {
  key: string;
  label: string;
  icon: IconName;
  active: boolean;
};

type BottomTabBarProps = {
  items: readonly NavItem[];
};

export function BottomTabBar({ items }: BottomTabBarProps) {
  return (
    <View style={styles.container}>
      <View style={styles.effectsLayer} pointerEvents="none">
        <BlurView
          style={styles.blurLayer}
          intensity={24}
          tint="light"
          experimentalBlurMethod="dimezisBlurView"
        />
        <View style={styles.whiteAlphaLayer} />
      </View>
      <View style={styles.nav}>
        {items.map((item) => (
          <Pressable key={item.key} style={styles.navItem}>
            <AppIcon
              name={item.icon}
              size={20}
              color={item.active ? theme.colors.nudsMain : theme.colors.nudsContentPrimary}
            />
            <Text style={[styles.label, item.active && styles.labelActive]}>{item.label}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    borderTopWidth: 1,
    borderTopColor: theme.colors.nudsBorderHairline,
    backgroundColor: "transparent",
    paddingTop: 2,
    paddingBottom: 8,
    overflow: "hidden",
  },
  effectsLayer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 0,
  },
  blurLayer: {
    ...StyleSheet.absoluteFillObject,
  },
  whiteAlphaLayer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255,255,255,0.8)",
  },
  nav: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    zIndex: 1,
  },
  navItem: {
    flex: 1,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
  },
  label: {
    color: theme.colors.nudsContentPrimary,
    ...theme.typography.label2XSmall,
  },
  labelActive: {
    color: theme.colors.nudsMain,
  },
});
