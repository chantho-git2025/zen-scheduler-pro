
import { Search } from "lucide-react";
import { useState } from "react";

export default function SearchBar() {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Searching for:", searchQuery);
    // Implement search functionality
  };

  return (
    <form onSubmit={handleSearch} className="relative w-full max-w-md">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="input-field pl-10 w-full"
        />
      </div>
    </form>
  );
}
