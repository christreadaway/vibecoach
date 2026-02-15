# Claude Code Instructions - VibeCoach

## About This Project
[Project built from recent spec - Feb 14, 2026]

## About Me (Chris Treadaway)
Product builder, not a coder. I bring requirements and vision — you handle implementation.

**Working with me:**
- Bias toward action - just do it, don't argue
- Make terminal commands dummy-proof (always start with `cd ~/vibecoach`)
- Minimize questions - make judgment calls and tell me what you chose
- I get interrupted frequently - always end sessions with a handoff note

## Tech Stack
[To be determined based on spec and implementation]

## File Paths
- **Always use:** `~/vibecoach/path/to/file`
- **Never use:** `/Users/christreadaway/...`
- **Always start commands with:** `cd ~/vibecoach`

## PII Rules (CRITICAL)
❌ NEVER include:
- Real names → use [Name]
- Email addresses → use user@example.com
- Personal information
- File paths with /Users/christreadaway → use ~/

✅ ALWAYS use placeholders

## Session End Routine
```markdown
## Session Handoff - [Date]

### What We Built
- [Feature 1]: [files modified]

### Current Status
✅ Working: [tested features]
❌ Broken: [known issues]
🚧 In Progress: [incomplete]

### Files Changed
- [file]

### Current Branch
Branch: [branch-name]
Ready to merge: [Yes/No]

### Next Steps
1. [Priority 1]
2. [Priority 2]
```

## Git Branch Strategy
- Claude Code creates new branch per session
- Merge to main when stable
- Delete merged branches immediately

## Testing Approach
[To be filled in based on project specifics]

## Current Status
Recently built from spec (Feb 14, 2026).

---
Last Updated: February 16, 2026
