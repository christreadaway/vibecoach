export default function Header({ darkMode, onToggleTheme, onToggleHistory, onOpenSettings }) {
  return (
    <header className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
      <div className="flex items-center gap-2">
        <span className="text-xl" aria-hidden="true">🧹</span>
        <h1 className="text-lg font-bold tracking-tight">TranscriptCleaner</h1>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onToggleHistory}
          className="btn-secondary text-xs"
          title="History"
        >
          History
        </button>

        <button
          onClick={onOpenSettings}
          className="btn-secondary text-xs"
          title="Settings"
        >
          Settings
        </button>

        <button
          onClick={onToggleTheme}
          className="btn-secondary text-xs w-9 h-9 p-0 flex items-center justify-center"
          title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {darkMode ? '☀️' : '🌙'}
        </button>
      </div>
    </header>
  )
}
