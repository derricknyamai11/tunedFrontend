"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { apiGet, apiPost } from "@/api-client";
import { Suspense } from "react";

/* ─── Types ─── */
interface Service { id: string; name: string; slug?: string; description?: string | null; category?: { id: string; name: string } | string | null; }
interface ServiceCategory { id: string; name: string; services: Service[]; }
interface Level { id: string; name: string; order?: number; }
interface Deadline { id: string; name: string; hours: number; order?: number; }
interface PriceCalc { total_price: number; price_per_page: number; page_count: number; }

interface FormData {
  service_id: string;
  service_name: string;
  academic_level_id: string;
  deadline_id: string;
  title: string;
  description: string;
  word_count: number;
  format_style: string;
  additional_materials: string;
}

const FORMAT_STYLES = ["APA", "MLA", "Chicago", "Harvard", "IEEE", "Turabian", "Other", "None/Not required"];
const WORDS_PER_PAGE = 275;

const STEP_LABELS = ["Service", "Paper Details", "Review & Checkout"];

function NewOrderWizard() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [step, setStep] = useState(1);
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [levels, setLevels] = useState<Level[]>([]);
  const [deadlines, setDeadlines] = useState<Deadline[]>([]);
  const [price, setPrice] = useState<PriceCalc | null>(null);
  const [priceLoading, setPriceLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [form, setForm] = useState<FormData>({
    service_id: searchParams?.get("service") || "",
    service_name: "",
    academic_level_id: "",
    deadline_id: "",
    title: "",
    description: "",
    word_count: 275,
    format_style: "APA",
    additional_materials: "",
  });

  useEffect(() => {
    // Single call: /quote/options returns { services, levels, deadlines }
    apiGet<{ services: Service[]; levels: Level[]; deadlines: Deadline[] }>("/quote/options").then((r) => {
      if (!r.ok) return;
      const { services = [], levels = [], deadlines = [] } = r.data;

      // Group services by category.
      // quote/options returns category as either a string (name) or object { id, name }
      const catMap = new Map<string, ServiceCategory>();
      services.forEach((svc) => {
        let catName = "General";
        let catId = "General";
        if (typeof svc.category === "string" && svc.category) {
          catName = svc.category;
          catId = svc.category;
        } else if (typeof svc.category === "object" && svc.category) {
          catName = svc.category.name || "General";
          catId = svc.category.id || catName;
        }
        if (!catMap.has(catId)) catMap.set(catId, { id: catId, name: catName, services: [] });
        catMap.get(catId)!.services.push(svc);
      });
      setCategories(Array.from(catMap.values()));

      // Sort deadlines by hours ascending
      const sortedDeadlines = [...deadlines].sort((a, b) => (a.hours ?? 0) - (b.hours ?? 0));
      setDeadlines(sortedDeadlines);

      // Sort levels by order
      const sortedLevels = [...levels].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
      setLevels(sortedLevels);

      setForm((f) => ({
        ...f,
        academic_level_id: f.academic_level_id || sortedLevels[0]?.id || "",
        deadline_id: f.deadline_id || sortedDeadlines[2]?.id || sortedDeadlines[0]?.id || "", // default ~24h
      }));
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-calculate price when step 3 opens
  useEffect(() => {
    if (step === 3 && form.service_id && form.academic_level_id && form.deadline_id) {
      setPriceLoading(true);
      // /calculate-price expects an ISO datetime, not a deadline_id
      // Find selected deadline's hours and build a future datetime
      const selectedDeadline = deadlines.find((d) => d.id === form.deadline_id);
      const hours = selectedDeadline?.hours ?? 24;
      const deadlineDt = new Date(Date.now() + hours * 3600 * 1000).toISOString();

      apiPost<PriceCalc>("/calculate-price", {
        service_id: form.service_id,
        level_id: form.academic_level_id,
        deadline: deadlineDt,
        word_count: form.word_count,
      }).then((r) => {
        if (r.ok) setPrice(r.data);
        setPriceLoading(false);
      });
    }
  }, [step, form.service_id, form.academic_level_id, form.deadline_id, form.word_count]);

  const allServices = categories.flatMap((c) => c.services || []);
  const pages = Math.max(1, Math.ceil(form.word_count / WORDS_PER_PAGE));

  const selectService = (svc: Service) => {
    setForm((f) => ({ ...f, service_id: svc.id, service_name: svc.name }));
  };

  const validateStep1 = () => {
    if (!form.service_id) { setErrors({ service: "Please select a service" }); return false; }
    setErrors({});
    return true;
  };

  const validateStep2 = () => {
    const e: Record<string, string> = {};
    if (!form.title.trim()) e.title = "Title is required";
    if (!form.description.trim()) e.description = "Instructions are required";
    if (!form.academic_level_id) e.academic_level_id = "Select an academic level";
    if (!form.deadline_id) e.deadline_id = "Select a deadline";
    if (form.word_count < 1) e.word_count = "Enter valid word count";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && !validateStep1()) return;
    if (step === 2 && !validateStep2()) return;
    setStep((s) => s + 1);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setSubmitError(null);
    const r = await apiPost<{ id: string; order_number: string }>("/client/orders", {
      service_id: form.service_id,
      academic_level_id: form.academic_level_id,
      deadline_id: form.deadline_id,
      title: form.title,
      description: form.description,
      word_count: form.word_count,
      format_style: form.format_style || null,
      additional_materials: form.additional_materials || null,
    });
    setSubmitting(false);
    if (r.ok) {
      router.push(`/client/orders/${r.data.id}` as never);
    } else {
      setSubmitError(r.error.message || "Failed to place order");
    }
  };

  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: "0 0 40px" }}>
      {/* Step indicator */}
      <div style={{ display: "flex", alignItems: "center", gap: 0, marginBottom: 28, padding: "0 4px" }}>
        {STEP_LABELS.map((label, i) => {
          const n = i + 1;
          const done = step > n;
          const active = step === n;
          return (
            <div key={label} style={{ display: "flex", alignItems: "center", flex: i < 2 ? 1 : undefined }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, cursor: done ? "pointer" : "default" }}
                onClick={() => done && setStep(n)}>
                <div style={{ width: 28, height: 28, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800, flexShrink: 0, background: done ? "#059669" : active ? "#1c2536" : "#e4e8ee", color: done || active ? "#fff" : "#8a96a8", transition: "all .2s" }}>
                  {done ? "✓" : n}
                </div>
                <span style={{ fontSize: 12.5, fontWeight: active ? 700 : 500, color: active ? "#0d1117" : done ? "#059669" : "#8a96a8", whiteSpace: "nowrap" }}>{label}</span>
              </div>
              {i < 2 && <div style={{ flex: 1, height: 2, background: done ? "#059669" : "#e4e8ee", margin: "0 10px", transition: "background .3s" }} />}
            </div>
          );
        })}
      </div>

      {/* ── Step 1: Service Selection ── */}
      {step === 1 && (
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: "#0d1117", marginBottom: 4 }}>Choose a Service</h2>
          <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 20 }}>Select the type of writing or editing support you need.</p>
          {errors.service && <div style={{ background: "#fef2f2", border: "1px solid #fca5a5", borderRadius: 8, padding: "10px 14px", fontSize: 12.5, color: "#dc2626", marginBottom: 12 }}>{errors.service}</div>}

          {categories.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px 0", color: "#8a96a8" }}>Loading services…</div>
          ) : (
            categories.map((cat) => (
              <div key={cat.id} style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#8a96a8", textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 10 }}>{cat.name}</div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))", gap: 10 }}>
                  {(cat.services || []).map((svc) => {
                    const selected = form.service_id === svc.id;
                    return (
                      <div key={svc.id} onClick={() => selectService(svc)}
                        style={{ border: `2px solid ${selected ? "#059669" : "#e4e8ee"}`, borderRadius: 12, padding: "14px 16px", cursor: "pointer", background: selected ? "#f0fdf4" : "#fff", transition: "all .15s", boxShadow: selected ? "0 0 0 4px rgba(5,150,105,.1)" : "none" }}>
                        <div style={{ fontSize: 20, marginBottom: 6 }}>
                          {({"essay": "✍️", "research": "🔬", "dissertation": "📚", "editing": "✏️", "analysis": "📊", "presentation": "📊", "coursework": "📝", "proofreading": "🔍", "ai": "🤖"} as Record<string,string>)[svc.name.toLowerCase().split(" ")[0] ?? ""] ?? "📄"}
                        </div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: "#0d1117", marginBottom: 3 }}>{svc.name}</div>
                        {svc.description && <div style={{ fontSize: 11.5, color: "#6b7280", lineHeight: 1.4 }}>{svc.description.slice(0, 60)}{svc.description.length > 60 ? "…" : ""}</div>}
                        {selected && <div style={{ marginTop: 8, fontSize: 11, fontWeight: 700, color: "#059669" }}>✓ Selected</div>}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* ── Step 2: Paper Details ── */}
      {step === 2 && (
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: "#0d1117", marginBottom: 4 }}>Paper Details</h2>
          <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 20 }}>Tell us about your paper so we can find the perfect specialist.</p>

          <div style={{ display: "grid", gap: 16 }}>
            {/* Level + Deadline */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <Field label="Academic Level *" error={errors.academic_level_id}>
                <select value={form.academic_level_id} onChange={(e) => setForm((f) => ({ ...f, academic_level_id: e.target.value }))} style={selectStyle(!!errors.academic_level_id)}>
                  <option value="">Select level…</option>
                  {levels.map((l) => <option key={l.id} value={l.id}>{l.name}</option>)}
                </select>
              </Field>
              <Field label="Deadline *" error={errors.deadline_id}>
                <select value={form.deadline_id} onChange={(e) => setForm((f) => ({ ...f, deadline_id: e.target.value }))} style={selectStyle(!!errors.deadline_id)}>
                  <option value="">Select deadline…</option>
                  {deadlines.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
                </select>
              </Field>
            </div>

            {/* Title */}
            <Field label="Paper Title *" error={errors.title}>
              <input value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} placeholder="e.g. Impact of Climate Change on Agricultural Output" style={inputStyle(!!errors.title)} maxLength={255} />
            </Field>

            {/* Instructions */}
            <Field label="Instructions & Requirements *" error={errors.description}>
              <textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} rows={5} placeholder="Provide detailed instructions — topic, requirements, sources needed, specific sections, grading rubric…" style={{ ...inputStyle(!!errors.description), resize: "vertical", minHeight: 120 } as React.CSSProperties} />
            </Field>

            {/* Word count + Format */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <Field label={`Word Count * (≈ ${pages} page${pages !== 1 ? "s" : ""})`} error={errors.word_count}>
                <input type="number" value={form.word_count} onChange={(e) => setForm((f) => ({ ...f, word_count: Math.max(1, parseInt(e.target.value) || 275) }))} min={1} style={inputStyle(!!errors.word_count)} />
              </Field>
              <Field label="Citation Style">
                <select value={form.format_style} onChange={(e) => setForm((f) => ({ ...f, format_style: e.target.value }))} style={selectStyle(false)}>
                  {FORMAT_STYLES.map((f) => <option key={f} value={f}>{f}</option>)}
                </select>
              </Field>
            </div>

            {/* Additional notes */}
            <Field label="Additional Notes (optional)">
              <textarea value={form.additional_materials} onChange={(e) => setForm((f) => ({ ...f, additional_materials: e.target.value }))} rows={2} placeholder="Any extra requirements, reference sources, or upload notes…" style={{ ...inputStyle(false), resize: "vertical" } as React.CSSProperties} />
            </Field>
          </div>
        </div>
      )}

      {/* ── Step 3: Review & Checkout ── */}
      {step === 3 && (
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: "#0d1117", marginBottom: 4 }}>Review & Checkout</h2>
          <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 20 }}>Confirm your order details before placing.</p>

          {submitError && <div style={{ background: "#fef2f2", border: "1px solid #fca5a5", borderRadius: 8, padding: "10px 14px", fontSize: 12.5, color: "#dc2626", marginBottom: 14 }}>{submitError}</div>}

          {/* Order summary */}
          <div style={{ background: "#fff", border: "1px solid #e4e8ee", borderRadius: 14, overflow: "hidden", marginBottom: 14 }}>
            <div style={{ padding: "12px 16px", background: "#f8fafc", borderBottom: "1px solid #e4e8ee", fontSize: 12, fontWeight: 700, color: "#1c2536" }}>Order Summary</div>
            {[
              { label: "Service", value: form.service_name || allServices.find((s) => s.id === form.service_id)?.name || form.service_id },
              { label: "Academic Level", value: levels.find((l) => l.id === form.academic_level_id)?.name || "—" },
              { label: "Deadline", value: deadlines.find((d) => d.id === form.deadline_id)?.name || "—" },
              { label: "Word Count", value: `${form.word_count.toLocaleString()} words (≈ ${pages} pages)` },
              { label: "Citation Style", value: form.format_style || "Not specified" },
            ].map((row) => (
              <div key={row.label} style={{ display: "flex", justifyContent: "space-between", padding: "10px 16px", borderBottom: "1px solid #f0f2f5", fontSize: 13 }}>
                <span style={{ color: "#6b7280" }}>{row.label}</span>
                <span style={{ fontWeight: 600, color: "#0d1117" }}>{row.value}</span>
              </div>
            ))}
          </div>

          {/* Paper title + instructions preview */}
          <div style={{ background: "#fff", border: "1px solid #e4e8ee", borderRadius: 14, padding: 16, marginBottom: 14 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#1c2536", marginBottom: 8 }}>Title</div>
            <div style={{ fontSize: 13, color: "#0d1117", marginBottom: 14 }}>{form.title}</div>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#1c2536", marginBottom: 8 }}>Instructions</div>
            <div style={{ fontSize: 12.5, color: "#4b5563", lineHeight: 1.6, maxHeight: 120, overflow: "hidden", textOverflow: "ellipsis" }}>{form.description}</div>
          </div>

          {/* Price */}
          <div style={{ background: "linear-gradient(135deg,#059669,#047857)", borderRadius: 14, padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,.7)", marginBottom: 3 }}>Estimated Total</div>
              {priceLoading ? (
                <div style={{ fontSize: 28, fontWeight: 800, color: "#fff" }}>Calculating…</div>
              ) : price ? (
                <div style={{ fontSize: 28, fontWeight: 800, color: "#fff" }}>${price.total_price.toFixed(2)}</div>
              ) : (
                <div style={{ fontSize: 18, fontWeight: 700, color: "rgba(255,255,255,.8)" }}>Price calculated at order</div>
              )}
              {price && <div style={{ fontSize: 11, color: "rgba(255,255,255,.6)", marginTop: 3 }}>${price.price_per_page.toFixed(2)}/page × {price.page_count} pages</div>}
            </div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,.7)", textAlign: "right", maxWidth: 140 }}>
              Payment after admin verifies & assigns a writer
            </div>
          </div>
        </div>
      )}

      {/* Navigation buttons */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 24, paddingTop: 20, borderTop: "1px solid #e4e8ee" }}>
        <button onClick={() => step === 1 ? router.back() : setStep((s) => s - 1)}
          style={{ background: "#fff", border: "1px solid #e4e8ee", borderRadius: 10, height: 40, padding: "0 20px", fontSize: 13, fontWeight: 600, cursor: "pointer", color: "#4b5563" }}>
          {step === 1 ? "Cancel" : "← Back"}
        </button>

        {step < 3 ? (
          <button onClick={handleNext}
            style={{ background: "linear-gradient(135deg,#059669,#047857)", border: "none", borderRadius: 10, height: 40, padding: "0 24px", fontSize: 13, fontWeight: 700, cursor: "pointer", color: "#fff" }}>
            Next →
          </button>
        ) : (
          <button onClick={handleSubmit} disabled={submitting}
            style={{ background: submitting ? "#9ca3af" : "linear-gradient(135deg,#059669,#047857)", border: "none", borderRadius: 10, height: 40, padding: "0 28px", fontSize: 13, fontWeight: 700, cursor: submitting ? "not-allowed" : "pointer", color: "#fff" }}>
            {submitting ? "Placing Order…" : "✓ Place Order"}
          </button>
        )}
      </div>
    </div>
  );
}

/* ─── Helpers ─── */
function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 5 }}>{label}</label>
      {children}
      {error && <div style={{ fontSize: 11.5, color: "#dc2626", marginTop: 4 }}>{error}</div>}
    </div>
  );
}

function inputStyle(hasErr: boolean): React.CSSProperties {
  return { width: "100%", border: `1.5px solid ${hasErr ? "#f87171" : "#d1d5db"}`, borderRadius: 8, padding: "9px 12px", fontSize: 13, outline: "none", background: "#fff", boxSizing: "border-box", fontFamily: "inherit" };
}
function selectStyle(hasErr: boolean): React.CSSProperties {
  return { ...inputStyle(hasErr), cursor: "pointer" };
}

export default function NewOrderPage() {
  return (
    <Suspense fallback={<div style={{ padding: 40, textAlign: "center", color: "#9ca3af" }}>Loading…</div>}>
      <NewOrderWizard />
    </Suspense>
  );
}
