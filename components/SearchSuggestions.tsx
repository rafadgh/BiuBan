import Link from 'next/link'

const suggestions = [
  'Nike Dunks',
  'Tenis blancos',
  'Hoodie oversize',
  'Playera blanca',
  "Jeans Levi's",
  'Vestido negro',
]

interface SearchSuggestionsProps {
  className?: string
}

export function SearchSuggestions({ className = '' }: SearchSuggestionsProps) {
  return (
    <div className={`flex flex-wrap justify-center gap-2 ${className}`}>
      {suggestions.map((suggestion) => (
        <Link
          key={suggestion}
          href={`/buscar?q=${encodeURIComponent(suggestion)}`}
          className="rounded-full border border-border/50 bg-card px-3.5 py-1.5 text-sm text-foreground/80 transition-all hover:border-[#586E26] hover:bg-[#F0F5E8] hover:text-[#31470B]"
        >
          {suggestion}
        </Link>
      ))}
    </div>
  )
}
