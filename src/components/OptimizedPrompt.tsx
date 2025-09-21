"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Check, Sparkles, TrendingDown, ArrowRight } from "lucide-react";
import { useState } from "react";

// Sanitizes common LLM boilerplate/copy-paste patterns for the main answer box
function sanitizeLLMAnswer(answer: string): string {
  let s = answer;
  // Remove leading courteous fillers
  s = s.replace(/^(?:sure,?|certainly,?|of course,?|here(?:'s| is)\b|here are\b|absolutely,?)\s*/i, "");
  // Remove AI disclaimers
  s = s.replace(/^(?:as an ai[^\.\n]*[\.!]?\s*)/i, "");
  // Remove browsing/access disclaimers
  s = s.replace(/\bI (?:can't|cannot|do not|don't) (?:browse|access|open) [^\.!\.\n]*[\.!]?\s*/gi, "");
  // Strip markdown code fences but keep inner content
  s = s.replace(/```(?:[a-zA-Z0-9_-]+)?\n([\s\S]*?)```/g, "$1");
  // Remove inline code fences around single/backticked words
  s = s.replace(/`([^`]+)`/g, "$1");
  // NEW: Strip markdown bold/italic markers and headings
  s = s.replace(/\*\*([^*]+)\*\*/g, "$1"); // **bold** -> bold
  s = s.replace(/(?:(?:\*|_){1,3})([^*_]+)(?:\*|_){1,3}/g, "$1"); // _italic_ or ***bold*** -> text
  s = s.replace(/^\s*#{1,6}\s+/gm, ""); // remove heading hashes
  // Remove blockquotes
  s = s.replace(/^>\s?.*$/gm, "");
  // Normalize lists: bullets and numbered lists to •
  s = s.replace(/^\s*[-*]\s+/gm, "• ");
  s = s.replace(/^\s*\d+[\.)]\s+/gm, "• ");
  // Insert bullets for inline hyphen/em-dash separators like " - " / " — "
  s = s.replace(/\s-\s/g, "\n• ");
  s = s.replace(/\s—\s/g, "\n• ");
  // Ensure bullets not at line start move to a new line
  s = s.replace(/([^\n])\s•\s/g, "$1\n• ");
  // Ensure section-like headings ending with a colon are on their own line
  s = s.replace(/([^\n])\s([A-Z][A-Za-z0-9 ]{2,60}:)\s*/g, "$1\n$2\n");
  // Prevent duplicate bullets at start of line
  s = s.replace(/^\s*•\s*•\s*/gm, "• ");
  // Remove bracketed citation markers like [1], [source]
  s = s.replace(/\[(?:\d+|source|citation|ref|link)\]/gi, "");
  // Collapse duplicate lines like repeated headers
  s = s.replace(/^(.*)(?:\r?\n)\1+/gm, "$1\n");
  // Trim trailing spaces per line
  s = s.replace(/[ \t]+$/gm, "");
  // Collapse multiple spaces but preserve newlines
  s = s.replace(/[ \t]{2,}/g, " ");
  // Collapse excessive newlines and trim
  s = s.replace(/\n{3,}/g, "\n\n").trim();
  return s;
}

interface OptimizedPromptProps {
  originalPrompt: string;
  optimizedPrompt: string;
  savings: {
    energy: number; // percentage
    co2: number; // percentage
    water: number; // percentage
    tokens: number; // token reduction
  };
  isVisible: boolean;
  llmAnswer?: string; // NEW: concise LLM answer
}

export default function OptimizedPrompt({
  originalPrompt,
  optimizedPrompt,
  savings,
  isVisible,
  llmAnswer,
}: OptimizedPromptProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(optimizedPrompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  // Apply regex cleanup to the LLM answer before rendering
  const processedAnswer = llmAnswer ? (sanitizeLLMAnswer(llmAnswer) || llmAnswer) : undefined;

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-6xl mx-auto"
    >
      <div className="text-center mb-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="inline-flex items-center gap-3 mb-4"
        >
          <Sparkles className="w-6 h-6 neon-text-green" />
          <h3 className="text-2xl font-bold neon-text-green">Optimized Prompt</h3>
          <Sparkles className="w-6 h-6 neon-text-green" />
        </motion.div>
        <p className="text-muted-foreground">
          Here's your environmentally optimized prompt with reduced resource consumption
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Original Prompt */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="glass rounded-2xl p-6 h-full">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-3 h-3 bg-red-400 rounded-full"></div>
              <h4 className="font-semibold text-muted-foreground">Original Prompt</h4>
            </div>
            <div className="bg-muted/30 rounded-lg p-4 text-sm font-mono leading-relaxed">
              {originalPrompt}
            </div>
            <div className="mt-4 text-xs text-muted-foreground">
              {originalPrompt.split(" ").length} words • Higher resource usage
            </div>
          </Card>
        </motion.div>

        {/* Optimized Prompt */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="glass-strong rounded-2xl p-6 h-full neon-glow-green">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-400 rounded-full pulse-glow"></div>
                <h4 className="font-semibold neon-text-green">Optimized Prompt</h4>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopy}
                className="glass border-green-400/30 hover:neon-glow-green"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-green-400" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            </div>
            <div className="bg-green-400/10 rounded-lg p-4 text-sm font-mono leading-relaxed border border-green-400/20">
              {optimizedPrompt}
            </div>
            <div className="mt-4 text-xs neon-text-green">
              {optimizedPrompt.split(" ").length} words • Reduced resource usage
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Savings Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card className="glass-strong rounded-2xl p-8 neon-glow-aqua">
          <div className="text-center mb-6">
            <h4 className="text-xl font-bold neon-text-aqua mb-2">Environmental Savings</h4>
            <p className="text-muted-foreground">
              By using the optimized prompt, you'll reduce your environmental impact
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <motion.div
                className="text-3xl font-bold neon-text-green mb-2"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.7 }}
              >
                -{savings.energy}%
              </motion.div>
              <div className="text-sm text-muted-foreground">Energy Usage</div>
              <TrendingDown className="w-4 h-4 text-green-400 mx-auto mt-1" />
            </div>

            <div className="text-center">
              <motion.div
                className="text-3xl font-bold neon-text-green mb-2"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.8 }}
              >
                -{savings.co2}%
              </motion.div>
              <div className="text-sm text-muted-foreground">CO₂ Emissions</div>
              <TrendingDown className="w-4 h-4 text-green-400 mx-auto mt-1" />
            </div>

            <div className="text-center">
              <motion.div
                className="text-3xl font-bold neon-text-green mb-2"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.9 }}
              >
                -{savings.water}%
              </motion.div>
              <div className="text-sm text-muted-foreground">Water Usage</div>
              <TrendingDown className="w-4 h-4 text-green-400 mx-auto mt-1" />
            </div>

            <div className="text-center">
              <motion.div
                className="text-3xl font-bold neon-text-aqua mb-2"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 1.0 }}
              >
                -{savings.tokens}
              </motion.div>
              <div className="text-sm text-muted-foreground">Tokens Saved</div>
              <TrendingDown className="w-4 h-4 text-cyan-400 mx-auto mt-1" />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Button
              onClick={handleCopy}
              className="px-6 py-3 glass-strong border border-green-400/30 hover:neon-glow-green neon-text-green"
            >
              {copied ? (
                <>
                  <Check className="w-5 h-5 mr-2" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-5 h-5 mr-2" />
                  Copy Optimized Prompt
                </>
              )}
            </Button>
            <Button
              variant="outline"
              className="px-6 py-3 glass border border-primary/30 hover:neon-glow-aqua"
            >
              <ArrowRight className="w-5 h-5 mr-2" />
              Try Another Prompt
            </Button>
          </div>
        </Card>
      </motion.div>

      {/* LLM Answer */}
      {processedAnswer && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-6"
        >
          <Card className="glass rounded-2xl p-6 max-w-4xl mx-auto">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2.5 h-2.5 bg-cyan-400 rounded-full"></div>
              <h4 className="font-semibold neon-text-aqua">LLM Answer</h4>
            </div>
            <div className="text-sm leading-relaxed text-foreground/90 whitespace-pre-wrap">
              {processedAnswer}
            </div>
          </Card>
        </motion.div>
      )}
    </motion.div>
  );
}