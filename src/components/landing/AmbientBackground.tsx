"use client";

import dynamic from "next/dynamic";

// ogl touches WebGL/window, so it must never render on the server.
const Aurora = dynamic(() => import("@/components/reactbits/Aurora"), {
  ssr: false,
});

/**
 * Single shared ambient layer that sits behind every body section below the
 * hero, giving the whole page one continuous dark-purple atmosphere. Fixed so
 * it parallaxes gently as you scroll; a dark gradient overlay keeps text
 * contrast high over the aurora.
 */
const AmbientBackground = () => {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10" aria-hidden="true">
      {/* base wash so sections never reveal pure black seams */}
      <div className="absolute inset-0 bg-[#070510]" />
      <div className="absolute inset-0 opacity-70">
        <Aurora
          colorStops={["#4C1D95", "#8B5CF6", "#6366F1"]}
          amplitude={1.1}
          blend={0.6}
          speed={0.35}
        />
      </div>
      {/* contrast + vignette overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#070510]/85 via-[#070510]/70 to-[#070510]/90" />
      <div className="absolute inset-0 [mask-image:radial-gradient(120%_90%_at_50%_30%,transparent,black_85%)] bg-[#070510]/60" />
    </div>
  );
};

export default AmbientBackground;
