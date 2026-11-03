---
name: systematic-debugging
description: Use when investigating a reproducible error, failed test or unexpected behavior.
---

# Systematic Debugging

Capture reproduction, expected/actual behavior and environment. Trace the earliest failing boundary in actual source. Form one falsifiable hypothesis and test it. Add a regression test where the existing harness supports it. Apply the smallest fix, rerun original scenario and impacted checks. Separate environment failures from code failures; do not repeatedly guess or disable checks.
