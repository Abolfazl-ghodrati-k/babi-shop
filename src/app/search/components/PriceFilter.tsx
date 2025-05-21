import { useState, useEffect } from 'react';

interface Props {
  minPrice: number;
  maxPrice: number;
  setMinPrice: (val: number) => void;
  setMaxPrice: (val: number) => void;
}

export default function PriceFilter({ minPrice, maxPrice, setMinPrice, setMaxPrice }: Props) {
  const [localMin, setLocalMin] = useState(minPrice);
  const [localMax, setLocalMax] = useState(maxPrice);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setMinPrice(localMin);
    }, 500);
    return () => clearTimeout(timeout);
  }, [localMin, setMinPrice]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setMaxPrice(localMax);
    }, 500);
    return () => clearTimeout(timeout);
  }, [localMax, setMaxPrice]);

  return (
    <div className="flex items-center gap-2">
      <input
        type="number"
        placeholder="Min"
        className="border rounded px-2 py-1 w-20"
        value={localMin === 0 ? '' : localMin} 
        onChange={(e) => setLocalMin(Number(e.target.value) || 0)}
      />
      <input
        type="number"
        placeholder="Max"
        className="border rounded px-2 py-1 w-20"
        value={localMax === Infinity ? '' : localMax}
        onChange={(e) => setLocalMax(Number(e.target.value) || Infinity)}
      />
    </div>
  );
}
