import { useEffect, useMemo, useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Animated, Easing, Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import type { StyleProp, ViewStyle } from "react-native";
import { AppIcon } from "@/components/AppIcon";
import { BottomTabBar } from "@/components/BottomTabBar";
import { TopBar } from "@/components/TopBar";
import { theme } from "@/theme";
import { savings3BoxesCreatedData } from "./data";

const BALANCE_DIGIT_SLOT_HEIGHT =
  typeof theme.typography.labelSmall.lineHeight === "number" ? theme.typography.labelSmall.lineHeight : 16;
const BALANCE_DIGIT_SLOT_WIDTH = 9;

type SectionHeadingProps = {
  label: string;
  containerStyle?: StyleProp<ViewStyle>;
};

export function Savings3BoxesCreatedScreen() {
  const topEntrance = useRef(new Animated.Value(0)).current;
  const yourSavingsEntrance = useRef(new Animated.Value(0)).current;
  const boostEntrance = useRef(new Animated.Value(0)).current;
  const tileEntrances = useRef([
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
  ]).current;
  const [shouldStartYieldAnimation, setShouldStartYieldAnimation] = useState(false);

  useEffect(() => {
    Animated.sequence([
      Animated.timing(topEntrance, {
        toValue: 1,
        duration: 520,
        easing: Easing.bezier(0.2, 0.9, 0.3, 1),
        useNativeDriver: true,
      }),
      Animated.timing(yourSavingsEntrance, {
        toValue: 1,
        duration: 440,
        easing: Easing.bezier(0.2, 0.9, 0.3, 1),
        useNativeDriver: true,
      }),
      Animated.stagger(
        80,
        tileEntrances.map((tileEntrance) =>
          Animated.timing(tileEntrance, {
            toValue: 1,
            duration: 420,
            easing: Easing.bezier(0.2, 0.9, 0.3, 1),
            useNativeDriver: true,
          }),
        ),
      ),
      Animated.timing(boostEntrance, {
        toValue: 1,
        duration: 420,
        easing: Easing.bezier(0.2, 0.9, 0.3, 1),
        useNativeDriver: true,
      }),
    ]).start(({ finished }) => {
      if (finished) {
        setShouldStartYieldAnimation(true);
      }
    });
  }, [boostEntrance, tileEntrances, topEntrance, yourSavingsEntrance]);

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <View style={styles.phoneFrame}>
        <TopBar title={savings3BoxesCreatedData.title} />

        <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <Animated.View
            style={[
              styles.topContent,
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
            <BalanceHero shouldStartYieldAnimation={shouldStartYieldAnimation} />
            <QuickActions />
          </Animated.View>

          <View style={styles.body}>
            <Animated.View
              style={{
                opacity: yourSavingsEntrance,
                transform: [
                  {
                    translateY: yourSavingsEntrance.interpolate({
                      inputRange: [0, 1],
                      outputRange: [12, 0],
                    }),
                  },
                ],
              }}
            >
              <SectionHeading label={savings3BoxesCreatedData.yourSavingsTitle} />
            </Animated.View>
            <SavingsGrid tileEntrances={tileEntrances} />

            <Animated.View
              style={{
                opacity: boostEntrance,
                transform: [
                  {
                    translateY: boostEntrance.interpolate({
                      inputRange: [0, 1],
                      outputRange: [12, 0],
                    }),
                  },
                ],
              }}
            >
              <SectionHeading label={savings3BoxesCreatedData.boostTitle} containerStyle={styles.boostSectionHeadingWrap} />
              <BoostList />
            </Animated.View>
          </View>
        </ScrollView>

        <View style={styles.tabBar}>
          <BottomTabBar items={savings3BoxesCreatedData.navItems} />
        </View>
      </View>
    </SafeAreaView>
  );
}

function SectionHeading({ label, containerStyle }: SectionHeadingProps) {
  return (
    <View style={[styles.sectionHeadingWrap, containerStyle]}>
      <Text style={styles.sectionHeadingLabel}>{label}</Text>
    </View>
  );
}

function RollingYieldValue({
  start,
  target,
  shouldStart,
}: {
  start: number;
  target: number;
  shouldStart: boolean;
}) {
  const startText = start.toFixed(2);
  const endText = target.toFixed(2);
  const digitProgressRefs = useRef<Animated.Value[]>([]);

  const odometerGlyphs = useMemo(() => {
    let digitIndex = 0;

    return endText.split("").map((char, glyphIndex) => {
      if (!/\d/.test(char)) {
        return {
          key: `static-${glyphIndex}-${char}`,
          type: "static" as const,
          char,
        };
      }

      const startDigit = Number(startText[glyphIndex]);
      const endDigit = Number(char);
      const digitOrder = digitIndex;
      const currentDigitIndex = digitIndex;
      digitIndex += 1;

      const fullTurns = 1 + digitOrder;
      const delta = (endDigit - startDigit + 10) % 10;
      const stepCount = fullTurns * 10 + delta;
      const wheelDigits = Array.from({ length: stepCount + 1 }, (_, step) => (startDigit + step) % 10);

      return {
        key: `digit-${glyphIndex}`,
        type: "digit" as const,
        digitIndex: currentDigitIndex,
        stepCount,
        wheelDigits,
      };
    });
  }, [endText, startText]);

  const digitCount = useMemo(() => odometerGlyphs.filter((glyph) => glyph.type === "digit").length, [odometerGlyphs]);

  if (digitProgressRefs.current.length !== digitCount) {
    digitProgressRefs.current = Array.from({ length: digitCount }, (_, index) => digitProgressRefs.current[index] ?? new Animated.Value(0));
  }

  useEffect(() => {
    if (!shouldStart) {
      digitProgressRefs.current.forEach((digitProgress) => {
        digitProgress.setValue(0);
      });
      return;
    }

    const digitAnimations = digitProgressRefs.current.map((digitProgress, digitIndex) => {
      digitProgress.setValue(0);
      return Animated.timing(digitProgress, {
        toValue: 1,
        duration: 950 + digitIndex * 160,
        easing: Easing.bezier(0.22, 1, 0.36, 1),
        useNativeDriver: true,
      });
    });

    const animation = Animated.stagger(70, digitAnimations);
    animation.start(({ finished }) => {
      if (finished) {
        digitProgressRefs.current.forEach((digitProgress) => {
          digitProgress.setValue(1);
        });
      }
    });

    return () => {
      animation.stop();
    };
  }, [odometerGlyphs, shouldStart]);

  return (
    <View style={styles.balanceRollingValue}>
      {odometerGlyphs.map((glyph) => {
        if (glyph.type === "static") {
          return (
            <Text key={glyph.key} style={styles.balanceTrend}>
              {glyph.char}
            </Text>
          );
        }

        const digitProgress = digitProgressRefs.current[glyph.digitIndex];
        const translateY = digitProgress.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -glyph.stepCount * BALANCE_DIGIT_SLOT_HEIGHT],
          extrapolate: "clamp",
        });

        return (
          <View key={glyph.key} style={styles.balanceDigitViewport}>
            <Animated.View style={{ transform: [{ translateY }] }}>
              {glyph.wheelDigits.map((digit, digitRowIndex) => (
                <Text key={`${glyph.key}-${digitRowIndex}`} style={styles.balanceDigitText}>
                  {digit}
                </Text>
              ))}
            </Animated.View>
          </View>
        );
      })}
    </View>
  );
}

