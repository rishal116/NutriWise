"use client";

import { useState } from "react";

const posts = [
  { id: 1, title: "5 Tips for a Balanced Diet", excerpt: "Start with small habits and stay consistent. The key is not perfection...", likes: 120, comments: 30, author: "Priya M.", time: "2h ago" },
  { id: 2, title: "Why Sleep is Your Best Workout", excerpt: "Recovery happens while you rest. Most people underestimate its impact on...", likes: 88, comments: 14, author: "Tom K.", time: "5h ago" },
  { id: 3, title: "How I lost 10kg without a gym", excerpt: "Walking, cooking at home, and tracking water intake changed everything for...", likes: 203, comments: 47, author: "Anika R.", time: "1d ago" },
  { id: 4, title: "The truth about protein supplements", excerpt: "Most people don't need them if they eat whole foods consistently throughout...", likes: 67, comments: 22, author: "Dr. Sam L.", time: "2d ago" },
];

export default function PostsPage({ preview = false }: { preview?: boolean }) {
  const items = preview ? posts.slice(0, 2) : posts;
  const [liked, setLiked] = useState<number[]>([]);

  return (
    <section>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Posts</h2>
        {!preview && (
          <button className="text-sm px-4 py-2 rounded-full bg-black text-white hover:bg-gray-800 transition">
            + New Post
          </button>
        )}
      </div>
      <div className="space-y-4">
        {items.map((p) => (
          <div key={p.id} className="p-5 rounded-2xl border bg-white hover:shadow-md transition">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold">{p.title}</h3>
                <p className="text-sm text-gray-500 mt-2">{p.excerpt}</p>
              </div>
            </div>
            <div className="mt-4 flex justify-between items-center">
              <div className="text-sm text-gray-400 flex gap-4">
                <button
                  onClick={() =>
                    setLiked((prev) =>
                      prev.includes(p.id) ? prev.filter((x) => x !== p.id) : [...prev, p.id]
                    )
                  }
                  className={`transition ${liked.includes(p.id) ? "text-red-500" : ""}`}
                >
                  ❤️ {liked.includes(p.id) ? p.likes + 1 : p.likes}
                </button>
                <span>💬 {p.comments}</span>
              </div>
              <span className="text-xs text-gray-400">{p.author} · {p.time}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}