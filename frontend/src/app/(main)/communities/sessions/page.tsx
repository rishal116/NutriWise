"use client";

const sessions = [
  { id: 1, title: "Nutrition Basics", date: "Apr 15", time: "6:00 PM", host: "Dr. Sarah Kim", spots: 12, enrolled: false },
  { id: 2, title: "Stress & Sleep", date: "Apr 18", time: "7:30 PM", host: "James Lee", spots: 5, enrolled: true },
  { id: 3, title: "Gut Health 101", date: "Apr 22", time: "5:00 PM", host: "Dr. Aisha Patel", spots: 20, enrolled: false },
  { id: 4, title: "HIIT for Beginners", date: "Apr 25", time: "8:00 AM", host: "Marcus Webb", spots: 0, enrolled: false },
];

export default function SessionsPage({ preview = false }: { preview?: boolean }) {
  const items = preview ? sessions.slice(0, 2) : sessions;

  return (
    <section>
      <h2 className="text-xl font-semibold mb-4">Sessions</h2>
      <div className="space-y-4">
        {items.map((s) => (
          <div key={s.id} className="p-5 rounded-2xl border bg-white flex justify-between items-center hover:shadow-md transition">
            <div>
              <h3 className="font-semibold">{s.title}</h3>
              <p className="text-sm text-gray-500">{s.date} · {s.time} · {s.host}</p>
              <p className="text-xs text-gray-400 mt-1">
                {s.spots === 0 ? "Full" : `${s.spots} spots left`}
              </p>
            </div>
            {s.enrolled ? (
              <span className="text-sm px-4 py-1 rounded-full bg-green-50 text-green-600 border border-green-200">
                Enrolled
              </span>
            ) : s.spots === 0 ? (
              <button disabled className="text-sm px-4 py-1 rounded-full bg-gray-100 text-gray-400 cursor-not-allowed">
                Full
              </button>
            ) : (
              <button className="text-sm px-4 py-1 rounded-full bg-green-500 text-white hover:bg-green-600 transition">
                Enroll
              </button>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}