function BalanceHero({ shouldStartYieldAnimation }: { shouldStartYieldAnimation: boolean }) {
  return (
    <View style={styles.balanceWrapper}>
      <Text style={styles.balanceLabel}>{savings3BoxesCreatedData.totalBalanceLabel}</Text>
      <Text style={styles.balanceAmount}>{savings3BoxesCreatedData.totalBalance}</Text>
      <View style={styles.balanceTrendRow}>
        <Text style={styles.balanceTrend}>+ $</Text>
        <RollingYieldValue
          start={savings3BoxesCreatedData.yieldStart}
          target={savings3BoxesCreatedData.yieldTarget}
          shouldStart={shouldStartYieldAnimation}
        />
        <Text style={styles.balanceTrend}> in yield today</Text>
      </View>
    </View>
  );
}

function QuickActions() {
  return (
    <View style={styles.quickActions}>
      <View style={styles.quickActionItem}>
        <Pressable style={({ pressed }) => [styles.quickActionSecondary, pressed && styles.pressed]}>
          <AppIcon
            name={savings3BoxesCreatedData.primaryActionIcon}
            size={20}
            color={theme.colors.nudsContentPrimary}
            stroke="none"
          />
        </Pressable>
        <Text style={styles.quickActionSecondaryLabel}>{savings3BoxesCreatedData.primaryActionLabel}</Text>
      </View>

      <View style={styles.quickActionItem}>
        <Pressable style={({ pressed }) => [styles.quickActionSecondary, pressed && styles.pressed]}>
          <AppIcon
            name={savings3BoxesCreatedData.secondaryActionIcon}
            size={20}
            color={theme.colors.nudsContentPrimary}
          />
        </Pressable>
        <Text style={styles.quickActionSecondaryLabel}>{savings3BoxesCreatedData.secondaryActionLabel}</Text>
      </View>
    </View>
  );
}

