const resources = [
  { id: 1, title: "Meal Prep Guide", description: "Weekly meal planning PDF", type: "PDF", size: "2.4 MB" },
  { id: 2, title: "HIIT Workout Plan", description: "4-week beginner program", type: "PDF", size: "1.1 MB" },
  { id: 3, title: "Calorie Calculator", description: "Interactive spreadsheet", type: "XLSX", size: "340 KB" },
  { id: 4, title: "Sleep Tracking Template", description: "30-day sleep journal", type: "PDF", size: "890 KB" },
];

const typeColors: Record<string, string> = {
  PDF: "bg-red-50 text-red-600 border-red-200",
  XLSX: "bg-green-50 text-green-600 border-green-200",
};

export default function ResourcesPage({ preview = false }: { preview?: boolean }) {
  const items = preview ? resources.slice(0, 2) : resources;

  return (
    <section>
      <h2 className="text-xl font-semibold mb-4">Resources</h2>
      <div className="grid md:grid-cols-2 gap-4">
        {items.map((r) => (
          <div key={r.id} className="p-5 rounded-2xl border bg-white hover:shadow-md transition">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold">{r.title}</h3>
                <p className="text-sm text-gray-500 mt-1">{r.description}</p>
                <p className="text-xs text-gray-400 mt-1">{r.size}</p>
              </div>
              <span className={`text-xs px-2 py-1 rounded-md border font-medium ${typeColors[r.type]}`}>
                {r.type}
              </span>
            </div>
            <button className="mt-4 text-sm px-4 py-1 rounded-full bg-black text-white hover:bg-gray-800 transition">
              Download
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}