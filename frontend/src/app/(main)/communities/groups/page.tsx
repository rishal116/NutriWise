"use client";

const groups = [
  { id: 1, name: "Healthy Eating", description: "Discuss healthy lifestyle habits", members: "1.2k", joined: false },
  { id: 2, name: "Morning Runners", description: "Daily running tips and motivation", members: "890", joined: true },
  { id: 3, name: "Mindful Living", description: "Meditation and stress reduction", members: "2.1k", joined: false },
  { id: 4, name: "Meal Preppers", description: "Weekly meal planning strategies", members: "540", joined: false },
  { id: 5, name: "Sleep Science", description: "Optimize your rest and recovery", members: "310", joined: false },
  { id: 6, name: "Strength Training", description: "Weightlifting and muscle building", members: "1.8k", joined: true },
];

export default function GroupsPage({ preview = false }: { preview?: boolean }) {
  const items = preview ? groups.slice(0, 2) : groups;

  return (
    <section>
      <h2 className="text-xl font-semibold mb-4">Groups</h2>
      <div className="grid md:grid-cols-2 gap-4">
        {items.map((g) => (
          <div key={g.id} className="p-5 rounded-2xl border bg-white hover:shadow-md transition">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-lg">{g.name}</h3>
                <p className="text-sm text-gray-500 mt-1">{g.description}</p>
              </div>
              {g.joined && (
                <span className="text-xs px-2 py-1 rounded-full bg-green-50 text-green-600 border border-green-200">
                  Joined
                </span>
              )}
            </div>
            <div className="flex justify-between items-center mt-4">
              <span className="text-xs text-gray-400">👥 {g.members} members</span>
              {!g.joined ? (
                <button className="text-sm px-4 py-1 rounded-full border border-green-500 text-green-600 hover:bg-green-500 hover:text-white transition">
                  Join
                </button>
              ) : (
                <button className="text-sm px-4 py-1 rounded-full border border-gray-300 text-gray-500 hover:bg-gray-100 transition">
                  Leave
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}