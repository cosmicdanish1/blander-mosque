"use client";

import { useState } from "react";
import { Icon } from "@/components/ui/Icon";
import ui from "@/components/ui/ui.module.css";

const SUBJECTS = ["General enquiry", "Nikah / Janazah", "Madrasa enrolment", "Volunteering", "New Muslim support"];

const field: React.CSSProperties = {
  width: "100%",
  padding: "13px 15px",
  borderRadius: 12,
  border: "1px solid var(--glass-border)",
  background: "var(--glass)",
  color: "var(--text)",
  fontSize: 15,
};
const labelStyle: React.CSSProperties = { display: "block", fontSize: 13, color: "var(--muted)", marginBottom: 7 };

export function ContactForm() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", subject: SUBJECTS[0], message: "" });
  const [touched, setTouched] = useState(false);

  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email);
  const valid = form.name.trim().length > 1 && emailOk && form.message.trim().length > 4;

  if (sent) {
    return (
      <div className="glass-strong" style={{ padding: "clamp(28px, 4vw, 44px)", textAlign: "center" }}>
        <span className={ui.cardIcon} style={{ margin: "0 auto 16px", width: 56, height: 56 }}>
          <Icon name="mail" size={26} />
        </span>
        <h3 className={ui.cardTitle}>Message received</h3>
        <p className={ui.cardBody} style={{ marginInline: "auto", maxWidth: 320 }}>
          Thank you for reaching out. This is a demo form — nothing was sent. A
          live inbox will be connected when the backend is ready.
        </p>
        <button type="button" className="btn btn-ghost" style={{ marginTop: 20 }} onClick={() => setSent(false)}>
          Send another
        </button>
      </div>
    );
  }

  return (
    <form
      className="glass-strong"
      style={{ padding: "clamp(24px, 3vw, 36px)", display: "grid", gap: 16 }}
      onSubmit={(e) => {
        e.preventDefault();
        setTouched(true);
        if (valid) setSent(true);
      }}
      noValidate
    >
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div>
          <label style={labelStyle} htmlFor="c-name">Name</label>
          <input id="c-name" style={field} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </div>
        <div>
          <label style={labelStyle} htmlFor="c-email">Email</label>
          <input id="c-email" style={field} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          {touched && !emailOk && <span style={{ color: "var(--accent)", fontSize: 12 }}>Enter a valid email.</span>}
        </div>
      </div>
      <div>
        <label style={labelStyle} htmlFor="c-subject">Subject</label>
        <select id="c-subject" style={field} value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })}>
          {SUBJECTS.map((s) => <option key={s}>{s}</option>)}
        </select>
      </div>
      <div>
        <label style={labelStyle} htmlFor="c-msg">Message</label>
        <textarea id="c-msg" rows={5} style={{ ...field, resize: "vertical" }} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
      </div>
      <button type="submit" className="btn btn-primary" style={{ justifyContent: "center" }}>
        Send message <Icon name="arrow" size={16} />
      </button>
      <p style={{ fontSize: 12, color: "var(--muted)", textAlign: "center" }}>Demo form — no message is actually sent.</p>
    </form>
  );
}
