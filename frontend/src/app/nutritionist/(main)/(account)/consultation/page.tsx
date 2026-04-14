"use client";
import { useState } from "react";

const specializationsList = [
  "Weight Management",
  "Sports Nutrition",
  "Pediatric Nutrition",
  "Diabetes Management",
  "General Wellness",
];

export default function ConsultationSettingsPage() {
  const [consultationFee, setConsultationFee] = useState("0.00");
  const [consultationDuration, setConsultationDuration] = useState("30");
  const [selectedSpecializations, setSelectedSpecializations] = useState<string[]>([]);
  const [allowGroupConsultation, setAllowGroupConsultation] = useState(false);
  const [firstConsultationFree, setFirstConsultationFree] = useState(false);

  const handleSpecializationToggle = (spec: string) => {
    setSelectedSpecializations(prev =>
      prev.includes(spec)
        ? prev.filter(s => s !== spec)
        : [...prev, spec]
    );
  };

  const handleSave = () => {
    // You can call your backend API here
    console.log({
      consultationFee,
      consultationDuration,
      selectedSpecializations,
      allowGroupConsultation,
      firstConsultationFree,
    });
    alert("Settings saved successfully!");
  };

  const handleReset = () => {
    setConsultationFee("0.00");
    setConsultationDuration("30");
    setSelectedSpecializations([]);
    setAllowGroupConsultation(false);
    setFirstConsultationFree(false);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Consultation Settings</h1>

      {/* Consultation Fee */}
      <div className="mb-6">
        <label className="block font-semibold mb-2">Amount per Video Call</label>
        <input
          type="number"
          min="0"
          value={consultationFee}
          onChange={e => setConsultationFee(e.target.value)}
          className="w-40 p-2 border rounded"
        />
      </div>

      {/* Consultation Duration */}
      <div className="mb-6">
        <label className="block font-semibold mb-2">Consultation Duration</label>
        <div className="flex gap-2">
          {["30", "45", "60"].map(duration => (
            <button
              key={duration}
              className={`px-4 py-2 rounded border ${
                consultationDuration === duration
                  ? "bg-emerald-600 text-white"
                  : "bg-gray-100 text-gray-700"
              }`}
              onClick={() => setConsultationDuration(duration)}
            >
              {duration} min
            </button>
          ))}
          <button
            className={`px-4 py-2 rounded border ${
              consultationDuration === "custom"
                ? "bg-emerald-600 text-white"
                : "bg-gray-100 text-gray-700"
            }`}
            onClick={() => setConsultationDuration("custom")}
          >
            Custom
          </button>
        </div>
      </div>

      {/* Specializations */}
      <div className="mb-6">
        <label className="block font-semibold mb-2">Specialization</label>
        <div className="flex flex-wrap gap-2">
          {specializationsList.map(spec => (
            <button
              key={spec}
              onClick={() => handleSpecializationToggle(spec)}
              className={`px-3 py-1 rounded border ${
                selectedSpecializations.includes(spec)
                  ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                  : "bg-gray-100 text-gray-700 border-gray-300"
              }`}
            >
              {spec}
            </button>
          ))}
        </div>
      </div>

      {/* Additional Options */}
      <div className="mb-6">
        <label className="block font-semibold mb-2">Additional Options</label>
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span>Allow Group Consultations</span>
            <input
              type="checkbox"
              checked={allowGroupConsultation}
              onChange={() => setAllowGroupConsultation(!allowGroupConsultation)}
              className="h-5 w-5"
            />
          </div>
          <div className="flex items-center justify-between">
            <span>First Consultation Free</span>
            <input
              type="checkbox"
              checked={firstConsultationFree}
              onChange={() => setFirstConsultationFree(!firstConsultationFree)}
              className="h-5 w-5"
            />
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-3 justify-end">
        <button
          onClick={handleSave}
          className="px-5 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700 transition"
        >
          Save Changes
        </button>
        <button
          onClick={handleReset}
          className="px-5 py-2 bg-gray-300 rounded hover:bg-gray-400 transition"
        >
          Cancel/Reset
        </button>
      </div>
    </div>
  );
}
