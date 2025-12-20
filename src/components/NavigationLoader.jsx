import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function NavigationLoader({ theme = "dark" }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [visible, setVisible] = useState(false);
  const targetRef = useRef(null);
  const navigatingRef = useRef(false);

  useEffect(() => {
    function findAnchor(el) {
      while (el && el !== document.body) {
        if (el.tagName && el.tagName.toLowerCase() === "a") return el;
        el = el.parentElement;
      }
      return null;
    }

    async function onClick(e) {
      if (navigatingRef.current) return;
      // only left click without modifier keys
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

      const a = findAnchor(e.target);
      if (!a) return;
      const href = a.getAttribute("href");
      const target = a.getAttribute("target");
      if (!href || href.startsWith("#") || href.startsWith("mailto:") || target === "_blank") return;

      // allow external links (absolute with different origin)
      try {
        const url = new URL(href, window.location.href);
        if (url.origin !== window.location.origin) return;
        // same-path navigation: ignore
        if (url.pathname === window.location.pathname) return;

        e.preventDefault();
        navigatingRef.current = true;
        targetRef.current = url.pathname + url.search + url.hash;
        setVisible(true);

        // create a small video element that is a duplicate of the main video
        const vid = document.createElement("video");
        vid.src = "/efecto-recording-2025-12-20T12-26-03.webm";
        vid.muted = true;
        vid.playsInline = true;
        vid.preload = "auto";
        vid.autoplay = true;
        vid.style.width = "33vmin"; // reduce roughly by 3
        vid.style.maxWidth = "120px";
        vid.style.height = "auto";
        vid.style.display = "block";
        vid.style.objectFit = "contain";
        vid.style.borderRadius = "6px";
        vid.style.filter = theme === "light" ? "invert(1) brightness(1.02) contrast(1.2)" : "none";
        vid.className = "nav-loader-video-el";

        const container = document.getElementById("nav-loader-video-container");
        if (container) {
          // clear previous children
          container.innerHTML = "";
          container.appendChild(vid);
        }

        try {
          await vid.play();
        } catch (err) {
          // ignore play errors
        }

        // navigate after max 1s
        setTimeout(() => {
          if (targetRef.current) navigate(targetRef.current);
        }, 1000);
      } catch (err) {
        return;
      }
    }

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [navigate, theme]);

  // hide overlay after location changed (navigation finished)
  useEffect(() => {
    if (!navigatingRef.current) return;
    const t = setTimeout(() => {
      setVisible(false);
      navigatingRef.current = false;
      targetRef.current = null;
    }, 1200);
    return () => clearTimeout(t);
  }, [location.pathname]);

  return (
    <div
      id="nav-loader-overlay"
      aria-hidden={!visible}
      style={{
        pointerEvents: visible ? "auto" : "none",
        opacity: visible ? 1 : 0,
        transition: "opacity 200ms ease",
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: theme === "light" ? "#ffffff" : "#000000",
      }}
    >
      <div id="nav-loader-video-container" style={{ display: "flex", alignItems: "center", justifyContent: "center" }} />
    </div>
  );
}
