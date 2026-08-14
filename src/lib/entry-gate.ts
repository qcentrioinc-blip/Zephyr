const ENTRY_GATE_KEY = "zephyr:entry-gate-seen";

/** True after the user has clicked through the entry gate this browser session. */
export function hasSeenEntryGate(): boolean {
  try {
    return sessionStorage.getItem(ENTRY_GATE_KEY) === "1";
  } catch {
    return false;
  }
}

export function markEntryGateSeen(): void {
  try {
    sessionStorage.setItem(ENTRY_GATE_KEY, "1");
  } catch {
    /* private mode / quota */
  }
}
