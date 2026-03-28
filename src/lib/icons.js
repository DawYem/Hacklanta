import {
  BatteryLow,
  BookOpen,
  Camera,
  Coffee,
  Flag,
  Footprints,
  Gamepad2,
  IceCreamCone,
  Map,
  Moon,
  Music4,
  ShoppingBag,
  Sofa,
  Sun,
  Swords,
  TreePine,
  Trophy,
  Utensils,
  Wind,
  Zap,
} from 'lucide-react';

export const stopIconMap = {
  batteryLow: BatteryLow,
  bookOpen: BookOpen,
  camera: Camera,
  coffee: Coffee,
  flag: Flag,
  footprints: Footprints,
  gamepad2: Gamepad2,
  iceCreamCone: IceCreamCone,
  map: Map,
  moon: Moon,
  music4: Music4,
  shoppingBag: ShoppingBag,
  sofa: Sofa,
  sun: Sun,
  swords: Swords,
  treePine: TreePine,
  trophy: Trophy,
  utensils: Utensils,
  wind: Wind,
  zap: Zap,
};

export function withStopIcons(stops = []) {
  return stops.map(stop => ({
    ...stop,
    Icon: typeof stop.Icon === 'function'
      ? stop.Icon
      : stopIconMap[stop.icon] || Map,
  }));
}
