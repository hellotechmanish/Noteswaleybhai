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

  // Load universities
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

  // Fetch Course list from Scraper API
  async function fetchCourses(website: string) {
    try {
      //  TEMPORARILY DISABLED API CALL
      // const res = await fetch(
      //   `/api/student/upload/university-courses?url=${encodeURIComponent(website)}`
      // );
      // if (!res.ok) throw new Error("Failed to fetch courses");

      // const data = await res.json();
      // if (data.courses && Array.isArray(data.courses)) {
      //   setCourses(data.courses);
      //   return;
      // }

      // ✔ ALWAYS USE DEFAULT COURSE LIST (COURSE_STRUCTURE)
      const fallbackCourses: string[] = Object.keys(COURSE_STRUCTURE);

      setCourses(fallbackCourses);
      setError(""); // remove error message
    } catch (err) {
      console.error(err);

      // Still fallback on error
      const fallbackCourses: string[] = Object.keys(COURSE_STRUCTURE);
      setCourses(fallbackCourses);
      setError("Showing default course list.");
    }
  }

  // When university changes → fetch course list
  useEffect(() => {
    if (selectedUni) {
      fetchCourses(selectedUni);
    } else {
      setCourses([]);
      setSelectedCourse("");
    }
    // Reset dependent fields
    setSelectedYear("");
    setSelectedSem("");
  }, [selectedUni]);

  // Reset year and semester when course changes
  useEffect(() => {
    setSelectedYear("");
    setSelectedSem("");
  }, [selectedCourse]);

  // Reset semester when year changes
  useEffect(() => {
    setSelectedSem("");
  }, [selectedYear]);

  // Dynamic Years (Based on Course)
  const YEARS =
    selectedCourse && COURSE_STRUCTURE[selectedCourse]
      ? Array.from(
          { length: COURSE_STRUCTURE[selectedCourse].years },
          (_, i) => `${i + 1}`
        )
      : [];

  // Dynamic Semesters (Based on Year)
  const SEMS =
    selectedCourse && selectedYear && COURSE_STRUCTURE[selectedCourse]
      ? COURSE_STRUCTURE[selectedCourse].semesters[
          selectedYear as keyof (typeof COURSE_STRUCTURE)[keyof typeof COURSE_STRUCTURE]["semesters"]
        ] || []
      : [];

  // Submit Handler
  async function handleSubmit() {
    setError("");
    setSuccess(false);

    // Validation
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

      const response = await fetch("/api/student/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Upload failed.");
        return;
      }

      setSuccess(true);
      setTimeout(() => {
        window.location.href = "/student";
      }, 1500);
    } catch (err) {
      console.error(err);
      setError("Upload failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Upload Notes
        </CardTitle>
        <CardDescription>
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
          <Alert className="mb-4 bg-green-50 text-green-900 border-green-200">
            <CheckCircle2 className="h-4 w-4" />
            <AlertDescription>Upload Successful 🎉</AlertDescription>
          </Alert>
        )}

        <div className="space-y-4">
          {/* University */}
          <div className="space-y-2">
            <label className="text-sm font-medium">University</label>
            <Select value={selectedUni} onValueChange={setSelectedUni}>
              <SelectTrigger>
                <SelectValue placeholder="Select University" />
              </SelectTrigger>
              <SelectContent>
                {universities.map((u: any) => (
                  <SelectItem key={u.name} value={u.web_pages?.[0] || u.name}>
                    {u.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Course */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Course</label>
            <Select
              value={selectedCourse}
              onValueChange={(v) =>
                setSelectedCourse(v as keyof typeof COURSE_STRUCTURE)
              }
              disabled={!courses.length}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Course" />
              </SelectTrigger>
              <SelectContent>
                {courses.map((c: string) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Year */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Year</label>
            <Select
              value={selectedYear}
              onValueChange={setSelectedYear}
              disabled={!selectedCourse}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Year" />
              </SelectTrigger>
              <SelectContent>
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
            <label className="text-sm font-medium">Semester</label>
            <Select
              value={selectedSem}
              onValueChange={setSelectedSem}
              disabled={!selectedYear}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Semester" />
              </SelectTrigger>
              <SelectContent>
                {SEMS.map((s: string) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Title</label>
            <Input
              placeholder="e.g., Data Structures Notes"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Description (Optional)
            </label>
            <Input
              placeholder="Brief description..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* File */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Upload PDF</label>
            <Input
              type="file"
              accept="application/pdf"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
            {file && (
              <p className="text-xs text-gray-600">
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
