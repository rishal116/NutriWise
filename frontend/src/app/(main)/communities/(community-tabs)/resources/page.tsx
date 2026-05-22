"use client";

import { FileText, Download, ArrowRight, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const resources = [
  { id: 1, title: "Meal Prep Guide", description: "Master the art of weekly meal planning with our comprehensive PDF guide.", type: "PDF", size: "2.4 MB" },
  { id: 2, title: "HIIT Workout Plan", description: "A high-intensity 4-week beginner program designed by expert trainers.", type: "PDF", size: "1.1 MB" },
  { id: 3, title: "Calorie Calculator", description: "Track your intake and expenditure with this advanced interactive spreadsheet.", type: "XLSX", size: "340 KB" },
  { id: 4, title: "Sleep Tracking Template", description: "Optimize your recovery with our 30-day guided sleep journal.", type: "PDF", size: "890 KB" },
];

const typeColors: Record<string, string> = {
  PDF: "bg-rose-50 text-rose-600 border-rose-100",
  XLSX: "bg-emerald-50 text-emerald-600 border-emerald-100",
};

export default function ResourcesPage({ preview = false }: { preview?: boolean }) {
  const items = preview ? resources.slice(0, 3) : resources;

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      {!preview && (
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Health Resources</h2>
            <p className="text-gray-500 mt-1">Exclusive guides and templates to accelerate your health journey.</p>
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            Premium Content
          </div>
        </div>
      )}

      {/* Grid */}
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-2"
      >
        <AnimatePresence mode="popLayout">
          {items.map((r) => (
            <motion.div
              key={r.id}
              variants={item}
              layout
              className="group relative flex flex-col justify-between p-6 rounded-3xl bg-white border border-gray-100 shadow-sm hover:shadow-2xl hover:border-emerald-200 transition-all duration-500 overflow-hidden"
            >
              {/* Background Glow */}
              <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-emerald-50 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-emerald-50 group-hover:text-emerald-500 transition-all duration-300">
                    <FileText className="w-6 h-6" />
                  </div>
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-lg border shadow-sm ${typeColors[r.type]}`}>
                    {r.type}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-gray-900 group-hover:text-emerald-700 transition-colors">
                  {r.title}
                </h3>
                <p className="text-sm text-gray-500 mt-2 leading-relaxed">
                  {r.description}
                </p>
                <div className="mt-4 flex items-center gap-2 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                  <span>File Size: {r.size}</span>
                </div>
              </div>

              <div className="mt-6 pt-5 border-t border-gray-50 flex items-center justify-between relative z-10">
                <button className="group/btn flex items-center gap-2 text-sm font-bold text-gray-600 hover:text-emerald-600 transition-colors">
                  Preview Document <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </button>

                <button className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gray-900 text-white text-xs font-bold hover:bg-emerald-600 hover:shadow-lg hover:shadow-emerald-200 transition-all duration-300 active:scale-95 shadow-md">
                  <Download className="w-4 h-4" />
                  Download
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Footer Note */}
      {!preview && (
        <div className="text-center py-8">
          <p className="text-sm text-gray-400">
            Need more specific guides? <button className="text-emerald-600 font-bold hover:underline">Request a resource</button>
          </p>
        </div>
      )}
    </div>
  );
}