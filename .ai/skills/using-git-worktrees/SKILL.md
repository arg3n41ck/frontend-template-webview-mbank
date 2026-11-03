---
name: using-git-worktrees
description: Use when parallel or unrelated code work needs isolation from an existing checkout.
---

# Using Git Worktrees

Project AGENTS.md, actual source and explicit user intent override generic workflow assumptions. Load only for the matching task.

1. Inspect git status, current branch and git worktree list. Reuse existing appropriate isolation; do not create another worktree merely because this skill loaded.
2. Select the base and branch from project rules or user intent; do not invent remote branches or assume main/dev universally. Check the chosen ref exists.
3. Prefer a supported native worktree facility; otherwise use git worktree add with quoted paths in an agreed disposable sibling location. Never switch, stash or reset a dirty user checkout to make room.
4. Inspect scripts before installing project dependencies; follow the lockfile/package manager. Do not symlink node_modules across checkouts.
5. Run baseline verification and report pre-existing failures. Keep changes within the assigned workspace.
6. Before cleanup check for uncommitted/untracked work and obtain authorization for removal. Never force-remove or delete another task's worktree.

Output: workspace path, branch/base and baseline status. No worktree is needed for a read-only answer or an already isolated task.
