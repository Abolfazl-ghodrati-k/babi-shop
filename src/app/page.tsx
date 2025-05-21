"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { FixedSizeList as List, ListOnScrollProps } from "react-window";
import { Card, CardContent } from "@/components/ui/card";
import api from "@/lib/api";
import Link from "next/link";
import { useRef, useState, useEffect } from "react";

interface Product {
  product_id: number;
  name: string;
  category: string;
  price: number;
  rating: number;
}

const PAGE_SIZE = 12;
const ITEM_HEIGHT = 180;

export default function HomePage() {
  const listRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerHeight, setContainerHeight] = useState<number | null>(null);
  const [containerWidth, setContainerWidth] = useState<number | null>(null);

  useEffect(() => {
    console.log(containerRef);
    if (containerRef.current) {
      const { clientHeight, clientWidth } = containerRef.current;
      setContainerHeight(clientHeight);
      setContainerWidth(clientWidth);
    }
  }, [containerRef]);

  const {
    data,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
    isLoading,
    isError,
  } = useInfiniteQuery({
    queryKey: ["products"],
    queryFn: async ({ pageParam = 1 }) => {
      const res = await api.get(
        `/products?page=${pageParam}&per_page=${PAGE_SIZE}`
      );
      return res.data;
    },
    getNextPageParam: (lastPage, allPages) => {
      const total = lastPage.total;
      const loaded = allPages.flatMap((p) => p.results).length;
      return loaded < total ? allPages.length + 1 : undefined;
    },
    initialPageParam: 1,
  });

  const allProducts = data?.pages.flatMap((page) => page.results) || [];

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

  const handleScroll = ({
    scrollOffset,
    scrollDirection,
  }: ListOnScrollProps) => {
    if (!containerHeight) return;
    const visibleRows = Math.ceil(containerHeight / ITEM_HEIGHT);
    if (
      hasNextPage &&
      scrollDirection === "forward" &&
      scrollOffset / ITEM_HEIGHT + visibleRows >= allProducts.length - 1 &&
      !isFetchingNextPage
    ) {
      fetchNextPage();
    }
  };

  const showListDimensions = containerHeight && containerWidth;

  return (
    <main className="p-6 max-w-5xl mx-auto h-full flex flex-col max-h-screen">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Abolfazl Shop - All Products</h1>
        <Link href="/search" className="text-blue-600 underline">
          Search
        </Link>
      </div>

      <div ref={containerRef} className="flex-1 max-h-full overflow-hidden">
        {showListDimensions && (
          <div>
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
        )}
      </div>
    </main>
  );
}
