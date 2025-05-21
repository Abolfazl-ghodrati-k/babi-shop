'use client';

import { useEffect, useState } from 'react';

interface Props {
  query: string;
  setQuery: (val: string) => void;
}

export default function SearchBox({ query, setQuery }: Props) {
  const [localQuery, setLocalQuery] = useState(query);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setQuery(localQuery);
    }, 500);
    return () => clearTimeout(timeout);
  }, [localQuery, setQuery]);

  return (
    <input
      className="border rounded px-3 py-2 w-full"
      placeholder="Search products..."
      value={localQuery}
      onChange={(e) => setLocalQuery(e.target.value)}
    />
  );
}