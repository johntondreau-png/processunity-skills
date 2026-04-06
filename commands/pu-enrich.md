---
description: Run vendor data enrichment pipeline against ProcessUnity
allowed-tools: Bash, Read, Write, Edit, Glob, Grep
argument-hint: <enrichment mode: script | workato | interactive | template-builder>
---

Enrich vendor data in ProcessUnity by pulling intelligence from external APIs.

## Instructions

1. Read the pu-enrich skill at `${CLAUDE_PLUGIN_ROOT}/skills/pu-enrich/SKILL.md`
2. Follow the skill's user interaction flow:
   - Ask which PU instance to target
   - Discover available reports and import templates
   - Ask which enrichment sources to run (9 categories available)
   - Ask which execution mode: Script Generator, Workato Recipe, Interactive, or Template Builder
3. Execute the selected enrichment pipeline
4. Report results and confirm before pushing to PU
