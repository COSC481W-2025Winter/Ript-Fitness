// ./app/(tabs)/SocialStack.tsx

import React, { useContext } from "react";
import { StyleSheet, Image } from "react-native";
import {
  createStackNavigator,
  HeaderStyleInterpolators,
  StackNavigationProp,
} from "@react-navigation/stack";
import { SocialProvider } from "@/context/SocialContext";
import SocialFeed from "../screens/socialfeed/SocialFeed";
import CommentsScreen from "../screens/socialfeed/CommentsScreen";
import TextPostScreen from "../screens/socialfeed/TextPostScreen";
import ImagePostScreen from "../screens/socialfeed/ImagePostScreen";
import VisitProfileScreen from "../screens/profile/VisitProfileScreen";
import StreakCounter from "@/components/StreakCounter";
import { StreakProvider } from "@/context/StreakContext";

const Stack = createStackNavigator();

export type SocialStackParamList = {
  SocialFeed: undefined;
};

export type SocialScreenNavigationProp =
  StackNavigationProp<SocialStackParamList>;

const SocialStack: React.FC = () => {
  return (
    <SocialProvider>
      <Stack.Navigator
        initialRouteName="SocialFeed"
        screenOptions={{
          headerShown: true,
          headerTitleAlign: "center",
          headerStyle: {
            backgroundColor: "#f8f8f8",
          },
          headerStyleInterpolator: HeaderStyleInterpolators.forNoAnimation,
        }}
      >
        <Stack.Screen
          name="SocialFeed"
          component={SocialFeed}
          options={{
            title: "",
            headerTitle: () => (
              <Image
                source={require("@/assets/images/Ript_logo_final.png")}
                style={{ width: 100, height: 35 }}
              />
            ),
            headerRight: () => <StreakCounter />,
          }}
        />
        <Stack.Screen
          name="TextPostScreen"
          component={TextPostScreen}
          options={{ title: "", headerRight: () => <StreakCounter /> }}
        />
        <Stack.Screen
          name="ImagePostScreen"
          component={ImagePostScreen}
          options={{ title: "", headerRight: () => <StreakCounter /> }}
        />
        <Stack.Screen
          name="VisitProfileScreen"
          component={VisitProfileScreen}
          options={{ title: "RIPT", headerShown: false }}
        />
        {/* Add any additional screens here */}
      </Stack.Navigator>
    </SocialProvider>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: "#005500",
    padding: 0,
    margin: 0,
    width: "100%",
  },

  centerContentContainer: {
    alignItems: "center",
  },
  SafeAreaView: {
    //alignItems: 'center',
    backgroundColor: "#0ffff0",
    height: "100%",
    width: "100%",
    //overflow:'scroll',
    paddingTop: 20,
    justifyContent: "flex-start",
    flexDirection: "column",
  },

  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "600",
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: "400",
  },
  highlight: {
    fontWeight: "700",
  },

  size40x40: {
    height: 40,
    width: 40,
  },
});

export default SocialStack; // Ensure SocialStack is exported as default
