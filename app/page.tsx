"use client";

import { useMemo, useState } from "react";

type Section = {
  key: string;
  title: string;
  emoji: string;
  accent: string;
  background: string;
  items: string[];
};

const sections: Section[] = [
  {
    key: "attire",
    title: "Attire (Mandatory)",
    emoji: "👕",
    accent: "#475569",
    background: "#f8fafc",
    items: [
      "ANC polo (preferred)",
      "Khaki pants",
      "Closed-toe shoes"
    ]
  },
  {
    key: "livesync",
    title: "LiveSync – Pre Event",
    emoji: "🔵",
    accent: "#2563eb",
    background: "#eff6ff",
    items: [
      "Boot primary + backup renders",
      "Verify LiveSync (UI / Render / DataCollector)",
      "Run full screen + game content",
      "Confirm stats/data working",
      "Check outputs + routing",
      "Test failover"
    ]
  },
  {
    key: "led",
    title: "LED – Pre Event",
    emoji: "🟢",
    accent: "#16a34a",
    background: "#f0fdf4",
    items: [
      "Power processors + switchers",
      "Verify signal on all displays",
      "Run full screen test content",
      "Check color / brightness / mapping",
      "Test backup input"
    ]
  },
  {
    key: "during",
    title: "During Event",
    emoji: "🟠",
    accent: "#ea580c",
    background: "#fff7ed",
    items: [
      "Monitor displays + data + playback",
      "Restart service if needed",
      "Reroute signal if needed",
      "Switch to backup if needed",
      "Do NOT wait on issues"
    ]
  },
  {
    key: "escalate",
    title: "Escalate Immediately If",
    emoji: "🔴",
    accent: "#dc2626",
    background: "#fef2f2",
    items: [
      "Issue lasts more than 5 minutes",
      "Multiple displays are down",
      "Stats/data not updating",
      "Server or processor failure"
    ]
  },
  {
    key: "support",
    title: "Support",
    emoji: "🟣",
    accent: "#9333ea",
    background: "#faf5ff",
    items: [
      "Email: support@anc.com",
      "Include venue, issue, time, and steps taken",
      "Stay engaged until resolved"
    ]
  }
];

export default function HomePage() {
  const totalItems = useMemo(
    () => sections.reduce((sum, section) => sum + section.items.length, 0),
    []
  );

  const [checked, setChecked] = useState<Record<string, boolean>>({});

  const checkedCount = Object.values(checked).filter(Boolean).length;
  const progress = Math.round((checkedCount / totalItems) * 100);

  const toggle = (key: string) => {
    setChecked((current) => ({
      ...current,
      [key]: !current[key]
    }));
  };

  const resetAll = () => setChecked({});

  return (
    <main className="page">
      <div className="shell">
        <header className="topbar">
          <div>
            <p className="eyebrow">ANC Field Tech</p>
            <h1>Event Day Checklist</h1>
            <p className="subtext">Mobile-friendly checklist for fast onsite use</p>
          </div>
          <button className="resetButton" onClick={resetAll}>
            Reset
          </button>
        </header>

        <section className="progressCard">
          <div className="progressHeader">
            <span>Progress</span>
            <strong>{checkedCount}/{totalItems} complete</strong>
          </div>
          <div className="progressBar">
            <div className="progressFill" style={{ width: `${progress}%` }} />
          </div>
          <p className="progressText">{progress}% complete</p>
        </section>

        <div className="sectionList">
          {sections.map((section) => (
            <section
              key={section.key}
              className="sectionCard"
              style={{
                borderLeftColor: section.accent,
                backgroundColor: section.background
              }}
            >
              <div className="sectionHeader">
                <span className="sectionEmoji">{section.emoji}</span>
                <h2>{section.title}</h2>
              </div>

              <div className="itemList">
                {section.items.map((item, index) => {
                  const itemKey = `${section.key}-${index}`;
                  const isChecked = !!checked[itemKey];

                  return (
                    <label key={itemKey} className={`item ${isChecked ? "itemChecked" : ""}`}>
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggle(itemKey)}
                      />
                      <span>{item}</span>
                    </label>
                  );
                })}
              </div>
            </section>
          ))}
        </div>

        <section className="ruleCard">
          <p className="eyebrow">Rule of Thumb</p>
          <p className="ruleText">Fix fast → escalate early → never assume</p>
        </section>
      </div>
    </main>
  );
}
