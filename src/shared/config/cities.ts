export const cities = [
  { slug: "halle", name: "Halle (Saale)" },
  { slug: "leipzig", name: "Leipzig" },
  { slug: "merseburg", name: "Merseburg" },
  { slug: "schkeuditz", name: "Schkeuditz" },
  { slug: "delitzsch", name: "Delitzsch" },
  { slug: "saalekreis", name: "Saalekreis" },
] as const;

export type City = (typeof cities)[number];

export function getCity(slug: string): City | undefined {
  return cities.find((c) => c.slug === slug);
}
