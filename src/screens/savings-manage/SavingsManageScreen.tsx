import { useEffect, useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Animated, Easing, StyleSheet, View } from "react-native";
import { BalanceHero } from "@/components/BalanceHero";
import { BottomTabBar } from "@/components/BottomTabBar";
import { FinancialEducationCard } from "@/components/FinancialEducationCard";
import { OfferCarousel } from "@/components/OfferCarousel";
import { SavingsBalanceCard } from "@/components/SavingsBalanceCard";
import { SectionTitle } from "@/components/SectionTitle";
import { TopBar } from "@/components/TopBar";
import { Widget2x2Grid } from "@/components/Widget2x2Grid";
import { theme } from "@/theme";
import { savingsManageData } from "./data";

export function SavingsManageScreen() {
  const [heroHeight, setHeroHeight] = useState(0);
  const heroOffset = heroHeight || 188;
  const scrollY = useRef(new Animated.Value(0)).current;
  const heroEntrance = useRef(new Animated.Value(0)).current;
  const savingsEntrance = useRef(new Animated.Value(0)).current;
  const offersEntrance = useRef(new Animated.Value(0)).current;
  const listEntrance = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(heroEntrance, {
        toValue: 1,
        duration: 500,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(savingsEntrance, {
        toValue: 1,
        duration: 450,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(offersEntrance, {
        toValue: 1,
        duration: 350,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(listEntrance, {
        toValue: 1,
        duration: 350,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start();
  }, [heroEntrance, listEntrance, offersEntrance, savingsEntrance]);

  const heroScale = scrollY.interpolate({
    inputRange: [0, heroOffset],
    outputRange: [1, 0.8],
    extrapolate: "clamp",
  });

  const heroOpacity = scrollY.interpolate({
    inputRange: [0, heroOffset],
    outputRange: [1, 0],
    extrapolate: "clamp",
  });

  const heroEntranceOpacity = heroEntrance.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const heroEntranceTranslateY = heroEntrance.interpolate({
    inputRange: [0, 1],
    outputRange: [24, 0],
  });

  const savingsEntranceOpacity = savingsEntrance.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const savingsEntranceTranslateY = savingsEntrance.interpolate({
    inputRange: [0, 1],
    outputRange: [24, 0],
  });

  const offersEntranceOpacity = offersEntrance.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const offersEntranceTranslateY = offersEntrance.interpolate({
    inputRange: [0, 1],
    outputRange: [24, 0],
  });

  const listEntranceOpacity = listEntrance.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const listEntranceTranslateY = listEntrance.interpolate({
    inputRange: [0, 1],
    outputRange: [24, 0],
  });

  const finalHeroOpacity = Animated.multiply(heroOpacity, heroEntranceOpacity);

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <View style={styles.phoneFrame}>
        <TopBar title={savingsManageData.title} />

        <View style={styles.contentArea}>
          <Animated.View
            style={styles.heroLayer}
            onLayout={(event) => setHeroHeight(event.nativeEvent.layout.height)}
          >
            <Animated.View
              style={[
                styles.heroAnimated,
                {
                  opacity: finalHeroOpacity,
                  transform: [{ translateY: heroEntranceTranslateY }, { scale: heroScale }],
                },
              ]}
            >
              <BalanceHero
                label={savingsManageData.totalBalanceLabel}
                total={savingsManageData.totalBalance}
                trend={savingsManageData.balanceTrend}
                action={savingsManageData.cta}
              />
            </Animated.View>
          </Animated.View>

          <Animated.ScrollView
            style={styles.scrollLayer}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={[styles.scrollContent, { paddingTop: heroOffset }]}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { y: scrollY } } }],
              { useNativeDriver: true }
            )}
            scrollEventThrottle={16}
          >
            <View style={styles.body}>
              <View style={styles.bodyContent}>
                <Animated.View
                  style={{
                    opacity: savingsEntranceOpacity,
                    transform: [{ translateY: savingsEntranceTranslateY }],
                  }}
                >
                  <SectionTitle label={savingsManageData.savingsSectionTitle} />
                  <SavingsBalanceCard
                    title={savingsManageData.moneybox.title}
                    amount={savingsManageData.moneybox.amount}
                    apy={savingsManageData.moneybox.apy}
                    image={savingsManageData.moneybox.image}
                  />
                  <Widget2x2Grid tiles={savingsManageData.savingsTiles} />
                </Animated.View>

                <Animated.View
                  style={{
                    opacity: offersEntranceOpacity,
                    transform: [{ translateY: offersEntranceTranslateY }],
                  }}
                >
                  <SectionTitle label={savingsManageData.offersSectionTitle} />
                  <OfferCarousel
                    title={savingsManageData.offer.title}
                    action={savingsManageData.offer.action}
                    image={savingsManageData.offer.image}
                  />
                </Animated.View>

                <Animated.View
                  style={{
                    opacity: listEntranceOpacity,
                    transform: [{ translateY: listEntranceTranslateY }],
                  }}
                >
                  <SectionTitle label={savingsManageData.educationSectionTitle} />
                  <FinancialEducationCard items={savingsManageData.educationItems} />
                </Animated.View>
              </View>
            </View>
          </Animated.ScrollView>
        </View>

        <BottomTabBar items={savingsManageData.navItems} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.nudsBackgroundPrimary,
  },
  phoneFrame: {
    flex: 1,
    width: "100%",
    backgroundColor: theme.colors.nudsBackgroundPrimary,
  },
  contentArea: {
    flex: 1,
    position: "relative",
  },
  heroLayer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
  },
  heroAnimated: {
    transformOrigin: "top center",
  },
  scrollLayer: {
    flex: 1,
    zIndex: 2,
  },
  scrollContent: {
    paddingBottom: theme.spacing.x4,
  },
  body: {
    backgroundColor: theme.colors.nudsBackgroundSecondary,
    borderTopLeftRadius: theme.radii.xLarge,
    borderTopRightRadius: theme.radii.xLarge,
    overflow: "hidden",
  },
  bodyContent: {
    paddingTop: 12,
  },
});
