"use client";

import { useEffect, useMemo, useState } from "react";
import { nutritionistAvailabilityService } from "@/services/nutritionist/nutritionistAvailability.service";

/* -------------------- Types -------------------- */

type Day =
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday"
  | "Sunday";

type TimeRange = {
  id: string;
  start: string; // "09:00"
  end: string; // "10:30"
};

type WeeklyMap = Record<Day, TimeRange[]>;

type SpecialDay = {
  id: string;
  date: string; // "2025-12-04"
  ranges: TimeRange[]; // custom ranges for that date
  blocked?: boolean; // full day blocked
};

/* -------------------- Constants & Helpers -------------------- */

const DAYS: Day[] = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const DEFAULT_WEEKLY: WeeklyMap = DAYS.reduce((acc, d) => ({ ...acc, [d]: [] }), {} as WeeklyMap);

function toMinutes(t: string) {
  const [hh = "0", mm = "0"] = t.split(":");
  return parseInt(hh, 10) * 60 + parseInt(mm, 10);
}
function minutesToHHMM(m: number) {
  const hh = Math.floor(m / 60)
    .toString()
    .padStart(2, "0");
  const mm = (m % 60).toString().padStart(2, "0");
  return `${hh}:${mm}`;
}
function uuid() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  return Math.random().toString(36).slice(2, 9);
}
function rangesOverlap(a: TimeRange, b: TimeRange) {
  return toMinutes(a.start) < toMinutes(b.end) && toMinutes(b.start) < toMinutes(a.end);
}

/* -------------------- Main Component -------------------- */

