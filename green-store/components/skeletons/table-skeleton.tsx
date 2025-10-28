type TableSkeletonProps = {
  columns: number;
  rows?: number;
  selectable?: boolean;
};

export default function TableSkeleton({ columns, rows = 4, selectable = false }: TableSkeletonProps) {
  return (
    <>
      {Array.from({ length: rows }).map((_, rIdx) => (
        <tr
          key={`skeleton-${rIdx}`}
          className="bg-white border-b border-gray-200"
        >
          {Array.from({ length: columns }).map((__, i) => {
            if (i === 0) {
              if (selectable) {
                return (
                  <td key={i} className="px-6 py-4">
                    <div className="h-4 w-4 bg-gray-200 rounded animate-pulse" />
                  </td>
                );
              }

              return (
                <th
                  key={i}
                  scope="row"
                  className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                >
                  <div className="h-4 w-40 bg-gray-200 rounded animate-pulse" />
                </th>
              );
            }

            return (
              <td key={i} className="px-6 py-4">
                <div className="h-4 w-full max-w-[120px] bg-gray-200 rounded animate-pulse" />
              </td>
            );
          })}
        </tr>
      ))}
    </>
  );
}
