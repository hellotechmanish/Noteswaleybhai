"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { AgGridReact } from "ag-grid-react";
import { ModuleRegistry, AllCommunityModule, ColDef } from "ag-grid-community";
import { iconSetQuartzLight } from "ag-grid-community";

import { themeQuartz } from "ag-grid-community";
import { Button } from "../ui/button";

// Register AG Grid Community Modules
ModuleRegistry.registerModules([AllCommunityModule]);

interface NoteRow {
  _id: string;
  title: string;
  university: string;
  course: string;
  year: string;
  semester: string;
  status: string;
  views: number;
  downloads: number;
  earnedAmount: number;
  supabaseSignedUrl: string;
}

export default function NotesTable() {
  const [rowData, setRowData] = useState<NoteRow[]>([]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isGridReady, setIsGridReady] = useState(false);

  // Detect system/theme dark mode
  useEffect(() => {
    const checkDark = () =>
      setIsDarkMode(document.documentElement.classList.contains("dark"));

    checkDark();

    const observer = new MutationObserver(checkDark);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  // Theme for AG Grid (Quartz)
  const myTheme = themeQuartz.withPart(iconSetQuartzLight).withParams({
    browserColorScheme: isDarkMode ? "dark" : "light",
    fontFamily: { googleFont: "Outfit" },

    // Colors
    backgroundColor: isDarkMode ? "#111827" : "#ffffff",
    headerBackgroundColor: isDarkMode ? "#181D2E" : "#D1CDCD",
    oddRowBackgroundColor: isDarkMode ? "#1f2937" : "#fafbfc",
    textColor: isDarkMode ? "#e5e7eb" : "#374151",
    headerTextColor: isDarkMode ? "#D1CDCD" : "#374151",
    borderColor: isDarkMode ? "#374151" : "#e2e8f0",
    accentColor: "#6366f1",

    // Size
    headerHeight: 48,
    rowHeight: 50,
    fontSize: 14,
    headerFontSize: 15,
  });

  // Fetch data from API
  useEffect(() => {
    (async () => {
      const res = await fetch("/api/student/notes");
      const data = await res.json();
      console.log("data>data", data.data);

      if (data.success) {
        setRowData(data.data);
      }
    })();
  }, []);

  // Renderers
  const textRenderer = useCallback(
    (params: any) => (
      <span className="text-gray-800 dark:text-gray-100">{params.value}</span>
    ),
    []
  );

  const amountRenderer = useCallback(
    (params: any) => (
      <span className="font-semibold text-indigo-600 dark:text-indigo-400">
        ₹{params.value}
      </span>
    ),
    []
  );

  const uploaderRenderer = useCallback((params: any) => {
    const u = params.data.uploadedBy;
    return (
      <span className="font-medium text-gray-900 dark:text-white">
        {u?.firstName} {u?.lastName}
      </span>
    );
  }, []);

  const Pdfrender = useCallback((params: any) => {
    return (
      <Button
        onClick={() => window.open(params.value, "_blank")}
        className="h-8 px-3 text-xs rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-100"
      >
        View
      </Button>
    );
  }, []);

  // Columns
  const colDefs = useMemo<ColDef<NoteRow>[]>(
    () => [
      {
        field: "title",
        headerName: "Title",
        cellRenderer: textRenderer,
        minWidth: 180,
        flex: 1.5,
      },
      {
        field: "university",
        headerName: "University",
        cellRenderer: textRenderer,
        minWidth: 140,
        flex: 1.2,
      },
      {
        field: "course",
        headerName: "Course",
        cellRenderer: textRenderer,
        minWidth: 140,
        flex: 1,
      },
      {
        field: "year",
        headerName: "Year",
        cellRenderer: textRenderer,
        minWidth: 100,
        flex: 0.6,
      },
      {
        field: "semester",
        headerName: "Sem",
        cellRenderer: textRenderer,
        minWidth: 100,
        flex: 0.6,
      },
      {
        field: "status",
        headerName: "Status",
        minWidth: 110,
        flex: 0.8,
        cellRenderer: (p: any) => (
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              p.value === "approved"
                ? "bg-green-100 text-green-700"
                : p.value === "pending"
                ? "bg-yellow-100 text-yellow-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {p.value.toUpperCase()}
          </span>
        ),
      },
      {
        field: "views",
        headerName: "Views",
        minWidth: 100,
        cellRenderer: textRenderer,
      },
      {
        field: "downloads",
        headerName: "Downloads",
        minWidth: 120,
        cellRenderer: textRenderer,
      },
      {
        field: "earnedAmount",
        headerName: "Earned",
        minWidth: 110,
        cellRenderer: amountRenderer,
      },
      {
        field: "supabaseSignedUrl",
        headerName: "Earned",
        minWidth: 110,
        cellRenderer: Pdfrender,
      },
    ],
    [textRenderer, amountRenderer, uploaderRenderer]
  );

  const defaultColDef = {
    sortable: true,
    filter: true,
    resizable: true,
  };

  if (!rowData.length) {
    return (
      <div className="w-full flex flex-col items-center justify-center py-24 text-center">
        <div className="w-16 h-16 mb-4 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
          <span className="text-gray-400 dark:text-gray-500 text-xl">—</span>
        </div>

        <h3 className="text-lg font-medium text-gray-700 dark:text-gray-200">
          No data
        </h3>

        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-sm">
          There is no information available to display right now.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full p-4 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
          {/* Header */}
          <div className="p-6 border-b border-gray-100 dark:border-gray-700">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              User Notes
            </h1>

            <div className="bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-full inline-block">
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                | {rowData.length} | Notes uploaded
              </span>
            </div>
          </div>

          {/* AG Grid */}
          <div style={{ height: 500, width: "100%" }}>
            <AgGridReact<NoteRow>
              theme={myTheme}
              rowData={rowData}
              columnDefs={colDefs}
              defaultColDef={defaultColDef}
              pagination={true}
              paginationPageSize={10}
              animateRows={true}
              onGridReady={(params) => {
                setIsGridReady(true);
                params.api.sizeColumnsToFit();
              }}
            />
          </div>

          {!isGridReady && (
            <div className="flex items-center justify-center h-64">
              <div className="text-gray-500 dark:text-gray-400">
                Initializing Grid...
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
