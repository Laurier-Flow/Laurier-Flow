import SearchBar from "../../components/SearchBar"

export const metadata = {
  title: "Search",
  description: "Search for courses, subjects, or professors",
}


export default function SearchPage() {
  return (
    <div className=" flex w-screen items-center justify-center">
      <SearchBar />
    </div>
  )
}




