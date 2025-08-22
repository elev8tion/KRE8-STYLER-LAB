import React, { useEffect, useMemo, useState } from "react";

/**
 * KRE8StylerLogo.tsx
 *
 * Renders KRE8Styler logo SVG as a React component.
 * - Default behavior: fetches the svg file from `src` and injects it inline
 * - Optional: pass `svgText` if you want to inline the markup at build time.
 * - Optional: set `asImg` to true to render as <img> instead (no inline).
 */

interface KRE8StylerLogoProps {
  /** Path to your SVG file in /public or imported asset */
  src?: string;
  /** If you prefer to paste the raw SVG markup directly, pass it here */
  svgText?: string;
  /** Size helpers (ignored if your SVG has its own width/height in markup) */
  width?: number;
  height?: number;
  /** Add classes/styles like any component */
  className?: string;
  style?: React.CSSProperties;
  /** a11y */
  title?: string;
  desc?: string;
  role?: string;
  /** Fallback to <img> instead of inlining (keeps bytes off the DOM). */
  asImg?: boolean;
}

export default function KRE8StylerLogo({
  src = "/kre8styler-logo.svg",
  svgText,
  width = 240,
  height = 240,
  className = "",
  style,
  title = "KRE8Styler",
  desc,
  role = "img",
  asImg = false,
}: KRE8StylerLogoProps) {
  const [markup, setMarkup] = useState(svgText || null);
  const needsFetch = !svgText && !!src && !asImg;

  useEffect(() => {
    let active = true;
    if (needsFetch) {
      fetch(src, { cache: "force-cache" })
        .then((r) => r.text())
        .then((txt) => {
          if (!active) return;
          setMarkup(txt);
        })
        .catch((err) => {
          console.error("SVG fetch failed:", err);
          setMarkup(null);
        });
    }
    return () => {
      active = false;
    };
  }, [src, needsFetch]);

  const containerProps = useMemo(
    () => ({
      className,
      style: { width, height, lineHeight: 0, display: "inline-block", ...style },
      role,
      "aria-label": !desc ? title : undefined,
      "aria-labelledby": desc ? "logo-title logo-desc" : undefined,
    }),
    [className, style, width, height, role, title, desc]
  );

  if (asImg) {
    // Simple <img> rendering (no inline markup)
    return (
      <img src={src} width={width} height={height} alt={title} className={className} style={style} />
    );
  }

  // Inline path: keep your SVG exactly as-is
  return (
    <span {...containerProps}>
      {markup ? (
        <span
          dangerouslySetInnerHTML={{ __html: withOptionalA11y(markup, title, desc) }}
          style={{ display: "inline-block", width: "100%", height: "100%" }}
        />
      ) : (
        // Lightweight placeholder while loading
        <svg viewBox="0 0 1 1" width={width} height={height} aria-hidden="true">
          <rect width="1" height="1" fill="transparent" />
        </svg>
      )}
    </span>
  );
}

/**
 * Inject a <title> / <desc> into the root <svg> for accessibility without altering
 * any geometry. If a title/desc already exists, we leave it alone.
 */
function withOptionalA11y(svgMarkup: string, title?: string, desc?: string) {
  if (!title && !desc) return svgMarkup;

  // Try to place title/desc right after the opening <svg ...>
  const hasTitle = /<title[\s>]/i.test(svgMarkup);
  const hasDesc = /<desc[\s>]/i.test(svgMarkup);

  if (hasTitle && hasDesc) return svgMarkup; // both present

  const inject = [
    !hasTitle && title ? `<title id="logo-title">${escapeHtml(title)}</title>` : "",
    !hasDesc && desc ? `<desc id="logo-desc">${escapeHtml(desc)}</desc>` : "",
  ].join("");

  return svgMarkup.replace(/(<svg\b[^>]*>)/i, `$1${inject}`);
}

function escapeHtml(str: string) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}