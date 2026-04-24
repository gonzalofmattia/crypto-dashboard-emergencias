interface SearchBarProps {
  value: string
  onChange: (value: string) => void
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <input
      type="text"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder="Buscar por nombre o símbolo..."
      className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-sm text-gray-100 outline-none transition focus:border-blue-500"
    />
  )
}
