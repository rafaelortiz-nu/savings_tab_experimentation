import { useEffect, useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Animated, Easing, Image, Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from "react-native";
import Svg, { Defs, LinearGradient, Rect, Stop } from "react-native-svg";
import { AppIcon } from "@/components/AppIcon";
import { BottomTabBar } from "@/components/BottomTabBar";
import { TopBar } from "@/components/TopBar";
import { theme } from "@/theme";
import { savings1BoxData } from "./data";
import HeroNewTripImage from "../../../assets/illustrations/one-box/hero_new_trip.png";
import HeroNewCellPhoneImage from "../../../assets/illustrations/one-box/hero_new_cell_phone.png";
import HeroTechnicalCourseImage from "../../../assets/illustrations/one-box/hero_technical_course.png";
import ThumbEmergencyFundImage from "../../../assets/illustrations/one-box/thumb_emergency_fund.png";

const HERO_IMAGES = {
  newTrip: HeroNewTripImage,
  newCellPhone: HeroNewCellPhoneImage,
  technicalCourse: HeroTechnicalCourseImage,
} as const;

export function Savings1BoxScreen() {
  const topEntrance = useRef(new Animated.Value(0)).current;
  const bodyEntrance = useRef(new Animated.Value(0)).current;
  const heroScrollX = useRef(new Animated.Value(0)).current;
  const didLogInterpolationShapeRef = useRef(false);
  const [activeHeroIndex, setActiveHeroIndex] = useState(0);
  const { width: screenWidth } = useWindowDimensions();
  const heroCardWidth = Math.round(screenWidth - 46);
  const heroSnapInterval = heroCardWidth + 12;
  const heroOnScroll = Animated.event([{ nativeEvent: { contentOffset: { x: heroScrollX } } }], { useNativeDriver: true });

  useEffect(() => {
    Animated.sequence([
      Animated.timing(topEntrance, {
        toValue: 1,
        duration: 520,
        easing: Easing.bezier(0.2, 0.9, 0.3, 1),
        useNativeDriver: true,
      }),
      Animated.timing(bodyEntrance, {
        toValue: 1,
        duration: 440,
        easing: Easing.bezier(0.2, 0.9, 0.3, 1),
        useNativeDriver: true,
      }),
    ]).start();
  }, [bodyEntrance, topEntrance]);

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <View style={styles.phoneFrame}>
        <TopBar title={savings1BoxData.title} />

        <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <Animated.View
            style={[
              styles.heroSection,
              {
                opacity: topEntrance,
                transform: [
                  {
                    translateY: topEntrance.interpolate({
                      inputRange: [0, 1],
                      outputRange: [8, 0],
                    }),
                  },
                ],
              },
            ]}
          >
            <View style={styles.heroHeader}>
              <View style={styles.heroBadge}>
                <Text style={styles.heroBadgeLabel}>{savings1BoxData.badgeLabel}</Text>
              </View>
              <Text style={styles.heroTitle}>{savings1BoxData.heroTitle}</Text>
            </View>

            <Animated.ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.heroCarousel}
              snapToInterval={heroSnapInterval}
              snapToAlignment="start"
              disableIntervalMomentum
              decelerationRate="fast"
              scrollEventThrottle={16}
              onScroll={heroOnScroll}
              onMomentumScrollEnd={({ nativeEvent }) => {
                const nextIndex = Math.round(nativeEvent.contentOffset.x / heroSnapInterval);
                const clampedIndex = Math.max(0, Math.min(nextIndex, savings1BoxData.heroCards.length - 1));
                setActiveHeroIndex(clampedIndex);
              }}
            >
              {savings1BoxData.heroCards.map((card, index) => (
                <Animated.View
                  key={`${card.title}-${index}`}
                  style={[
                    styles.heroCard,
                    { width: heroCardWidth },
                    {
                      opacity: heroScrollX.interpolate({
                        inputRange: [(index - 1) * heroSnapInterval, index * heroSnapInterval, (index + 1) * heroSnapInterval],
                        outputRange: [0.92, 1, 0.92],
                        extrapolate: "clamp",
                      }),
                      transform: [
                        {
                          scale: heroScrollX.interpolate({
                            inputRange: [(index - 1) * heroSnapInterval, index * heroSnapInterval, (index + 1) * heroSnapInterval],
                            outputRange: [0.97, 1, 0.97],
                            extrapolate: "clamp",
                          }),
                        },
                      ],
                    },
                  ]}
                >
                  {/* Delay text/button reveal until card is closer to center */}
                  {(() => {
                    const animationInputRange = [
                      (index - 1) * heroSnapInterval,
                      (index - 0.65) * heroSnapInterval,
                      (index - 0.35) * heroSnapInterval,
                      (index - 0.12) * heroSnapInterval,
                      index * heroSnapInterval,
                      (index + 0.12) * heroSnapInterval,
                      (index + 0.35) * heroSnapInterval,
                      (index + 0.65) * heroSnapInterval,
                      (index + 1) * heroSnapInterval,
                    ];
                    const titleOutputRange = [0, 0.04, 0.18, 0.46, 1, 0.46, 0.18, 0.04, 0];
                    const titleTranslateYOutputRange = [14, 12, 8, 3, 0, -3, -6, -9, -11];
                    const buttonOpacityOutputRange = [0, 0.03, 0.12, 0.34, 1, 0.34, 0.12, 0.03, 0];
                    const buttonTranslateYOutputRange = [16, 14, 10, 4, 0, -4, -7, -10, -12];

                    if (!didLogInterpolationShapeRef.current && index === 0) {
                      didLogInterpolationShapeRef.current = true;
                      // #region agent log
                      fetch("http://127.0.0.1:7764/ingest/1968387d-2282-42db-9ec5-9099a0833ae3", {
                        method: "POST",
                        headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "0e1ca7" },
                        body: JSON.stringify({
                          sessionId: "0e1ca7",
                          runId: "run2",
                          hypothesisId: "H1",
                          location: "Savings1BoxScreen.tsx:145",
                          message: "interpolation range length snapshot",
                          data: {
                            inputRangeLength: animationInputRange.length,
                            titleOutputRangeLength: titleOutputRange.length,
                            titleTranslateYOutputRangeLength: titleTranslateYOutputRange.length,
                            buttonOpacityOutputRangeLength: buttonOpacityOutputRange.length,
                            buttonTranslateYOutputRangeLength: buttonTranslateYOutputRange.length,
                          },
                          timestamp: Date.now(),
                        }),
                      }).catch(() => {});
                      // #endregion
                    }

                    const titleOpacity = heroScrollX.interpolate({
                      inputRange: animationInputRange,
                      outputRange: titleOutputRange,
                      extrapolate: "clamp",
                    });

                    const titleTranslateY = heroScrollX.interpolate({
                      inputRange: animationInputRange,
                      outputRange: titleTranslateYOutputRange,
                      extrapolate: "clamp",
                    });

                    const buttonOpacity = heroScrollX.interpolate({
                      inputRange: animationInputRange,
                      outputRange: buttonOpacityOutputRange,
                      extrapolate: "clamp",
                    });

                    const buttonTranslateY = heroScrollX.interpolate({
                      inputRange: animationInputRange,
                      outputRange: buttonTranslateYOutputRange,
                      extrapolate: "clamp",
                    });

                    return (
                      <>
                  <Image
                    source={HERO_IMAGES[card.image]}
                    style={[styles.heroCardImage, card.image === "newCellPhone" && styles.heroCardImageNewCellPhone]}
                  />
                  <View pointerEvents="none" style={styles.heroCardGradient}>
                    <Svg width="100%" height="100%" preserveAspectRatio="none">
                      <Defs>
                        <LinearGradient id={`heroCardOverlay-${index}`} x1="0" y1="0" x2="0" y2="1">
                          <Stop offset="0%" stopColor="#9359DA" stopOpacity={0} />
                          <Stop offset="64%" stopColor="#9359DA" stopOpacity={0.14} />
                          <Stop offset="91.318%" stopColor="#9359DA" stopOpacity={0.38} />
                          <Stop offset="100%" stopColor="#9359DA" stopOpacity={0.48} />
                        </LinearGradient>
                      </Defs>
                      <Rect x="0" y="0" width="100%" height="100%" fill={`url(#heroCardOverlay-${index})`} />
                    </Svg>
                  </View>
                  <Animated.View
                    style={{
                      opacity: titleOpacity,
                      transform: [
                        {
                          translateY: titleTranslateY,
                        },
                      ],
                    }}
                  >
                    <Text style={styles.heroCardTitle}>{card.title}</Text>
                  </Animated.View>
                  {card.ctaLabel ? (
                    <Animated.View
                      style={[
                        styles.heroCardButtonWrap,
                        {
                          opacity: buttonOpacity,
                          transform: [
                            {
                              translateY: buttonTranslateY,
                            },
                          ],
                        },
                      ]}
                    >
                      <Pressable style={({ pressed }) => [styles.heroCardButton, pressed && styles.pressed]}>
                        <Text style={styles.heroCardButtonLabel}>{card.ctaLabel}</Text>
                      </Pressable>
                    </Animated.View>
                  ) : null}
                  <View pointerEvents="none" style={styles.heroCardInset} />
                      </>
                    );
                  })()}
                </Animated.View>
              ))}
            </Animated.ScrollView>

            <View style={styles.pageControl}>
              {savings1BoxData.heroCards.map((card, index) => (
                <View key={`${card.title}-dot`} style={[styles.pageDot, index === activeHeroIndex && styles.pageDotActive]} />
              ))}
            </View>
          </Animated.View>

          <Animated.View
            style={[
              styles.body,
              {
                opacity: bodyEntrance,
                transform: [
                  {
                    translateY: bodyEntrance.interpolate({
                      inputRange: [0, 1],
                      outputRange: [10, 0],
                    }),
                  },
                ],
              },
            ]}
          >
            <View style={styles.sectionHeadingWrap}>
              <Text style={styles.sectionHeadingLabel}>{savings1BoxData.yourSavingsTitle}</Text>
            </View>

            <View style={styles.gridWrapper}>
              <View style={styles.gridRow}>
                <View style={styles.tileCard}>
                  <View style={styles.tileImageFrame}>
                    <Image source={ThumbEmergencyFundImage} style={styles.tileImage} />
                  </View>
                  <View style={styles.tileTexts}>
                    <Text style={styles.tileTitle}>{savings1BoxData.savingsItem.title}</Text>
                    <Text style={styles.tileAmount}>{savings1BoxData.savingsItem.amount}</Text>
                    <Text style={styles.tilePerformance}>{savings1BoxData.savingsItem.performance}</Text>
                  </View>
                </View>

                <View style={styles.createCard}>
                  <View style={styles.createBadge}>
                    <AppIcon name="add" size={16} color={theme.colors.nudsMain} />
                  </View>
                  <View style={styles.createTexts}>
                    <Text style={styles.createTitle}>{savings1BoxData.createTileTitle}</Text>
                    <Text style={styles.createSubtitle}>{savings1BoxData.createTileSubtitle}</Text>
                  </View>
                </View>
              </View>
            </View>

            <View style={styles.sectionHeadingWrap}>
              <Text style={styles.sectionHeadingLabel}>{savings1BoxData.organizeTitle}</Text>
            </View>

            <View style={styles.listWrapper}>
              <View style={styles.listCard}>
                {savings1BoxData.organizeItems.map((item, index) => (
                  <View key={item.title}>
                    <View style={styles.listRow}>
                      <View style={styles.listIconCircle}>
                        <AppIcon name={item.icon} size={18} color={theme.colors.nudsContentPrimary} />
                      </View>
                      <View style={styles.listTextArea}>
                        <Text style={styles.listTitle}>{item.title}</Text>
                        <Text style={styles.listSubtitle}>{item.subtitle}</Text>
                      </View>
                    </View>
                    {index < savings1BoxData.organizeItems.length - 1 ? <View style={styles.listDivider} /> : null}
                  </View>
                ))}
              </View>
            </View>
          </Animated.View>
        </ScrollView>

        <View style={styles.tabBar}>
          <BottomTabBar items={savings1BoxData.navItems} />
        </View>
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
    backgroundColor: theme.colors.nudsBackgroundPrimary,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 112,
  },
  heroSection: {
    paddingTop: 8,
    paddingBottom: 12,
  },
  heroHeader: {
    paddingHorizontal: 20,
    gap: 8,
    marginBottom: 20,
  },
  heroBadge: {
    alignSelf: "flex-start",
    borderRadius: 8,
    backgroundColor: "#E9DAFE",
    paddingHorizontal: 8,
    minHeight: 24,
    justifyContent: "center",
  },
  heroBadgeLabel: {
    color: theme.colors.nudsMain,
    ...theme.typography.labelXSmallStrong,
    letterSpacing: 0.12,
  },
  heroTitle: {
    color: theme.colors.nudsContentPrimary,
    ...theme.typography.titleMedium,
  },
  heroCarousel: {
    paddingLeft: 16,
    paddingRight: 40,
    gap: 12,
  },
  heroCard: {
    height: 169,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: theme.colors.nudsBorderSubtle,
    overflow: "hidden",
    backgroundColor: theme.colors.nudsBackgroundPrimary,
  },
  heroCardImage: {
    ...StyleSheet.absoluteFillObject,
    width: "100%",
    height: "100%",
  },
  heroCardImageNewCellPhone: {
    width: "100%",
    height: "210%",
    left: 0,
    top: "-88%",
  },
  heroCardGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  heroCardTitle: {
    marginTop: 50,
    color: "#FFFFFF",
    textAlign: "center",
    ...theme.typography.titleSmall,
  },
  heroCardButton: {
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    ...theme.elevation.onColor,
  },
  heroCardButtonWrap: {
    position: "absolute",
    left: 10,
    right: 10,
    bottom: 8,
  },
  heroCardButtonLabel: {
    color: theme.colors.nudsMain,
    ...theme.typography.labelSmallStrong,
  },
  heroCardInset: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "rgba(31,0,47,0.02)",
  },
  pageControl: {
    marginTop: 16,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  pageDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.nudsContentDisabled,
  },
  pageDotActive: {
    backgroundColor: theme.colors.nudsContentPrimary,
  },
  body: {
    backgroundColor: theme.colors.nudsBackgroundPrimary,
    borderTopLeftRadius: theme.radii.xLarge,
    borderTopRightRadius: theme.radii.xLarge,
    paddingTop: 8,
  },
  sectionHeadingWrap: {
    height: 48,
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  sectionHeadingLabel: {
    color: theme.colors.nudsContentSecondary,
    ...theme.typography.labelSmallStrong,
  },
  gridWrapper: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  gridRow: {
    flexDirection: "row",
    gap: 12,
  },
  tileCard: {
    width: "48.25%",
    aspectRatio: 1,
    borderRadius: theme.radii.large,
    borderWidth: 1,
    borderColor: theme.colors.nudsBorderSubtle,
    backgroundColor: theme.colors.nudsBackgroundPrimary,
    ...theme.elevation.defaultCard,
    overflow: "hidden",
  },
  tileImageFrame: {
    marginHorizontal: 8,
    marginTop: 8,
    height: 62,
    borderRadius: 16,
    overflow: "hidden",
  },
  tileImage: {
    position: "absolute",
    width: "135.24%",
    height: "325.43%",
    left: "-4.57%",
    top: "-47.45%",
  },
  tileTexts: {
    padding: 16,
    gap: 2,
  },
  tileTitle: {
    color: theme.colors.nudsContentSecondary,
    ...theme.typography.labelSmall,
  },
  tileAmount: {
    color: theme.colors.nudsContentPrimary,
    ...theme.typography.subtitleMediumStrong,
  },
  tilePerformance: {
    color: theme.colors.nudsPositive,
    ...theme.typography.labelSmall,
  },
  createCard: {
    width: "48.25%",
    aspectRatio: 1,
    borderRadius: theme.radii.large,
    borderWidth: 1.5,
    borderColor: theme.colors.nudsBorderDisabledStrong,
    borderStyle: "dashed",
    backgroundColor: theme.colors.nudsBackgroundPrimary,
    padding: 16,
  },
  createBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#F2E8FD",
    alignItems: "center",
    justifyContent: "center",
  },
  createTexts: {
    marginTop: 48,
    gap: 2,
  },
  createTitle: {
    color: theme.colors.nudsContentPrimary,
    ...theme.typography.titleXSmall,
  },
  createSubtitle: {
    color: theme.colors.nudsMain,
    ...theme.typography.labelSmall,
  },
  listWrapper: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  listCard: {
    borderRadius: theme.radii.large,
    borderWidth: 1,
    borderColor: theme.colors.nudsBorderSubtle,
    backgroundColor: theme.colors.nudsBackgroundPrimary,
    ...theme.elevation.defaultCard,
    paddingTop: 8,
    paddingBottom: 8,
    overflow: "hidden",
  },
  listRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  listIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.nudsBackgroundSecondary,
    alignItems: "center",
    justifyContent: "center",
  },
  listTextArea: {
    flex: 1,
    gap: 4,
  },
  listTitle: {
    color: theme.colors.nudsContentPrimary,
    ...theme.typography.labelSmallStrong,
  },
  listSubtitle: {
    color: theme.colors.nudsContentSecondary,
    ...theme.typography.paragraphSmall,
  },
  listDivider: {
    marginHorizontal: 16,
    height: 1.5,
    backgroundColor: theme.colors.nudsBorderHairline,
  },
  tabBar: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
  },
  pressed: {
    opacity: 0.86,
    transform: [{ scale: 0.97 }],
  },
});
