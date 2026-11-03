# Decisions

- Two independent WebView starters share a versioned baseline; generic contains no bank contract.
- TanStack Query owns server data; Router owns URL search; no Redux or extra global state manager.
- Native operations unavailable by default; no fake success in production.
- A native waiting timeout does not cancel a payment and does not authorize replay.
- Modern-only CSS stack until host minimum engine compatibility is established. Browser tests are not native evidence.