export default function AvailabilityPage() {
  /* UI Tabs */
  const [tab, setTab] = useState<"weekly" | "date">("weekly");

  /* Weekly state */
  const [weeklyMap, setWeeklyMap] = useState<WeeklyMap>(DEFAULT_WEEKLY);

  /* Special dates state */
  const [specialDays, setSpecialDays] = useState<SpecialDay[]>([]);

  /* Shared form state for adding ranges */
  const [activeDay, setActiveDay] = useState<Day | "special" | null>(null);
  const [activeSpecialId, setActiveSpecialId] = useState<string | null>(null); // editing special range
  const [start, setStart] = useState("09:00");
  const [end, setEnd] = useState("10:00");

  /* Consultation duration (minutes) — custom numeric */
  const [consultDuration, setConsultDuration] = useState<number | "">(30);

  /* Loading / saving / toasts */
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  /* Editing ids */
  const [editingId, setEditingId] = useState<string | null>(null); // for weekly
  const [specialEditingRangeId, setSpecialEditingRangeId] = useState<string | null>(null); // for special ranges

  useEffect(() => {
    let t = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(t);
  }, [toast]);

  /* ------------- fetch current availability ------------- */
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        // Backend should return: { weekly: { Monday: [{id,start,end}, ...], ... }, special: [{id,date,ranges,blocked}] }
        const res = await nutritionistAvailabilityService.getAvailability()
        const payload = res.data;
        if (payload?.weekly) setWeeklyMap(payload.weekly);
        if (payload?.special) setSpecialDays(payload.special);
        if (payload?.consultDuration) setConsultDuration(payload.consultDuration);
      } catch (err) {
        console.error("Failed to load availability", err);
        setToast({ type: "err", text: "Failed to load availability" });
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  /* ------------- validation helpers ------------- */

  function validateRange(startTime: string, endTime: string) {
    if (!startTime || !endTime) return "Start & end times are required.";
    if (toMinutes(startTime) >= toMinutes(endTime)) return "Start must be before end.";
    return null;
  }

  function validateConsultDuration(value: number | "") {
    if (value === "") return "Consultation duration is required.";
    if (typeof value !== "number" || isNaN(value)) return "Duration must be a number.";
    if (value < 10 || value > 180) return "Duration must be between 10 and 180 minutes.";
    return null;
  }

  /* ------------- weekly add/edit/delete ------------- */

  function addOrUpdateWeekly(day: Day) {
    setToast(null);
    const err = validateRange(start, end);
    if (err) return setToast({ type: "err", text: err });

    const existing = weeklyMap[day] || [];
    const newRange: TimeRange = { id: editingId ?? uuid(), start, end };

    const check = editingId ? existing.filter((r) => r.id !== editingId) : existing;
    if (check.some((r) => rangesOverlap(r, newRange))) {
      return setToast({ type: "err", text: "Overlaps existing slot(s) for this day." });
    }

    const updated = editingId ? existing.map((r) => (r.id === editingId ? newRange : r)) : [...existing, newRange];
    updated.sort((a, b) => toMinutes(a.start) - toMinutes(b.start));

    setWeeklyMap((prev) => ({ ...prev, [day]: updated }));
    clearEditor();
    setToast({ type: "ok", text: "Slot saved." });
  }

  function deleteWeekly(day: Day, id: string) {
    setWeeklyMap((prev) => ({ ...prev, [day]: prev[day].filter((r) => r.id !== id) }));
    if (editingId === id) clearEditor();
    setToast({ type: "ok", text: "Slot removed." });
  }

  function startEditWeekly(day: Day, range: TimeRange) {
    setActiveDay(day);
    setStart(range.start);
    setEnd(range.end);
    setEditingId(range.id);
  }

  /* ------------- special date management ------------- */

  function createSpecialDate(date: string) {
    const d = specialDays.find((s) => s.date === date);
    if (d) {
      setToast({ type: "err", text: "Special date already exists. Edit it below." });
      return;
    }
    const newSpecial: SpecialDay = { id: uuid(), date, ranges: [], blocked: false };
    setSpecialDays((prev) => [newSpecial, ...prev]);
    setTab("date");
    setToast({ type: "ok", text: "Special date added. Add ranges or block the day." });
  }

  function addOrUpdateSpecialRange(specialId: string) {
    setToast(null);
    const err = validateRange(start, end);
    if (err) return setToast({ type: "err", text: err });

    setSpecialDays((prev) =>
      prev.map((s) => {
        if (s.id !== specialId) return s;
        const existing = s.ranges || [];
        const newRange: TimeRange = { id: specialEditingRangeId ?? uuid(), start, end };

        const check = specialEditingRangeId ? existing.filter((r) => r.id !== specialEditingRangeId) : existing;
        if (check.some((r) => rangesOverlap(r, newRange))) {
          setToast({ type: "err", text: "Overlaps existing slot(s) for this date." });
          return s;
        }

        const updated = specialEditingRangeId ? existing.map((r) => (r.id === specialEditingRangeId ? newRange : r)) : [...existing, newRange];
        updated.sort((a, b) => toMinutes(a.start) - toMinutes(b.start));
        setToast({ type: "ok", text: "Special slot saved." });
        return { ...s, ranges: updated };
      }),
    );

    clearEditor();
  }

  function deleteSpecialRange(specialId: string, rangeId: string) {
    setSpecialDays((prev) => prev.map((s) => (s.id === specialId ? { ...s, ranges: s.ranges.filter((r) => r.id !== rangeId) } : s)));
    if (specialEditingRangeId === rangeId) clearEditor();
    setToast({ type: "ok", text: "Special slot removed." });
  }

  function toggleBlockSpecial(specialId: string) {
    setSpecialDays((prev) => prev.map((s) => (s.id === specialId ? { ...s, blocked: !s.blocked } : s)));
    setToast({ type: "ok", text: "Special date updated." });
  }

  function deleteSpecialDate(specialId: string) {
    if (!confirm("Delete this special date?")) return;
    setSpecialDays((prev) => prev.filter((s) => s.id !== specialId));
    setToast({ type: "ok", text: "Special date removed." });
  }

  function startEditSpecialRange(specialId: string, range: TimeRange) {
    setActiveDay("special");
    setActiveSpecialId(specialId);
    setStart(range.start);
    setEnd(range.end);
    setSpecialEditingRangeId(range.id);
  }

  /* ------------- utility ------------- */

  function clearEditor() {
    setActiveDay(null);
    setEditingId(null);
    setSpecialEditingRangeId(null);
    setActiveSpecialId(null);
    setStart("09:00");
    setEnd("10:00");
  }

  /* Generate slots for preview from weekly + duration */
  const generatedSlotsPreview = useMemo(() => {
    const durValidation = validateConsultDuration(consultDuration);
    if (durValidation) return null;
    const dur = Number(consultDuration);

    const out: Record<string, string[]> = {};
    for (const d of DAYS) {
      out[d] = (weeklyMap[d] || []).flatMap((r) => {
        const startMin = toMinutes(r.start);
        const endMin = toMinutes(r.end);
        const slots: string[] = [];
        for (let t = startMin; t + dur <= endMin; t += dur) {
          slots.push(`${minutesToHHMM(t)} - ${minutesToHHMM(t + dur)}`);
        }
        return slots;
      });
    }
    return out;
  }, [weeklyMap, consultDuration]);

  /* ------------- Save all to backend ------------- */
  /* Helper to generate slots from ranges */
function generateSlots(ranges: TimeRange[], duration: number) {
  const slots: { start: string; end: string }[] = [];
  ranges.forEach((r) => {
    let startMin = toMinutes(r.start);
    const endMin = toMinutes(r.end);
    while (startMin + duration <= endMin) {
      slots.push({
        start: minutesToHHMM(startMin),
        end: minutesToHHMM(startMin + duration),
      });
      startMin += duration;
    }
  });
  return slots;
}

async function saveAll() {
  setToast(null);
  const durErr = validateConsultDuration(consultDuration);
  if (durErr) return setToast({ type: "err", text: durErr });

  setSaving(true);
  try {
    const dur = Number(consultDuration);

    // Convert weeklyMap to slot-level ranges
    const weeklySlots = DAYS.reduce((acc, day) => {
      acc[day] = generateSlots(weeklyMap[day], dur);
      return acc;
    }, {} as Record<Day, { start: string; end: string }[]>);

    // Convert specialDays to slot-level ranges
    const specialSlots = specialDays.map((s) => ({
      ...s,
      ranges: generateSlots(s.ranges, dur),
    }));

    const payload = {
      weekly: weeklySlots,
      special: specialSlots,
      consultDuration: dur,
    };

    console.log("Saving payload:", payload);

    await nutritionistAvailabilityService.saveAvailability(payload);
    setToast({ type: "ok", text: "Availability saved successfully." });
  } catch (err) {
    console.error(err);
    setToast({ type: "err", text: "Failed to save availability." });
  } finally {
    setSaving(false);
  }
}


  /* ------------- Render ------------- */

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="text-center">
          <div className="animate-pulse mb-3 text-slate-500">Loading availability…</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
  <div className="max-w-7xl mx-auto">
    {/* Header */}
    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Availability — Nutritionist Panel</h1>
        <p className="mt-1 text-sm text-gray-500 max-w-xl">
          Configure weekly recurring slots and special dates. Consultation Duration is used to generate bookable slots automatically.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded border">
          <label className="text-xs text-gray-500">Consultation Duration (mins)</label>
          <input
            type="number"
            min={10}
            max={180}
            value={consultDuration}
            onChange={(e) => setConsultDuration(e.target.value === "" ? "" : Number(e.target.value))}
            className="w-20 border-gray-300 rounded px-2 py-1 text-sm outline-none"
          />
        </div>
        <button
          onClick={saveAll}
          disabled={saving}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded shadow disabled:opacity-50 text-sm font-medium"
        >
          {saving ? "Saving..." : "Save All"}
        </button>
      </div>
    </div>

    {/* Tabs */}
    <div className="bg-white rounded-xl border p-3 mb-6 flex gap-3">
      <button
        onClick={() => setTab("weekly")}
        className={`px-4 py-2 rounded font-medium text-sm ${tab === "weekly" ? "bg-indigo-600 text-white" : "text-gray-600 hover:bg-gray-50"}`}
      >
        Weekly Availability
      </button>
      <button
        onClick={() => setTab("date")}
        className={`px-4 py-2 rounded font-medium text-sm ${tab === "date" ? "bg-indigo-600 text-white" : "text-gray-600 hover:bg-gray-50"}`}
      >
        Specific Dates
      </button>
    </div>

    <div className="grid lg:grid-cols-3 gap-6">
      {/* Left: Weekly / Special */}
      <div className="lg:col-span-2 flex flex-col gap-4">
        {tab === "weekly" && DAYS.map((day) => (
          <div key={day} className="bg-white border rounded-xl p-4 shadow-sm">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold text-gray-800">{day}</h3>
              <div className="flex gap-2">
                <button
                  className="text-xs px-3 py-1 border rounded text-red-600 hover:bg-red-50"
                  onClick={() => {
                    if (!confirm(`Clear all slots for ${day}?`)) return;
                    setWeeklyMap((prev) => ({ ...prev, [day]: [] }));
                  }}
                >
                  Clear
                </button>
                <button
                  className="text-xs px-3 py-1 border rounded hover:bg-gray-50"
                  onClick={() => { setActiveDay(day); setEditingId(null); setStart("09:00"); setEnd("10:00"); }}
                >
                  Add Slot
                </button>
              </div>
            </div>

            {weeklyMap[day].length === 0 ? (
              <div className="text-sm text-gray-400">No slots added for {day}.</div>
            ) : (
              weeklyMap[day].map((r) => (
                <div key={r.id} className="flex justify-between items-center p-2 border rounded mb-2">
                  <div>
                    <div className="font-medium text-gray-700">{r.start} — {r.end}</div>
                    <div className="text-xs text-gray-500">{toMinutes(r.end) - toMinutes(r.start)} mins</div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => startEditWeekly(day, r)} className="text-xs px-2 py-1 border rounded hover:bg-gray-50">Edit</button>
                    <button onClick={() => deleteWeekly(day, r.id)} className="text-xs px-2 py-1 border rounded text-red-600 hover:bg-red-50">Delete</button>
                  </div>
                </div>
              ))
            )}
          </div>
        ))}

        {tab === "date" && (
          <div className="flex flex-col gap-4">
            {/* Add Special Date */}
            <div className="bg-white border rounded-xl p-4 shadow-sm flex flex-col sm:flex-row sm:items-center gap-3">
              <input type="date" id="specialDate" className="border rounded px-3 py-2" />
              <button
                className="bg-indigo-600 text-white px-3 py-2 rounded hover:bg-indigo-700 text-sm font-medium"
                onClick={() => {
                  const el = document.getElementById("specialDate") as HTMLInputElement | null;
                  const date = el?.value;
                  if (!date) return setToast({ type: "err", text: "Select a date first." });
                  if (new Date(date) < new Date(new Date().toDateString())) return setToast({ type: "err", text: "Date must be in future." });
                  createSpecialDate(date);
                }}
              >
                Add Specific Date
              </button>
              <p className="text-xs text-gray-500 mt-2 sm:mt-0">Special dates allow one-off slots or blocking a day.</p>
            </div>

            {/* Special Dates */}
            {specialDays.length === 0 ? (
              <div className="bg-white border rounded-xl p-4 shadow-sm text-gray-500">No special dates. Add one above.</div>
            ) : (
              specialDays.map((s) => (
                <div key={s.id} className="bg-white border rounded-xl p-4 shadow-sm">
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <div className="font-medium text-gray-800">{new Date(s.date).toDateString()}</div>
                      <div className="text-xs text-gray-500">{s.blocked ? "Blocked" : `${s.ranges.length} custom range(s)`}</div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => toggleBlockSpecial(s.id)} className={`text-xs px-2 py-1 border rounded ${s.blocked ? "bg-red-50 text-red-600" : "hover:bg-gray-50"}`}>
                        {s.blocked ? "Unblock" : "Block Day"}
                      </button>
                      <button onClick={() => deleteSpecialDate(s.id)} className="text-xs px-2 py-1 border rounded text-red-600 hover:bg-red-50">
                        Remove
                      </button>
                    </div>
                  </div>

                  {!s.blocked && (
                    <>
                      {s.ranges.length === 0 ? (
                        <div className="text-sm text-gray-400">No ranges. Add below.</div>
                      ) : (
                        s.ranges.map((r) => (
                          <div key={r.id} className="flex justify-between items-center p-2 border rounded mb-2">
                            <div>
                              <div className="font-medium text-gray-700">{r.start} — {r.end}</div>
                              <div className="text-xs text-gray-500">{toMinutes(r.end) - toMinutes(r.start)} mins</div>
                            </div>
                            <div className="flex gap-2">
                              <button onClick={() => startEditSpecialRange(s.id, r)} className="text-xs px-2 py-1 border rounded hover:bg-gray-50">Edit</button>
                              <button onClick={() => deleteSpecialRange(s.id, r.id)} className="text-xs px-2 py-1 border rounded text-red-600 hover:bg-red-50">Delete</button>
                            </div>
                          </div>
                        ))
                      )}

                      <div className="mt-3 grid grid-cols-2 gap-2">
                        <input type="time" value={activeDay === "special" && activeSpecialId === s.id ? start : undefined} onChange={(e) => { setActiveDay("special"); setActiveSpecialId(s.id); setStart(e.target.value); }} className="border rounded px-3 py-2" />
                        <input type="time" value={activeDay === "special" && activeSpecialId === s.id ? end : undefined} onChange={(e) => { setActiveDay("special"); setActiveSpecialId(s.id); setEnd(e.target.value); }} className="border rounded px-3 py-2" />
                        <button className="col-span-2 bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded font-medium" onClick={() => addOrUpdateSpecialRange(s.id)}>
                          {specialEditingRangeId ? "Save Range" : "Add Range"}
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Right: Editor + Preview */}
      <aside className="flex flex-col gap-4">
        <div className="bg-white border rounded-xl p-4 shadow-sm sticky top-6">
          <h4 className="font-semibold mb-2">Slot Editor</h4>
          <p className="text-xs text-gray-500 mb-2">Add or edit ranges for weekly or special dates.</p>

          <label className="text-xs text-gray-600">Target</label>
          <select value={activeDay ?? ""} onChange={(e) => { const v = e.target.value; setActiveDay(v === "special" ? "special" : (v as Day)); }} className="w-full border rounded px-3 py-2 mb-3 text-sm">
            <option value="">Select day or special date</option>
            {DAYS.map(d => <option key={d} value={d}>{d}</option>)}
            <option value="special">Special date (use tab)</option>
          </select>

          <div className="grid grid-cols-2 gap-2 mb-3">
            <div>
              <label className="text-xs text-gray-600">Start</label>
              <input type="time" value={start} onChange={(e) => setStart(e.target.value)} className="w-full border rounded px-3 py-2" />
            </div>
            <div>
              <label className="text-xs text-gray-600">End</label>
              <input type="time" value={end} onChange={(e) => setEnd(e.target.value)} className="w-full border rounded px-3 py-2" />
            </div>
          </div>

          <div className="flex gap-2">
            <button onClick={() => {
              if (activeDay === "special") {
                if (!activeSpecialId) return setToast({ type: "err", text: "Select a special date first from the tab." });
                addOrUpdateSpecialRange(activeSpecialId);
              } else if (activeDay) {
                addOrUpdateWeekly(activeDay as Day);
              } else {
                setToast({ type: "err", text: "Pick a target (weekday or special date) to add/edit." });
              }
            }} className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded font-medium">{(editingId || specialEditingRangeId) ? "Save" : "Add"}</button>
            <button onClick={clearEditor} className="px-3 py-2 border rounded text-sm">Reset</button>
          </div>
        </div>

        <div className="bg-white border rounded-xl p-4 shadow-sm">
          <h4 className="font-semibold mb-2">Preview Generated Slots</h4>
          <p className="text-xs text-gray-500 mb-2">Slots auto-generated using consultation duration.</p>
          <div className="max-h-80 overflow-auto space-y-3">
            {DAYS.map(d => (
              <div key={d}>
                <div className="flex justify-between items-center mb-1">
                  <div className="font-medium text-gray-700">{d}</div>
                  <div className="text-xs text-gray-500">{generatedSlotsPreview?.[d]?.length || 0} slots</div>
                </div>
                {generatedSlotsPreview?.[d]?.length ? (
                  <div className="flex flex-wrap gap-2">
                    {generatedSlotsPreview[d].map((s, i) => <div key={i} className="px-2 py-1 rounded border text-xs">{s}</div>)}
                  </div>
                ) : (
                  <div className="text-xs text-gray-400">— no slots</div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border rounded-xl p-4 shadow-sm">
          <h4 className="font-semibold mb-2">Tips</h4>
          <ul className="text-sm text-gray-500 list-disc ml-4 space-y-1">
            <li>Use Consultation Duration for slot generation (common: 15, 30, 45, 60).</li>
            <li>Special dates override weekly availability for that date.</li>
            <li>Booked slots are stored separately and won't be overwritten by changes here.</li>
          </ul>
        </div>
      </aside>
    </div>

    {/* Toast */}
    {toast && (
      <div className={`fixed right-6 bottom-6 px-4 py-3 rounded shadow ${toast.type === "ok" ? "bg-emerald-600 text-white" : "bg-red-600 text-white"}`}>
        {toast.text}
      </div>
    )}
  </div>
</div>

  );
}
