"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AlertCircle, CheckCircle2, Upload } from "lucide-react";

export const COURSE_STRUCTURE = {
  "B.Tech": {
    years: 4,
    semesters: {
      "1": ["Semester 1", "Semester 2"],
      "2": ["Semester 3", "Semester 4"],
      "3": ["Semester 5", "Semester 6"],
      "4": ["Semester 7", "Semester 8"],
    },
  },
  "B.Sc": {
    years: 3,
    semesters: {
      "1": ["Semester 1", "Semester 2"],
      "2": ["Semester 3", "Semester 4"],
      "3": ["Semester 5", "Semester 6"],
    },
  },
  "B.Com": {
    years: 3,
    semesters: {
      "1": ["Semester 1", "Semester 2"],
      "2": ["Semester 3", "Semester 4"],
      "3": ["Semester 5", "Semester 6"],
    },
  },
  BA: {
    years: 3,
    semesters: {
      "1": ["Semester 1", "Semester 2"],
      "2": ["Semester 3", "Semester 4"],
      "3": ["Semester 5", "Semester 6"],
    },
  },
  BCA: {
    years: 3,
    semesters: {
      "1": ["Semester 1", "Semester 2"],
      "2": ["Semester 3", "Semester 4"],
      "3": ["Semester 5", "Semester 6"],
    },
  },
  BBA: {
    years: 3,
    semesters: {
      "1": ["Semester 1", "Semester 2"],
      "2": ["Semester 3", "Semester 4"],
      "3": ["Semester 5", "Semester 6"],
    },
  },
  MCA: {
    years: 2,
    semesters: {
      "1": ["Semester 1", "Semester 2"],
      "2": ["Semester 3", "Semester 4"],
    },
  },
  MBA: {
    years: 2,
    semesters: {
      "1": ["Semester 1", "Semester 2"],
      "2": ["Semester 3", "Semester 4"],
    },
  },
};

export function UploadForm() {
  const [universities, setUniversities] = useState<any[]>([]);
  const [courses, setCourses] = useState<string[]>([]);
  const [selectedUni, setSelectedUni] = useState("");
  const [selectedCourse, setSelectedCourse] = useState<
    keyof typeof COURSE_STRUCTURE | ""
  >("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedSem, setSelectedSem] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(
          "http://universities.hipolabs.com/search?country=India"
        );
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setUniversities(data || []);
      } catch (err) {
        console.error(err);
        setError("Failed to load universities");
      }
    }
    load();
  }, []);

  async function fetchCourses() {
    const fallbackCourses = Object.keys(COURSE_STRUCTURE);
    setCourses(fallbackCourses);
    setError("");
  }

  useEffect(() => {
    if (selectedUni) fetchCourses();
    setSelectedCourse("");
    setSelectedYear("");
    setSelectedSem("");
  }, [selectedUni]);

  useEffect(() => {
    setSelectedYear("");
    setSelectedSem("");
  }, [selectedCourse]);

  useEffect(() => {
    setSelectedSem("");
  }, [selectedYear]);

  const YEARS =
    selectedCourse && COURSE_STRUCTURE[selectedCourse]
      ? Array.from(
          { length: COURSE_STRUCTURE[selectedCourse].years },
          (_, i) => `${i + 1}`
        )
      : [];

  const SEMS =
    selectedCourse && selectedYear && COURSE_STRUCTURE[selectedCourse]
      ? COURSE_STRUCTURE[selectedCourse].semesters[
          selectedYear as keyof (typeof COURSE_STRUCTURE)[keyof typeof COURSE_STRUCTURE]["semesters"]
        ] || []
      : [];

  async function handleSubmit() {
    setError("");
    setSuccess(false);

    if (
      !selectedUni ||
      !selectedCourse ||
      !selectedYear ||
      !selectedSem ||
      !title ||
      !file
    ) {
      setError("Please fill all fields.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Max 5MB is allowed.");
      return;
    }

    if (file.type !== "application/pdf") {
      setError("Only PDF files are allowed.");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("university", selectedUni);
      formData.append("course", selectedCourse);
      formData.append("year", selectedYear);
      formData.append("semester", selectedSem);
      formData.append("title", title);
      formData.append("description", description);
      formData.append("file", file);

      const res = await fetch("/api/student/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Upload failed.");
        return;
      }

      setSuccess(true);
      setTimeout(() => {
        window.location.href = "/student";
      }, 1500);
    } catch (e) {
      setError("Upload failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto bg-white dark:bg-gray-900 dark:border-gray-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
          <Upload className="h-5 w-5" />
          Upload Notes
        </CardTitle>
        <CardDescription className="text-gray-600 dark:text-gray-400">
          Select University → Course → Year → Semester
        </CardDescription>
      </CardHeader>

      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="mb-4 bg-green-50 dark:bg-green-900/30 text-green-900 dark:text-green-200 border-green-200 dark:border-green-800">
            <CheckCircle2 className="h-4 w-4" />
            <AlertDescription>Upload Successful 🎉</AlertDescription>
          </Alert>
        )}

        <div className="space-y-4">
          {/* University */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-800 dark:text-gray-200">
              University
            </label>
            <Select value={selectedUni} onValueChange={setSelectedUni}>
              <SelectTrigger className="dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200">
                <SelectValue placeholder="Select University" />
              </SelectTrigger>
              <SelectContent className="dark:bg-gray-800 dark:text-gray-200">
                {universities.map((u) => (
                  <SelectItem
                    key={u.name}
                    value={u.web_pages?.[0] || u.name}
                    className="dark:text-gray-200"
                  >
                    {u.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Course */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-800 dark:text-gray-200">
              Course
            </label>
            <Select
              value={selectedCourse}
              onValueChange={(v) =>
                setSelectedCourse(v as keyof typeof COURSE_STRUCTURE)
              }
              disabled={!courses.length}
            >
              <SelectTrigger className="dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200">
                <SelectValue placeholder="Select Course" />
              </SelectTrigger>
              <SelectContent className="dark:bg-gray-800 dark:text-gray-200">
                {courses.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Year */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-800 dark:text-gray-200">
              Year
            </label>
            <Select
              value={selectedYear}
              onValueChange={setSelectedYear}
              disabled={!selectedCourse}
            >
              <SelectTrigger className="dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200">
                <SelectValue placeholder="Select Year" />
              </SelectTrigger>
              <SelectContent className="dark:bg-gray-800 dark:text-gray-200">
                {YEARS.map((y) => (
                  <SelectItem key={y} value={y}>
                    Year {y}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Semester */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-800 dark:text-gray-200">
              Semester
            </label>
            <Select
              value={selectedSem}
              onValueChange={setSelectedSem}
              disabled={!selectedYear}
            >
              <SelectTrigger className="dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200">
                <SelectValue placeholder="Select Semester" />
              </SelectTrigger>
              <SelectContent className="dark:bg-gray-800 dark:text-gray-200">
                {SEMS.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-800 dark:text-gray-200">
              Title
            </label>
            <Input
              placeholder="e.g., Data Structures Notes"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-800 dark:text-gray-200">
              Description (Optional)
            </label>
            <Input
              placeholder="Brief description..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
            />
          </div>

          {/* File */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-800 dark:text-gray-200">
              Upload PDF
            </label>
            <Input
              type="file"
              accept="application/pdf"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300"
            />
            {file && (
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Selected: {file.name} ({(file.size / 1024).toFixed(2)} KB)
              </p>
            )}
          </div>

          <Button onClick={handleSubmit} className="w-full" disabled={loading}>
            {loading ? "Uploading..." : "Upload Notes"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
