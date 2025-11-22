"use client";

import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faArrowLeft } from "@fortawesome/free-solid-svg-icons";

type Props = {
  pageNumber: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (newPage: number) => void;
  onPageSizeChange: (newSize: number) => void;
  pageSizeOptions?: number[];
};

export default function Pagination({
  pageNumber,
  pageSize,
  totalItems,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 25, 50, 100],
}: Props) {
  const [input, setInput] = useState(String(pageNumber));

  useEffect(() => setInput(String(pageNumber)), [pageNumber]);

  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  const go = (n: number) => {
    const clamped = Math.max(1, Math.min(totalPages, Math.floor(n)));
    if (clamped !== pageNumber) onPageChange(clamped);
  };

  return (
    <div className="flex items-center justify-between gap-4 mt-4">
      <div className="flex items-center gap-2">
        <button
            className="px-3 py-1 rounded disabled:opacity-50"
          onClick={() => go(pageNumber - 1)}
          disabled={pageNumber <= 1}
        >
          <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
          Trước
        </button>

        <div className="flex items-center gap-2">
          <span className="text-sm">Trang</span>
          <input
              className="w-5 text-sm text-center rounded"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                const n = Number(input);
                if (!Number.isNaN(n)) go(n);
              }
            }}
          />
          <span className="text-sm">/ {totalPages}</span>
        </div>

        <button
            className="px-3 py-1 rounded disabled:opacity-50"
          onClick={() => go(pageNumber + 1)}
          disabled={pageNumber >= totalPages}
        >
          Sau
          <FontAwesomeIcon icon={faArrowRight} className="ml-2" />
        </button>
      </div>

      <div className="flex items-center gap-2 text-sm text-gray-600">
        <span>Hiển thị</span>
        <select
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="rounded px-2 py-1"
        >
          {pageSizeOptions.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <span>mỗi trang</span>
      </div>
    </div>
  );
}
