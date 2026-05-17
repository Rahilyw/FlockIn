import { INTERESTS } from "@/lib/interests";
import { InterestTag } from "@/components/InterestTag";

interface InterestSelectorProps {
  selected: string[];
  onChange: (interests: string[]) => void;
}

export function InterestSelector({ selected, onChange }: InterestSelectorProps) {
  function toggle(label: string) {
    if (selected.includes(label)) {
      onChange(selected.filter((i) => i !== label));
    } else {
      onChange([...selected, label]);
    }
  }

  return (
    <div className="flex flex-wrap gap-2">
      {INTERESTS.map((interest) => (
        <InterestTag
          key={interest}
          label={interest}
          selected={selected.includes(interest)}
          onToggle={toggle}
        />
      ))}
    </div>
  );
}
