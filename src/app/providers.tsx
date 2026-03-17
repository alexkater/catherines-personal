"use client";

import { useState, useEffect } from "react";
import i18n from "../i18n";
import { I18nextProvider } from "react-i18next";
import { Layout } from "@/components";
import LoadingScreen from "@/components/loading-screen";

export default function Providers({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const minTime = new Promise<void>((resolve) => setTimeout(resolve, 1000));

    let interval: ReturnType<typeof setInterval>;

    const imageReady = new Promise<void>((resolve) => {
      // Poll for the flag set by hero.tsx onLoad.
      // Polling handles the race condition where a priority image
      // (preloaded via <link rel="preload">) fires onLoad before
      // this useEffect registers.
      interval = setInterval(() => {
        if ((window as Window & { __heroImageLoaded?: boolean }).__heroImageLoaded) {
          clearInterval(interval);
          resolve();
        }
      }, 50);
    });

    Promise.all([minTime, imageReady]).then(() => setIsLoading(false));

    return () => clearInterval(interval);
  }, []);

  return (
    <I18nextProvider i18n={i18n}>
      <LoadingScreen visible={isLoading} />
      <Layout>{children}</Layout>
    </I18nextProvider>
  );
}
