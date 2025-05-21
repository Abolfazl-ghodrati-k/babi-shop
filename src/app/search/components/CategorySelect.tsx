import { useEffect, useState } from "react";
import api from "@/lib/api";

interface Props {
  category: string;
  setCategory: (val: string) => void;
}

export default function CategorySelect({ category, setCategory }: Props) {
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    api.get("/categories").then((res) => setCategories(res.data));
  }, []);

  return (
    <select
      className="border rounded px-3 py-2"
      value={category}
      onChange={(e) => setCategory(e.target.value)}
    >
      <option value="">All Categories</option>
      {categories.map((cat) => (
        <option key={cat} value={cat}>
          {cat}
        </option>
      ))}
    </select>
  );
}