function SavingsGrid({ tileEntrances }: { tileEntrances: Animated.Value[] }) {
  const cards = [
    ...savings3BoxesCreatedData.savingsTiles.map((tile) => ({ kind: "tile" as const, tile })),
    { kind: "create" as const },
  ];

  return (
    <View style={styles.gridWrapper}>
      <View style={styles.grid}>
        {cards.map((card, index) => {
          const tileEntrance = tileEntrances[index];

          const entranceStyle = tileEntrance
            ? {
                opacity: tileEntrance,
                transform: [
                  {
                    translateY: tileEntrance.interpolate({
                      inputRange: [0, 1],
                      outputRange: [14, 0],
                    }),
                  },
                ],
              }
            : null;

          if (card.kind === "create") {
            return (
              <Animated.View key="create-card" style={[styles.gridAnimatedItem, entranceStyle]}>
                <View style={styles.createCard}>
                  <View style={styles.createBadge}>
                    <AppIcon name="add" size={16} color={theme.colors.nudsMain} />
                  </View>
                  <View style={styles.createTexts}>
                    <Text style={styles.createTitle}>{savings3BoxesCreatedData.createTileTitle}</Text>
                    <Text style={styles.createSubtitle}>{savings3BoxesCreatedData.createTileSubtitle}</Text>
                  </View>
                </View>
              </Animated.View>
            );
          }

          return (
            <Animated.View key={card.tile.title} style={[styles.gridAnimatedItem, entranceStyle]}>
              <View style={styles.tileCard}>
                <View style={styles.tileImageFrame}>
                  <Image source={{ uri: card.tile.image }} style={[styles.tileImage, card.tile.imageStyle]} />
                  {card.tile.overlayImage ? <Image source={{ uri: card.tile.overlayImage }} style={styles.tileOverlayImage} /> : null}
                </View>
                <View style={styles.tileTexts}>
                  <Text style={styles.tileTitle}>{card.tile.title}</Text>
                  <Text style={styles.tileAmount}>{card.tile.amount}</Text>
                  <Text style={styles.tilePerformance}>{card.tile.performance}</Text>
                </View>
              </View>
            </Animated.View>
          );
        })}
      </View>
    </View>
  );
}

