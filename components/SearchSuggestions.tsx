import Link from 'next/link'

const suggestions = [
  'Nike Dunks',
  'Tenis blancos',
  'Hoodie oversize',
  'Playera blanca',
  'Jeans Levi\'s',
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
          className="rounded-full bg-muted px-3.5 py-1.5 text-sm text-foreground/80 transition-colors hover:bg-muted/80 hover:text-foreground"
        >
          {suggestion}
        </Link>
      ))}
    </div>
  )
}
