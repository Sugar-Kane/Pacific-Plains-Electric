import {
  Wrench,
  Search,
  PanelsTopLeft,
  CarFront,
  Lamp,
  House,
  Building2,
  Cable,
  ClipboardCheck,
} from "lucide-react";
const icons = {
  Wrench,
  Search,
  PanelsTopLeft,
  CarFront,
  Lamp,
  House,
  Building2,
  Cable,
  ClipboardCheck,
};
export function ServiceIcon({
  name,
  size = 30,
}: {
  name: string;
  size?: number;
}) {
  const Icon = icons[name as keyof typeof icons] || Wrench;
  return <Icon size={size} strokeWidth={1.4} aria-hidden="true" />;
}
