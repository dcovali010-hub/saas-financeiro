"use client";

import { useState } from "react";
import { mockGeneratedSites } from "@/lib/mock-data";
import { formatDate, getStatusColor, getStatusLabel } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Input, Select } from "@/components/ui/Input";
import { Plus, Wand2, ExternalLink, Globe, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import type { GeneratedSite } from "@/types";

const businessTypes = [
  "Restaurant", "Clinic / Health", "E-commerce", "Real Estate",
  "Law Firm", "Technology", "Education", "Photography", "Beauty & Aesthetics",
  "Construction", "Finance", "Gym / Fitness", "Other",
];

export default function GenerateSitePage() {
  const [sites, setSites] = useState<GeneratedSite[]>(mockGeneratedSites);
  const [modalOpen, setModalOpen] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [form, setForm] = useState({
    site_name: "", client_name: "", business_type: "Restaurant", domain: "",
  });

  const handleGenerate = async () => {
    if (!form.site_name || !form.client_name || !form.business_type) {
      toast.error("Please fill in all required fields");
      return;
    }
    setGenerating(true);
    await new Promise((r) => setTimeout(r, 2000));

    const newSite: GeneratedSite = {
      id: `SITE-${String(sites.length + 1).padStart(3, "0")}`,
      client_id: "new",
      client_name: form.client_name,
      site_name: form.site_name,
      business_type: form.business_type,
      domain: form.domain || undefined,
      status: "em_producao",
      created_at: new Date().toISOString().split("T")[0],
    };
    setSites([newSite, ...sites]);
    setGenerating(false);
    setModalOpen(false);
    setForm({ site_name: "", client_name: "", business_type: "Restaurant", domain: "" });
    toast.success("Site created with AI! Now in production.");
  };

  const updateStatus = (id: string, status: GeneratedSite["status"]) => {
    setSites(sites.map((s) => (s.id === id ? { ...s, status } : s)));
    toast.success("Status updated");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-white text-xl font-bold">Generate Site with AI</h2>
          <p className="text-gray-400 text-sm mt-0.5">
            {sites.length} sites generated · {sites.filter(s => s.status === "publicado").length} published
          </p>
        </div>
        <Button onClick={() => setModalOpen(true)}>
          <Wand2 className="w-4 h-4" />
          Generate New Site
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {(["rascunho", "em_producao", "publicado", "pausado"] as GeneratedSite["status"][]).map((s) => {
          const count = sites.filter((site) => site.status === s).length;
          return (
            <div key={s} className="bg-[#111827] border border-[#1f2937] rounded-2xl p-4 text-center">
              <p className="text-2xl font-bold text-white">{count}</p>
              <div className="flex justify-center mt-1">
                <Badge className={getStatusColor(s)}>{getStatusLabel(s)}</Badge>
              </div>
            </div>
          );
        })}
      </div>

      {/* Sites Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {sites.map((site) => (
          <div
            key={site.id}
            className="bg-[#111827] border border-[#1f2937] rounded-2xl p-5 hover:border-gray-600 transition-colors"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
                  <Globe className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-white font-semibold">{site.site_name}</p>
                  <p className="text-gray-500 text-xs">{site.client_name}</p>
                </div>
              </div>
              <Badge className={getStatusColor(site.status)}>{getStatusLabel(site.status)}</Badge>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500">Business type</span>
                <span className="text-gray-300">{site.business_type}</span>
              </div>
              {site.domain && (
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500">Domain</span>
                  <span className="text-blue-400">{site.domain}</span>
                </div>
              )}
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500">Created on</span>
                <span className="text-gray-300">{formatDate(site.created_at)}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-[#1f2937]">
              <div className="flex gap-1">
                {(["em_producao", "publicado", "pausado"] as GeneratedSite["status"][]).map((s) => (
                  <button
                    key={s}
                    onClick={() => updateStatus(site.id, s)}
                    className={`text-xs px-2 py-1 rounded-lg transition-colors ${
                      site.status === s
                        ? "bg-blue-600 text-white"
                        : "hover:bg-[#1f2937] text-gray-500"
                    }`}
                  >
                    {getStatusLabel(s)}
                  </button>
                ))}
              </div>
              {site.url && (
                <a
                  href={site.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 transition-colors"
                >
                  <ExternalLink className="w-3 h-3" />
                  View site
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

      <Modal open={modalOpen} onClose={() => !generating && setModalOpen(false)} title="Generate Site with AI" size="lg">
        <div className="space-y-4">
          <Input
            label="Site Name *"
            placeholder="e.g. Tech Solutions"
            value={form.site_name}
            onChange={(e) => setForm({ ...form, site_name: e.target.value })}
          />
          <Input
            label="Client *"
            placeholder="Client name"
            value={form.client_name}
            onChange={(e) => setForm({ ...form, client_name: e.target.value })}
          />
          <Select
            label="Business Type *"
            value={form.business_type}
            onChange={(e) => setForm({ ...form, business_type: e.target.value })}
          >
            {businessTypes.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </Select>
          <Input
            label="Domain (optional)"
            placeholder="example.com"
            value={form.domain}
            onChange={(e) => setForm({ ...form, domain: e.target.value })}
          />

          <div className="flex items-center gap-3 p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl">
            <Wand2 className="w-5 h-5 text-blue-400 flex-shrink-0" />
            <p className="text-blue-300 text-sm">
              AI will create the structure, layout and content based on the business type provided.
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" onClick={() => setModalOpen(false)} disabled={generating}>Cancel</Button>
            <Button onClick={handleGenerate} disabled={generating}>
              {generating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4" />
                  Generate with AI
                </>
              )}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
