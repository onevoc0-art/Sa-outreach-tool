import { useState, useEffect } from "react";

const INDUSTRIES = [
  { id: "tech", label: "Software & IT", outsourceScore: 95, icon: "💻" },
  { id: "marketing", label: "Digital Marketing", outsourceScore: 90, icon: "📣" },
  { id: "customer", label: "Customer Support", outsourceScore: 92, icon: "🎧" },
  { id: "finance", label: "Finance & Accounting", outsourceScore: 88, icon: "📊" },
  { id: "ecommerce", label: "eCommerce Ops", outsourceScore: 85, icon: "🛒" },
];

const LEADS = [
  { id: 1, company: "TechFlow Solutions", industry: "tech", size: "SMB", location: "Austin, TX", contact: "Sarah Mitchell", title: "COO" },
  { id: 2, company: "GrowthMark Digital", industry: "marketing", size: "Startup", location: "New York, NY", contact: "James Rivera", title: "CEO" },
  { id: 3, company: "SupportFirst", industry: "customer", size: "Mid-Market", location: "Denver, CO", contact: "Derek Washington", title: "Head of CX" },
  { id: 4, company: "CapitalEdge Financial", industry: "finance", size: "Mid-Market", location: "Dallas, TX", contact: "Amanda Brooks", title: "CFO" },
  { id: 5, company: "ShopSphere Inc", industry: "ecommerce", size: "SMB", location: "Seattle, WA", contact: "Mark Thompson", title: "VP Operations" },
];

