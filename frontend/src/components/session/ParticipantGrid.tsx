"use client";

import { Children, useEffect, useRef, useState, type ReactNode } from "react";

const GAP = 12;
const MAX_TILE_WIDTH = 1200;
const MIN_RATIO = 3 / 4;
const MAX_RATIO = 16 / 9;

interface Size {
  width: number;
  height: number;
}

interface TileLayout {
  cols: number;
  tileWidth: number;
  tileHeight: number;
}

// Tiles take the shape of their grid cell (like Meet), with the ratio
// clamped so they never get absurdly wide or tall. The column count that
// yields the largest tile area wins.
function computeLayout(count: number, { width, height }: Size): TileLayout {
  let best: TileLayout = { cols: 1, tileWidth: 0, tileHeight: 0 };
  let bestArea = 0;

  for (let cols = 1; cols <= count; cols++) {
    const rows = Math.ceil(count / cols);
    const cellWidth = (width - GAP * (cols - 1)) / cols;
    const cellHeight = (height - GAP * (rows - 1)) / rows;
    if (cellWidth <= 0 || cellHeight <= 0) continue;

    const ratio = Math.min(
      MAX_RATIO,
      Math.max(MIN_RATIO, cellWidth / cellHeight),
    );
    const tileWidth = Math.floor(
      Math.min(cellWidth, cellHeight * ratio, MAX_TILE_WIDTH),
    );
    const tileHeight = Math.floor(tileWidth / ratio);
    const area = tileWidth * tileHeight;

    if (area > bestArea) {
      bestArea = area;
      best = { cols, tileWidth, tileHeight };
    }
  }

  return best;
}

export default function ParticipantGrid({ children }: { children: ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState<Size>({ width: 0, height: 0 });

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new ResizeObserver(([entry]) => {
      if (!entry) return;
      const { width, height } = entry.contentRect;
      setSize((prev) =>
        prev.width === width && prev.height === height
          ? prev
          : { width, height },
      );
    });

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const tiles = Children.toArray(children);
  const ready = size.width > 0 && size.height > 0 && tiles.length > 0;
  const layout = ready ? computeLayout(tiles.length, size) : null;

  return (
    <div
      ref={containerRef}
      className="flex h-full w-full items-center justify-center"
    >
      {layout && (
        <div
          className="flex flex-wrap content-center justify-center"
          style={{
            gap: GAP,
            width: layout.cols * layout.tileWidth + GAP * (layout.cols - 1),
          }}
        >
          {tiles.map((tile, index) => (
            <div
              key={index}
              className="shrink-0"
              style={{ width: layout.tileWidth, height: layout.tileHeight }}
            >
              {tile}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
