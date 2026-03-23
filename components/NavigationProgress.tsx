"use client";

import { AppProgressBar } from "next-nprogress-bar";

export default function NavigationProgress() {
  return (
    <AppProgressBar
      height="3px"
      color="#f97316"
      options={{ showSpinner: false }}
      shallowRouting
    />
  );
}
