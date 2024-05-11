import { createClient } from "@/utils/supabase/client"
import { MetadataRoute } from "next";

// This function will be called at build time to generate the sitemap
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const supabase = createClient();
    // iterate over all courses and return an array of objects
    const courses = await supabase.from("courses").select("course_code");
    const courseCodes = courses.data?.map((course) => course.course_code);
    if (!courseCodes) {
        return [{
            url: "https://laurierflow.ca/course/BU%20111",
        }]
    }
    return courseCodes.map((code) => ({
        url: `https://laurierflow.ca/course/${code.replaceAll(/\s/g, "%20")}`,
        lastModified: new Date().toISOString(),
        changeFrequency: 'weekly',
        priority: 0.9
    }))
  }