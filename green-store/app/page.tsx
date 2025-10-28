import Image from "next/image";

const kpis = [
  { label: "Doanh thu (Hôm nay)", value: "₫12,450", diff: "+8%" },
  { label: "Đơn hàng", value: "128", diff: "+3%" },
  { label: "Khách hàng mới", value: "34", diff: "-1%" },
  { label: "Tồn kho", value: "1,240", diff: "+5%" },
];

function MiniBar({ values = [4, 6, 8, 5, 7] }: { values?: number[] }) {
  const max = Math.max(...values);
  return (
    <div className="flex items-end gap-1 h-10">
      {values.map((v, i) => (
        <div key={i} className="bg-green-600" style={{ width: 6, height: `${(v / max) * 100}%`, borderRadius: 3 }} />
      ))}
    </div>
  );
}

export default function Home() {
  return (
    <div className="mx-auto p-6">
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Bảng thống kê</h1>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {kpis.map((k) => (
          <div key={k.label} className="bg-white p-4 rounded-lg shadow-sm flex flex-col justify-between">
            <div className="text-sm text-gray-500">{k.label}</div>
            <div className="mt-2 flex items-end justify-between">
              <div>
                <div className="text-2xl font-bold">{k.value}</div>
                <div className="text-xs text-green-600">{k.diff}</div>
              </div>
              <MiniBar />
            </div>
          </div>
        ))}
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-white p-4 rounded-lg shadow-sm">
          <h2 className="text-lg font-medium mb-4">Doanh thu theo ngày</h2>
          <div className="w-full h-48 bg-gradient-to-b from-white to-green-50 rounded p-4 flex items-center justify-center">
            {/* Placeholder chart - a simple SVG sparkline */}
            <svg width="100%" height="80" viewBox="0 0 200 80" preserveAspectRatio="none">
              <polyline fill="none" stroke="#16a34a" strokeWidth="3" points="0,60 25,50 50,30 75,40 100,20 125,30 150,10 175,20 200,15" />
            </svg>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h2 className="text-lg font-medium mb-4">Top sản phẩm bán chạy</h2>
          <ul className="space-y-3">
            <li className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center">🍏</div>
                <div>
                  <div className="font-medium">Táo xanh</div>
                  <div className="text-xs text-gray-500">120 bán</div>
                </div>
              </div>
              <div className="text-sm text-gray-600">₫1,200</div>
            </li>
            <li className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center">🥦</div>
                <div>
                  <div className="font-medium">Rau củ</div>
                  <div className="text-xs text-gray-500">98 bán</div>
                </div>
              </div>
              <div className="text-sm text-gray-600">₫850</div>
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
}
