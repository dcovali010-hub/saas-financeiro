"use client";

import { useState } from "react";
import { mockMessages } from "@/lib/mock-data";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Input, Select } from "@/components/ui/Input";
import {
  MessageCircle,
  Send,
  Phone,
  CheckCheck,
  Check,
  Clock,
  Plus,
  FileText,
  DollarSign,
  Bell,
} from "lucide-react";
import toast from "react-hot-toast";
import type { WhatsAppMessage } from "@/types";

const templates = [
  {
    id: "billing",
    name: "Billing",
    icon: DollarSign,
    color: "text-amber-400",
    bg: "bg-amber-500/10 border-amber-500/20",
    text: "Hi {{name}}, your invoice of {{amount}} is due on {{date}}. Click the link to pay: {{link}}",
  },
  {
    id: "followup",
    name: "Follow-up",
    icon: Bell,
    color: "text-blue-400",
    bg: "bg-blue-500/10 border-blue-500/20",
    text: "Hi {{name}}! How is your website going? Need any updates or support? Just reach out!",
  },
  {
    id: "welcome",
    name: "Welcome",
    icon: MessageCircle,
    color: "text-emerald-400",
    bg: "bg-emerald-500/10 border-emerald-500/20",
    text: "Hi {{name}}, welcome! We are AgencySaaS and we're ready to help with your project.",
  },
];

function MessageStatusIcon({ status }: { status: WhatsAppMessage["status"] }) {
  if (status === "read") return <CheckCheck className="w-3.5 h-3.5 text-blue-400" />;
  if (status === "delivered") return <CheckCheck className="w-3.5 h-3.5 text-gray-400" />;
  if (status === "sent") return <Check className="w-3.5 h-3.5 text-gray-400" />;
  return <Clock className="w-3.5 h-3.5 text-gray-500" />;
}