function BoostList() {
  return (
    <View style={styles.boostWrapper}>
      <View style={styles.boostCard}>
        {savings3BoxesCreatedData.boostItems.map((item, index) => (
          <View key={item.title}>
            <View style={styles.boostRow}>
              <View style={styles.boostIconCircle}>
                <AppIcon name={item.icon} size={18} color={theme.colors.nudsContentPrimary} />
              </View>
              <View style={styles.boostTextArea}>
                <Text style={styles.boostTitle}>{item.title}</Text>
                <Text style={styles.boostSubtitle}>{item.subtitle}</Text>
              </View>
            </View>
            {index < savings3BoxesCreatedData.boostItems.length - 1 ? <View style={styles.boostDivider} /> : null}
          </View>
        ))}
      </View>
    </View>
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
  topContent: {
    backgroundColor: theme.colors.nudsBackgroundPrimary,
    paddingBottom: 12,
  },
  balanceWrapper: {
    alignItems: "center",
    paddingTop: 20,
    paddingBottom: 20,
    gap: 4,
  },
  balanceLabel: {
    color: theme.colors.nudsContentSecondary,
    ...theme.typography.labelMedium,
  },
  balanceAmount: {
    color: theme.colors.nudsContentPrimary,
    ...theme.typography.titleLarge,
  },
  balanceTrend: {
    color: theme.colors.nudsPositive,
    ...theme.typography.labelSmall,
  },
  balanceTrendRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  balanceRollingValue: {
    flexDirection: "row",
    alignItems: "center",
  },
  balanceDigitViewport: {
    width: BALANCE_DIGIT_SLOT_WIDTH,
    height: BALANCE_DIGIT_SLOT_HEIGHT,
    overflow: "hidden",
    alignItems: "center",
  },
  balanceDigitText: {
    width: BALANCE_DIGIT_SLOT_WIDTH,
    height: BALANCE_DIGIT_SLOT_HEIGHT,
    color: theme.colors.nudsPositive,
    ...theme.typography.labelSmall,
    textAlign: "center",
  },
  quickActions: {
    paddingTop: 4,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "center",
    gap: 36,
  },
  quickActionItem: {
    minWidth: 112,
    height: 90,
    alignItems: "center",
    justifyContent: "flex-start",
    gap: 8,
  },
  quickActionSecondary: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 1,
    borderColor: theme.colors.nudsBorderSubtle,
    backgroundColor: theme.colors.nudsBackgroundPrimary,
    ...theme.elevation.defaultCard,
    alignItems: "center",
    justifyContent: "center",
  },
  quickActionSecondaryLabel: {
    color: theme.colors.nudsContentPrimary,
    ...theme.typography.labelSmallStrong,
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
    paddingBottom: 16,
  },
  sectionHeadingLabel: {
    color: theme.colors.nudsContentSecondary,
    ...theme.typography.labelSmallStrong,
  },
  boostSectionHeadingWrap: {
    paddingTop: 12,
  },
  gridWrapper: {
    paddingHorizontal: theme.spacing.x4,
    paddingBottom: 20,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  gridAnimatedItem: {
    width: "48.25%",
    aspectRatio: 1,
    flexShrink: 0,
  },
  tileCard: {
    width: "100%",
    height: "100%",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "flex-start",
    borderRadius: theme.radii.large,
    borderWidth: 1,
    borderColor: theme.colors.nudsBorderSubtle,
    backgroundColor: theme.colors.nudsBackgroundPrimary,
    shadowColor: theme.colors.nudsContentPrimary,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 0,
    elevation: 1,
    overflow: "hidden",
  },
  tileImageFrame: {
    alignSelf: "stretch",
    marginHorizontal: 8,
    marginTop: 8,
    height: 62,
    borderRadius: 16,
    overflow: "hidden",
  },
  tileImage: {
    position: "absolute",
    left: 0,
    top: 0,
    width: "100%",
    height: "100%",
  },
  tileOverlayImage: {
    ...StyleSheet.absoluteFillObject,
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
    width: "100%",
    height: "100%",
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
    marginTop: 56,
    gap: 2,
  },
  createTitle: {
    color: theme.colors.nudsContentPrimary,
    ...theme.typography.subtitleMediumStrong,
  },
  createSubtitle: {
    color: theme.colors.nudsMain,
    ...theme.typography.labelSmall,
  },
  boostWrapper: {
    paddingHorizontal: theme.spacing.x4,
    paddingBottom: 24,
  },
  boostCard: {
    borderRadius: theme.radii.large,
    borderWidth: 1,
    borderColor: theme.colors.nudsBorderSubtle,
    backgroundColor: theme.colors.nudsBackgroundPrimary,
    ...theme.elevation.defaultCard,
    paddingTop: 8,
    paddingBottom: 8,
    overflow: "hidden",
  },
  boostRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  boostIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.nudsBackgroundSecondary,
    alignItems: "center",
    justifyContent: "center",
  },
  boostTextArea: {
    flex: 1,
    gap: 4,
  },
  boostTitle: {
    color: theme.colors.nudsContentPrimary,
    ...theme.typography.labelSmallStrong,
  },
  boostSubtitle: {
    color: theme.colors.nudsContentSecondary,
    ...theme.typography.paragraphSmall,
  },
  boostDivider: {
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
