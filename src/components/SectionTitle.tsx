import { StyleSheet, Text, View } from "react-native";
import { theme } from "@/theme";

type SectionTitleProps = {
  label: string;
};

export function SectionTitle({ label }: SectionTitleProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 48,
    justifyContent: "center",
    paddingHorizontal: theme.spacing.x5,
  },
  label: {
    color: theme.colors.nudsContentSecondary,
    ...theme.typography.labelSmallStrong,
  },
});
