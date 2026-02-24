import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Search,
  Share2,
  Linkedin,
  Music,
  Monitor,
  Zap,
  ClipboardList,
  DollarSign,
  BarChart3,
  Palette,
  PanelLeftClose,
  PanelLeft,
} from "lucide-react";
import type { ComponentType } from "react";

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

interface NavItem {
  label: string;
  route: string;
  icon: ComponentType<{ size?: number; className?: string }>;
}

const platformItems: NavItem[] = [
  { label: "Dashboard", route: "/", icon: LayoutDashboard },
  { label: "Google Ads", route: "/platform/google", icon: Search },
  { label: "Meta Ads", route: "/platform/meta", icon: Share2 },
  { label: "LinkedIn Ads", route: "/platform/linkedin", icon: Linkedin },
  { label: "TikTok Ads", route: "/platform/tiktok", icon: Music },
  { label: "Microsoft Ads", route: "/platform/microsoft", icon: Monitor },
];

const toolItems: NavItem[] = [
  { label: "Quick Wins", route: "/quick-wins", icon: Zap },
  { label: "Action Plan", route: "/action-plan", icon: ClipboardList },
  { label: "Budget", route: "/budget", icon: DollarSign },
  { label: "Benchmarks", route: "/benchmarks", icon: BarChart3 },
  { label: "Creative", route: "/creative", icon: Palette },
];

function NavItemLink({
  item,
  collapsed,
}: {
  item: NavItem;
  collapsed: boolean;
}) {
  const Icon = item.icon;

  return (
    <NavLink
      to={item.route}
      end={item.route === "/"}
      className={({ isActive }) =>
        [
          "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
          collapsed ? "justify-center" : "",
          isActive
            ? "border-l-[3px] border-amber-accent bg-navy-100 text-navy-900 dark:bg-navy-800 dark:text-white"
            : "border-l-[3px] border-transparent text-navy-500 hover:bg-navy-50 hover:text-navy-700 dark:text-navy-300 dark:hover:bg-navy-800/50 dark:hover:text-white",
        ].join(" ")
      }
    >
      <Icon
        size={20}
        className="shrink-0"
      />
      {!collapsed && <span className="truncate">{item.label}</span>}
    </NavLink>
  );
}

export default function Sidebar({ collapsed, onToggle }: SidebarProps) {
  return (
    <aside
      className={[
        "flex h-screen flex-col border-r transition-all duration-300 ease-in-out",
        "border-navy-200 bg-white",
        "dark:border-navy-800 dark:bg-navy-900",
        collapsed ? "w-16" : "w-64",
      ].join(" ")}
    >
      {/* Brand */}
      <div className="flex h-16 items-center gap-3 border-b border-navy-200 px-4 dark:border-navy-800">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-accent font-mono text-sm font-bold text-white">
          CA
        </div>
        {!collapsed && (
          <span className="text-lg font-semibold text-navy-900 dark:text-white">
            Claude Ads
          </span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        {/* Platform section */}
        <div className="space-y-1">
          {platformItems.map((item) => (
            <NavItemLink key={item.route} item={item} collapsed={collapsed} />
          ))}
        </div>

        {/* Separator */}
        <div className="my-4 border-t border-navy-200 dark:border-navy-700" />

        {/* Tools section */}
        <div className="space-y-1">
          {toolItems.map((item) => (
            <NavItemLink key={item.route} item={item} collapsed={collapsed} />
          ))}
        </div>
      </nav>

      {/* Collapse toggle */}
      <div className="border-t border-navy-200 p-3 dark:border-navy-800">
        <button
          onClick={onToggle}
          className={[
            "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
            "text-navy-400 hover:bg-navy-50 hover:text-navy-600",
            "dark:text-navy-400 dark:hover:bg-navy-800/50 dark:hover:text-navy-200",
            collapsed ? "justify-center" : "",
          ].join(" ")}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <PanelLeft size={20} className="shrink-0" />
          ) : (
            <>
              <PanelLeftClose size={20} className="shrink-0" />
              <span>Collapse</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
