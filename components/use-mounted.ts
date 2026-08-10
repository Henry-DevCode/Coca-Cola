"use client";

import { useSyncExternalStore } from "react";

// Never emits — we only care about the initial snapshot difference.
const noopSubscribe = () => () => {};
const getSnapshot = () => true;
const getServerSnapshot = () => false;

export function useMounted(): boolean {
  return useSyncExternalStore(noopSubscribe, getSnapshot, getServerSnapshot);
}
