# Local Graphify runtime

The skill is bundled; Python packages are installed separately in an isolated environment. Python 3.10+ is required. Verified package: `graphifyy==0.9.55` (the package has two trailing y characters; the command is graphify). See [upstream](https://github.com/Graphify-Labs/graphify) and [pinned package](https://pypi.org/project/graphifyy/0.9.55/).

## Setup (explicitly authorized, never postinstall)

Unix/macOS:

```bash
python3 -m venv .venv-graphify
.venv-graphify/bin/python -m pip install --only-binary=:all: graphifyy==0.9.55
.venv-graphify/bin/python .ai/skills/graphify/scripts/build_graph.py --source src
```

Windows PowerShell:

```powershell
py -3 -m venv .venv-graphify
.venv-graphify\Scripts\python.exe -m pip install --only-binary=:all: graphifyy==0.9.55
.venv-graphify\Scripts\python.exe .ai/skills/graphify/scripts/build_graph.py --source src
```

Check the interpreter version first. If compatible wheels are unavailable, stop and report it rather than changing system packages. Do not run `graphify install`: template skills/adapters are already installed and must not be replaced by upstream defaults.

## Outputs and safety

The adapter extracts only the supplied in-project code folders, without symlinks, semantic API calls or model credentials. Generated graph/cache and scope metadata live in ignored `graphify-out/`; runtime lives in ignored `.venv-graphify/`. No global config, hooks or background service is installed. Re-run after relevant source changes; verify graph findings against current code. Use `graphify explain`/`path` with a graph and node labels actually observed in its JSON. The smoke verifies AST extraction and graph assembly, not semantic completeness or every optional exporter.

Keep `.wiki/` for durable business meaning; do not commit the generated graph as the authoritative architecture. Runtime version changes require a new smoke test; reference procedures may describe older upstream APIs.
