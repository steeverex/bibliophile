const TIERS = [
  ["The Initiate", 0], ["The Reader", 10_000], ["The Bibliophile", 50_000], ["The Archivist", 300_000], ["The Curator", 750_000], ["The Scholar", 1_500_000], ["The Chronicler", 3_000_000], ["The Librarian", 6_000_000], ["The Lorekeeper", 12_000_000], ["The Sage", 25_000_000], ["Grand Archivist", 50_000_000], ["Keeper of Eternity", 100_000_000],
] as const;
const roman = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"];
export const rankLookup = (xp: number) => {
  let index = 0;
  TIERS.forEach((tier, i) => { if (xp >= tier[1]) index = i; });
  const next = TIERS[index + 1];
  const progressPct = next ? Math.min(100, Math.round(((xp - TIERS[index][1]) / (next[1] - TIERS[index][1])) * 100)) : 100;
  return { tierNumber: index + 1, roman: roman[index], title: TIERS[index][0], progressPct, xpToNext: next ? Math.max(0, next[1] - xp) : 0 };
};
