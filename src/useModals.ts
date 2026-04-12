"use client";

import { useSyncExternalStore } from "react";
import type { EntryList, Store } from "./types";
import { store as defaultStore } from "./store";

type Options = {
  store: Store;
};

export const useModals = (
  { store }: Options = { store: defaultStore },
): EntryList => {
  return useSyncExternalStore(
    store.subscribe,
    store.getSnapshot,
    store.getServerSnapshot,
  );
};
