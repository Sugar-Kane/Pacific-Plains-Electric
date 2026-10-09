import {
  Wrench,
  Search,
  PanelsTopLeft,
  CarFront,
  Lamp,
  House,
  Building2,
  Zap,
  ClipboardCheck,
  Plug,
  Cable,
} from "lucide-react";
const icons = {
  Wrench,
  Search,
  PanelsTopLeft,
  CarFront,
  Lamp,
  House,
  Building2,
  Zap,
  ClipboardCheck,
  Plug,
  Cable,
};
export function ServiceIcon({
  name,
  size = 30,
}: {
  name: string;
  size?: number;
}) {
  const Icon = icons[name as keyof typeof icons] || Wrench;
  return <Icon size={size} strokeWidth={1.75} aria-hidden="true" />;
}
