import { Routes, Route } from "react-router-dom";
import { useTheme } from "./hooks/useTheme";
import { useReport } from "./hooks/useReport";
import Layout from "./components/layout/Layout";
import DashboardPage from "./components/dashboard/DashboardPage";
import PlatformPage from "./components/platform/PlatformPage";
import QuickWinsPage from "./components/quickwins/QuickWinsPage";
import ActionPlanPage from "./components/action-plan/ActionPlanPage";
import BudgetPage from "./components/budget/BudgetPage";
import BenchmarksPage from "./components/benchmarks/BenchmarksPage";
import CreativePage from "./components/creative/CreativePage";

export default function App() {
  const { theme, toggle } = useTheme();
  const { report, isCustom, loadFromFile, loadSample } = useReport();

  return (
    <div className={theme === "dark" ? "dark" : ""}>
      <Layout
        theme={theme}
        onThemeToggle={toggle}
        onFileLoad={loadFromFile}
        isCustomReport={isCustom}
        onLoadSample={loadSample}
      >
        <Routes>
          <Route path="/" element={<DashboardPage report={report} />} />
          <Route
            path="/platform/:id"
            element={<PlatformPage report={report} />}
          />
          <Route
            path="/quick-wins"
            element={<QuickWinsPage report={report} />}
          />
          <Route
            path="/action-plan"
            element={<ActionPlanPage report={report} />}
          />
          <Route path="/budget" element={<BudgetPage report={report} />} />
          <Route
            path="/benchmarks"
            element={<BenchmarksPage report={report} />}
          />
          <Route path="/creative" element={<CreativePage report={report} />} />
        </Routes>
      </Layout>
    </div>
  );
}
