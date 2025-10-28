"use client";
import React, { useEffect, useState } from "react";
import Sidebar from "./sidebar";

export default function SidebarClient() {
  const [collapsed, setCollapsed] = useState(true);

  // Keep a CSS variable on :root in sync so server layout can use it for offset.
  useEffect(() => {
    const val = collapsed ? "5rem" : "16rem"; // 5rem ~= 80px (w-20), 16rem ~= 256px (w-64)
    document.documentElement.style.setProperty("--sidebar-width", val);

    return () => {};
  }, [collapsed]);

  // Use a global mousemove listener with hysteresis so hovering near the left edge
  // expands the sidebar and moving away collapses it. This avoids needing to change
  // the Sidebar component signature and works even if the toggle button remains.
  useEffect(() => {
    const enterThreshold = 90; // px from left -> expand
    const leaveThreshold = 260; // px from left -> collapse

    function onMove(e: MouseEvent) {
      const x = e.clientX;
      if (x <= enterThreshold && collapsed) {
        setCollapsed(false);
      } else if (x > leaveThreshold && !collapsed) {
        setCollapsed(true);
      }
    }

    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [collapsed]);

  return <Sidebar collapsed={collapsed} />;
}
