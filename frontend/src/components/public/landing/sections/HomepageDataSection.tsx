"use client";

import { useCallback, useEffect, useState } from "react";

import type { ApiResponseDTO } from "@/dtos/common/api-response.dto";

import HomepageSection from "../shared/HomepageSection";
import HomepageSectionState from "../shared/HomepageSectionState";

interface HomepageDataSectionProps<T> {
  title: string;
  description: string;
  eyebrow?: string;
  href?: string;
  linkLabel?: string;
  centered?: boolean;
  fetchData: () => Promise<ApiResponseDTO<T[]>>;
  renderItem: (item: T, index: number) => React.ReactNode;
  gridClassName?: string;
}

export default function HomepageDataSection<T>({
  title,
  description,
  eyebrow,
  href,
  linkLabel,
  centered,
  fetchData,
  renderItem,
  gridClassName = "grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3",
}: HomepageDataSectionProps<T>) {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(false);

    try {
      const response = await fetchData();
      setItems(response.data ?? []);
    } catch {
      setError(true);
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [fetchData]);

  useEffect(() => {
    void loadData();
  }, [loadData, retryCount]);

  return (
    <HomepageSection
      eyebrow={eyebrow}
      title={title}
      description={description}
      href={href}
      linkLabel={linkLabel}
      centered={centered}
    >
      {loading ? (
        <HomepageSectionState type="loading" />
      ) : error ? (
        <HomepageSectionState
          type="error"
          onRetry={() => setRetryCount((count) => count + 1)}
        />
      ) : items.length === 0 ? (
        <HomepageSectionState type="empty" />
      ) : (
        <div className={gridClassName}>
          {items.map((item, index) => (
            <div key={index}>{renderItem(item, index)}</div>
          ))}
        </div>
      )}
    </HomepageSection>
  );
}
