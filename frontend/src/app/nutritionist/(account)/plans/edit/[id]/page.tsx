"use client";

import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { nutritionistPlanService } from "@/services/nutritionist/nutritionistPlan.service";

interface PlanForm {
  title: string;
  category: string;
  durationInDays: number;
  price: number;
  status: "draft" | "published";
  currency: string;
  description: string;
  features: string[];
}

export default function EditPlanPage() {
  const router = useRouter();
 const { id } = useParams();
const planId = Array.isArray(id) ? id[0] : id; 
  
  const [form, setForm] = useState<PlanForm | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Fetch plan
useEffect(() => {
  const fetchPlan = async () => {
    if (!planId) return;
    try {
      const res = await nutritionistPlanService.getPlanById(planId);
      const planData = res.data.data; // <--- important
      if (!planData.features) planData.features = [];
      setForm(planData);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch plan data");
    } finally {
      setLoading(false);
    }
  };
  fetchPlan();
}, [planId]);



  // Handle input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
    index?: number
  ) => {
    const { name, value } = e.target;

    if (name === "features" && index !== undefined && form) {
      const newFeatures = [...form.features];
      newFeatures[index] = value;
      setForm({ ...form, features: newFeatures });
    } else if (form) {
      setForm({ ...form, [name]: name === "price" || name === "durationInDays" ? Number(value) : value });
    }
  };

  const addFeature = () => form && setForm({ ...form, features: [...form.features, ""] });
  const removeFeature = (index: number) =>
    form && setForm({ ...form, features: form.features.filter((_, i) => i !== index) });

  // Form validation
  const validateForm = (): string | null => {
    if (!form) return "Form not loaded";
    if (!form.title.trim()) return "Title is required";
    if (!form.category.trim()) return "Category is required";
    if (!form.description.trim()) return "Description is required";
    if (form.price <= 0) return "Price must be greater than 0";
    if (form.features.some((f) => !f.trim())) return "All features must be filled or removed";
    return null;
  };

  // Submit
  const handleSubmit = async () => {
    const error = validateForm();
    if (error) return toast.error(error);

    setSubmitting(true);
    try {
      await nutritionistPlanService.updatePlan(planId!, form!);
      toast.success("Plan updated successfully!");
      router.push("/nutritionist/plans");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update plan");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !form) return <p className="text-center mt-10">Loading plan...</p>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Edit Nutrition Plan</h1>
      <div className="space-y-4">
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Title"
          className="w-full p-3 border rounded"
        />
        <input
          name="category"
          value={form.category}
          onChange={handleChange}
          placeholder="Category"
          className="w-full p-3 border rounded"
        />
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Description"
          className="w-full p-3 border rounded"
          rows={4}
        />
        <input
          name="price"
          type="number"
          value={form.price}
          onChange={handleChange}
          placeholder="Price"
          className="w-full p-3 border rounded"
        />
        <select
          name="durationInDays"
          value={form.durationInDays}
          onChange={handleChange}
          className="w-full p-3 border rounded"
        >
          <option value={30}>1 Month</option>
          <option value={90}>3 Months</option>
          <option value={180}>6 Months</option>
        </select>
        <select
          name="status"
          value={form.status}
          onChange={handleChange}
          className="w-full p-3 border rounded"
        >
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>

        {/* Features */}
        <div>
          <label className="font-semibold block mb-2">Features</label>
          {form.features.map((f, idx) => (
            <div key={idx} className="flex gap-2 mt-2">
              <input
                value={f}
                onChange={(e) => handleChange(e, idx)}
                placeholder={`Feature ${idx + 1}`}
                className="flex-1 p-2 border rounded"
              />
              <button
                type="button"
                onClick={() => removeFeature(idx)}
                className="px-3 bg-red-500 text-white rounded"
              >
                X
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addFeature}
            className="mt-2 px-3 py-1 bg-green-500 text-white rounded"
          >
            + Add Feature
          </button>
        </div>

        <button
          onClick={handleSubmit}
          disabled={submitting}
          className={`w-full py-3 px-4 text-white font-bold rounded ${
            submitting ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:shadow-lg"
          }`}
        >
          {submitting ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
}
