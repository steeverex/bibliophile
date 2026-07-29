import React, { useEffect, useState } from "react";
import "./visualEffects.css";

type EffectsMode = "loading" | "library" | "profile" | "reader";

const readerRoutes = [
  "/epub", "/mobi", "/cbr", "/cbt", "/cbz", "/cb7", "/azw3", "/azw",
  "/txt", "/docx", "/md", "/fb2", "/html", "/htm", "/xml", "/xhtml",
  "/mhtml", "/href", "/pdf",
];

const modeForCurrentRoute = (): Exclude<EffectsMode, "loading"> => {
  const route = window.location.hash.replace(/^#/, "").toLowerCase();

  if (readerRoutes.some((readerRoute) => route.startsWith(readerRoute))) {
    return "reader";
  }

  return route.startsWith("/profile") ? "profile" : "library";
};

/**
 * A root-mounted sibling of the application. It deliberately has no knowledge
 * of application layout and never wraps, filters, or modifies application UI.
 */
const VisualEffects: React.FC = () => {
  const [routeMode, setRouteMode] = useState(modeForCurrentRoute);
  const [showStartupTreatment, setShowStartupTreatment] = useState(
    () => modeForCurrentRoute() !== "reader"
  );

  useEffect(() => {
    const updateRouteMode = () => {
      const nextMode = modeForCurrentRoute();
      setRouteMode(nextMode);
      if (nextMode === "reader") setShowStartupTreatment(false);
    };

    window.addEventListener("hashchange", updateRouteMode);
    const startupTimer = window.setTimeout(
      () => setShowStartupTreatment(false),
      2400
    );

    return () => {
      window.removeEventListener("hashchange", updateRouteMode);
      window.clearTimeout(startupTimer);
    };
  }, []);

  const mode: EffectsMode = showStartupTreatment ? "loading" : routeMode;

  // The reader remains entirely sharp: no overlay DOM is mounted for it.
  if (mode === "reader") return null;

  return (
    <div className={`visual-effects visual-effects--${mode}`} aria-hidden="true">
      <span className="visual-effects__scanlines" />
      <span className="visual-effects__grain" />
      <span className="visual-effects__glow" />
      <i /><i /><i /><i /><i />
    </div>
  );
};

export default VisualEffects;
