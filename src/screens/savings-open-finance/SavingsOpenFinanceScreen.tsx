import { useEffect, useMemo, useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Animated, Easing, Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import type { StyleProp, ViewStyle } from "react-native";
import Svg, { Rect } from "react-native-svg";
import { AppIcon } from "@/components/AppIcon";
import { BottomTabBar } from "@/components/BottomTabBar";
import { TopBar } from "@/components/TopBar";
import { theme } from "@/theme";
import { savingsOpenFinanceData } from "./data";

const AnimatedRect = Animated.createAnimatedComponent(Rect);
const BALANCE_DIGIT_SLOT_HEIGHT =
  typeof theme.typography.labelSmall.lineHeight === "number" ? theme.typography.labelSmall.lineHeight : 16;
const BALANCE_DIGIT_SLOT_WIDTH = 9;

export function SavingsOpenFinanceScreen() {
  const topEntrance = useRef(new Animated.Value(0)).current;
  const bodyEntrance = useRef(new Animated.Value(0)).current;
  const promoDismissProgress = useRef(new Animated.Value(0)).current;
  const [promoHeight, setPromoHeight] = useState(0);
  const [isPromoDismissed, setIsPromoDismissed] = useState(false);
  const [shouldStartYieldAnimation, setShouldStartYieldAnimation] = useState(false);

  useEffect(() => {
    Animated.sequence([
      Animated.timing(topEntrance, {
        toValue: 1,
        duration: 460,
        easing: Easing.out(Easing.exp),
        useNativeDriver: true,
      }),
      Animated.timing(bodyEntrance, {
        toValue: 1,
        duration: 440,
        easing: Easing.out(Easing.exp),
        useNativeDriver: true,
      }),
    ]).start(({ finished }) => {
      if (finished) {
        setShouldStartYieldAnimation(true);
      }
    });
  }, [bodyEntrance, topEntrance]);

  const handleDismissPromo = () => {
    if (isPromoDismissed) {
      return;
    }

    setIsPromoDismissed(true);
    Animated.timing(promoDismissProgress, {
      toValue: 1,
      duration: 340,
      easing: Easing.inOut(Easing.cubic),
      useNativeDriver: false,
    }).start();
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <View style={styles.phoneFrame}>
        <TopBar title={savingsOpenFinanceData.title} />

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
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
            <Animated.View
              style={[
                promoHeight > 0
                  ? {
                      height: promoDismissProgress.interpolate({
                        inputRange: [0, 1],
                        outputRange: [promoHeight, 0],
                      }),
                      opacity: promoDismissProgress.interpolate({
                        inputRange: [0, 1],
                        outputRange: [1, 0],
                      }),
                      transform: [
                        {
                          translateY: promoDismissProgress.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0, -8],
                          }),
                        },
                      ],
                    }
                  : null,
                styles.promoDismissContainer,
              ]}
              onLayout={(event) => {
                if (promoHeight === 0) {
                  setPromoHeight(event.nativeEvent.layout.height);
                }
              }}
            >
              <PromoCard onDismiss={handleDismissPromo} isDismissed={isPromoDismissed} />
            </Animated.View>
            <BalanceHero shouldStartYieldAnimation={shouldStartYieldAnimation} />
            <QuickActions />
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
            <SectionHeading label={savingsOpenFinanceData.yourSavingsTitle} />
            <SavingsGrid />

            <SectionHeading
              label={savingsOpenFinanceData.otherBanksTitle}
              containerStyle={styles.otherBanksSectionHeadingWrap}
            />
            <OtherBanksCard />

            <SectionHeading label={savingsOpenFinanceData.boostTitle} containerStyle={styles.boostSectionHeadingWrap} />
            <BoostList />
          </Animated.View>
        </ScrollView>

        <View style={styles.tabBar}>
          <BottomTabBar items={savingsOpenFinanceData.navItems} />
        </View>
      </View>
    </SafeAreaView>
  );
}

function PromoCard({
  onDismiss,
  isDismissed,
}: {
  onDismiss: () => void;
  isDismissed: boolean;
}) {
  return (
    <View style={styles.promoWrapper}>
      <ShiningBorder radius={theme.radii.large}>
        <View style={styles.promoCard}>
          <View style={styles.promoContent}>
            <Text style={styles.promoTitle}>{savingsOpenFinanceData.promoTitle}</Text>
            <View style={styles.promoActions}>
              <Pressable style={({ pressed }) => [styles.promoPrimaryButton, pressed && styles.pressed]}>
                <Text style={styles.promoPrimaryLabel}>{savingsOpenFinanceData.promoPrimaryAction}</Text>
                <AppIcon name="arrowRight" size={14} color={theme.colors.nudsMain} />
              </Pressable>
              <Pressable
                onPress={onDismiss}
                disabled={isDismissed}
                style={({ pressed }) => [styles.promoSecondaryButton, pressed && styles.pressed]}
              >
                <Text style={styles.promoSecondaryLabel}>{savingsOpenFinanceData.promoSecondaryAction}</Text>
              </Pressable>
            </View>
          </View>
          <View style={styles.promoAvatar}>
            <AppIcon name="logoCaixa" size={40} />
          </View>
        </View>
      </ShiningBorder>
    </View>
  );
}

