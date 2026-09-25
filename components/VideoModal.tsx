"use client";

import { useCallback, useEffect, useState } from "react";
import LoadingOverlay from "@/components/LoadingOverlay";

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  videoId: string;
}

export default function VideoModal({ isOpen, onClose, title, videoId }: VideoModalProps) {
  // Spinner shows until this video reports loaded — derived, no reset effect.
  const [loadedId, setLoadedId] = useState<string | null>(null);
  const loading = loadedId !== videoId;

  const close = useCallback(() => {
    setLoadedId(null);
    onClose();
  }, [onClose]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };

    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, close]);

  if (!isOpen) return null;

  return (
    <div className="video-modal-backdrop" onClick={close} role="dialog" aria-modal="true" aria-label={title}>
      <div className="video-modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="video-modal-header">
          <div className="video-modal-title">
            <span className="playing-dot" /> {title}
          </div>
          <div className="video-modal-actions">
            <a
              href={`https://www.youtube.com/watch?v=${videoId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="video-modal-youtube-link"
            >
              VIEW IT ON YOUTUBE
            </a>
            <button
              type="button"
              className="video-modal-close"
              onClick={close}
              aria-label="Close video modal"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="video-modal-iframe-wrap">
          {loading && <LoadingOverlay label={`Loading ${title}`} />}
          <iframe
            key={videoId}
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`}
            title={title}
            onLoad={() => setLoadedId(videoId)}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
      </div>
    </div>
  );
}
