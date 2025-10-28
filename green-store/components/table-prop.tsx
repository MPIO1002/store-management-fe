import React from "react";
import TableSkeleton from "./skeletons/table-skeleton";

type Column<T> = {
  header: React.ReactNode;
  accessor?: keyof T | string;
  render?: (row: T) => React.ReactNode;
  className?: string;
};

type TableProps<T> = {
  columns: Column<T>[];
  data: T[];
  rowKey?: (row: T, idx: number) => string | number;
  wrapperClassName?: string;
  loading?: boolean;
  skeletonRows?: number;
  selectable?: boolean;
  initialSelected?: Array<string | number>;
  onSelectionChange?: (selected: Array<string | number>) => void;
  /** If truthy, display an error state (image + message) instead of the table body */
  error?: boolean | string;
};

export default function TableProp<T extends Record<string, any>>({
  columns,
  data,
  rowKey,
  wrapperClassName = "",
  loading = false,
  skeletonRows = 4,
  selectable = false,
  initialSelected = [],
  onSelectionChange,
  error,
}: TableProps<T>) {
  const [selectedSet, setSelectedSet] = React.useState<Set<string | number>>(new Set(initialSelected));

  React.useEffect(() => {
    onSelectionChange?.(Array.from(selectedSet));
  }, [selectedSet]);

  const getRowKey = (row: any, idx: number) => (rowKey ? rowKey(row, idx) : row.id ?? row.key ?? idx);

  const allRowKeys = data.map((r, i) => getRowKey(r, i));
  const allSelected = allRowKeys.length > 0 && allRowKeys.every((k) => selectedSet.has(k));

  function toggleAll(checked: boolean) {
    if (checked) {
      setSelectedSet(new Set(allRowKeys));
    } else {
      setSelectedSet(new Set());
    }
  }

  function toggleOne(key: string | number, checked: boolean) {
    setSelectedSet((prev) => {
      const copy = new Set(prev);
      if (checked) copy.add(key);
      else copy.delete(key);
      return copy;
    });
  }

  const totalColumns = columns.length + (selectable ? 1 : 0);

  return (
    <div className={`relative overflow-x-auto shadow-sm sm:rounded-lg ${wrapperClassName}`}>
      <table className="w-full text-sm text-left rtl:text-right text-gray-500">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
          <tr>
            {selectable && (
              <th className="px-6 py-3">
                <input
                  type="checkbox"
                  aria-label="Select all rows"
                  checked={allSelected}
                  onChange={(e) => toggleAll(e.target.checked)}
                />
              </th>
            )}
            {columns.map((col, i) => (
              <th key={i} scope="col" className={`px-6 py-3 ${col.className ?? ""}`}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <TableSkeleton columns={totalColumns} rows={skeletonRows} selectable={selectable} />
          ) : error ? (
            <tr className="bg-white border-b border-gray-200">
              <td colSpan={totalColumns} className="px-6 py-8 text-center text-gray-500">
                <div className="max-w-xs mx-auto">
                  <img src="/error.png" alt="error" className="mx-auto mb-4 w-36 h-auto" />
                  <div className="text-lg font-medium">Lỗi hệ thống</div>
                  {typeof error === "string" ? <div className="text-sm text-gray-500 mt-1">{error}</div> : null}
                </div>
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr className="bg-white border-b border-gray-200">
              <td colSpan={totalColumns} className="px-6 py-8 text-center text-gray-500">
                <div className="max-w-xs mx-auto">
                  <img src="/no-data.png" alt="no data" className="mx-auto mb-4 w-36 h-auto" />
                  <div className="text-lg font-medium">Không có dữ liệu</div>
                </div>
              </td>
            </tr>
          ) : (
              data.map((row, idx) => {
                const key = getRowKey(row, idx);
                return (
                  <tr key={String(key)} className="bg-white border-b border-gray-200">
                    {selectable && (
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          aria-label={`Select row ${String(key)}`}
                          checked={selectedSet.has(key)}
                          onChange={(e) => toggleOne(key, e.target.checked)}
                        />
                      </td>
                    )}
                    {columns.map((col, i) => {
                      const content = col.render
                        ? col.render(row)
                        : col.accessor
                        ? String((col.accessor as string).split?.(".").reduce((acc: any, part: string) => (acc ? acc[part] : undefined), row) ?? "")
                        : null;

                      if (i === 0) {
                        return (
                          <th key={i} scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                            {content}
                          </th>
                        );
                      }

                      return (
                        <td key={i} className="px-6 py-4">
                          {content}
                        </td>
                      );
                    })}
                  </tr>
                );
              })
            )}
        </tbody>
      </table>
    </div>
  );
}
