"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { FixedSizeList as List, ListOnScrollProps } from "react-window";
import React, { useState, useEffect, useRef } from "react";
import api from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import SearchBox from "./components/SearchBox";
import CategorySelect from "./components/CategorySelect";
import PriceFilter from "./components/PriceFilter";

interface Product {
  product_id: number;
  name: string;
  category: string;
  price: number;
  rating: number;
}

const PAGE_SIZE = 12;
const ITEM_HEIGHT = 180;

const SearchPage = () => {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(Infinity);

  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<any>(null);
  const [containerHeight, setContainerHeight] = useState(600);
  const [containerWidth, setContainerWidth] = useState(800);

  useEffect(() => {
    if (containerRef.current) {
      const { clientHeight, clientWidth } = containerRef.current;
      setContainerHeight(clientHeight);
      setContainerWidth(clientWidth);
    }
  }, []);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isError,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["search", query, category, minPrice, maxPrice],
    queryFn: async ({ pageParam = 1 }) => {
      const res = await api.get(`/search`, {
        params: {
          query,
          category: category || undefined,
          min_price: minPrice,
          max_price: maxPrice,
          page: pageParam,
          per_page: PAGE_SIZE,
        },
      });
      return res.data;
    },
    getNextPageParam: (lastPage, allPages) => {
      const total = lastPage.results.length + (lastPage.total || 0);
      const loaded = allPages.flatMap((p) => p.results).length;
      return loaded < total ? allPages.length + 1 : undefined;
    },
    initialPageParam: 1,
    enabled: Boolean(query),
  });

  const allProducts = data?.pages.flatMap((page) => page.results) || [];

  const handleScroll = ({
    scrollOffset,
    scrollDirection,
  }: ListOnScrollProps) => {
    const visibleRows = Math.ceil(containerHeight / ITEM_HEIGHT);
    if (
      hasNextPage &&
      scrollDirection === "forward" &&
      scrollOffset / ITEM_HEIGHT + visibleRows >= allProducts.length - 1 &&
      isFetchingNextPage
    ) {
      fetchNextPage();
    }
  };

  const Row = ({
    index,
    style,
  }: {
    index: number;
    style: React.CSSProperties;
  }) => {
    const product = allProducts[index];
    if (!product) return null;

    return (
      <div style={style} className="px-2">
        <Card>
          <CardContent className="p-4">
            <h2 className="text-lg font-semibold">{product.name}</h2>
            <p className="text-sm text-muted-foreground">
              Category: {product.category}
            </p>
            <p className="text-sm">${product.price.toFixed(2)}</p>
            <p className="text-sm">⭐ {product.rating}</p>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <main className="p-6 max-w-5xl mx-auto h-full flex flex-col max-h-screen">
      <div className="mb-6 flex items-center justify-between gap-4">
        <SearchBox query={query} setQuery={setQuery} />
        <CategorySelect category={category} setCategory={setCategory} />
        <PriceFilter
          minPrice={minPrice}
          maxPrice={maxPrice}
          setMinPrice={setMinPrice}
          setMaxPrice={setMaxPrice}
        />
      </div>
      <div className="flex-1 max-h-full overflow-hidden" ref={containerRef}>
        {isLoading ? (
          <p>Loading...</p>
        ) : isError ? (
          <p>Error loading products.</p>
        ) : (
          <List
            height={containerHeight}
            width={containerWidth}
            itemCount={allProducts.length}
            itemSize={ITEM_HEIGHT}
            onScroll={handleScroll}
            ref={listRef}
          >
            {Row}
          </List>
        )}
      </div>
    </main>
  );
};

export default SearchPage;
