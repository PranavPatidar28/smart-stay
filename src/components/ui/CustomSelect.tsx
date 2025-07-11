import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

interface Option {
  value: string;
  label: string;
}

interface CustomSelectProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export default function CustomSelect({ options, value, onChange, placeholder, className = "" }: CustomSelectProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selected = options.find(o => o.value === value);

  return (
    <div ref={ref} className={`relative w-full ${className}`} tabIndex={0}>
      <button
        type="button"
        className={`w-full px-4 py-3 border border-gray-200 rounded-xl bg-white text-gray-900 flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)] transition-all duration-200 ${open ? "ring-2 ring-[var(--color-primary-500)]" : ""}`}
        onClick={() => setOpen(o => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span>{selected ? selected.label : (placeholder || "Select...")}</span>
        <ChevronDown className={`w-5 h-5 ml-2 transition-transform ${open ? "rotate-180" : "rotate-0"}`} />
      </button>
      {open && (
        <ul
          className="absolute z-20 mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-auto animate-fade-in-up"
          role="listbox"
        >
          {options.map((option) => (
            <li
              key={option.value}
              className={`px-4 py-3 cursor-pointer hover:bg-[var(--color-primary-50)] transition-colors ${option.value === value ? "bg-[var(--color-primary-100)] text-[var(--color-primary-700)] font-semibold" : "text-gray-900"}`}
              onClick={() => { onChange(option.value); setOpen(false); }}
              role="option"
              aria-selected={option.value === value}
              tabIndex={0}
              onKeyDown={e => {
                if (e.key === "Enter" || e.key === " ") {
                  onChange(option.value); setOpen(false);
                }
              }}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
} 