export default function WhatsAppPage() {
  const [messages, setMessages] = useState<WhatsAppMessage[]>(mockMessages);
  const [selectedContact, setSelectedContact] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [bulkModal, setBulkModal] = useState(false);
  const [bulkForm, setBulkForm] = useState({ template: "billing", phone: "", contact: "" });

  const contacts = Array.from(new Set(messages.map((m) => m.contact)));
  const contactMessages = selectedContact
    ? messages.filter((m) => m.contact === selectedContact)
    : [];

  const handleSend = () => {
    if (!newMessage.trim() || !selectedContact) return;
    const contact = messages.find((m) => m.contact === selectedContact);
    const msg: WhatsAppMessage = {
      id: `MSG-${Date.now()}`,
      contact: selectedContact,
      phone: contact?.phone ?? "",
      message: newMessage,
      direction: "outbound",
      timestamp: new Date().toISOString(),
      status: "sent",
      type: "text",
    };
    setMessages([...messages, msg]);
    setNewMessage("");
    toast.success("Message sent!");
  };

  const handleBulk = () => {
    if (!bulkForm.phone || !bulkForm.contact) {
      toast.error("Please fill in all fields");
      return;
    }
    const tmpl = templates.find((t) => t.id === bulkForm.template);
    const msg: WhatsAppMessage = {
      id: `MSG-${Date.now()}`,
      contact: bulkForm.contact,
      phone: bulkForm.phone,
      message: tmpl?.text ?? "",
      direction: "outbound",
      timestamp: new Date().toISOString(),
      status: "sent",
      type: bulkForm.template as WhatsAppMessage["type"],
    };
    setMessages([...messages, msg]);
    setBulkModal(false);
    setBulkForm({ template: "billing", phone: "", contact: "" });
    toast.success("Template message sent!");
  };

  const formatTime = (ts: string) => {
    return new Date(ts).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
  };

  const getTypeBadge = (type: WhatsAppMessage["type"]) => {
    const map: Record<string, string> = {
      text: "bg-gray-500/20 text-gray-400 border-gray-500/30",
      template: "bg-blue-500/20 text-blue-400 border-blue-500/30",
      billing: "bg-amber-500/20 text-amber-400 border-amber-500/30",
      followup: "bg-purple-500/20 text-purple-400 border-purple-500/30",
    };
    const labels: Record<string, string> = { text: "Text", template: "Template", billing: "Billing", followup: "Follow-up" };
    return { color: map[type] ?? map.text, label: labels[type] ?? type };
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-white text-xl font-bold">WhatsApp</h2>
          <p className="text-gray-400 text-sm mt-0.5">
            {messages.length} messages · {contacts.length} contacts
          </p>
        </div>
        <Button onClick={() => setBulkModal(true)}>
          <FileText className="w-4 h-4" />
          Send Template
        </Button>
      </div>

      {/* Templates */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {templates.map((t) => (
          <div key={t.id} className={`p-4 rounded-2xl border ${t.bg} cursor-pointer hover:opacity-90 transition-opacity`} onClick={() => { setBulkModal(true); setBulkForm({ ...bulkForm, template: t.id }); }}>
            <div className="flex items-center gap-2 mb-2">
              <t.icon className={`w-4 h-4 ${t.color}`} />
              <span className={`text-sm font-medium ${t.color}`}>{t.name}</span>
            </div>
            <p className="text-gray-400 text-xs line-clamp-2">{t.text}</p>
          </div>
        ))}
      </div>

      {/* Chat area */}
      <div className="bg-[#111827] border border-[#1f2937] rounded-2xl overflow-hidden flex" style={{ height: "480px" }}>
        {/* Contacts list */}
        <div className="w-48 sm:w-64 border-r border-[#1f2937] flex flex-col flex-shrink-0">
          <div className="p-3 border-b border-[#1f2937]">
            <p className="text-gray-400 text-xs uppercase tracking-wider font-semibold">Conversations</p>
          </div>
          <div className="flex-1 overflow-y-auto">
            {contacts.map((contact) => {
              const lastMsg = [...messages].filter(m => m.contact === contact).pop();
              const unread = messages.filter(m => m.contact === contact && m.direction === "inbound" && m.status !== "read").length;
              return (
                <button
                  key={contact}
                  onClick={() => setSelectedContact(contact)}
                  className={`w-full flex items-center gap-3 p-3 hover:bg-[#0f172a] transition-colors text-left ${selectedContact === contact ? "bg-[#0f172a] border-r-2 border-blue-500" : ""}`}
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xs font-bold">{contact.charAt(0)}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-xs font-medium truncate">{contact}</p>
                    <p className="text-gray-500 text-xs truncate">{lastMsg?.message.slice(0, 25)}...</p>
                  </div>
                  {unread > 0 && (
                    <span className="w-4 h-4 rounded-full bg-emerald-500 text-white text-xs flex items-center justify-center flex-shrink-0">{unread}</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Chat */}
        <div className="flex-1 flex flex-col min-w-0">
          {selectedContact ? (
            <>
              <div className="flex items-center gap-3 p-4 border-b border-[#1f2937]">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                  <span className="text-white text-xs font-bold">{selectedContact.charAt(0)}</span>
                </div>
                <div>
                  <p className="text-white text-sm font-semibold">{selectedContact}</p>
                  <p className="text-gray-500 text-xs flex items-center gap-1">
                    <Phone className="w-3 h-3" />
                    {messages.find(m => m.contact === selectedContact)?.phone}
                  </p>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {contactMessages.map((msg) => {
                  const { color, label } = getTypeBadge(msg.type);
                  return (
                    <div key={msg.id} className={`flex ${msg.direction === "outbound" ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-xs lg:max-w-sm rounded-2xl px-4 py-2.5 ${msg.direction === "outbound" ? "bg-blue-600 text-white" : "bg-[#0f172a] text-gray-200 border border-[#1f2937]"}`}>
                        <p className="text-sm">{msg.message}</p>
                        <div className="flex items-center justify-between gap-2 mt-1">
                          <Badge className={`${color} scale-75 origin-left`}>{label}</Badge>
                          <div className="flex items-center gap-1">
                            <span className="text-xs opacity-60">{formatTime(msg.timestamp)}</span>
                            {msg.direction === "outbound" && <MessageStatusIcon status={msg.status} />}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="p-4 border-t border-[#1f2937] flex gap-2">
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  className="flex-1 bg-[#0a0f1e] border border-[#1f2937] rounded-xl px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 text-sm"
                />
                <button
                  onClick={handleSend}
                  disabled={!newMessage.trim()}
                  className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                  <Send className="w-4 h-4 text-white" />
                </button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <MessageCircle className="w-10 h-10 text-gray-700 mx-auto mb-3" />
                <p className="text-gray-500 text-sm">Select a conversation</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bulk/Template Modal */}
      <Modal open={bulkModal} onClose={() => setBulkModal(false)} title="Send Template">
        <div className="space-y-4">
          <Select label="Template" value={bulkForm.template} onChange={(e) => setBulkForm({ ...bulkForm, template: e.target.value })}>
            {templates.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
          </Select>
          <div className="p-3 bg-[#0a0f1e] rounded-xl">
            <p className="text-gray-400 text-xs mb-1">Preview</p>
            <p className="text-gray-300 text-sm">{templates.find(t => t.id === bulkForm.template)?.text}</p>
          </div>
          <Input label="Contact Name *" placeholder="Tech Solutions" value={bulkForm.contact} onChange={(e) => setBulkForm({ ...bulkForm, contact: e.target.value })} />
          <Input label="WhatsApp Number *" placeholder="+1 555 999 9999" value={bulkForm.phone} onChange={(e) => setBulkForm({ ...bulkForm, phone: e.target.value })} />
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" onClick={() => setBulkModal(false)}>Cancel</Button>
            <Button onClick={handleBulk}><Send className="w-4 h-4" />Send</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
