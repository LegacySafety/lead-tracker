import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Plus,
  Phone,
  CalendarDays,
  Trophy,
  StickyNote,
  Flame,
  Snowflake,
  Sun,
  Briefcase,
  Timer,
  Mail,
  MapPin,
  Waypoints,
  BarChart3,
  X,
} from "lucide-react";

const BRAND = {
  navy: "#0B3F86",
  blue: "#4C82BF",
  sky: "#DCE9F8",
  mist: "#EEF4FB",
  ink: "#16324F",
  white: "#FFFFFF",
};

const initialLeads = [
  {
    id: crypto.randomUUID(),
    name: "Acme Manufacturing",
    contact: "Jordan Lee",
    email: "jordan@acme.com",
    phone: "(555) 123-4567",
    address: "123 Industrial Way, Dallas, TX",
    source: "Referral",
    status: "hot",
    firstContact: "2026-04-02",
    lastContact: "2026-04-10",
    nextFollowUp: "2026-04-18",
    notes: "Asked for updated pricing and implementation timeline.",
    capturedDate: "",
  },
  {
    id: crypto.randomUUID(),
    name: "North Ridge Supply",
    contact: "Avery Chen",
    email: "avery@northridge.com",
    phone: "(555) 888-1212",
    address: "455 Market St, Denver, CO",
    source: "Cold call",
    status: "warm",
    firstContact: "2026-04-01",
    lastContact: "2026-04-08",
    nextFollowUp: "2026-04-20",
    notes: "Good first call. Interested but needs internal approval.",
    capturedDate: "",
  },
  {
    id: crypto.randomUUID(),
    name: "Blue Harbor Logistics",
    contact: "Morgan Patel",
    email: "morgan@blueharbor.com",
    phone: "(555) 222-9999",
    address: "78 Port Ave, Long Beach, CA",
    source: "Website inquiry",
    status: "cold",
    firstContact: "2026-03-20",
    lastContact: "2026-03-27",
    nextFollowUp: "2026-04-22",
    notes: "No response yet. Try again with a case study.",
    capturedDate: "",
  },
];

const statusStyles = {
  hot: { label: "Hot", className: "badge badge-hot", icon: Flame },
  warm: { label: "Warm", className: "badge badge-warm", icon: Sun },
  cold: { label: "Cold", className: "badge badge-cold", icon: Snowflake },
  captured: { label: "Captured", className: "badge badge-captured", icon: Trophy },
};

function emptyLead() {
  return {
    id: "",
    name: "",
    contact: "",
    email: "",
    phone: "",
    address: "",
    source: "",
    status: "warm",
    firstContact: "",
    lastContact: "",
    nextFollowUp: "",
    notes: "",
    capturedDate: "",
  };
}

function calculateDaysToCapture(firstContact, capturedDate) {
  if (!firstContact || !capturedDate) return null;
  const first = new Date(firstContact);
  const captured = new Date(capturedDate);
  if (Number.isNaN(first.getTime()) || Number.isNaN(captured.getTime())) return null;
  const diffMs = captured.getTime() - first.getTime();
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
  return diffDays >= 0 ? diffDays : null;
}

function saveLeadsToStorage(leads) {
  if (typeof window === "undefined") return;
  localStorage.setItem("legacy-safety-leads", JSON.stringify(leads));
}

function loadLeadsFromStorage() {
  if (typeof window === "undefined") return initialLeads;
  const saved = localStorage.getItem("legacy-safety-leads");
  if (!saved) return initialLeads;
  try {
    return JSON.parse(saved);
  } catch {
    return initialLeads;
  }
}

function Field({ label, children }) {
  return (
    <div>
      <label className="field-label">{label}</label>
      {children}
    </div>
  );
}

function InfoRow({ icon: Icon, label, value }) {
  if (!value) return null;
  return (
    <div className="info-row">
      <Icon size={16} className="info-icon" />
      <p>
        <span className="info-label">{label}:</span> {value}
      </p>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, subtitle }) {
  return (
    <div className="stat-card">
      <div className="stat-inner">
        <div>
          <p className="stat-title">{title}</p>
          <p className="stat-value">{value}</p>
          <p className="stat-subtitle">{subtitle}</p>
        </div>
        <div className="stat-icon-wrap">
          <Icon size={24} className="stat-icon" />
        </div>
      </div>
    </div>
  );
}

