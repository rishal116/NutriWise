import Image from "next/image";

interface RoleCardProps {
  title: string;
  image: string;
  selected: boolean;
  onSelect: () => void;
}

export default function RoleCard({ title, image, selected, onSelect }: RoleCardProps) {
  return (
    <div
      onClick={onSelect}
      className={`cursor-pointer rounded-2xl shadow-md border-2 transition-all duration-300 
        ${selected ? "border-green-600 scale-105 shadow-lg" : "border-transparent hover:shadow-lg"}
      `}
    >
      <div className="flex flex-col items-center justify-center p-6 bg-white rounded-2xl">
        <Image
          src={image}
          alt={title}
          width={180}
          height={180}
          className="object-contain mb-4 rounded-xl"
        />
        <h2
          className={`text-lg font-semibold ${
            selected ? "text-green-700" : "text-gray-700"
          }`}
        >
          {title}
        </h2>
      </div>
    </div>
  );
}
