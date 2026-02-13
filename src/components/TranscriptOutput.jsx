import { useState } from 'react'

export default function TranscriptOutput({ result, tokenUsage, error, onRetry }) {
  const [copied, setCopied] = useState(false)

  if (error) {
    return (
      <div className="flex flex-col h-full">
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
          Cleaned output
        </p>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-3">
            <p className="text-red-500 dark:text-red-400 text-sm">{error}</p>
            <button className="btn-secondary text-xs" onClick={onRetry}>
              Try again
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!result) {
    return (
      <div className="flex flex-col h-full">
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
          Cleaned output
        </p>
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-400 dark:text-gray-600 text-sm text-center">
            Cleaned transcript will appear here after processing.
          </p>
        </div>
      </div>
    )
  }

  function handleCopy() {
    navigator.clipboard.writeText(result).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  function handleDownload(format) {
    const ext = format === 'md' ? 'md' : 'txt'
    const content = format === 'md' ? formatAsMarkdown(result) : result
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `transcript-${new Date().toISOString().slice(0, 10)}.${ext}`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="flex flex-col h-full">
      <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
        Cleaned output
      </p>
      <div className="flex-1 overflow-auto rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-4">
        <pre className="text-sm leading-relaxed whitespace-pre-wrap font-sans">
          {result}
        </pre>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button className="btn-secondary text-xs" onClick={handleCopy}>
          {copied ? 'Copied!' : 'Copy'}
        </button>
        <button className="btn-secondary text-xs" onClick={() => handleDownload('txt')}>
          Download .txt
        </button>
        <button className="btn-secondary text-xs" onClick={() => handleDownload('md')}>
          Download .md
        </button>
        {tokenUsage && (
          <span className="ml-auto text-xs text-gray-400 dark:text-gray-500">
            ~{tokenUsage.toLocaleString()} tokens used
          </span>
        )}
      </div>
    </div>
  )
}

function formatAsMarkdown(text) {
  return text.replace(/^(.+?):\n/gm, '**$1:**\n')
}