function ShiningBorder({
  children,
  radius,
}: {
  children: React.ReactNode;
  radius: number;
}) {
  const sizeRef = useRef({ width: 0, height: 0 });
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(progress, {
        toValue: 1,
        duration: 2500,
        easing: Easing.linear,
        useNativeDriver: false,
      })
    );
    loop.start();
    return () => loop.stop();
  }, [progress]);

  const width = Math.max(sizeRef.current.width, 0);
  const height = Math.max(sizeRef.current.height, 0);
  const innerW = Math.max(width - 2, 0);
  const innerH = Math.max(height - 2, 0);
  const clampedR = Math.max(0, Math.min(radius, innerW / 2, innerH / 2));
  const perimeter = innerW > 0 && innerH > 0 ? 2 * (innerW + innerH - 2 * clampedR) + 2 * Math.PI * clampedR : 1;
  const visibleSegment = Math.min(68, Math.max(28, perimeter * 0.14));
  const dashGap = Math.max(perimeter - visibleSegment, 1);

  const dashOffset = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -perimeter],
  });

  return (
    <View
      style={{ position: "relative", borderRadius: radius }}
      onLayout={(event) => {
        sizeRef.current = {
          width: event.nativeEvent.layout.width,
          height: event.nativeEvent.layout.height,
        };
      }}
    >
      <View
        pointerEvents="none"
        style={[
          StyleSheet.absoluteFillObject,
          {
            borderRadius: radius,
            borderWidth: 2,
            borderColor: "#ECD9FF",
          },
        ]}
      />
      <Svg pointerEvents="none" style={StyleSheet.absoluteFillObject}>
        <AnimatedRect
          x={1}
          y={1}
          width={innerW}
          height={innerH}
          rx={clampedR}
          ry={clampedR}
          fill="none"
          stroke="#C084FC"
          strokeWidth={4}
          strokeOpacity={0.5}
          strokeDasharray={`${visibleSegment} ${dashGap}`}
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
        />
        <AnimatedRect
          x={1}
          y={1}
          width={innerW}
          height={innerH}
          rx={clampedR}
          ry={clampedR}
          fill="none"
          stroke="#FFFFFF"
          strokeWidth={2}
          strokeDasharray={`${visibleSegment} ${dashGap}`}
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
        />
      </Svg>
      <View style={{ position: "relative", zIndex: 1 }}>{children}</View>
    </View>
  );
}

function SectionHeading({
  label,
  containerStyle,
}: {
  label: string;
  containerStyle?: StyleProp<ViewStyle>;
}) {
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
      <Text style={styles.balanceLabel}>{savingsOpenFinanceData.totalBalanceLabel}</Text>
      <Text style={styles.balanceAmount}>{savingsOpenFinanceData.totalBalance}</Text>
      <View style={styles.balanceTrendRow}>
        <Text style={styles.balanceTrend}>+ $</Text>
        <RollingYieldValue
          start={savingsOpenFinanceData.yieldStart}
          target={savingsOpenFinanceData.yieldTarget}
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
            name={savingsOpenFinanceData.primaryActionIcon}
            size={20}
            color={theme.colors.nudsContentPrimary}
            stroke="none"
          />
        </Pressable>
        <Text style={styles.quickActionSecondaryLabel}>{savingsOpenFinanceData.primaryActionLabel}</Text>
      </View>

      <View style={styles.quickActionItem}>
        <Pressable style={({ pressed }) => [styles.quickActionSecondary, pressed && styles.pressed]}>
          <AppIcon
            name={savingsOpenFinanceData.secondaryActionIcon}
            size={20}
            color={theme.colors.nudsContentPrimary}
          />
        </Pressable>
        <Text style={styles.quickActionSecondaryLabel}>{savingsOpenFinanceData.secondaryActionLabel}</Text>
      </View>
    </View>
  );
}

