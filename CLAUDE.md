# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Claude Ads is a Claude Code skill (not a traditional application). It installs into `~/.claude/skills/` and `~/.claude/agents/` to provide paid advertising audit and optimization capabilities via `/ads` commands. There is no build step, test suite, or compilation — the codebase is entirely Markdown skill definitions and Python utility scripts.

## Repository Structure

```
ads/SKILL.md              — Main orchestrator skill (routes /ads commands)
ads/references/*.md       — 12 RAG reference files (benchmarks, checklists, specs)
skills/ads-*/SKILL.md     — 12 sub-skills (one per command: google, meta, etc.)
skills/ads-plan/assets/   — 11 industry templates (saas, ecommerce, etc.)
agents/audit-*.md         — 6 parallel subagents for full audits
scripts/*.py              — 3 Python utilities (landing page analysis)
install.sh / install.ps1  — Installers that copy files to ~/.claude/
```

## Key Commands

```bash
# Install to ~/.claude (copies skills, agents, references)
./install.sh              # Unix/macOS
.\install.ps1             # Windows PowerShell

# Python scripts (optional, require playwright)
pip install -r requirements.txt && playwright install chromium
python scripts/analyze_landing.py https://example.com
python scripts/capture_screenshot.py https://example.com --mobile
python scripts/fetch_page.py https://example.com
```

## Architecture

**Orchestration pattern:** `/ads` (main SKILL.md) receives commands and routes to sub-skills. `/ads audit` spawns 6 subagents in parallel via the Task tool. Individual commands (`/ads google`, `/ads meta`, etc.) load one sub-skill directly.

**RAG pattern for references:** Reference files are loaded on-demand, not at startup. Sub-skills and agents specify which references to read (e.g., `ads/references/google-audit.md`). Path resolution: references installed at `~/.claude/skills/ads/references/`.

**Scoring algorithm:** `S_total = Σ(C_pass × W_sev × W_cat) / Σ(C_total × W_sev × W_cat) × 100`. Severity multipliers: Critical=5.0, High=3.0, Medium=1.5, Low=0.5. Check results: PASS=1.0, WARNING=0.5, FAIL=0, N/A=excluded. Cross-platform aggregate weighted by budget share.

**Agent model:** All 6 agents use `model: sonnet`, `maxTurns: 20`, with tools: Read, Bash, Write, Glob, Grep.

## Quality Gates (never violate)

- Never recommend Broad Match without Smart Bidding (Google)
- 3x Kill Rule: flag CPA >3x target for immediate pause
- Budget sufficiency: Meta ≥5x CPA/ad set, TikTok ≥50x CPA/ad group
- No edits during active learning phase
- Always check Special Ad Categories for housing/employment/credit/finance
- Never run silent video ads on TikTok
- Default attribution: 7-day click / 1-day view (Meta), data-driven (Google)

## Conventions

- **SKILL.md frontmatter:** YAML with `name`, `description`, `allowed-tools`, optional `argument-hint`. Sub-skills have `user-invocable: true` so they appear in the skill menu.
- **Agent frontmatter:** YAML with `name`, `description`, `model`, `maxTurns`, `tools`. No non-spec fields (e.g., `color` was removed).
- **Check IDs:** Platform-prefixed (G01-G74 for Google, M01-M46 for Meta, L01-L25 for LinkedIn, T01-T25 for TikTok, MS01-MS20 for Microsoft).
- **Report files:** Generated at runtime, gitignored (e.g., `ADS-AUDIT-REPORT.md`, `GOOGLE-ADS-REPORT.md`).
- **Version pinning:** requirements.txt uses bounded ranges with CVE-aware minimums.

## When Editing

- Audit check counts must stay consistent across README, CHANGELOG, SKILL.md files, and reference checklists (currently 190 total: 74+46+25+25+20).
- Cross-reference thresholds between templates and audit checks (e.g., PMax image count in ecommerce template must match G31).
- Budget percentage ranges in industry templates must bracket 100%.
- When adding a new platform or check, update: the reference checklist, the agent, the sub-skill, the orchestrator SKILL.md sub-skills list, and README feature table.
