"use client";
import { createClient } from "@supabase/supabase-js";
import { Database } from "@/database.types";

async function HandleSearch(searchQuery: string) {
  // const [courses, setCourses] = useState<any[] | null>(null)
  const supabaseUrl: string = process.env.NEXT_PUBLIC_SUPABASE_URL
    ? process.env.NEXT_PUBLIC_SUPABASE_URL
    : "";
  const supabaseAnonKey: string = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    ? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    : "";
  const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

  const { data, error } = await supabase.from("courses").select("*").limit(10);
  console.log(data);

  // useEffect(() => {
  //   const getData = async () => {
  //     const { data } = await supabase.from('courses').select('*').limit(10);
  //     setCourses(data)
  //   }
  //   getData()
  // }, [])

  // return <pre>{JSON.stringify(courses, null, 2)}</pre>
}

export default function SearchBar({ placeholder }: { placeholder: string }) {
  return (
    <div className="">
      <input
        type="text"
        placeholder={placeholder}
        onChange={(e) => HandleSearch(e.target.value)}
        size={placeholder.length}
      ></input>
    </div>
  );
}
