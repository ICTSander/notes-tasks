"use client";

import { useState, useEffect } from "react";
import { useSettings } from "@/lib/useSettings";

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

interface ProviderStatus {
  provider: string;
  hasAnthropicKey: boolean;
  hasOpenAIKey: boolean;
}

export default function SettingsPage() {
  const { settings, setSettings, loaded } = useSettings();
  const [status, setStatus] = useState<ProviderStatus | null>(null);
  const [warning, setWarning] = useState("");

  useEffect(() => {
    fetch("/api/rewrite")
      .then((r) => r.json())
      .then(setStatus)
      .catch(() => {});
  }, []);

  if (!loaded) return null;

  function handleToggleMock() {
    const next = !settings.mockAi;
    if (!next && status && !status.hasAnthropicKey && !status.hasOpenAIKey) {
      setWarning("No API key configured on the server. Mock mode will stay active. Set ANTHROPIC_API_KEY in your environment to enable real AI.");
      return;
    }
    setWarning("");
    setSettings({ mockAi: next });
  }

  function toggleWorkday(idx: number) {
    const next = [...settings.workdays];
    next[idx] = !next[idx];
    setSettings({ workdays: next });
  }

  const providerLabel = status
    ? status.hasAnthropicKey
      ? "Anthropic (Claude)"
      : status.hasOpenAIKey
        ? "OpenAI"
        : "None configured"
    : "Loading...";

  return (
    <div className="max-w-lg space-y-8">
      <div>
        <h1 className="text-xl font-semibold text-text-main">Settings</h1>
        <p className="text-sm text-text-muted mt-1">
          Configure your planning preferences. Stored locally in your browser.
        </p>
      </div>

      <div className="bg-surface rounded-lg border border-border p-5 space-y-6">
        {/* Mock AI Toggle */}
        <div>
          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <p className="text-sm font-medium text-text-main">Mock AI Mode</p>
              <p className="text-xs text-text-muted mt-0.5">
                When enabled, uses simple rule-based rewriting instead of a real LLM.
                Disable to use Claude or OpenAI.
              </p>
            </div>
            <button
              onClick={handleToggleMock}
              className={`relative w-11 h-6 rounded-full transition-colors shrink-0 ml-4 ${
                settings.mockAi ? "bg-accent" : "bg-white/20"
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                  settings.mockAi ? "translate-x-5" : ""
                }`}
              />
            </button>
          </label>
          {warning && (
            <p className="text-xs text-orange-400 mt-2 bg-orange-500/10 rounded-md px-3 py-2">
              {warning}
            </p>
          )}
        </div>

        {/* Daily Minutes */}
        <div>
          <label className="block text-sm font-medium text-text-main mb-1.5">
            Available minutes per day
          </label>
          <input
            type="number"
            value={settings.dailyMinutes}
            onChange={(e) =>
              setSettings({ dailyMinutes: Math.max(15, Math.min(720, Number(e.target.value) || 120)) })
            }
            min={15}
            max={720}
            className="rounded-md border border-border px-3 py-2 text-[16px] bg-input w-32"
          />
          <p className="text-xs text-text-muted mt-1">
            How many minutes per workday you want to plan for (15-720).
          </p>
        </div>

        {/* Workdays */}
        <div>
          <label className="block text-sm font-medium text-text-main mb-2">
            Workdays
          </label>
          <div className="flex gap-2">
            {DAY_LABELS.map((label, idx) => (
              <button
                key={label}
                onClick={() => toggleWorkday(idx)}
                className={`w-10 h-10 rounded-lg text-xs font-medium transition-colors ${
                  settings.workdays[idx]
                    ? "bg-accent text-white"
                    : "bg-surface-hover text-text-muted hover:bg-white/10"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          <p className="text-xs text-text-muted mt-1.5">
            Select which days you want included in the planning view.
          </p>
        </div>
      </div>

      <div className="bg-surface rounded-lg border border-border p-5">
        <h3 className="text-sm font-medium text-text-main mb-2">AI Provider Status</h3>
        <div className="flex items-center gap-2 mb-2">
          <span
            className={`w-2 h-2 rounded-full ${
              status?.hasAnthropicKey || status?.hasOpenAIKey
                ? "bg-green-500"
                : "bg-gray-600"
            }`}
          />
          <span className="text-sm text-text-main">{providerLabel}</span>
        </div>
        <p className="text-xs text-text-muted">
          Set <code className="bg-surface-hover px-1 rounded">ANTHROPIC_API_KEY</code> in your
          environment variables (or Vercel project settings) to use Claude for rewriting.
          When Mock AI is enabled above, the real provider is bypassed.
        </p>
      </div>
    </div>
  );
}
