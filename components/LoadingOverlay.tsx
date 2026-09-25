"use client";

import { BlinkBlur } from "react-loading-indicators";

export default function LoadingOverlay({
  label = "Loading",
}: {
  label?: string;
}) {
  return (
    <div className="media-loading-overlay" role="status" aria-label={label}>
      <BlinkBlur color="#f5c518" size="medium" text="" textColor="" />
    </div>
  );
}
