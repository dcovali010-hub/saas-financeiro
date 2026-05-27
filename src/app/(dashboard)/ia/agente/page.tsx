"use client";

import { useState } from "react";
import { mockAgents } from "@/lib/mock-data";
import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Plus, Bot, ToggleLeft, ToggleRight, Zap, MessageSquare, Settings } from "lucide-react";
import toast from "react-hot-toast";
import type { AIAgent } from "@/types";

export default function AgenteIAPage() {
  const [agents, setAgents] = useState<AIAgent[]>(mockAgents);
  const [modalOpen, setModalOpen] = useState(false);
  const [editAgent, setEditAgent] = useState<AIAgent | null>(null);
  const [form, setForm] = useState({ name: "", prompt: "", triggers: "" });

  const handleCreate = () => {
    if (!form.name || !form.prompt) {
      toast.error("Nome e prompt são obrigatórios");
      return;
    }
    const newAgent: AIAgent = {
      id: `AGENT-${String(agents.length + 1).padStart(3, "0")}`,
      name: form.name,
      prompt: form.prompt,
      active: false,
      triggers: form.triggers.split(",").map((t) => t.trim()).filter(Boolean),
      responses: 0,
      created_at: new Date().toISOString().split("T")[0],
    };
    setAgents([...agents, newAgent]);
    setModalOpen(false);
    setForm({ name: "", prompt: "", triggers: "" });
    toast.success("Agente criado com sucesso!");
  };

  const handleToggle = (id: string) => {
    setAgents(agents.map((a) => a.id === id ? { ...a, active: !a.active } : a));
    toast.success("Agente atualizado");
  };

  const handleEdit = (agent: AIAgent) => {
    setEditAgent(agent);
    setForm({ name: agent.name, prompt: agent.prompt, triggers: agent.triggers.join(", ") });
    setModalOpen(true);
  };

  const handleSave = () => {
    if (editAgent) {
      setAgents(agents.map((a) =>
        a.id === editAgent.id
          ? { ...a, name: form.name, prompt: form.prompt, triggers: form.triggers.split(",").map(t => t.trim()).filter(Boolean) }
          : a
      ));
      toast.success("Agente atualizado!");
    } else {
      handleCreate();
      return;
    }
    setModalOpen(false);
    setEditAgent(null);
    setForm({ name: "", prompt: "", triggers: "" });
  };

  const activeCount = agents.filter((a) => a.active).length;
  const totalResponses = agents.reduce((s, a) => s + a.responses, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-white text-xl font-bold">Agente IA</h2>
          <p className="text-gray-400 text-sm mt-0.5">
            {activeCount} agente(s) ativo(s) · {totalResponses} respostas no total
          </p>
        </div>
        <Button onClick={() => { setEditAgent(null); setForm({ name: "", prompt: "", triggers: "" }); setModalOpen(true); }}>
          <Plus className="w-4 h-4" />
          Novo Agente
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-[#111827] border border-[#1f2937] rounded-2xl p-4 text-center">
          <Bot className="w-6 h-6 text-blue-400 mx-auto mb-2" />
          <p className="text-2xl font-bold text-white">{agents.length}</p>
          <p className="text-gray-500 text-xs">Total de Agentes</p>
        </div>
        <div className="bg-[#111827] border border-[#1f2937] rounded-2xl p-4 text-center">
          <Zap className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
          <p className="text-2xl font-bold text-emerald-400">{activeCount}</p>
          <p className="text-gray-500 text-xs">Ativos</p>
        </div>
        <div className="bg-[#111827] border border-[#1f2937] rounded-2xl p-4 text-center">
          <MessageSquare className="w-6 h-6 text-purple-400 mx-auto mb-2" />
          <p className="text-2xl font-bold text-purple-400">{totalResponses}</p>
          <p className="text-gray-500 text-xs">Respostas</p>
        </div>
      </div>

      {/* Agent Cards */}
      <div className="space-y-4">
        {agents.map((agent) => (
          <div
            key={agent.id}
            className={`bg-[#111827] border rounded-2xl p-5 transition-colors ${
              agent.active ? "border-blue-500/30" : "border-[#1f2937]"
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  agent.active ? "bg-blue-500/20" : "bg-gray-500/20"
                }`}>
                  <Bot className={`w-5 h-5 ${agent.active ? "text-blue-400" : "text-gray-500"}`} />
                </div>
                <div>
                  <p className="text-white font-semibold">{agent.name}</p>
                  <p className="text-gray-500 text-xs">{agent.responses} respostas · criado em {formatDate(agent.created_at)}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => handleEdit(agent)} className="p-2 rounded-lg hover:bg-[#1f2937] transition-colors text-gray-400 hover:text-white">
                  <Settings className="w-4 h-4" />
                </button>
                <button onClick={() => handleToggle(agent.id)} className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-[#1f2937] transition-colors text-sm">
                  {agent.active ? (
                    <>
                      <ToggleRight className="w-5 h-5 text-emerald-400" />
                      <span className="text-emerald-400 font-medium">Ativo</span>
                    </>
                  ) : (
                    <>
                      <ToggleLeft className="w-5 h-5 text-gray-500" />
                      <span className="text-gray-500">Inativo</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="bg-[#0a0f1e] rounded-xl p-3 mb-3">
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Prompt</p>
              <p className="text-gray-300 text-sm leading-relaxed line-clamp-2">{agent.prompt}</p>
            </div>

            {agent.triggers.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                <span className="text-gray-600 text-xs mr-1">Gatilhos:</span>
                {agent.triggers.map((trigger) => (
                  <span
                    key={trigger}
                    className="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 text-xs border border-blue-500/20"
                  >
                    {trigger}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <Modal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditAgent(null); }}
        title={editAgent ? "Editar Agente" : "Novo Agente"}
        size="lg"
      >
        <div className="space-y-4">
          <Input
            label="Nome do Agente *"
            placeholder="Ex: Atendimento Inicial"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-300">Prompt *</label>
            <textarea
              rows={5}
              placeholder="Descreva como o agente deve se comportar..."
              value={form.prompt}
              onChange={(e) => setForm({ ...form, prompt: e.target.value })}
              className="w-full bg-[#0a0f1e] border border-[#1f2937] rounded-xl px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors text-sm resize-none"
            />
          </div>
          <Input
            label="Gatilhos (separados por vírgula)"
            placeholder="olá, oi, preciso de ajuda"
            value={form.triggers}
            onChange={(e) => setForm({ ...form, triggers: e.target.value })}
          />
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" onClick={() => { setModalOpen(false); setEditAgent(null); }}>Cancelar</Button>
            <Button onClick={handleSave}>{editAgent ? "Salvar" : <><Plus className="w-4 h-4" />Criar</>}</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
