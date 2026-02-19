# Claude Code Instructions - VibeCoach

## About This Project
TranscriptCleaner — web app for cleaning Claude Code conversation transcripts. Paste raw transcript, clean via Claude Haiku API, get formatted output. Supports dark mode, history management, download as .txt/.md, and dual API key configuration (server-side env var or user-provided).

## About Me (Chris Treadaway)
Product builder, not a coder. I bring requirements and vision — you handle implementation.

**Working with me:**
- Bias toward action — just do it, don't argue
- Make terminal commands dummy-proof (always start with `cd ~/vibecoach`)
- Minimize questions — make judgment calls and tell me what you chose
- I get interrupted frequently — always end sessions with clear handoff

## Tech Stack
- **Frontend:** React 18 + Vite 6 + Tailwind CSS 3
- **API:** Claude Haiku (claude-haiku-4-5-20251001) via Netlify Functions
- **Hosting:** Netlify (with serverless API proxy) or Docker self-hosting
- **State:** localStorage for history (50-entry FIFO cap)

## File Paths
- **Always use:** `~/vibecoach/`
- **Always start commands with:** `cd ~/vibecoach`

## PII Rules
❌ NEVER include: API keys (Anthropic), real conversation content from transcripts, file paths with /Users/christreadaway → use ~/
✅ ALWAYS use placeholders

## Key Features
- Paste raw transcript → clean via Claude Haiku
- Side-by-side panels (desktop) / stacked (mobile)
- Dark mode default with toggle
- Download as .txt or .md
- Copy to clipboard
- Token usage display
- 50-entry history with slide-out sidebar
- Dual API key: server env var OR user-provided via Settings modal

## Git Branch Strategy
- Claude Code creates new branch per session
- Merge to main when stable
- Delete merged branches immediately

## Session End Routine

At the end of EVERY session — or when I say "end session" — do ALL of the following:

### A. Update SESSION_NOTES.md
Append a detailed entry at the TOP of SESSION_NOTES.md (most recent first) with: What We Built, Technical Details, Current Status (✅/❌/🚧), Branch Info, Decisions Made, Next Steps, Questions/Blockers.

### B. Update PROJECT_STATUS.md
Overwrite PROJECT_STATUS.md with the CURRENT state of the project — progress %, what's working, what's broken, what's in progress, next steps, last session date/summary. This is a snapshot, not a log.

### C. Commit Both Files
```
git add SESSION_NOTES.md PROJECT_STATUS.md
git commit -m "Session end: [brief description of what was done]"
git push
```

### D. Tell the User
- What branch you're on
- Whether it's ready to merge to main (and if not, why)
- Top 3 next steps for the next session

---
Last Updated: February 16, 2026


## Branch Rules
Always work on the main branch. Do not create new branches unless explicitly asked. Commit and push all changes directly to main.

