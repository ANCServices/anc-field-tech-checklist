"use client";

import { useEffect, useMemo, useState } from "react";

export default function ANCFieldTechMobileChecklist() {
  const sections = [
    {
      key: "attire",
      title: "Attire (Mandatory)",
      emoji: "👕",
      color: "border-slate-400",
      bg: "bg-slate-50",
      items: ["ANC polo (preferred)", "Khaki pants", "Closed-toe shoes"],
    },
    {
      key: "livesync",
      title: "LiveSync – Pre Event",
      emoji: "🔵",
      color: "border-blue-500",
      bg: "bg-blue-50",
      items: [
        "Restart primary + backup renders software",
        "Verify LiveSync (UI / Render / DataCollector)",
        "Run full screen + game content",
        "Confirm stats/data working",
        "Check outputs + routing",
        "Test failover",
      ],
    },
    {
      key: "led",
      title: "LED – Pre Event",
      emoji: "🟢",
      color: "border-green-500",
      bg: "bg-green-50",
      items: [
        "Verify processors power",
        "Verify signal on all displays",
        "Run full screen test content",
        "Check color / brightness / mapping",
        "Test backup input",
      ],
    },
    {
      key: "during",
      title: "During Event",
      emoji: "🟠",
      color: "border-orange-500",
      bg: "bg-orange-50",
      items: [
        "Monitor displays + data + playback",
        "Restart service if needed",
        "Reroute signal if needed",
        "Switch to backup if needed",
        "Do NOT wait on issues",
      ],
    },
    {
      key: "escalate",
      title: "Escalate Immediately If",
      emoji: "🔴",
      color: "border-red-500",
      bg: "bg-red-50",
      items: [
        "Issue lasts more than 5 minutes",
        "Multiple displays are down",
        "Stats/data not updating",
        "Server or processor failure",
      ],
    },
    {
      key: "support",
      title: "Support",
      emoji: "🟣",
      color: "border-purple-500",
      bg: "bg-purple-50",
      items: [
        "Email: support@anc.com",
        "Include venue, issue, time, and steps taken",
        "Stay engaged until resolved",
      ],
    },
  ];

  const storageKey = "anc-field-tech-checklist";
  const totalItems = useMemo(
    () => sections.reduce((sum, section) => sum + section.items.length, 0),
    []
  );

  const [checked, setChecked] = useState({});
  const [isLoaded, setIsLoaded] = useState(false);
  const [installPromptEvent, setInstallPromptEvent] = useState(null);
  const [installMessage, setInstallMessage] = useState("");

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(storageKey);
      if (saved) {
        setChecked(JSON.parse(saved));
      }
    } catch {}
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(checked));
    } catch {}
  }, [checked, isLoaded]);

  useEffect(() => {
    const handler = (event) => {
      event.preventDefault();
      setInstallPromptEvent(event);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const checkedCount = Object.values(checked).filter(Boolean).length;
  const progress = Math.round((checkedCount / totalItems) * 100);

  const toggle = (key) => {
    setChecked((current) => ({
      ...current,
      [key]: !current[key],
    }));
  };

  const resetAll = () => {
    setChecked({});
    try {
      window.localStorage.removeItem(storageKey);
    } catch {}
  };

  const installApp = async () => {
    if (installPromptEvent) {
      await installPromptEvent.prompt();
      const result = await installPromptEvent.userChoice;
      if (result?.outcome === "accepted") {
        setInstallMessage("App added to home screen.");
      } else {
        setInstallMessage("Install was dismissed.");
      }
      setInstallPromptEvent(null);
      return;
    }

    setInstallMessage(
      "On iPhone: tap Share, then Add to Home Screen. On Android/Chrome: use the browser menu and tap Install App or Add to Home Screen."
    );
  };

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <div className="mx-auto max-w-md px-4 py-5">
        <div className="sticky top-0 z-10 -mx-4 border-b bg-white/95 px-4 py-3 backdrop-blur">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                ANC Field Tech
              </p>
              <h1 className="text-lg font-bold tracking-tight">Event Day Mobile Checklist</h1>
              <p className="mt-1 text-sm text-slate-600">Progress saves automatically on this device.</p>
            </div>
            <button
              onClick={resetAll}
              className="rounded-full border border-slate-300 bg-white px-3 py-2 text-sm font-semibold shadow-sm"
            >
              Reset
            </button>
          </div>
        </div>

        <div className="mt-4 space-y-4 pb-24">
          <div className="rounded-2xl border border-slate-300 bg-white p-4 shadow-sm">
            <div className="mb-2 flex items-center justify-between gap-3 text-sm">
              <span className="font-medium text-slate-600">Progress</span>
              <strong>{checkedCount}/{totalItems} complete</strong>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-slate-200">
              <div
                className="h-full rounded-full bg-slate-900 transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="mt-2 text-xs text-slate-500">{progress}% complete</p>
          </div>

          <div className="rounded-2xl border border-slate-300 bg-slate-50 p-4 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold">Install on phone</p>
                <p className="text-xs text-slate-600">Use it like an app from the home screen.</p>
              </div>
              <button
                onClick={installApp}
                className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm"
              >
                Install
              </button>
            </div>
            {installMessage ? (
              <p className="mt-3 text-xs leading-5 text-slate-600">{installMessage}</p>
            ) : null}
          </div>

          {sections.map((section) => (
            <SectionCard key={section.title} section={section} checked={checked} toggle={toggle} />
          ))}

          <div className="rounded-2xl border border-slate-300 bg-slate-50 p-4 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Rule of Thumb</p>
            <p className="mt-2 text-base font-semibold">Fix fast → escalate early → never assume</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function SectionCard({ section, checked, toggle }) {
  return (
    <div className={`rounded-2xl border-l-4 ${section.color} ${section.bg} p-4 shadow-sm`}>
      <div className="mb-3 flex items-center gap-2">
        <span className="text-xl">{section.emoji}</span>
        <h2 className="text-base font-bold leading-tight">{section.title}</h2>
      </div>

      <div className="space-y-2.5">
        {section.items.map((item, index) => {
          const itemKey = `${section.key}-${index}`;
          const isChecked = !!checked[itemKey];

          return (
            <label
              key={itemKey}
              className={`flex items-start gap-3 rounded-xl p-3 shadow-sm transition ${
                isChecked ? "bg-slate-100" : "bg-white/80"
              }`}
            >
              <input
                type="checkbox"
                checked={isChecked}
                onChange={() => toggle(itemKey)}
                className="mt-1 h-5 w-5 shrink-0 rounded border-slate-300"
              />
              <span className={`text-sm leading-5 ${isChecked ? "text-slate-500 line-through" : ""}`}>
                {item}
              </span>
            </label>
          );
        })}
      </div>
    </div>
  );
}
