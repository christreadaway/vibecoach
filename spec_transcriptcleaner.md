# Product Spec: TranscriptCleaner

## 1. Product Name & Problem Statement

**TranscriptCleaner** — A self-hosted web tool that takes messy, raw transcript text (copied from Zoom, Otter, Teams, Google Meet, etc.) and reformats it into clean, speaker-labeled sections ready for download or reference.

**Problem:** Meeting transcript tools dump unstructured walls of text — inconsistent speaker labels, broken lines, timestamps mixed in, fragments instead of sentences. Cleaning these up manually is tedious. There's no simple, privacy-respecting, open-source tool to paste in a raw transcript and get back a properly formatted one.

---

## 2. User Story

**Who:** Anyone who regularly takes or receives meeting transcripts — PMs, founders, researchers, journalists, assistants, consultants.

**What they're trying to do:** Copy raw transcript text from a meeting tool, paste it into a simple interface, and get back a cleanly formatted, speaker-labeled transcript they can download or reference later.

**Flow:**
> "I just finished a Zoom call. I select-all the transcript text, paste it into TranscriptCleaner, hit 'Clean', and in a few seconds I get a nicely formatted version with each speaker's dialogue clearly labeled. I can download it as a .txt file or come back to it later from my history."

---

## 3. Core Functionality

### Workflow (step by step):

1. **User opens the app** → Sees a clean, dark-mode interface with a large text input area
2. **User pastes raw transcript** → Copy-paste from any meeting tool (Zoom, Otter, Teams, Meet, etc.)
3. **User clicks "Clean Transcript"** → App sends text to Claude Haiku API for parsing
4. **API processes the text** → Identifies speakers, consolidates their dialogue, removes noise (timestamps, system messages, formatting artifacts)
5. **Cleaned result displays on screen** → Formatted with clear speaker labels and readable paragraph breaks
6. **User can download** → One-click download as `.txt` file
7. **Result saved to history** → Persisted in local storage, accessible from a sidebar or history view
8. **User can revisit past cleanups** → Browse, re-download, or delete previous transcripts

### UI Layout:

```
┌─────────────────────────────────────────────────────┐
│  🧹 TranscriptCleaner          [History] [☀/🌙]    │
├──────────────────────┬──────────────────────────────┤
│                      │                              │
│   Paste raw          │   Cleaned output             │
│   transcript here    │   (appears after processing) │
│                      │                              │
│                      │                              │
│   [textarea]         │   [formatted result]         │
│                      │                              │
│                      │   [📋 Copy] [⬇ Download]     │
│                      │                              │
├──────────────────────┴──────────────────────────────┤
│              [ 🚀 Clean Transcript ]                │
└─────────────────────────────────────────────────────┘
```

- **Desktop:** Side-by-side input/output panels
- **Mobile:** Stacked vertically (input on top, output below)
- **History panel:** Slide-out sidebar or dedicated view showing past cleanups with timestamps and preview snippets

---

## 4. Inputs and Outputs

### Inputs:
| Input | Source | Format |
|-------|--------|--------|
| Raw transcript text | User copy-paste | Unstructured plain text — may contain timestamps, speaker names in various formats, filler words, system messages, line breaks, etc. |
| Anthropic API key | User-provided via settings/config | Stored in `.env` file (self-hosted) or settings panel in the UI |

### Outputs:
| Output | Format | Description |
|--------|--------|-------------|
| Cleaned transcript (on screen) | Formatted text with speaker labels | Displayed in the output panel with clear visual separation between speakers |
| Downloadable file | `.txt` | Clean plain text file with speaker-labeled sections |
| History entry | JSON in local storage | Timestamp, preview snippet, full cleaned text, original text |

### Example Transformation:

**Input (raw paste from Zoom):**
```
10:03:22 From John Smith: um so I think we should
10:03:25 probably look at the the quarterly numbers
10:03:28 From Sarah Chen: yeah I agree um
10:03:30 the Q3 results were
10:03:32 From Sarah Chen: actually pretty strong
10:03:35 From John Smith: right so let's focus on
10:03:37 From John Smith: the growth metrics specifically
```

**Output (cleaned):**
```
John Smith:
I think we should probably look at the quarterly numbers. Right, so let's focus on the growth metrics specifically.

Sarah Chen:
Yeah, I agree. The Q3 results were actually pretty strong.
```

---

## 5. Business Rules & Logic