function Modal({ open, title, children, onClose }) {
  if (!open) return null;
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{title}</h2>
          <button className="icon-button" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function LeadForm({ lead, onChange, onSave, saveLabel = "Save lead" }) {
  const daysToCapture = calculateDaysToCapture(lead.firstContact, lead.capturedDate);

  return (
    <div className="form-grid">
      <div className="two-col">
        <input className="input" placeholder="Company name" value={lead.name} onChange={(e) => onChange({ ...lead, name: e.target.value })} />
        <input className="input" placeholder="Contact person" value={lead.contact} onChange={(e) => onChange({ ...lead, contact: e.target.value })} />
      </div>

      <input className="input" placeholder="Company address" value={lead.address} onChange={(e) => onChange({ ...lead, address: e.target.value })} />
      <input className="input" placeholder="How was this lead found? (Referral, cold call, website, etc.)" value={lead.source} onChange={(e) => onChange({ ...lead, source: e.target.value })} />

      <div className="two-col">
        <input className="input" placeholder="Email" value={lead.email} onChange={(e) => onChange({ ...lead, email: e.target.value })} />
        <input className="input" placeholder="Phone" value={lead.phone} onChange={(e) => onChange({ ...lead, phone: e.target.value })} />
      </div>

      <div className="four-col">
        <Field label="Lead status">
          <select className="input" value={lead.status} onChange={(e) => onChange({ ...lead, status: e.target.value })}>
            <option value="hot">Hot</option>
            <option value="warm">Warm</option>
            <option value="cold">Cold</option>
            <option value="captured">Captured</option>
          </select>
        </Field>

        <Field label="First contact">
          <input className="input" type="date" value={lead.firstContact} onChange={(e) => onChange({ ...lead, firstContact: e.target.value })} />
        </Field>

        <Field label="Last contact">
          <input className="input" type="date" value={lead.lastContact} onChange={(e) => onChange({ ...lead, lastContact: e.target.value })} />
        </Field>

        <Field label="Next follow-up">
          <input className="input" type="date" value={lead.nextFollowUp} onChange={(e) => onChange({ ...lead, nextFollowUp: e.target.value })} />
        </Field>
      </div>

      {lead.status === "captured" && (
        <div className="two-col">
          <Field label="Captured date">
            <input className="input" type="date" value={lead.capturedDate} onChange={(e) => onChange({ ...lead, capturedDate: e.target.value })} />
          </Field>
          <Field label="Time to capture">
            <div className="readonly-field">
              {daysToCapture !== null ? `${daysToCapture} days` : "Add first contact and captured date"}
            </div>
          </Field>
        </div>
      )}

      <Field label="Notes">
        <textarea className="textarea" placeholder="Add conversation notes, objections, next steps, and reminders..." value={lead.notes} onChange={(e) => onChange({ ...lead, notes: e.target.value })} />
      </Field>

      <button className="brand-button" onClick={onSave}>{saveLabel}</button>
    </div>
  );
}

export default function Home() {
  const [leads, setLeads] = useState(() => loadLeadsFromStorage());
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [newLead, setNewLead] = useState(emptyLead());
  const [editingLead, setEditingLead] = useState(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [tab, setTab] = useState("active");

  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      const haystack = [
        lead.name,
        lead.contact,
        lead.email,
        lead.phone,
        lead.address,
        lead.source,
        lead.notes,
        lead.firstContact,
      ]
        .join(" ")
        .toLowerCase();

      const matchesSearch = haystack.includes(search.toLowerCase());
      const matchesFilter = filter === "all" ? true : lead.status === filter;
      return matchesSearch && matchesFilter;
    });
  }, [leads, search, filter]);

  const activeLeads = filteredLeads.filter((lead) => lead.status !== "captured");
  const capturedLeads = filteredLeads.filter((lead) => lead.status === "captured");

  const counts = useMemo(
    () => ({
      total: leads.length,
      hot: leads.filter((l) => l.status === "hot").length,
      warm: leads.filter((l) => l.status === "warm").length,
      cold: leads.filter((l) => l.status === "cold").length,
      captured: leads.filter((l) => l.status === "captured").length,
    }),
    [leads]
  );

  const averageDaysToCapture = useMemo(() => {
    const captured = leads
      .map((lead) => calculateDaysToCapture(lead.firstContact, lead.capturedDate))
      .filter((value) => value !== null);
    if (!captured.length) return null;
    return Math.round(captured.reduce((sum, value) => sum + value, 0) / captured.length);
  }, [leads]);

  const updateLeads = (next) => {
    setLeads(next);
    saveLeadsToStorage(next);
  };

  const saveNewLead = () => {
    if (!newLead.name.trim()) return;
    const leadToSave = {
      ...newLead,
      id: crypto.randomUUID(),
      capturedDate: newLead.status === "captured" ? newLead.capturedDate || new Date().toISOString().slice(0, 10) : "",
    };
    updateLeads([leadToSave, ...leads]);
    setNewLead(emptyLead());
    setIsCreateOpen(false);
  };

  const saveEditedLead = () => {
    if (!editingLead?.name?.trim()) return;
    const normalized = {
      ...editingLead,
      capturedDate: editingLead.status === "captured" ? editingLead.capturedDate || new Date().toISOString().slice(0, 10) : "",
    };
    updateLeads(leads.map((lead) => (lead.id === normalized.id ? normalized : lead)));
    setEditingLead(null);
    setIsEditOpen(false);
  };

  const markCaptured = (leadId) => {
    updateLeads(
      leads.map((lead) =>
        lead.id === leadId
          ? { ...lead, status: "captured", capturedDate: lead.capturedDate || new Date().toISOString().slice(0, 10) }
          : lead
      )
    );
    setTab("captured");
  };

  const deleteLead = (leadId) => {
    updateLeads(leads.filter((lead) => lead.id !== leadId));
    if (editingLead?.id === leadId) {
      setEditingLead(null);
      setIsEditOpen(false);
    }
  };

  const openEdit = (lead) => {
    setEditingLead(lead);
    setIsEditOpen(true);
  };

  const displayedLeads = tab === "active" ? activeLeads : capturedLeads;

  return (
    <div className="page-shell">
      <div className="container">
        <section className="hero">
          <div className="hero-content">
            <div className="brand-row">
              <div className="logo-wrap">
                <img src="/logo.png" alt="Legacy Safety Services" className="logo" />
              </div>
              <div>
                <h1 className="hero-title">Sales Lead Tracker</h1>
                <p className="hero-subtitle">
                  Legacy Safety branded lead management for tracking outreach, follow-ups, notes, and captured contracts.
                </p>
              </div>
            </div>

            <button className="hero-button" onClick={() => setIsCreateOpen(true)}>
              <Plus size={16} />
              Add lead
            </button>
          </div>
        </section>

        <section className="stats-grid">
          <StatCard title="Total leads" value={counts.total} icon={Briefcase} subtitle="All prospects and wins" />
          <StatCard title="Hot" value={counts.hot} icon={Flame} subtitle="Highest priority" />
          <StatCard title="Warm" value={counts.warm} icon={Sun} subtitle="Needs follow-up" />
          <StatCard title="Cold" value={counts.cold} icon={Snowflake} subtitle="Longer nurture cycle" />
          <StatCard title="Captured" value={counts.captured} icon={Trophy} subtitle="Won contracts" />
          <StatCard title="Avg. days" value={averageDaysToCapture ?? "-"} icon={BarChart3} subtitle="Average time to capture" />
        </section>

        <section className="toolbar-card">
          <div className="toolbar-row">
            <div className="search-wrap">
              <Search size={16} className="search-icon" />
              <input
                className="input search-input"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by company, contact, email, phone, address, source, first contact, or notes"
              />
            </div>

            <select className="input filter-select" value={filter} onChange={(e) => setFilter(e.target.value)}>
              <option value="all">All leads</option>
              <option value="hot">Hot</option>
              <option value="warm">Warm</option>
              <option value="cold">Cold</option>
              <option value="captured">Captured</option>
            </select>
          </div>
        </section>

        <section className="tabs-row">
          <button className={`tab-button ${tab === "active" ? "tab-active" : ""}`} onClick={() => setTab("active")}>
            Active Leads
          </button>
          <button className={`tab-button ${tab === "captured" ? "tab-active" : ""}`} onClick={() => setTab("captured")}>
            Captured
          </button>
        </section>

        {displayedLeads.length === 0 ? (
          <section className="empty-card">
            <p className="empty-title">{tab === "active" ? "No active leads found" : "No captured contracts yet"}</p>
            <p className="empty-copy">
              {tab === "active"
                ? "Try adjusting your search or add a new prospect."
                : "When you win a deal, mark the lead as captured and it will appear here."}
            </p>
          </section>
        ) : (
          <section className="lead-grid">
            {displayedLeads.map((lead) => {
              const statusMeta = statusStyles[lead.status];
              const StatusIcon = statusMeta.icon;
              const daysToCapture = calculateDaysToCapture(lead.firstContact, lead.capturedDate);

              return (
                <motion.div
                  key={lead.id}
                  layout
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <article className="lead-card">
                    <div className="lead-topbar" />
                    <div className="lead-body">
                      <div className="lead-header">
                        <div>
                          <h3 className="lead-title">{lead.name}</h3>
                          <p className="lead-contact">{lead.contact || "No contact listed"}</p>
                        </div>
                        <span className={statusMeta.className}>
                          <StatusIcon size={14} />
                          {statusMeta.label}
                        </span>
                      </div>

                      <div className="info-stack">
                        <InfoRow icon={MapPin} label="Address" value={lead.address} />
                        <InfoRow icon={Waypoints} label="Source" value={lead.source} />
                        <InfoRow icon={Mail} label="Email" value={lead.email} />
                        <InfoRow icon={Phone} label="Phone" value={lead.phone} />
                      </div>

                      <div className="mini-grid">
                        <div className="mini-card">
                          <div className="mini-label"><CalendarDays size={14} /> First contact</div>
                          <p className="mini-value">{lead.firstContact || "Not set"}</p>
                        </div>
                        <div className="mini-card">
                          <div className="mini-label"><Phone size={14} /> Last contact</div>
                          <p className="mini-value">{lead.lastContact || "Not set"}</p>
                        </div>
                        <div className="mini-card">
                          <div className="mini-label"><CalendarDays size={14} /> Next follow-up</div>
                          <p className="mini-value">{lead.nextFollowUp || "Not set"}</p>
                        </div>
                      </div>

                      {lead.status === "captured" && (
                        <div className="capture-grid">
                          <div className="capture-card">
                            <div className="capture-label"><Trophy size={14} /> Captured date</div>
                            <p className="capture-value">{lead.capturedDate || "Not set"}</p>
                          </div>
                          <div className="capture-card">
                            <div className="capture-label"><Timer size={14} /> Time to capture</div>
                            <p className="capture-value">{daysToCapture !== null ? `${daysToCapture} days` : "Not available"}</p>
                          </div>
                        </div>
                      )}

                      <div className="notes-card">
                        <div className="mini-label"><StickyNote size={14} /> Notes</div>
                        <p className="notes-copy">{lead.notes || "No notes yet."}</p>
                      </div>

                      <div className="action-row">
                        <button className="secondary-button" onClick={() => openEdit(lead)}>Edit</button>
                        {lead.status !== "captured" && (
                          <button className="brand-button" onClick={() => markCaptured(lead.id)}>Mark captured</button>
                        )}
                        <button className="ghost-button" onClick={() => deleteLead(lead.id)}>Delete</button>
                      </div>
                    </div>
                  </article>
                </motion.div>
              );
            })}
          </section>
        )}

        <Modal open={isCreateOpen} title="Add a new lead" onClose={() => setIsCreateOpen(false)}>
          <LeadForm lead={newLead} onChange={setNewLead} onSave={saveNewLead} saveLabel="Create lead" />
        </Modal>

        <Modal open={isEditOpen} title="Edit lead" onClose={() => setIsEditOpen(false)}>
          {editingLead && (
            <LeadForm lead={editingLead} onChange={setEditingLead} onSave={saveEditedLead} saveLabel="Save changes" />
          )}
        </Modal>
      </div>
    </div>
  );
}
