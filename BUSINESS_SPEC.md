# VibeCoach (TranscriptCleaner) — Business Product Spec
**Version:** 1.0 | **Date:** 2026-02-16 | **Repo:** github.com/christreadaway/vibecoach

---

## 1. Problem Statement
Claude Code session transcripts are messy. They contain UI chrome, navigation elements, "Show more" buttons, system messages, and formatting artifacts that make them unreadable when saved or shared. Developers who want to archive their Claude Code conversations for reference, documentation, or portfolio purposes need to manually clean these transcripts — a tedious process that discourages good documentation habits.

## 2. Solution
A web application that takes raw Claude Code transcripts, sends them through Claude Haiku for intelligent cleaning, and returns a readable User/Claude conversation flow. Strips all UI artifacts while preserving the essential technical content, decisions, and code. Runs as a lightweight React app with a Netlify Functions backend that keeps API keys secure.

## 3. Target Users
- **Claude Code Users** — Developers who want clean archives of their AI pair programming sessions
- **Vibe Coders** — Non-traditional developers who use Claude Code as their primary development tool
- **Portfolio Builders** — People documenting their AI-assisted development work
- **Team Leads** — Reviewing Claude Code transcripts from team members

## 4. Core Features

### Core Functionality
- **Paste & Clean** — Paste raw transcript → click "Clean Transcript" → get formatted output
- **AI-Powered Cleaning** — Claude Haiku (claude-haiku-4-5-20251001) removes UI chrome, navigation, "Show more" buttons while preserving User/Claude conversation flow
- **Repository & Date Extraction** — AI extracts repo name and session date from transcript context
- **Token Usage Display** — Shows input/output tokens after each cleanup

### User Interface
- **Side-by-Side Panels** — Input (left) and output (right) on desktop; stacked on mobile
- **Dark Mode Default** — With light mode toggle
- **Download Options** — Save as .txt or .md file
- **Copy to Clipboard** — One-click copy of cleaned transcript

### History Management
- **localStorage Persistence** — Cleaned transcripts saved locally
- **50-Entry FIFO Cap** — Oldest entries evicted when limit reached
- **Slide-Out Sidebar** — Browse, delete, or clear history
- **Per-Entry Delete** — Remove individual entries

### API Key Handling
- **Dual Mode:** Server-side env var (Netlify) OR user-provided via Settings modal
- **Secure:** User keys stay client-side when using Netlify Functions proxy

### Deployment Options
- **Netlify** — Functions for API proxy (recommended, key never exposed)
- **Docker** — Self-hosting via Dockerfile + docker-compose.yml

## 5. Tech Stack
- **Frontend:** React 18 + Vite 6, Tailwind CSS 3
- **API Proxy:** Netlify Functions (serverless)
- **AI:** Claude Haiku API (claude-haiku-4-5-20251001)
- **Build:** 154 KB JS + 16 KB CSS (gzipped)
- **Container:** Dockerfile + docker-compose.yml for self-hosting

## 6. Data & Privacy
- Transcripts processed through Claude Haiku API (sent to Anthropic)
- Cleaned transcripts stored only in browser localStorage
- API keys never logged or transmitted beyond the API call
- No server-side storage of transcript content

## 7. Current Status
- **Built:** Complete React application with all features
- **Built:** Netlify deployment configuration
- **Built:** Docker self-hosting option
- **Verified:** Production build compiles (154 KB JS, 16 KB CSS)
- **Branch:** Main branch (built directly)
- **Not Deployed:** Needs Netlify site creation and deployment

## 8. Business Model
- **Free Tool** — Part of the Claude Code ecosystem
- **Self-Hosted Option** — For privacy-conscious users
- **Future:** Could become a feature within claudecodearchiver

## 9. Success Metrics
- Transcripts cleaned per user per week
- Time saved vs. manual cleanup
- History feature adoption rate
- Deployment method split (Netlify vs. self-hosted)

## 10. Open Questions / Next Steps
- Deploy to Netlify
- Integration with claudecodearchiver (automatic cleaning of archived transcripts)
- Batch cleaning mode (process multiple transcripts at once)
- Custom cleaning rules (user-defined patterns to strip/keep)
- Team sharing features (share cleaned transcripts via link)
- Cost optimization (Haiku already cheap, but batch mode could reduce further)
