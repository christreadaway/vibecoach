import { useLocalStorage } from './useLocalStorage'

const MAX_HISTORY = 50

export function useHistory() {
  const [history, setHistory] = useLocalStorage('tc-history', [])

  function addEntry(rawText, cleanedText) {
    const entry = {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
      timestamp: new Date().toISOString(),
      preview: cleanedText.slice(0, 100).replace(/\n/g, ' '),
      rawText,
      cleanedText,
    }

    setHistory((prev) => {
      const updated = [entry, ...prev]
      if (updated.length > MAX_HISTORY) {
        return updated.slice(0, MAX_HISTORY)
      }
      return updated
    })

    return entry
  }

  function deleteEntry(id) {
    setHistory((prev) => prev.filter((e) => e.id !== id))
  }

  function clearHistory() {
    setHistory([])
  }

  return { history, addEntry, deleteEntry, clearHistory }
}
