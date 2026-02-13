import { useState, useEffect } from 'react'
import Header from './components/Header'
import TranscriptInput from './components/TranscriptInput'
import TranscriptOutput from './components/TranscriptOutput'
import HistorySidebar from './components/HistorySidebar'
import SettingsModal from './components/SettingsModal'
import { useLocalStorage } from './hooks/useLocalStorage'
import { useHistory } from './hooks/useHistory'
import { cleanTranscript } from './utils/api'

export default function App() {
  const [darkMode, setDarkMode] = useLocalStorage('tc-dark-mode', true)
  const [apiKey, setApiKey] = useLocalStorage('tc-api-key', '')
  const [rawText, setRawText] = useState('')
  const [result, setResult] = useState('')
  const [tokenUsage, setTokenUsage] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [historyOpen, setHistoryOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)

  const { history, addEntry, deleteEntry, clearHistory } = useHistory()

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode)
  }, [darkMode])

  async function handleClean() {
    if (!rawText.trim()) return

    setLoading(true)
    setError(null)
    setResult('')
    setTokenUsage(null)

    try {
      const data = await cleanTranscript(rawText, apiKey)
      setResult(data.cleaned)
      setTokenUsage(data.tokenUsage || null)
      addEntry(rawText, data.cleaned)
    } catch (err) {
      if (err.message.toLowerCase().includes('api key')) {
        setError('API key is missing or invalid. Please configure it in Settings.')
      } else {
        setError(err.message || 'Cleanup failed — please try again')
      }
    } finally {
      setLoading(false)
    }
  }

  function handleSelectHistory(entry) {
    setRawText(entry.rawText)
    setResult(entry.cleanedText)
    setError(null)
    setTokenUsage(null)
  }

  return (
    <div className="flex flex-col h-screen">
      <Header
        darkMode={darkMode}
        onToggleTheme={() => setDarkMode((d) => !d)}
        onToggleHistory={() => setHistoryOpen((o) => !o)}
        onOpenSettings={() => setSettingsOpen(true)}
      />

      <main className="flex-1 overflow-hidden p-4">
        <div className="h-full flex flex-col md:flex-row gap-4">
          {/* Input panel */}
          <div className="panel flex-1 p-4 flex flex-col min-h-[300px] md:min-h-0">
            <TranscriptInput
              value={rawText}
              onChange={setRawText}
              onClean={handleClean}
              loading={loading}
            />
          </div>

          {/* Output panel */}
          <div className="panel flex-1 p-4 flex flex-col min-h-[300px] md:min-h-0">
            <TranscriptOutput
              result={result}
              tokenUsage={tokenUsage}
              error={error}
              onRetry={handleClean}
            />
          </div>
        </div>
      </main>

      <HistorySidebar
        open={historyOpen}
        history={history}
        onClose={() => setHistoryOpen(false)}
        onSelect={handleSelectHistory}
        onDelete={deleteEntry}
        onClear={clearHistory}
      />

      <SettingsModal
        open={settingsOpen}
        apiKey={apiKey}
        onSave={setApiKey}
        onClose={() => setSettingsOpen(false)}
      />
    </div>
  )
}
