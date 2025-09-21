"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import {
  Leaf,
  Droplets,
  Battery,
  Clock3,
  MessageSquare,
  FileText,
  Settings2,
  Network,
  ShieldQuestion,
  Save,
} from "lucide-react";

interface AILearningTipsProps {
  className?: string;
}

const tips = [
  {
    title: "Be concise — fewer tokens = less energy",
    desc:
      "Short, clear prompts can cut tokens by 30–50%. Try: 'Summarize in 3 bullets' instead of long instructions.",
    icon: Leaf,
    color: "neon-text-green",
  },
  {
    title: "Skip needless pleasantries",
    desc:
      "Avoid filler like ‘thanks’/‘sorry’ in prompts and follow‑ups. Every token still consumes compute, electricity, and water for cooling.",
    icon: MessageSquare,
    color: "text-blue-300",
  },
  {
    title: "Right-size the model",
    desc:
      "Use smaller/faster models for simple tasks (extract, classify). Reserve large models for reasoning-heavy asks.",
    icon: Settings2,
    color: "text-yellow-300",
  },
  {
    title: "Limit output length",
    desc:
      "Ask for exact formats and caps (e.g., '<=100 words', 'CSV with 5 rows'). Output tokens also consume energy.",
    icon: FileText,
    color: "text-teal-300",
  },
  {
    title: "Batch and cache",
    desc:
      "Group similar queries together and cache frequent answers to avoid repeated inference.",
    icon: Save,
    color: "text-emerald-300",
  },
  {
    title: "Prefer retrieval over generation",
    desc:
      "Fetching known facts (RAG, search) is often cheaper than asking the model to ‘rethink’ from scratch.",
    icon: Network,
    color: "text-violet-300",
  },
  {
    title: "Reduce retries with good context",
    desc:
      "Provide minimal but essential context and examples to avoid multiple re-runs that multiply footprint.",
    icon: Clock3,
    color: "text-amber-300",
  },
  {
    title: "Prefer structured formats",
    desc:
      "Ask for JSON/tables. Deterministic outputs reduce follow-up parsing and re-asks.",
    icon: Battery,
    color: "text-cyan-300",
  },
  {
    title: "Sensitive data caution",
    desc:
      "Unnecessary PII increases audit/storage overhead. Share only what’s required.",
    icon: ShieldQuestion,
    color: "text-red-300",
  },
  {
    title: "Hydration & cooling impact",
    desc:
      "Data centers use significant water for cooling. Efficient prompting helps lower water use per response.",
    icon: Droplets,
    color: "text-sky-300",
  },
];

export const AILearningTips = ({ className = "" }: AILearningTipsProps) => {
  return (
    <Card className={`glass-strong rounded-2xl p-6 ${className}`}>
      <div className="mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-full glass neon-glow-green">
            <Leaf className="w-6 h-6 neon-text-green" />
          </div>
          <div>
            <h3 className="text-xl font-bold neon-text-green">Practical Tips to Reduce AI Footprint</h3>
            <p className="text-muted-foreground text-sm">Actionable habits that cut energy, CO₂, and water use</p>
          </div>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {tips.map((t, i) => {
          const Icon = t.icon;
          return (
            <motion.div
              key={t.title}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.03 }}
              className="glass rounded-lg p-4 h-full"
            >
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-full glass">
                  <Icon className={`w-5 h-5 ${t.color}`} />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold leading-snug">{t.title}</span>
                    {i < 3 && (
                      <Badge variant="outline" className="border-primary/30 text-primary">High Impact</Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{t.desc}</p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </Card>
  );
};

export default AILearningTips;