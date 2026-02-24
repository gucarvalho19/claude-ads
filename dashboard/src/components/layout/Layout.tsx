import { useState, useEffect, type ReactNode } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

interface LayoutProps {
  theme: "dark" | "light";
  onThemeToggle: () => void;
  onFileLoad: (file: File) => void;
  isCustomReport: boolean;
  onLoadSample: () => void;
  children: ReactNode;
}

export default function Layout({
  theme,
  onThemeToggle,
  onFileLoad,
  isCustomReport,
  onLoadSample,
  children,
}: LayoutProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    function handleResize() {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setCollapsed(true);
      }
    }

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex h-screen overflow-hidden bg-navy-50 dark:bg-navy-900">
      {/* Sidebar - hidden on mobile, visible on larger screens */}
      <div
        className={[
          "shrink-0 transition-all duration-300",
          isMobile && collapsed ? "hidden" : "block",
        ].join(" ")}
      >
        <Sidebar
          collapsed={collapsed}
          onToggle={() => setCollapsed((c) => !c)}
        />
      </div>

      {/* Mobile overlay when sidebar is open */}
      {isMobile && !collapsed && (
        <div
          className="fixed inset-0 z-10 bg-black/50"
          onClick={() => setCollapsed(true)}
          aria-hidden="true"
        />
      )}

      {/* Main content area */}
      <div className="flex min-w-0 flex-1 flex-col">
        <Header
          theme={theme}
          onThemeToggle={onThemeToggle}
          onFileLoad={onFileLoad}
          isCustomReport={isCustomReport}
          onLoadSample={onLoadSample}
        />

        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
