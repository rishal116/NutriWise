import React from "react";
import { Section, FileInput } from "../FormComponents";
import { FileText } from "lucide-react";
import { X } from "lucide-react";

interface Props {
  cvFile: File | null;
  setCvFile: React.Dispatch<React.SetStateAction<File | null>>;
  certFiles: File[];
  setCertFiles: React.Dispatch<React.SetStateAction<File[]>>;
  errors: Record<string, string>;
}

export default function DocumentsSection({ cvFile, setCvFile, certFiles, setCertFiles, errors }: Props) {
  return (
    <Section title="Documents" icon={FileText}>
      <div className="grid md:grid-cols-2 gap-6">

        {/* CV */}
        <div>
          <FileInput label="Upload CV/Resume (Required)" onChange={e => {
            const file = e.target.files?.[0];
            if (file) setCvFile(file);
          }} fileName={cvFile?.name} />
          {errors.cv && <p className="text-red-600 text-sm mt-1">{errors.cv}</p>}
        </div>

        {/* Certifications */}
        <div>
          <FileInput label="Upload Certifications (Optional)" multiple onChange={e => {
            if (!e.target.files) return;
                      if (!e.target.files) return;
          const files = Array.from(e.target.files) as File[];
          setCertFiles(prev => [...prev, ...files]);
          }} />
          <div className="flex flex-wrap gap-2 mt-2">
            {certFiles.map((file, i) => (
              <span key={i} className="flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-full">
                {file.name} <X className="cursor-pointer" size={14} onClick={() => setCertFiles(prev => prev.filter((_, idx) => idx !== i))}/>
              </span>
            ))}
          </div>
        </div>

      </div>
    </Section>
  );
}
