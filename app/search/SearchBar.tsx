"use client";

function HandleSearch(searchQuery: string) {
  console.log(searchQuery);
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
