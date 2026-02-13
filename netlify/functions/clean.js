const SYSTEM_PROMPT = `You are a transcript formatting assistant. Your ONLY job is to take raw, messy meeting transcript text and reformat it into clean, speaker-labeled sections.

Rules:
1. Identify each speaker and label their dialogue clearly as "Speaker Name:\\n"
2. Merge consecutive lines from the same speaker into cohesive paragraphs
3. Remove timestamps, system messages (e.g., "X joined the meeting"), and formatting artifacts
4. Remove filler words (um, uh, you know, like) ONLY when they disrupt readability
5. Fix obvious grammar and punctuation issues caused by transcription errors
6. Maintain the chronological order of the conversation — do NOT group by speaker
7. NEVER summarize, paraphrase, add commentary, or remove substantive content
8. If no speaker labels are detectable, format as clean paragraphs and note: "[No speakers detected]"

Output ONLY the cleaned transcript. No preamble, no explanation, no markdown formatting.`

export default async (req) => {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  try {
    const body = await req.json()
    const transcript = body.transcript

    if (!transcript || !transcript.trim()) {
      return new Response(
        JSON.stringify({ error: 'Please paste a transcript to clean' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } },
      )
    }

    // Server-side key takes priority, then client-provided key
    const apiKey =
      process.env.ANTHROPIC_API_KEY || req.headers.get('x-api-key')

    if (!apiKey) {
      return new Response(
        JSON.stringify({
          error:
            'API key is missing. Please set your Anthropic API key in Settings or configure it as an environment variable.',
        }),
        { status: 401, headers: { 'Content-Type': 'application/json' } },
      )
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 8192,
        system: SYSTEM_PROMPT,
        messages: [
          {
            role: 'user',
            content: transcript,
          },
        ],
      }),
    })

    if (!response.ok) {
      const errBody = await response.json().catch(() => ({}))
      const message =
        errBody?.error?.message || `Anthropic API error (${response.status})`
      return new Response(JSON.stringify({ error: message }), {
        status: response.status,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const data = await response.json()
    const cleaned = data.content?.[0]?.text || ''
    const inputTokens = data.usage?.input_tokens || 0
    const outputTokens = data.usage?.output_tokens || 0

    return new Response(
      JSON.stringify({
        cleaned,
        tokenUsage: inputTokens + outputTokens,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } },
    )
  } catch (err) {
    return new Response(
      JSON.stringify({ error: 'Cleanup failed — please try again' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } },
    )
  }
}

export const config = {
  path: '/api/clean',
}
