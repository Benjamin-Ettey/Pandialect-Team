import AsyncStorage from "@react-native-async-storage/async-storage";
import { Redirect } from "expo-router";
import React, { useEffect, useState } from "react";

async function getRedirectPath(): Promise<string> {
  const accessToken = await AsyncStorage.getItem("accessToken");
  const refreshToken = await AsyncStorage.getItem("refreshToken");
  if (accessToken && refreshToken) {
    return "/(root)/(tabs)/englishPages/beginner/HomepageTabs/home";
  }
  return "/(root)/(tabs)/(auth)/landingPage";
}

export default function Index() {
  const [redirectTo, setRedirectTo] = useState<string | null>(null);

  useEffect(() => {
    getRedirectPath().then(setRedirectTo);
  }, []);

  if (!redirectTo) return null;
  return <Redirect href={redirectTo as any} />;
}