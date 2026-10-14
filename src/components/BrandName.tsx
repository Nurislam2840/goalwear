// src/components/BrandName.tsx
"use client";

interface BrandNameProps {
  name: string;
  className?: string;
}

export default function BrandName({ name, className = "" }: BrandNameProps) {
  // First uppercase letter after position 0 খুঁজে split করব
  // "GoalWear" → ["Goal", "Wear"]
  // "FootballHub" → ["Football", "Hub"]
  let splitIndex = -1;
  for (let i = 1; i < name.length; i++) {
    if (name[i] === name[i].toUpperCase() && name[i] !== name[i].toLowerCase()) {
      splitIndex = i;
      break;
    }
  }

  const first = splitIndex > 0 ? name.slice(0, splitIndex) : name;
  const second = splitIndex > 0 ? name.slice(splitIndex) : "";

  return (
    <span className={className}>
      <span className="text-gray-900 dark:text-white">{first}</span>
      {second && <span className="text-brand-green">{second}</span>}
    </span>
  );
}