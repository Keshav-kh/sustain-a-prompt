"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Send, Sparkles, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface PromptConsoleProps {
  onAnalyze: (prompt: string) => void;
  isAnalyzing: boolean;
}

export default function PromptConsole({ onAnalyze, isAnalyzing }: PromptConsoleProps) {
  const [prompt, setPrompt] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim()) {
      onAnalyze(prompt.trim());
    }
  };

  return (
    <Card className="glass-strong rounded-2xl p-8 max-w-4xl mx-auto">
      <div className="text-center mb-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-3 mb-4"
        >
          <Sparkles className="w-8 h-8 neon-text-aqua" />
          <h2 className="text-3xl font-bold neon-text-aqua">AI Prompt Optimizer</h2>
          <Sparkles className="w-8 h-8 neon-text-aqua" />
        </motion.div>
        <p className="text-muted-foreground text-lg">
          Analyze your prompts for environmental impact and get optimized suggestions
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="relative">
          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter your AI prompt here... (e.g., Write a detailed blog post about sustainable technology with examples, case studies, and implementation strategies)"
            className="min-h-[120px] text-lg glass border-border/50 focus:border-primary/50 focus:neon-glow-aqua resize-none"
            disabled={isAnalyzing}
          />
          <div className="absolute bottom-3 right-3 text-sm text-muted-foreground">
            {prompt.length} chars
          </div>
        </div>

        <div className="flex justify-center">
          <Button
            type="submit"
            size="lg"
            disabled={!prompt.trim() || isAnalyzing}
            className="px-8 py-3 text-lg font-semibold glass-strong border border-primary/30 hover:neon-glow-aqua transition-all duration-300 group"
          >
            <AnimatePresence mode="wait">
              {isAnalyzing ? (
                <motion.div
                  key="analyzing"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-2"
                >
                  <Zap className="w-5 h-5 animate-spin" />
                  Analyzing Impact...
                </motion.div>
              ) : (
                <motion.div
                  key="analyze"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-2 group-hover:scale-105 transition-transform"
                >
                  <Send className="w-5 h-5" />
                  Analyze Prompt
                </motion.div>
              )}
            </AnimatePresence>
          </Button>
        </div>
      </form>

      {/* Visual indicator */}
      <motion.div
        className="mt-6 h-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent rounded-full"
        animate={{
          opacity: isAnalyzing ? [0.3, 1, 0.3] : 0.3,
        }}
        transition={{
          duration: 2,
          repeat: isAnalyzing ? Infinity : 0,
          ease: "easeInOut",
        }}
      />
    </Card>
  );
}