export default function App() {
  const [leads, setLeads] = useState([]);
  const [scanning, setScanning] = useState(false);
  const [selected, setSelected] = useState(null);
  const [ai, setAi] = useState("");
  const [loadingAi, setLoadingAi] = useState(false);

  const scan = () => {
    setScanning(true);
    setLeads([]);
    setAi("");
    setTimeout(() => {
      const scored = LEADS.map(l => {
        const ind = INDUSTRIES.find(i => i.id === l.industry);
        const score = Math.min(99, Math.max(60, (ind?.outsourceScore || 70) + Math.floor(Math.random() * 10) - 5));
        return { ...l, score };
      }).sort((a, b) => b.score - a.score);
      setLeads(scored);
      setScanning(false);
    }, 2000);
  };

  const getAi = async () => {
    setLoadingAi(true);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{ role: "user", content: `You help a South African outsourcing company get US clients. Top leads: ${leads.map(l => l.company + " (" + l.industry + ")").join(", ")}. Give 3 sentences: which industry to target first, best value prop, and one 30-day quick win. Plain text only.` }]
        })
      });
      const data = await res.json();
      setAi(data.content?.map(c => c.text || "").join("") || "No response.");
    } catch {
      setAi("Could not connect to AI.");
    }
    setLoadingAi(false);
  };

  const email = (lead) => {
    const templates = {
      tech: `Subject: Cut Dev Costs 60% — South Africa Tech Talent\n\nHi ${lead.contact.split(" ")[0]},\n\nWe help US tech companies like ${lead.company} access world-class developers in South Africa at 40-60% lower cost with a 6+ hour US timezone overlap.\n\nWorth a 15-min call?\n\nBest,\n[Your Name]`,
      marketing: `Subject: Scale Marketing Ops at Half the US Cost\n\nHi ${lead.contact.split(" ")[0]},\n\nWe connect US businesses with South Africa's top marketing talent at 50% below US rates — native English, Western business culture.\n\nOpen to a quick call?\n\nBest,\n[Your Name]`,
      customer: `Subject: Elite 24/7 Support Team from $8/hr\n\nHi ${lead.contact.split(" ")[0]},\n\nWe build customer support teams in South Africa for US companies like ${lead.company} — native English, 55% cost savings.\n\nCan we chat?\n\nBest,\n[Your Name]`,
    };
    return templates[lead.industry] || `Subject: Save 50% on Ops — South Africa Outsourcing\n\nHi ${lead.contact.split(" ")[0]},\n\nWe help US companies save 50%+ by outsourcing to South Africa. Would love to show you how ${lead.company} could benefit.\n\nBest,\n[Your Name]`;
  };

  const scoreColor = s => s >= 85 ? "#00e5a0" : s >= 70 ? "#f5c400" : "#ff6b6b";

  return (
    <div style={{ minHeight: "100vh", background: "#060d1a", color: "#e8f0fe", fontFamily: "sans-serif", padding: 20 }}>
      <div style={{ maxWidth: 600, margin: "0 auto" }}>
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 22, fontWeight: 800 }}>🇿🇦 SA Outreach AI</div>
          <div style={{ fontSize: 13, color: "#5a7a9a" }}>US Client Acquisition Tool</div>
        </div>

        <button onClick={scan} disabled={scanning} style={{ background: scanning ? "#1e2d45" : "#00b87a", border: "none", borderRadius: 10, padding: "12px 24px", color: "#fff", fontWeight: 700, fontSize: 15, cursor: "pointer", marginBottom: 24 }}>
          {scanning ? "⏳ Scanning..." : "🔍 Scan for US Leads"}
        </button>

        {leads.length > 0 && (
          <div style={{ marginBottom: 16, display: "flex", gap: 12 }}>
            <div style={{ background: "#0f1623", border: "1px solid #1e2d45", borderRadius: 10, padding: "12px 20px", textAlign: "center" }}>
              <div style={{ fontSize: 24, fontWeight: 800, color: "#4a9eff" }}>{leads.length}</div>
              <div style={{ fontSize: 11, color: "#5a7a9a" }}>Total Leads</div>
            </div>
            <div style={{ background: "#0f1623", border: "1px solid #1e2d45", borderRadius: 10, padding: "12px 20px", textAlign: "center" }}>
              <div style={{ fontSize: 24, fontWeight: 800, color: "#00e5a0" }}>{leads.filter(l => l.score >= 85).length}</div>
              <div style={{ fontSize: 11, color: "#5a7a9a" }}>Hot Leads</div>
            </div>
          </div>
        )}

        {leads.map(lead => (
          <div key={lead.id} style={{ background: "#0f1623", border: "1px solid #1e2d45", borderRadius: 12, padding: 16, marginBottom: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontWeight: 700 }}>{lead.company}</div>
                <div style={{ fontSize: 12, color: "#5a7a9a" }}>{lead.contact} · {lead.title} · {lead.location}</div>
              </div>
              <div style={{ background: scoreColor(lead.score) + "22", border: `1px solid ${scoreColor(lead.score)}`, color: scoreColor(lead.score), borderRadius: 6, padding: "2px 10px", fontSize: 13, fontWeight: 700 }}>
                {lead.score}
              </div>
            </div>
            <button onClick={() => setSelected(selected?.id === lead.id ? null : lead)} style={{ marginTop: 10, background: "transparent", border: "1px solid #1e3a5f", color: "#4a9eff", borderRadius: 8, padding: "6px 14px", cursor: "pointer", fontSize: 12 }}>
              {selected?.id === lead.id ? "Hide Email" : "✉ View Email"}
            </button>
            {selected?.id === lead.id && (
              <pre style={{ marginTop: 10, background: "#060d1a", border: "1px solid #1e2d45", borderRadius: 8, padding: 12, color: "#b0c8e8", fontSize: 12, whiteSpace: "pre-wrap" }}>
                {email(lead)}
              </pre>
            )}
          </div>
        ))}

        {leads.length > 0 && (
          <div style={{ marginTop: 8 }}>
            <button onClick={getAi} disabled={loadingAi} style={{ background: "#1a2a5a", border: "1px solid #2a4a7f", borderRadius: 10, padding: "12px 24px", color: "#fff", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>
              {loadingAi ? "⏳ Thinking..." : "✨ Get AI Strategy"}
            </button>
            {ai && (
              <div style={{ marginTop: 12, background: "#0a1628", border: "1px solid #2a4a7f", borderRadius: 10, padding: 16, fontSize: 14, color: "#b0c8e8", lineHeight: 1.7 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#4a9eff", marginBottom: 8 }}>AI STRATEGY</div>
                {ai}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
