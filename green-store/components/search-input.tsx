"use client";

import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons/faMagnifyingGlass";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";

type SearchInputProps = {
  value?: string;
  placeholder?: string;
  onChange?: (val: string) => void;
  onSearch?: (val: string) => void;
  debounceMs?: number;
  className?: string;
  name?: string;
};

export default function SearchInput({
  value = "",
  placeholder = "Tìm kiếm...",
  onChange,
  onSearch,
  debounceMs = 300,
  className = "",
  name = "search",
}: SearchInputProps) {
  const [term, setTerm] = useState(value);

  useEffect(() => setTerm(value), [value]);

  useEffect(() => {
    if (!onChange) return;
    onChange(term);
  }, [term]);

  useEffect(() => {
    if (!onSearch) return;
    const t = setTimeout(() => onSearch(term), debounceMs);
    return () => clearTimeout(t);
  }, [term, debounceMs]);

  return (
    <div className={`relative max-w-2xs ${className}`}>
      <label htmlFor={name} className="sr-only">
        Search
      </label>
      <input
        id={name}
        name={name}
        type="search"
        value={term}
        onChange={(e) => setTerm(e.target.value)}
        placeholder={placeholder}
        className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm placeholder-gray-400 focus:outline-none"
        aria-label="Search"
      />
      <button
        type="button"
        onClick={() => onSearch?.(term)}
        className="absolute right-1 top-1 bottom-1 inline-flex items-center rounded px-3 text-sm text-gray-600 hover:text-gray-800"
        aria-label="Submit search"
      >
        <FontAwesomeIcon icon={faMagnifyingGlass} />
      </button>
    </div>
  );
}
