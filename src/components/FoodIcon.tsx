import { Baby, Banana, Bean, Carrot, Egg, Fish, Milk, Wheat, type LucideIcon } from 'lucide-react';

const MAP: Record<string, LucideIcon> = {
  breast_milk: Baby,
  grains: Wheat,
  legumes: Bean,
  dairy: Milk,
  flesh: Fish,
  eggs: Egg,
  vit_a_fruits_veg: Carrot,
  other_fruits_veg: Banana,
};

export default function FoodIcon({
  group,
  size = 30,
  className = '',
}: {
  group: string;
  size?: number;
  className?: string;
}) {
  const Icon = MAP[group] ?? Wheat;
  return <Icon size={size} strokeWidth={1.8} className={className} aria-hidden />;
}
