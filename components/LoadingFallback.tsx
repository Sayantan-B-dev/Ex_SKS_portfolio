"use client";

import { BlinkBlur } from "react-loading-indicators";

export default function LoadingFallback() {
  return (
    <div className="section-loading-fallback">
      <BlinkBlur
        color="#eb9f00"
        size="large"
        text=""
        textColor="#000000"
      />
    </div>
  );
}
