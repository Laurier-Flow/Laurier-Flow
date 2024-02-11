"use client";
import { createClient } from "@/utils/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

type CourseResult = {
  course_code: string;
  course_title: string | null;
  easy: number | null;
  liked: number | null;
  total_reviews: number | null;
  useful: number | null;
};

type ProfResult = {
  clear: number | null;
  engaging: number | null;
  instructor_email: string | null;
  instructor_name: string;
  liked: number | null;
  total_reviews: number | null;
};

export default function SearchBar() {
  const [searchQuery, setSearchQuery] = useState<String>();
  const [courseResults, setCourseResults] = useState<CourseResult[]>([]);
  const [profResults, setProfResults] = useState<ProfResult[]>([]);

  useEffect(() => {
    async function fetchResults() {
      const supabase = createClient();
      const COURSE_LIMIT = 4;
      const PROF_LIMIT = 2;
      try {
        const [courseResults, profResults] = await Promise.all([
          supabase
            .from("courses")
            .select()
            .ilike("course_code", `%${searchQuery}%`)
            .limit(COURSE_LIMIT),
          supabase
            .from("instructors")
            .select()
            .ilike("instructor_name", `%${searchQuery}%`)
            .limit(PROF_LIMIT),
        ]);
        setCourseResults(courseResults.data as CourseResult[]);
        setProfResults(profResults.data as ProfResult[]);
      } catch (error) {
        console.error(error);
      }
    }
    if (searchQuery?.trim() === "") {
      setCourseResults([]);
      setProfResults([]);
    } else {
      fetchResults();
    }
  }, [searchQuery]);

  return (
    <div>
      <div className="flex w-72 items-center">
        <Input
          type="search"
          placeholder="Search for Courses or Professors"
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Button type="submit" className=""></Button>
      </div>
      <div className="">
        <ul>
          {courseResults.map((course) => (
            <li
              key={course.course_code}
              className="bg-background text-foreground"
            >
              {course.course_code}
            </li>
          ))}
          {profResults.map((prof) => (
            <li
              key={prof.instructor_name}
              className="bg-background text-foreground"
            >
              {prof.instructor_name}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
