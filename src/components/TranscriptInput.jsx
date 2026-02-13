export default function TranscriptInput({ value, onChange, onClean, loading }) {
  return (
    <div className="flex flex-col h-full">
      <label htmlFor="transcript-input" className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
        Paste raw transcript
      </label>
      <textarea
        id="transcript-input"
        className="flex-1 w-full resize-none rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-4 text-sm leading-relaxed font-mono placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        placeholder={"Paste your raw transcript here...\n\nSupports transcripts from Zoom, Google Meet, Otter.ai, Microsoft Teams, and more."}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={loading}
      />

      <div className="mt-3">
        <button
          className="btn-primary w-full text-base"
          onClick={onClean}
          disabled={loading || !value.trim()}
        >
          {loading ? (
            <>
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Cleaning...
            </>
          ) : (
            'Clean Transcript'
          )}
        </button>
      </div>
    </div>
  )
}
