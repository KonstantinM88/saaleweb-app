import {
  Hotel,
  UtensilsCrossed,
  Scissors,
  HardHat,
  Wrench,
  Stethoscope,
  Home,
  Scale,
  type LucideIcon,
} from "lucide-react";
import { industryKeyFrom } from "@/widgets/industry-detail/industryContent";

const ICONS: Record<string, LucideIcon> = {
  hotels: Hotel,
  restaurants: UtensilsCrossed,
  beauty: Scissors,
  bau: HardHat,
  handwerk: Wrench,
  arzt: Stethoscope,
  immobilien: Home,
  kanzlei: Scale,
};

export function industryIcon(slug: string, name: string): LucideIcon {
  return ICONS[industryKeyFrom(slug, name)] ?? Wrench;
}
