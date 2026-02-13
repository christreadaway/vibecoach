import { useState } from 'react'

export default function SettingsModal({ open, apiKey, onSave, onClose }) {
  const [key, setKey] = useState(apiKey || '')

  if (!open) return null

  function handleSave(e) {
    e.preventDefault()
    onSave(key.trim())
    onClose()
  }

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/30 z-40" onClick={onClose} />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 dark:border-gray-800">
            <h2 className="font-semibold">Settings</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-xl leading-none"
              aria-label="Close settings"
            >
              &times;
            </button>
          </div>

          <form onSubmit={handleSave} className="p-5 space-y-4">
            <div>
              <label htmlFor="api-key" className="block text-sm font-medium mb-1">
                Anthropic API Key
              </label>
              <input
                id="api-key"
                type="password"
                className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="sk-ant-..."
                value={key}
                onChange={(e) => setKey(e.target.value)}
              />
              <p className="mt-1.5 text-xs text-gray-400 dark:text-gray-500">
                Your key is stored only in this browser's localStorage and sent directly to the server-side proxy. It is never logged.
              </p>
            </div>

            <p className="text-xs text-gray-400 dark:text-gray-500">
              If the site owner has configured a server-side API key, you can leave this blank.
            </p>

            <div className="flex justify-end gap-2 pt-2">
              <button type="button" className="btn-secondary text-xs" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn-primary text-xs">
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}
