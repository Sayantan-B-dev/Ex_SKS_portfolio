"use client";

import { ThreeDot } from "react-loading-indicators";

export default function Loading() {
  return (
    <div className="initial-loading">
      <div className="initial-loading-inner">
        <div className="initial-loading-logo">SKS</div>
        <ThreeDot
          variant="bounce"
          color="#32cd32"
          size="medium"
          text=""
          textColor=""
        />
        <div className="initial-loading-text">Loading experience…</div>
      </div>
    </div>
  );
}
