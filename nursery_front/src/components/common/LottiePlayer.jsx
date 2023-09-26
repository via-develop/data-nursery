import React from "react";
import { useLottie } from "lottie-react";

// https://lottiereact.com/components/Lottie#oncomplete
function LottieView({ options, style }) {
  // animationData, loop, autoplay, initialSegment

  const { View } = useLottie(options, style);

  return View;
}

export default LottieView;