function SavingsGrid() {
  return (
    <View style={styles.gridWrapper}>
      <View style={styles.grid}>
        {savingsOpenFinanceData.savingsTiles.map((tile) => (
          <View key={tile.title} style={styles.tileCard}>
            <View style={styles.tileImageFrame}>
              <Image source={{ uri: tile.image }} style={[styles.tileImage, tile.imageStyle]} />
              {tile.overlayImage ? <Image source={{ uri: tile.overlayImage }} style={styles.tileOverlayImage} /> : null}
            </View>
            <View style={styles.tileTexts}>
              <Text style={styles.tileTitle}>{tile.title}</Text>
              <Text style={styles.tileAmount}>{tile.amount}</Text>
              <Text style={styles.tilePerformance}>{tile.performance}</Text>
            </View>
          </View>
        ))}

        <View style={styles.createCard}>
          <View style={styles.createBadge}>
            <AppIcon name="add" size={16} color={theme.colors.nudsMain} />
          </View>
          <View style={styles.createTexts}>
            <Text style={styles.createTitle}>{savingsOpenFinanceData.createTileTitle}</Text>
            <Text style={styles.createSubtitle}>{savingsOpenFinanceData.createTileSubtitle}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

function OtherBanksCard() {
  return (
    <View style={styles.otherBanksWrapper}>
      <View style={styles.otherBanksCard}>
        <View style={styles.otherBanksLeft}>
          <Text style={styles.otherBanksLabel}>{savingsOpenFinanceData.otherBankLabel}</Text>
          <Text style={styles.otherBanksAmount}>{savingsOpenFinanceData.otherBankAmount}</Text>
        </View>
        <View style={styles.otherBanksIconCircle}>
          <AppIcon name={savingsOpenFinanceData.otherBankMainIcon} size={18} color={theme.colors.nudsContentPrimary} />
          <View style={styles.otherBanksBadge}>
            <AppIcon name={savingsOpenFinanceData.otherBankBadgeIcon} size={20} />
            <View style={styles.otherBanksBadgeOverlay} />
          </View>
        </View>
      </View>
    </View>
  );
}

function BoostList() {
  const visibleBoostItems = savingsOpenFinanceData.boostItems.filter((item) => item.title !== "Open Finance");

  return (
    <View style={styles.boostWrapper}>
      <View style={styles.boostCard}>
        {visibleBoostItems.map((item) => (
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
  promoDismissContainer: {
    overflow: "hidden",
  },
  promoWrapper: {
    paddingHorizontal: theme.spacing.x4,
    paddingTop: 0,
    paddingBottom: 12,
  },
  promoCard: {
    borderWidth: 1.5,
    borderColor: "#ECD9FF",
    borderRadius: theme.radii.large,
    backgroundColor: "#FAF6FF",
    ...theme.elevation.defaultCard,
    paddingLeft: 20,
    paddingTop: 16,
    paddingBottom: 12,
    paddingRight: 20,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  promoContent: {
    flex: 1,
    gap: 12,
  },
  promoTitle: {
    color: theme.colors.nudsMainFeedback,
    ...theme.typography.labelMedium,
    fontFamily: "NuSansTextSemibold",
    lineHeight: 21,
  },
  promoActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  promoPrimaryButton: {
    height: 36,
    borderRadius: theme.radii.jumbo,
    backgroundColor: "#F2E8FD",
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  promoSecondaryButton: {
    height: 36,
    borderRadius: theme.radii.jumbo,
    paddingHorizontal: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  promoPrimaryLabel: {
    color: theme.colors.nudsMainFeedback,
    ...theme.typography.labelXSmallStrong,
  },
  promoSecondaryLabel: {
    color: theme.colors.nudsContentSecondary,
    ...theme.typography.labelXSmallStrong,
  },
  promoAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    backgroundColor: "#38AEB3",
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
    marginTop: 0,
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
  quickActionPrimary: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: theme.colors.nudsMain,
    alignItems: "center",
    justifyContent: "center",
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
  quickActionPrimaryLabel: {
    color: theme.colors.nudsMain,
    ...theme.typography.labelSmallStrong,
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
    paddingTop: 8,
  },
  otherBanksSectionHeadingWrap: {
    height: "auto",
    paddingTop: 32,
    paddingBottom: 16,
    justifyContent: "flex-end",
  },
  gridWrapper: {
    paddingHorizontal: theme.spacing.x4,
    paddingBottom: 8,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  tileCard: {
    width: "48.25%",
    aspectRatio: 1,
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "flex-start",
    flexShrink: 0,
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
    width: "48.25%",
    aspectRatio: 1,
    flexShrink: 0,
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
  otherBanksWrapper: {
    paddingHorizontal: theme.spacing.x4,
    paddingBottom: 24,
  },
  otherBanksCard: {
    height: 85,
    borderRadius: theme.radii.large,
    borderWidth: 1,
    borderColor: theme.colors.nudsBorderSubtle,
    backgroundColor: theme.colors.nudsBackgroundPrimary,
    ...theme.elevation.defaultCard,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  otherBanksLeft: {
    gap: 2,
  },
  otherBanksLabel: {
    color: theme.colors.nudsContentSecondary,
    ...theme.typography.labelMedium,
  },
  otherBanksAmount: {
    color: theme.colors.nudsContentPrimary,
    ...theme.typography.subtitleMediumStrong,
  },
  otherBanksIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.nudsBackgroundSecondary,
    alignItems: "center",
    justifyContent: "center",
  },
  otherBanksBadge: {
    position: "absolute",
    right: -6,
    bottom: -6,
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: theme.colors.nudsBackgroundPrimary,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  otherBanksBadgeOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(31,2,48,0.04)",
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
