import { readMbankLaunch } from '@/shared/native/mbank/launch'
// This module must evaluate BEFORE app/router and telemetry. Capture once, outside React.
export const launch = readMbankLaunch(window.location.href, (safeHref) =>
  window.history.replaceState(window.history.state, '', safeHref),
)
