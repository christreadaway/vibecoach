export async function cleanTranscript(rawText, apiKey) {
  const headers = { 'Content-Type': 'application/json' }
  if (apiKey) {
    headers['x-api-key'] = apiKey
  }

  const res = await fetch('/api/clean', {
    method: 'POST',
    headers,
    body: JSON.stringify({ transcript: rawText }),
  })

  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.error || `Request failed (${res.status})`)
  }

  const data = await res.json()
  return data
}