### Parsing Rules:
- **Speaker identification:** Detect and normalize speaker names from various transcript formats (e.g., "From John Smith:", "John Smith said:", "JS:", timestamps + names, etc.)
- **Consolidation:** Merge consecutive lines from the same speaker into cohesive paragraphs
- **Noise removal:** Strip timestamps, system messages ("John Smith joined the meeting"), and formatting artifacts
- **Filler word handling:** Remove egregious filler words (um, uh, like) when they break sentence flow — but preserve natural speech patterns. Do NOT aggressively rewrite; the goal is formatting, not editing
- **Speaker order:** Maintain chronological order of conversation (do NOT group all of one speaker's dialogue together — keep the back-and-forth flow)
- **Preserve meaning:** Never alter, summarize, or editorialize the content. This is a formatting tool, not a summarizer

### Edge Cases:
- **No detectable speakers:** If the transcript has no speaker labels, return it as cleaned paragraphs with a note: "No speakers detected — text cleaned as continuous transcript"
- **Single speaker:** Format as a single speaker monologue
- **Very long transcripts:** Chunk the text and process in segments if it exceeds Claude Haiku's context window (~200k tokens). Stitch results together
- **Empty input:** Show validation message "Please paste a transcript to clean"
- **API failure:** Show user-friendly error with retry option: "Cleanup failed — please try again"
- **API key missing/invalid:** Prompt user to configure their API key in settings with clear instructions

### Rate/Cost Awareness:
- Show a brief indication of approximate token usage after each cleanup (e.g., "~2,400 tokens used")
- No hard limits — the user owns their API key and budget

---

## 6. Data Requirements

### Stored Locally (browser localStorage):
| Data | Purpose | Retention |
|------|---------|-----------|
| Cleaned transcript text | History/re-download | Until user deletes |
| Original raw text | Re-process option | Until user deletes |
| Timestamp of cleanup | History sorting/display | Until user deletes |
| Title/preview snippet | History list display | First ~100 chars of cleaned text |
| User settings (API key, theme) | Configuration | Persistent |

### NOT Stored:
- No server-side database
- No user accounts or authentication
- No analytics or telemetry
- Nothing leaves the user's machine except the API call to Anthropic

---

## 7. Integrations & Dependencies

### Required:
| Dependency | Purpose | Notes |
|------------|---------|-------|
| **Anthropic API (Claude Haiku)** | Transcript parsing and cleanup | Model: `claude-haiku-4-5-20251001`. User provides their own API key. Haiku chosen for cost efficiency — this is a formatting task, not reasoning-heavy |
| **Vite + React** | Frontend SPA | Fast builds, simple config, Netlify-native. No SSR needed — this is a client-side tool |
| **Netlify Functions** | Serverless API proxy | Handles the `/api/clean` endpoint. Proxies requests to Anthropic so the API key stays server-side |
| **Tailwind CSS** | Styling | Dark mode default, light mode toggle. Modern, responsive |
| **localStorage** | History persistence | Browser-native, no database needed |

### Optional / Nice-to-have (not required for v1):
| Dependency | Purpose |
|------------|---------|
| Docker + docker-compose | Local self-hosting option for users who don't want Netlify |

### Architecture:

```
┌──────────────┐     ┌───────────────────┐     ┌──────────────────┐
│   Browser     │────▶│  Netlify Function  │────▶│  Anthropic API    │
│   (React +    │◀────│  /api/clean        │◀────│  (Claude Haiku)   │
│   Tailwind)   │     │  (serverless)      │     │                   │
└──────────────┘     └───────────────────┘     └──────────────────┘
       │
       ▼
  localStorage
  (history, settings)
```

### Deployment: Netlify

- **Frontend:** Vite builds to `dist/` — Netlify serves it as a static site
- **API:** Netlify Functions live in `netlify/functions/` — auto-deployed as serverless endpoints
- **API key handling (two modes):**
  - **Hosted mode:** API key set as a Netlify environment variable (`ANTHROPIC_API_KEY`). Users of the deployed site don't need their own key — the site owner's key is used server-side
  - **BYO key mode:** User enters their own API key in the UI settings panel. Key is sent per-request to the Netlify Function, which proxies it to Anthropic. Key is stored in localStorage (never logged server-side)
  - **Priority:** Server-side `.env` key takes precedence. If not set, the function expects the key from the client request header
- **netlify.toml** config should include:
  ```toml
  [build]
    command = "npm run build"
    publish = "dist"
    functions = "netlify/functions"

  [[redirects]]
    from = "/api/*"
    to = "/.netlify/functions/:splat"
    status = 200
  ```
- **Local dev:** `netlify dev` runs both the Vite dev server and functions locally
- **Self-hosting alternative:** Docker option for users who prefer not to use Netlify

---

## 8. Out of Scope (v1)

The following are explicitly **NOT** included in the initial build:

- ❌ Audio/video file upload or transcription (use Whisper or your meeting tool first)
- ❌ File upload (.txt, .srt, .vtt) — paste only for v1
- ❌ Summarization, action items, or meeting notes generation
- ❌ Multi-language support (English-only for v1)
- ❌ User accounts, login, or authentication
- ❌ Server-side database or cloud storage
- ❌ Real-time / streaming output (wait for full result)
- ❌ Support for multiple LLM providers (Claude Haiku only for v1)
- ❌ Collaborative features or sharing
- ❌ Browser extension or integrations with Zoom/Teams/etc.
- ❌ Editing the cleaned transcript in the UI

---

## 9. Open Design Questions

| # | Question | Impact | Suggested Default |
|---|----------|--------|-------------------|
| 1 | Should the API key be configured via `.env` only, or also via a settings panel in the UI? | UX for non-technical users | Support both — `.env` takes priority, UI settings as fallback |
| 2 | How should very long transcripts (>100k tokens) be chunked? | Accuracy at boundaries between chunks | Chunk by speaker turns, overlap 2-3 turns at boundaries |
| 3 | Should the history have a max size to avoid bloating localStorage? | Performance on low-end devices | Cap at 50 entries, FIFO eviction with warning |
| 4 | Should we offer .md (Markdown) download in addition to .txt? | Some users may want formatted output | Add as a toggle — .txt default, .md optional |
| 5 | Should the prompt be user-editable for power users? | Flexibility vs. complexity | Not in v1 — hardcode a well-tested prompt |
| 6 | ~~Project name — is "TranscriptCleaner" final?~~ | ~~Branding, repo name~~ | **Confirmed: TranscriptCleaner** |

---

## 10. Success Criteria

### Functional (must pass before release):
- [ ] User can paste raw transcript text and receive a cleaned, speaker-labeled result
- [ ] Cleaned transcript displays on screen with clear formatting
- [ ] One-click download as `.txt` file works
- [ ] History persists across browser sessions (localStorage)
- [ ] History entries can be revisited and re-downloaded
- [ ] History entries can be deleted individually
- [ ] Dark mode is default; light mode toggle works
- [ ] Responsive layout works on desktop (side-by-side) and mobile (stacked)
- [ ] Missing/invalid API key shows a helpful configuration prompt
- [ ] API errors show user-friendly messages with retry option
- [ ] App runs locally with `netlify dev` (or `npm run dev` + functions)
- [ ] Deploys to Netlify with zero manual config beyond env vars

### Quality:
- [ ] Correctly parses transcripts from at least: Zoom, Google Meet, Otter.ai, Microsoft Teams
- [ ] Speaker labels are accurate and consistent
- [ ] Chronological conversation flow is preserved
- [ ] No content is lost, summarized, or altered beyond formatting
- [ ] Handles 60-minute meeting transcripts (~10k-15k words) without issues
- [ ] Total cleanup time under 10 seconds for a typical transcript

### GitHub Release Ready:
- [ ] Clean README with setup instructions, screenshots, and usage guide
- [ ] `.env.example` with clear variable documentation
- [ ] `LICENSE` file (MIT recommended)
- [ ] `netlify.toml` included and tested
- [ ] "Deploy to Netlify" button in README
- [ ] Docker support via `Dockerfile` and `docker-compose.yml` as alternative
- [ ] No hardcoded secrets or API keys in codebase

---

## Appendix: System Prompt for Claude Haiku

The following system prompt should be used for the API call. It is intentionally specific to constrain Haiku to formatting-only behavior:

```
You are a transcript formatting assistant. Your ONLY job is to take raw, messy meeting transcript text and reformat it into clean, speaker-labeled sections.

Rules:
1. Identify each speaker and label their dialogue clearly as "Speaker Name:\n"
2. Merge consecutive lines from the same speaker into cohesive paragraphs
3. Remove timestamps, system messages (e.g., "X joined the meeting"), and formatting artifacts
4. Remove filler words (um, uh, you know, like) ONLY when they disrupt readability
5. Fix obvious grammar and punctuation issues caused by transcription errors
6. Maintain the chronological order of the conversation — do NOT group by speaker
7. NEVER summarize, paraphrase, add commentary, or remove substantive content
8. If no speaker labels are detectable, format as clean paragraphs and note: "[No speakers detected]"

Output ONLY the cleaned transcript. No preamble, no explanation, no markdown formatting.
```

---

*Spec version: 1.1*
*Created: February 2026*
*Updated: Netlify deployment, name confirmed*
*Status: Ready for build*
