export default function HistorySidebar({ open, history, onClose, onSelect, onDelete, onClear }) {
  if (!open) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/30 z-40"
        onClick={onClose}
      />

      {/* Sidebar */}
      <aside className="fixed inset-y-0 right-0 w-full max-w-sm bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-800 shadow-xl z-50 flex flex-col">
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-800">
          <h2 className="font-semibold">History</h2>
          <div className="flex items-center gap-2">
            {history.length > 0 && (
              <button
                className="text-xs text-red-500 hover:text-red-400"
                onClick={() => {
                  if (window.confirm('Clear all history?')) onClear()
                }}
              >
                Clear all
              </button>
            )}
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-xl leading-none"
              aria-label="Close history"
            >
              &times;
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {history.length === 0 ? (
            <p className="p-4 text-sm text-gray-400 dark:text-gray-500 text-center">
              No history yet. Clean a transcript to see it here.
            </p>
          ) : (
            <ul className="divide-y divide-gray-100 dark:divide-gray-800">
              {history.map((entry) => (
                <li key={entry.id} className="group">
                  <button
                    className="w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                    onClick={() => {
                      onSelect(entry)
                      onClose()
                    }}
                  >
                    <p className="text-xs text-gray-400 dark:text-gray-500 mb-1">
                      {new Date(entry.timestamp).toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">
                      {entry.preview}
                    </p>
                  </button>
                  <div className="px-4 pb-2">
                    <button
                      className="text-xs text-red-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => {
                        e.stopPropagation()
                        onDelete(entry.id)
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </aside>
    </>
  )
}
