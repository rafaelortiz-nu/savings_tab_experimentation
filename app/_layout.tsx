import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useFonts } from "expo-font";

export default function RootLayout() {
  const [loaded] = useFonts({
    NuSansTextRegular: require("../assets/fonts/NuSansText-Regular.otf"),
    NuSansTextMedium: require("../assets/fonts/NuSansText-Medium.otf"),
    NuSansTextSemibold: require("../assets/fonts/NuSansText-Semibold.otf"),
    NuSansDisplayMedium: require("../assets/fonts/NuSansDisplay-Medium.otf"),
  });

  if (!loaded) {
    return null;
  }

  return (
    <>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }} />
    </>
  );
}
