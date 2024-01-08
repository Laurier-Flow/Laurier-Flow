"use client";
import { createClient } from "@/utils/supabase/client";

export default function SearchBar({ placeholder }: { placeholder: string }) {
	async function handleSearch(searchQuery: string) {
		const supabase = createClient();
		const { data: courseResults, error: courseErr } = await supabase
			.from("courses")
			.select()
			.ilike("course_code", `%${searchQuery}%`);
	
		const { data: profResults, error: profErr } = await supabase
			.from("instructors")
			.select()
			.ilike("instructor_name", `%${searchQuery}%`);
		if (courseErr) {
			console.log(courseErr);
		}
		if (profErr) {
			console.log(profErr);
		}
	}

	return (
		<div className="">
			<input
				type="text"
				placeholder={placeholder}
				onChange={(e) => handleSearch(e.target.value)}
				size={placeholder.length}
			></input>
		</div>
	);
}
