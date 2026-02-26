"use client";

import { useState, useEffect, useCallback } from "react";
import { DEFAULT_SETTINGS, type Settings } from "./types";

const STORAGE_KEY = "notes-tasks-settings";

export function useSettings() {
  const [settings, setSettingsState] = useState<Settings>(DEFAULT_SETTINGS);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        setSettingsState({ ...DEFAULT_SETTINGS, ...parsed });
      }
    } catch {
      // ignore
    }
    setLoaded(true);
  }, []);

  const setSettings = useCallback((next: Partial<Settings>) => {
    setSettingsState((prev) => {
      const merged = { ...prev, ...next };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
      return merged;
    });
  }, []);

  return { settings, setSettings, loaded };
}
