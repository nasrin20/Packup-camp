'use client'
interface TopBarProps {
  title?: string
  showBack?: boolean
  right?: React.ReactNode
}

export default function TopBar({ title, showBack, right }: TopBarProps) {
  return (
    <header className="sticky top-0 bg-forest-900 border-b border-forest-800 z-40 px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        {showBack && (
          <button onClick={() => window.history.back()} className="text-forest-400 text-xl">←</button>
        )}
        {title ? (
          <h1 className="text-forest-100 font-bold text-lg">{title}</h1>
        ) : (
          <div className="flex items-center gap-2">
            <span className="text-2xl">⛺</span>
            <span className="text-ember-400 font-bold text-xl font-serif">PackUp</span>
          </div>
        )}
      </div>
      {right && <div>{right}</div>}
    </header>
  )
}
