import { useState, useCallback } from "react";
import type { AuditReport } from "../types/audit";
import sampleReport from "../data/sample-report.json";

export function useReport() {
  const [report, setReport] = useState<AuditReport>(sampleReport as AuditReport);
  const [isCustom, setIsCustom] = useState(false);

  const loadFromFile = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        setReport(data as AuditReport);
        setIsCustom(true);
      } catch {
        alert("Invalid JSON file. Please upload a valid audit report.");
      }
    };
    reader.readAsText(file);
  }, []);

  const loadSample = useCallback(() => {
    setReport(sampleReport as AuditReport);
    setIsCustom(false);
  }, []);

  return { report, isCustom, loadFromFile, loadSample };
}
