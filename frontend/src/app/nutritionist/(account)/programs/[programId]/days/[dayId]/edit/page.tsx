"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { programDayService } from "@/services/nutritionist/programDay.service";
import { 
  ArrowLeft, Utensils, Dumbbell, Droplets, 
  Plus, Trash2, Save, Sparkles, Loader2 
} from "lucide-react";

export default function EditProgramDayPage() {
  const params = useParams();
  const router = useRouter();
  const programId = params.programId as string;
  const dayId = params.dayId as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<any>({
    dayNumber: 1,
    meals: [],
    workouts: [],
    habits: []
  });

  useEffect(() => {
    if (dayId) fetchDay();
  }, [dayId]);

  const fetchDay = async () => {
    try {
      setLoading(true);
      const res = await programDayService.getProgramDayById(dayId);
      setFormData(res.data || res);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await programDayService.updateProgramDay(dayId, formData);
      router.push(`/nutritionist/programs/${programId}/days/${dayId}`);
    } catch (err) {
      console.error("Update error:", err);
    } finally {
      setSaving(false);
    }
  };

  // Dynamic Form Handlers
  const addItem = (type: 'meals' | 'workouts' | 'habits', newItem: any) => {
    setFormData({ ...formData, [type]: [...formData[type], newItem] });
  };

  const removeItem = (type: 'meals' | 'workouts' | 'habits', index: number) => {
    const updated = formData[type].filter((_: any, i: number) => i !== index);
    setFormData({ ...formData, [type]: updated });
  };

  const updateItem = (type: 'meals' | 'workouts' | 'habits', index: number, field: string, value: any) => {
    const updated = [...formData[type]];
    updated[index][field] = value;
    setFormData({ ...formData, [type]: updated });
  };

  if (loading) return <div className="p-20 text-center font-black text-slate-400 animate-pulse">Initializing Editor...</div>;

  return (
    <div className="max-w-4xl mx-auto pb-20">
      {/* Header Actions */}
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-4">
          <button onClick={() => router.back()} className="p-3 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 transition-all">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Edit Protocol <span className="text-emerald-600">Day {formData.dayNumber}</span></h1>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Client sync active</p>
          </div>
        </div>

        <button 
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-3 bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-4 rounded-2xl font-bold transition-all shadow-xl shadow-emerald-200 disabled:opacity-50"
        >
          {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
          <span>{saving ? "Updating..." : "Save Changes"}</span>
        </button>
      </div>

      <div className="space-y-8">
        {/* --- MEALS SECTION --- */}
        <SectionWrapper title="Nutrition Strategy" icon={<Utensils size={18} />} color="teal">
          <div className="space-y-4">
            {formData.meals.map((meal: any, idx: number) => (
              <div key={idx} className="p-6 bg-slate-50 border border-slate-100 rounded-[2rem] relative group">
                <button onClick={() => removeItem('meals', idx)} className="absolute top-4 right-4 p-2 text-slate-300 hover:text-red-500 transition-colors">
                  <Trash2 size={16} />
                </button>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input label="Meal Title" value={meal.title} onChange={(v) => updateItem('meals', idx, 'title', v)} placeholder="e.g. Avocado Toast" />
                  <Select  label="Meal Category" value={meal.mealType} onChange={(v) => updateItem('meals', idx, 'mealType', v)}
                  options={[
                    { label: "Breakfast", value: "breakfast" },
                    { label: "Lunch", value: "lunch" },
                    { label: "Dinner", value: "dinner" },
                    { label: "Snack", value: "snack" },
                ]}
                />
                  <Input label="Calories" type="number" value={meal.calories} onChange={(v) => updateItem('meals', idx, 'calories', parseInt(v))} />
                  <Input label="Description" value={meal.description} onChange={(v) => updateItem('meals', idx, 'description', v)} />
                </div>
              </div>
            ))}
            <AddButton label="Add Meal" onClick={() => addItem('meals', { title: '', mealType: 'snack', calories: 0, description: '' })} />
          </div>
        </SectionWrapper>

        {/* --- WORKOUT SECTION --- */}
        <SectionWrapper title="Training Protocol" icon={<Dumbbell size={18} />} color="emerald">
          <div className="space-y-4">
            {formData.workouts.map((work: any, idx: number) => (
              <div key={idx} className="p-6 bg-slate-900 rounded-[2rem] text-white relative">
                <button onClick={() => removeItem('workouts', idx)} className="absolute top-4 right-4 p-2 text-slate-500 hover:text-red-400">
                  <Trash2 size={16} />
                </button>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input dark label="Workout Title" value={work.title} onChange={(v) => updateItem('workouts', idx, 'title', v)} />
                  <Input dark label="Duration (min)" type="number" value={work.duration} onChange={(v) => updateItem('workouts', idx, 'duration', parseInt(v))} />
                  <div className="md:col-span-2">
                    <Input dark label="Instructions" value={work.instructions} onChange={(v) => updateItem('workouts', idx, 'instructions', v)} />
                  </div>
                </div>
              </div>
            ))}
            <AddButton label="Add Workout" onClick={() => addItem('workouts', { title: '', duration: 0, instructions: '' })} />
          </div>
        </SectionWrapper>

        {/* --- HABITS SECTION --- */}
        <SectionWrapper title="Daily Habits" icon={<Droplets size={18} />} color="blue">
           <div className="space-y-4">
            {formData.habits.map((habit: any, idx: number) => (
              <div key={idx} className="p-6 bg-white border border-slate-200 rounded-[2rem] flex items-end gap-4 relative">
                 <Input label="Habit Name" value={habit.title} onChange={(v) => updateItem('habits', idx, 'title', v)} />
                 <Input label="Goal" type="number" value={habit.targetValue} onChange={(v) => updateItem('habits', idx, 'targetValue', parseInt(v))} />
                 <Input label="Unit" value={habit.unit} onChange={(v) => updateItem('habits', idx, 'unit', v)} />
                 <button onClick={() => removeItem('habits', idx)} className="p-3 mb-1 text-red-400 hover:bg-red-50 rounded-xl transition-colors">
                  <Trash2 size={20} />
                </button>
              </div>
            ))}
            <AddButton label="Add Habit" onClick={() => addItem('habits', { title: '', targetValue: 0, unit: 'Liters' })} />
          </div>
        </SectionWrapper>
      </div>
    </div>
  );
}

// --- SUB-COMPONENTS ---

function SectionWrapper({ children, title, icon, color }: any) {
  const colors: any = { teal: "text-teal-600 bg-teal-50", emerald: "text-emerald-600 bg-emerald-50", blue: "text-blue-600 bg-blue-50" };
  return (
    <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm">
      <div className="flex items-center gap-3 mb-8">
        <div className={`p-2.5 rounded-xl ${colors[color]}`}>{icon}</div>
        <h2 className="text-xl font-black text-slate-800 tracking-tight">{title}</h2>
      </div>
      {children}
    </div>
  );
}

function Input({ label, value, onChange, type = "text", placeholder, dark = false }: any) {
  return (
    <div className="space-y-1.5 flex-1">
      <label className={`text-[10px] font-black uppercase tracking-widest ${dark ? 'text-slate-500' : 'text-slate-400'} ml-1`}>{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full px-5 py-3 rounded-2xl border font-bold text-sm transition-all outline-none 
          ${dark 
            ? 'bg-slate-800 border-slate-700 text-white focus:border-emerald-500' 
            : 'bg-white border-slate-100 text-slate-700 focus:border-emerald-200 focus:ring-4 focus:ring-emerald-500/5'}`}
      />
    </div>
  );
}

function AddButton({ label, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className="w-full py-4 border-2 border-dashed border-slate-100 rounded-[2rem] text-slate-400 font-bold text-xs uppercase tracking-widest hover:border-emerald-200 hover:text-emerald-600 hover:bg-emerald-50/30 transition-all flex items-center justify-center gap-2"
    >
      <Plus size={16} strokeWidth={3} />
      {label}
    </button>
  );
}

function Select({ label, value, onChange, options }: any) {
  return (
    <div className="space-y-1.5 flex-1">
      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
        {label}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-5 py-3 rounded-2xl border border-slate-100 bg-white text-slate-700 font-bold text-sm transition-all outline-none appearance-none focus:border-emerald-200 focus:ring-4 focus:ring-emerald-500/5 cursor-pointer"
        >
          {options.map((opt: any) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {/* Custom Chevron for the Select */}
        <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-slate-400">
          <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
            <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>
    </div>
  );
}