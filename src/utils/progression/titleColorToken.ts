import { TITLE_CSS_TOKENS } from "./progressionConfig";

/**
 * Maps a title string to its CSS custom property token name.
 * Use the returned value as a CSS class name. stats.css owns its color values.
 *
 * CSS owns the actual color values in stats.css :root.
 * This function returns only the token name — never a color value.
 */
export function titleColorToken(title: string): string {
  return TITLE_CSS_TOKENS[title] ?? TITLE_CSS_TOKENS["Reader"];
}
