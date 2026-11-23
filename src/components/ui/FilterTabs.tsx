"use client";

interface FilterOption<T extends string> {
  value: T;
  label: string;
}

interface FilterTabsProps<T extends string> {
  label: string;
  options: readonly FilterOption<T>[];
  value: T;
  onChange: (value: T) => void;
}

export function FilterTabs<T extends string>({ label, options, value, onChange }: FilterTabsProps<T>) {
  return (
    <div className="tabs" role="group" aria-label={label}>
      {options.map((option) => (
        <button
          key={option.value}
          className="tab"
          type="button"
          aria-pressed={value === option.value}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
