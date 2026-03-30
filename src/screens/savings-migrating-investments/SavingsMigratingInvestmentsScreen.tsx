import { useEffect, useMemo, useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Animated, Easing, Image, PanResponder, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import type { StyleProp, ViewStyle } from "react-native";
import Coin1BottomIllustration from "../../../assets/illustrations/animations/coin_1_bottom.svg";
import Coin2Illustration from "../../../assets/illustrations/animations/coin_2.svg";
import Coin3Illustration from "../../../assets/illustrations/animations/coin_3.svg";
import Coin4TopIllustration from "../../../assets/illustrations/animations/coin_4_top.svg";
import { AppIcon } from "@/components/AppIcon";
import { BottomTabBar } from "@/components/BottomTabBar";
import { TopBar } from "@/components/TopBar";
import { theme } from "@/theme";
import { savingsMigratingInvestmentsData } from "./data";

type SectionHeadingProps = {
  label: string;
  trailingLabel?: string;
  containerStyle?: StyleProp<ViewStyle>;
};

const BALANCE_DIGIT_SLOT_HEIGHT =
  typeof theme.typography.labelSmall.lineHeight === "number" ? theme.typography.labelSmall.lineHeight : 16;
const BALANCE_DIGIT_SLOT_WIDTH = 9;

let hasShownBottomSheetInSession = false;

export function SavingsMigratingInvestmentsScreen() {
  const topEntrance = useRef(new Animated.Value(0)).current;
  const yourSavingsEntrance = useRef(new Animated.Value(0)).current;
  const savingsRow1Entrance = useRef(new Animated.Value(0)).current;
  const savingsRow2Entrance = useRef(new Animated.Value(0)).current;
  const levelUpEntrance = useRef(new Animated.Value(0)).current;
  const [isBottomSheetMounted, setIsBottomSheetMounted] = useState(false);
  const [shouldStartYieldAnimation, setShouldStartYieldAnimation] = useState(false);

  useEffect(() => {
    Animated.sequence([
      Animated.timing(topEntrance, {
        toValue: 1,
        duration: 520,
        easing: Easing.bezier(0.2, 0.9, 0.3, 1),
        useNativeDriver: true,
      }),
      Animated.parallel([
        Animated.timing(yourSavingsEntrance, {
          toValue: 1,
          duration: 460,
          easing: Easing.bezier(0.2, 0.9, 0.3, 1),
          useNativeDriver: true,
        }),
        Animated.timing(savingsRow1Entrance, {
          toValue: 1,
          duration: 500,
          easing: Easing.bezier(0.2, 0.9, 0.3, 1),
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(savingsRow2Entrance, {
        toValue: 1,
        duration: 400,
        easing: Easing.bezier(0.2, 0.9, 0.3, 1),
        useNativeDriver: true,
      }),
      Animated.timing(levelUpEntrance, {
        toValue: 1,
        duration: 460,
        easing: Easing.bezier(0.2, 0.9, 0.3, 1),
        useNativeDriver: true,
      }),
    ]).start(({ finished }) => {
      if (finished) {
        setShouldStartYieldAnimation(true);
      }
    });
  }, [levelUpEntrance, savingsRow1Entrance, savingsRow2Entrance, topEntrance, yourSavingsEntrance]);

  useEffect(() => {
    if (hasShownBottomSheetInSession) {
      return;
    }

    const timer = setTimeout(() => {
      hasShownBottomSheetInSession = true;
      setIsBottomSheetMounted(true);
    }, 7000);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <View style={styles.phoneFrame}>
        <TopBar title={savingsMigratingInvestmentsData.title} />

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
            <InlineActions />
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
              <SectionHeading label={savingsMigratingInvestmentsData.yourSavingsTitle} />
            </Animated.View>
            <SavingsGrid row1Entrance={savingsRow1Entrance} row2Entrance={savingsRow2Entrance} />
            <Animated.View
              style={{
                opacity: levelUpEntrance,
                transform: [
                  {
                    translateY: levelUpEntrance.interpolate({
                      inputRange: [0, 1],
                      outputRange: [12, 0],
                    }),
                  },
                ],
              }}
            >
              <SectionHeading
                label={savingsMigratingInvestmentsData.levelUpTitle}
                trailingLabel={savingsMigratingInvestmentsData.levelUpTrailingLabel}
                containerStyle={styles.levelUpSectionHeadingWrap}
              />
              <LevelUpCarousel />
            </Animated.View>
          </View>
        </ScrollView>

        <View style={styles.tabBar}>
          <BottomTabBar items={savingsMigratingInvestmentsData.navItems} />
        </View>

        {isBottomSheetMounted ? <MigratingInvestmentsBottomSheet onClosed={() => setIsBottomSheetMounted(false)} /> : null}
      </View>
    </SafeAreaView>
  );
}

function MigratingInvestmentsBottomSheet({ onClosed }: { onClosed: () => void }) {
  const overlayOpacity = useRef(new Animated.Value(0)).current;
  const panelTranslateY = useRef(new Animated.Value(560)).current;
  const dragProgress = useRef(new Animated.Value(0)).current;
  const panelHeightRef = useRef(560);
  const coinTranslateY = useRef([
    new Animated.Value(-12),
    new Animated.Value(-20),
    new Animated.Value(-28),
    new Animated.Value(-36),
  ]).current;
  const coinOpacity = useRef([new Animated.Value(0), new Animated.Value(0), new Animated.Value(0), new Animated.Value(0)]).current;
  const [canStartCoinAnimation, setCanStartCoinAnimation] = useState(false);
  const hasTriggeredCoinAnimationRef = useRef(false);

  const closeSheet = () => {
    Animated.parallel([
      Animated.timing(overlayOpacity, {
        toValue: 0,
        duration: 250,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(panelTranslateY, {
        toValue: panelHeightRef.current,
        duration: 250,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start(({ finished }) => {
      if (finished) {
        onClosed();
      }
    });
  };

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) =>
        Math.abs(gestureState.dy) > 5 && Math.abs(gestureState.dy) > Math.abs(gestureState.dx),
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) {
          panelTranslateY.setValue(gestureState.dy);
          const dismissThreshold = Math.max(120, panelHeightRef.current * 0.22);
          const nextDragProgress = Math.min(Math.max(gestureState.dy / dismissThreshold, 0), 1);
          dragProgress.setValue(nextDragProgress);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        const dismissThreshold = Math.max(120, panelHeightRef.current * 0.22);
        if (gestureState.dy > dismissThreshold || gestureState.vy > 1.2) {
          closeSheet();
          return;
        }

        Animated.parallel([
          Animated.timing(panelTranslateY, {
            toValue: 0,
            duration: 220,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(dragProgress, {
            toValue: 0,
            duration: 220,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }),
        ]).start();
      },
      onPanResponderTerminate: () => {
        Animated.parallel([
          Animated.timing(panelTranslateY, {
            toValue: 0,
            duration: 220,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(dragProgress, {
            toValue: 0,
            duration: 220,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }),
        ]).start();
      },
    }),
  ).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(overlayOpacity, {
        toValue: 1,
        duration: 620,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(panelTranslateY, {
        toValue: 0,
        duration: 620,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start();
  }, [overlayOpacity, panelTranslateY]);

  useEffect(() => {
    const listenerId = panelTranslateY.addListener(({ value }) => {
      const startThreshold = Math.max(20, panelHeightRef.current * 0.1);
      if (!hasTriggeredCoinAnimationRef.current && value <= startThreshold) {
        hasTriggeredCoinAnimationRef.current = true;
        setCanStartCoinAnimation(true);
      }
    });

    return () => {
      panelTranslateY.removeListener(listenerId);
    };
  }, [panelTranslateY]);

  useEffect(() => {
    if (!canStartCoinAnimation) {
      return;
    }

    const coinDrops = coinTranslateY.map((translateY, index) =>
      Animated.parallel([
        Animated.timing(coinOpacity[index], {
          toValue: 1,
          duration: 220,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.sequence([
          Animated.timing(translateY, {
            toValue: 3,
            duration: 320,
            easing: Easing.bezier(0.22, 1, 0.36, 1),
            useNativeDriver: true,
          }),
          Animated.timing(translateY, {
            toValue: 0,
            duration: 220,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
          }),
        ]),
      ]),
    );

    Animated.stagger(140, coinDrops).start();
  }, [canStartCoinAnimation, coinOpacity, coinTranslateY]);

  const dragOverlayOpacity = dragProgress.interpolate({
    inputRange: [0, 0.7, 1],
    outputRange: [1, 0.7, 0.48],
    extrapolate: "clamp",
  });
  const interactiveOverlayOpacity = Animated.multiply(overlayOpacity, dragOverlayOpacity);

  const coinDragOffsetX = [
    dragProgress.interpolate({ inputRange: [0, 1], outputRange: [0, -6], extrapolate: "clamp" }),
    dragProgress.interpolate({ inputRange: [0, 1], outputRange: [0, 3], extrapolate: "clamp" }),
    dragProgress.interpolate({ inputRange: [0, 1], outputRange: [0, 6], extrapolate: "clamp" }),
    dragProgress.interpolate({ inputRange: [0, 1], outputRange: [0, 9], extrapolate: "clamp" }),
  ];
  const coinDragOffsetY = [
    dragProgress.interpolate({ inputRange: [0, 1], outputRange: [0, 14], extrapolate: "clamp" }),
    dragProgress.interpolate({ inputRange: [0, 1], outputRange: [0, 6], extrapolate: "clamp" }),
    dragProgress.interpolate({ inputRange: [0, 1], outputRange: [0, -5], extrapolate: "clamp" }),
    dragProgress.interpolate({ inputRange: [0, 1], outputRange: [0, -12], extrapolate: "clamp" }),
  ];

  return (
    <View style={styles.bottomSheetRoot} pointerEvents="box-none">
      <Animated.View style={[styles.bottomSheetOverlay, { opacity: interactiveOverlayOpacity }]} />
      <View style={styles.bottomSheetContainer} pointerEvents="box-none">
        <Animated.View
          style={[styles.bottomSheetPanel, { transform: [{ translateY: panelTranslateY }] }]}
          onLayout={(event) => {
            const height = event.nativeEvent.layout.height;
            if (height > 0) {
              panelHeightRef.current = height;
            }
          }}
          {...panResponder.panHandlers}
        >
          <View style={styles.bottomSheetHandle} />
          <Pressable style={styles.bottomSheetCloseButton} onPress={closeSheet} hitSlop={8}>
            <AppIcon name="closeMini" size={20} color={theme.colors.nudsContentSecondary} />
          </Pressable>

          <View style={styles.bottomSheetHeroWrap}>
            <View style={styles.bottomSheetCoinsFrame}>
              <Animated.View
                style={[
                  styles.bottomSheetCoinBottom,
                  {
                    opacity: coinOpacity[0],
                    transform: [{ translateY: coinTranslateY[0] }, { translateX: coinDragOffsetX[0] }, { translateY: coinDragOffsetY[0] }],
                  },
                ]}
              >
                <Coin1BottomIllustration width={100} height={96} />
              </Animated.View>
              <Animated.View
                style={[
                  styles.bottomSheetCoinTwo,
                  {
                    opacity: coinOpacity[1],
                    transform: [{ translateY: coinTranslateY[1] }, { translateX: coinDragOffsetX[1] }, { translateY: coinDragOffsetY[1] }],
                  },
                ]}
              >
                <Coin2Illustration width={93} height={93} />
              </Animated.View>
              <Animated.View
                style={[
                  styles.bottomSheetCoinThree,
                  {
                    opacity: coinOpacity[2],
                    transform: [{ translateY: coinTranslateY[2] }, { translateX: coinDragOffsetX[2] }, { translateY: coinDragOffsetY[2] }],
                  },
                ]}
              >
                <Coin3Illustration width={93} height={93} />
              </Animated.View>
              <Animated.View
                style={[
                  styles.bottomSheetCoinTop,
                  {
                    opacity: coinOpacity[3],
                    transform: [{ translateY: coinTranslateY[3] }, { translateX: coinDragOffsetX[3] }, { translateY: coinDragOffsetY[3] }],
                  },
                ]}
              >
                <Coin4TopIllustration width={93} height={93} />
              </Animated.View>
            </View>
            <Text style={styles.bottomSheetTitle}>{savingsMigratingInvestmentsData.bottomSheet.title}</Text>
            <Text style={styles.bottomSheetDescription}>{savingsMigratingInvestmentsData.bottomSheet.description}</Text>
          </View>

          <View style={styles.bottomSheetRowsCard}>
            {savingsMigratingInvestmentsData.bottomSheet.rows.map((row, index) => (
              <View key={`${row.title}-${index}`}>
                <View style={styles.bottomSheetRow}>
                  <View style={styles.bottomSheetRowLeading}>
                    <AppIcon
                      name={row.icon}
                      size={20}
                      color={row.disabled ? theme.colors.nudsContentDisabled : theme.colors.nudsContentPrimary}
                    />
                  </View>
                  <View style={styles.bottomSheetRowContent}>
                    <Text style={row.disabled ? styles.bottomSheetRowTitleDisabled : styles.bottomSheetRowTitle}>{row.title}</Text>
                    {row.subtitle ? <Text style={styles.bottomSheetRowSubtitle}>{row.subtitle}</Text> : null}
                  </View>
                  {row.disabled ? (
                    <AppIcon name="checkCircle" size={20} color={theme.colors.nudsContentDisabled} />
                  ) : (
                    <AppIcon name="arrowRight" size={20} color={theme.colors.nudsContentSecondary} />
                  )}
                </View>
                {index < savingsMigratingInvestmentsData.bottomSheet.rows.length - 1 ? (
                  <View style={styles.bottomSheetRowDivider} />
                ) : null}
              </View>
            ))}
          </View>
        </Animated.View>
      </View>
    </View>
  );
}

function RollingYieldValue({ target, shouldStart }: { target: number; shouldStart: boolean }) {
  const baselineValue = 200;
  const startText = baselineValue.toFixed(2);
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

  const digitCount = useMemo(
    () => odometerGlyphs.filter((glyph) => glyph.type === "digit").length,
    [odometerGlyphs],
  );

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
      <Text style={styles.balanceLabel}>{savingsMigratingInvestmentsData.totalBalanceLabel}</Text>
      <Text style={styles.balanceAmount}>{savingsMigratingInvestmentsData.totalBalance}</Text>
      <View style={styles.balanceTrendRow}>
        <Text style={styles.balanceTrend}>+ $</Text>
        <RollingYieldValue target={savingsMigratingInvestmentsData.yieldTarget} shouldStart={shouldStartYieldAnimation} />
        <Text style={styles.balanceTrend}> in yield today</Text>
      </View>
    </View>
  );
}

function InlineActions() {
  return (
    <View style={styles.quickActions}>
      {savingsMigratingInvestmentsData.inlineActions.map((action) => (
        <View key={action.label} style={styles.quickActionItem}>
          <Pressable
            style={({ pressed }) => [
              action.variant === "primary" ? styles.quickActionPrimary : styles.quickActionSecondary,
              pressed && styles.pressed,
            ]}
          >
            <AppIcon
              name={action.icon}
              size={20}
              color={action.variant === "primary" ? theme.colors.nudsBackgroundPrimary : theme.colors.nudsContentPrimary}
            />
          </Pressable>
          {action.badgeLabel ? <View style={styles.investBadge}><Text style={styles.investBadgeLabel}>{action.badgeLabel}</Text></View> : null}
          <Text style={action.variant === "primary" ? styles.quickActionPrimaryLabel : styles.quickActionSecondaryLabel}>
            {action.label}
          </Text>
        </View>
      ))}
    </View>
  );
}

function SectionHeading({ label, trailingLabel, containerStyle }: SectionHeadingProps) {
  return (
    <View style={[styles.sectionHeadingWrap, containerStyle]}>
      <Text style={styles.sectionHeadingLabel}>{label}</Text>
      {trailingLabel ? <Text style={styles.sectionHeadingTrailing}>{trailingLabel}</Text> : null}
    </View>
  );
}

function SavingsGrid({ row1Entrance, row2Entrance }: { row1Entrance: Animated.Value; row2Entrance: Animated.Value }) {
  const firstRowTiles = savingsMigratingInvestmentsData.savingsTiles.slice(0, 2);
  const secondRowTiles = savingsMigratingInvestmentsData.savingsTiles.slice(2);

  const renderTile = (tile: (typeof savingsMigratingInvestmentsData.savingsTiles)[number]) => (
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
  );

  return (
    <View style={styles.gridWrapper}>
      <Animated.View
        style={[
          styles.gridRow,
          {
            opacity: row1Entrance,
            transform: [
              {
                translateY: row1Entrance.interpolate({
                  inputRange: [0, 1],
                  outputRange: [10, 0],
                }),
              },
            ],
          },
        ]}
      >
        {firstRowTiles.map((tile) => renderTile(tile))}
      </Animated.View>

      <Animated.View
        style={[
          styles.gridRow,
          styles.gridRowSpacing,
          {
            opacity: row2Entrance,
            transform: [
              {
                translateY: row2Entrance.interpolate({
                  inputRange: [0, 1],
                  outputRange: [10, 0],
                }),
              },
            ],
          },
        ]}
      >
        {secondRowTiles.map((tile) => renderTile(tile))}
        <View style={styles.createCard}>
          <View style={styles.createBadge}>
            <AppIcon name="add" size={16} color={theme.colors.nudsMain} />
          </View>
          <View style={styles.createTexts}>
            <Text style={styles.createTitle}>{savingsMigratingInvestmentsData.createTileTitle}</Text>
            <Text style={styles.createSubtitle}>{savingsMigratingInvestmentsData.createTileSubtitle}</Text>
          </View>
        </View>
      </Animated.View>
    </View>
  );
}

function LevelUpCarousel() {
  return (
    <View style={styles.levelUpWrapper}>
      <ScrollView
        horizontal
        removeClippedSubviews={false}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.levelUpCarousel}
      >
        {savingsMigratingInvestmentsData.levelUpCards.map((card) => (
          <View key={`${card.title}-${card.badgeLabel}`} style={styles.levelUpCardShadow}>
            <View style={styles.levelUpCard}>
              <View
                style={[styles.levelUpStripe, card.stripeVariant === "green" ? styles.levelUpStripeGreen : styles.levelUpStripePurple]}
              />
              <View style={styles.levelUpContent}>
                <View style={styles.levelUpTop}>
                  <Text style={styles.levelUpTopLabel}>{card.topLabel || " "}</Text>
                  <View style={[styles.levelUpBadge, card.badgeVariant === "green" ? styles.levelUpBadgeGreen : styles.levelUpBadgePurple]}>
                    <Text style={[styles.levelUpBadgeLabel, card.badgeVariant === "green" ? styles.levelUpBadgeLabelGreen : styles.levelUpBadgeLabelPurple]}>
                      {card.badgeLabel}
                    </Text>
                  </View>
                </View>
                <View style={styles.levelUpBottom}>
                  <Text style={styles.levelUpTitle}>{card.title}</Text>
                  <Text style={styles.levelUpSubtitle}>{card.subtitle}</Text>
                </View>
              </View>
              <View pointerEvents="none" style={styles.levelUpBottomEdge} />
              <View pointerEvents="none" style={styles.levelUpTopInsetEdge} />
              <View pointerEvents="none" style={styles.levelUpInsetBorder} />
            </View>
          </View>
        ))}
      </ScrollView>
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
  balanceTrendRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  balanceTrend: {
    color: theme.colors.nudsPositive,
    ...theme.typography.labelSmall,
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
    paddingTop: 8,
    paddingBottom: 20,
    paddingHorizontal: 16,
    flexDirection: "row",
    justifyContent: "center",
    gap: 4,
  },
  quickActionItem: {
    flex: 1,
    minWidth: 104,
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
    ...theme.elevation.defaultCard,
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
  investBadge: {
    marginTop: -18,
    minHeight: 20,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: theme.radii.medium,
    backgroundColor: "#F6ECFF",
    alignItems: "center",
    justifyContent: "center",
  },
  investBadgeLabel: {
    color: theme.colors.nudsMain,
    ...theme.typography.labelXSmallStrong,
    letterSpacing: 0.12,
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
    paddingHorizontal: 20,
    paddingBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  sectionHeadingLabel: {
    color: theme.colors.nudsContentSecondary,
    ...theme.typography.labelSmallStrong,
    flex: 1,
  },
  sectionHeadingTrailing: {
    color: theme.colors.nudsMain,
    ...theme.typography.labelSmallStrong,
    paddingRight: 12,
  },
  levelUpSectionHeadingWrap: {
    height: "auto",
    paddingTop: 32,
    paddingBottom: 16,
    alignItems: "flex-end",
  },
  gridWrapper: {
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  gridRow: {
    flexDirection: "row",
    gap: 12,
  },
  gridRowSpacing: {
    marginTop: 12,
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
  levelUpWrapper: {
    paddingBottom: 12,
  },
  levelUpCarousel: {
    paddingLeft: 16,
    paddingRight: 16,
    gap: 12,
  },
  levelUpCardShadow: {
    width: 319,
    borderRadius: 24,
  },
  levelUpCard: {
    width: 319,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: theme.colors.nudsBorderSubtle,
    backgroundColor: theme.colors.nudsBackgroundPrimary,
    position: "relative",
    overflow: "hidden",
  },
  levelUpStripe: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
  },
  levelUpStripePurple: {
    backgroundColor: "#615BCC",
  },
  levelUpStripeGreen: {
    backgroundColor: "#A0C61B",
  },
  levelUpContent: {
    flex: 1,
    paddingTop: 20,
    paddingRight: 20,
    paddingBottom: 20,
    paddingLeft: 24,
    gap: 24,
  },
  levelUpTop: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  levelUpTopLabel: {
    color: theme.colors.nudsContentSecondary,
    ...theme.typography.labelSmall,
    flex: 1,
    paddingRight: 12,
  },
  levelUpBadge: {
    minHeight: 20,
    borderRadius: theme.radii.medium,
    paddingHorizontal: 8,
    paddingVertical: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  levelUpBadgePurple: {
    backgroundColor: "#EEECFF",
  },
  levelUpBadgeGreen: {
    backgroundColor: "#EBF5BA",
  },
  levelUpBadgeLabel: {
    ...theme.typography.labelXSmallStrong,
    letterSpacing: 0.12,
  },
  levelUpBadgeLabelPurple: {
    color: "#615BCC",
  },
  levelUpBadgeLabelGreen: {
    color: "#567400",
  },
  levelUpBottom: {
    gap: 2,
  },
  levelUpTitle: {
    color: theme.colors.nudsContentPrimary,
    ...theme.typography.subtitleMediumStrong,
  },
  levelUpSubtitle: {
    color: theme.colors.nudsContentSecondary,
    ...theme.typography.labelSmall,
  },
  levelUpBottomEdge: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 1,
    backgroundColor: "rgba(31,0,47,0.05)",
  },
  levelUpTopInsetEdge: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: 1,
    backgroundColor: "rgba(31,0,47,0.10)",
  },
  levelUpInsetBorder: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "rgba(31,0,47,0.02)",
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
  bottomSheetRoot: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 50,
  },
  bottomSheetOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(31,2,48,0.62)",
  },
  bottomSheetContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  bottomSheetPanel: {
    width: "100%",
    backgroundColor: "#F8F6F8",
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingBottom: 16,
    overflow: "hidden",
  },
  bottomSheetHandle: {
    alignSelf: "center",
    width: 36,
    height: 4,
    borderRadius: 4,
    backgroundColor: "#BDB5C2",
    marginTop: 10,
  },
  bottomSheetCloseButton: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 12,
    marginTop: 2,
  },
  bottomSheetHeroWrap: {
    alignItems: "center",
    paddingTop: 8,
    paddingBottom: 16,
    paddingHorizontal: 20,
    gap: 16,
  },
  bottomSheetCoinsFrame: {
    width: 120,
    height: 120,
  },
  bottomSheetCoinBottom: {
    position: "absolute",
    top: 44,
    left: 10,
  },
  bottomSheetCoinTwo: {
    position: "absolute",
    top: 34,
    left: 14,
  },
  bottomSheetCoinThree: {
    position: "absolute",
    top: 22,
    left: 14,
  },
  bottomSheetCoinTop: {
    position: "absolute",
    top: 0,
    left: 14,
  },
  bottomSheetTitle: {
    color: theme.colors.nudsContentPrimary,
    ...theme.typography.titleMedium,
    textAlign: "center",
    maxWidth: 252,
  },
  bottomSheetDescription: {
    color: theme.colors.nudsContentSecondary,
    ...theme.typography.paragraphMedium,
    textAlign: "center",
    maxWidth: 252,
  },
  bottomSheetRowsCard: {
    marginHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: theme.colors.nudsBorderSubtle,
    backgroundColor: theme.colors.nudsBackgroundPrimary,
    ...theme.elevation.defaultCard,
    overflow: "hidden",
  },
  bottomSheetRow: {
    minHeight: 52,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  bottomSheetRowLeading: {
    width: 24,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  bottomSheetRowContent: {
    flex: 1,
    gap: 2,
  },
  bottomSheetRowTitle: {
    color: theme.colors.nudsContentPrimary,
    ...theme.typography.labelSmallStrong,
  },
  bottomSheetRowTitleDisabled: {
    color: theme.colors.nudsContentDisabled,
    ...theme.typography.labelSmallStrong,
  },
  bottomSheetRowSubtitle: {
    color: theme.colors.nudsContentSecondary,
    ...theme.typography.paragraphSmall,
  },
  bottomSheetRowDivider: {
    height: 1.5,
    backgroundColor: theme.colors.nudsBorderDefault,
    marginLeft: 52,
  },
});
