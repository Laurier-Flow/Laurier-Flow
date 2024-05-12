import { createClient } from "@/utils/supabase/client"
import { MetadataRoute } from "next";

// This function will be called at build time to generate the sitemap
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const supabase = createClient();
    // iterate over all courses and return an array of objects
    const instructors = await supabase.from("instructors").select("instructor_name");
    const instrucorNames = instructors.data?.map((instructor) => instructor);
    if (!instrucorNames) {
        return [{
            url: "https://laurierflow.ca/instructor/Kenneth Jackson",
        }]
    }
    return instrucorNames.map((name) => ({
        url: `https://laurierflow.ca/instructor/${name}`,
        lastModified: new Date().toISOString(),
        changeFrequency: 'weekly',
        priority: 0.9
    }))
  }