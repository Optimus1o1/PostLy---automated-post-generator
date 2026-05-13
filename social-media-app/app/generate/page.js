"use client";

import { useState } from "react";
import Link from "next/link";

export default function GeneratePage() {
  const [formData, setFormData] = useState({
    clientName: "",
    clientEmail: "",
    businessName: "",
    niche: "",
    targetAudience: "",
    brandTone: "",
    topics: "",
    platform: "Instagram",
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [delivering, setDelivering] = useState(false);
  const [deliverStatus, setDeliverStatus] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);
    setDeliverStatus("");

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to generate content. Check your API key and try again.");
      }

      const data = await response.json();
      setResult(data.content);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const emailToClient = async () => {
    if (!result) return;
    if (!formData.clientEmail) {
      setDeliverStatus("Please enter a client email first.");
      return;
    }
    setDelivering(true);
    setDeliverStatus("");
    try {
      const response = await fetch("/api/deliver", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          toEmail: formData.clientEmail,
          clientName: formData.clientName,
          businessName: formData.businessName,
          content: result,
        }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data?.error || "Failed to send email.");
      }
      setDeliverStatus("Email sent.");
    } catch (err) {
      setDeliverStatus(err.message);
    } finally {
      setDelivering(false);
    }
  };

  const downloadCSV = () => {
    if (!result) return;
    
    // Simple parser: Split by "DAY"
    const days = result.split(/DAY\s+\d+/i).filter(d => d.trim().length > 10);
    
    let csvContent = "data:text/csv;charset=utf-8,Date,Message,Link\n";
    
    // Start posting date from tomorrow
    let currentDate = new Date();
    currentDate.setDate(currentDate.getDate() + 1);

    days.forEach((dayContent) => {
      // Escape quotes for CSV
      const formattedMessage = dayContent.replace(/"/g, '""').trim();
      const dateString = currentDate.toISOString().split('T')[0]; // YYYY-MM-DD
      
      csvContent += `${dateString},"${formattedMessage}",\n`;
      currentDate.setDate(currentDate.getDate() + 1); // increment day
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `social_calendar_${formData.businessName.replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <header>
        <div className="container">
          <div className="header-content">
            <Link href="/" className="logo">🤖 Social Media Agent</Link>
          </div>
        </div>
      </header>

      <main className="container">
        {!result ? (
          <div className="form-container">
            <h1 style={{ marginBottom: '20px', fontSize: '2rem' }}>Generate 30-Day Calendar</h1>
            <p style={{ color: 'var(--muted)', marginBottom: '30px' }}>Fill out the details below to generate your customized content.</p>
            
            {error && (
              <div style={{ background: 'rgba(255, 0, 0, 0.1)', border: '1px solid red', padding: '15px', borderRadius: '8px', marginBottom: '20px', color: '#ff8a8a' }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Client Name (optional)</label>
                <input type="text" name="clientName" className="form-input" value={formData.clientName} onChange={handleChange} placeholder="e.g. Aniket" />
              </div>

              <div className="form-group">
                <label className="form-label">Client Email (optional, for delivery)</label>
                <input type="email" name="clientEmail" className="form-input" value={formData.clientEmail} onChange={handleChange} placeholder="e.g. client@example.com" />
              </div>

              <div className="form-group">
                <label className="form-label">Business Name</label>
                <input required type="text" name="businessName" className="form-input" value={formData.businessName} onChange={handleChange} placeholder="e.g. The Daily Grind Cafe" />
              </div>

              <div className="form-group">
                <label className="form-label">Industry/Niche</label>
                <input required type="text" name="niche" className="form-input" value={formData.niche} onChange={handleChange} placeholder="e.g. Specialty Coffee Shop" />
              </div>

              <div className="form-group">
                <label className="form-label">Target Audience</label>
                <input required type="text" name="targetAudience" className="form-input" value={formData.targetAudience} onChange={handleChange} placeholder="e.g. College students and remote workers" />
              </div>

              <div className="form-group">
                <label className="form-label">Brand Tone</label>
                <input required type="text" name="brandTone" className="form-input" value={formData.brandTone} onChange={handleChange} placeholder="e.g. Friendly, energetic, welcoming" />
              </div>

              <div className="form-group">
                <label className="form-label">Key Topics (Comma separated)</label>
                <textarea required name="topics" className="form-textarea" rows="3" value={formData.topics} onChange={handleChange} placeholder="e.g. Coffee sourcing, barista tips, new menu items, study atmosphere" />
              </div>

              <div className="form-group">
                <label className="form-label">Primary Platform</label>
                <select name="platform" className="form-select" value={formData.platform} onChange={handleChange}>
                  <option value="Instagram">Instagram</option>
                  <option value="LinkedIn">LinkedIn</option>
                  <option value="Twitter/X">Twitter / X</option>
                  <option value="TikTok">TikTok</option>
                  <option value="Facebook">Facebook</option>
                </select>
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', fontSize: '16px', padding: '15px' }} disabled={loading}>
                {loading ? (
                  <><span className="loading-spinner"></span> Generating... This takes about 30 seconds.</>
                ) : "Generate 30-Day Content Calendar"}
              </button>
            </form>
          </div>
        ) : (
          <div className="result-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', flexWrap: 'wrap', gap: '15px' }}>
              <h2 style={{ fontSize: '2rem', color: 'var(--secondary)' }}>Your Content Calendar</h2>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button 
                  className="btn btn-primary" 
                  onClick={() => navigator.clipboard.writeText(result)}
                >
                  Copy Text
                </button>
                <button 
                  className="btn btn-primary" 
                  style={{ background: 'var(--green)', color: '#000' }}
                  onClick={downloadCSV}
                >
                  Download CSV
                </button>
                <button
                  className="btn btn-primary"
                  style={{ background: 'var(--primary)', opacity: delivering ? 0.7 : 1 }}
                  onClick={emailToClient}
                  disabled={delivering}
                  title="Requires SMTP env vars"
                >
                  {delivering ? "Sending..." : "Email to Client"}
                </button>
              </div>
            </div>
            {deliverStatus ? (
              <div style={{ marginBottom: '15px', color: deliverStatus === "Email sent." ? '#86efac' : '#fde68a' }}>
                {deliverStatus}
              </div>
            ) : null}
            <div className="post-item">
              <div className="post-content">{result}</div>
            </div>
            <div style={{ textAlign: 'center', marginTop: '30px' }}>
              <button className="btn" style={{ background: 'transparent', border: '1px solid var(--muted)', color: 'var(--text)' }} onClick={() => setResult(null)}>Generate Another</button>
            </div>
          </div>
        )}
      </main>
    </>
  );
}
