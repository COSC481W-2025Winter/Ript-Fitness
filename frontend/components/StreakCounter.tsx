// components/StreakCounter.tsx

import React from "react";
import { View, Text, StyleSheet } from "react-native";
import FlameIcon from "../assets/images/streak_flame.svg";
import Flame from "../assets/images/flame.svg";
import NoFlame from "../assets/images/no-flame.svg";
import { useStreak } from "@/context/StreakContext";
import { Platform } from "react-native";

const StreakCounter: React.FC = () => {
  const { streak, loading, error } = useStreak();

  if (loading || error) {
    return null;
  }

  const FlameComponent = streak > 0 ? Flame : NoFlame;

  return (
    <View
      style={styles.container}
      accessible
      accessibilityLabel={`Streak of ${streak} days`}
    >
      <FlameComponent width={48} height={48} />
      <View style={[styles.badge]}>
        <Text style={[styles.badgeText,{paddingTop: Platform.OS === "ios" ? 0 : 10}]}>{streak}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
    marginTop: Platform.OS === "android" ? -10 : -20,
    paddingTop: Platform.OS === "android" ? 10 : 0,
  },
  badge: {
    position: "absolute",
    width:'100%',
    top: 24,
    borderRadius: 8,
    flex:1,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: {
    fontSize: 15,
    fontWeight: "bold",
  },
});

export default StreakCounter;
