"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Cpu, Zap, Droplets, TreePine, TrendingUp, TrendingDown } from "lucide-react";
import { baseModels, type ModelData } from "@/data/models";

interface ModelPickerProps {
  selectedModel: string;
  onModelSelect: (modelId: string) => void;
  className?: string;
}

export default function ModelPicker({ selectedModel, onModelSelect, className = "" }: ModelPickerProps) {
  const [models, setModels] = useState<ModelData[]>(baseModels);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const fetchModels = async () => {
      try {
        setLoading(true);
        const token = typeof window !== "undefined" ? localStorage.getItem("bearer_token") : null;
        const res = await fetch("/api/cerebras/models", {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
          cache: "no-store",
        });
        if (!res.ok) return;
        const data = await res.json();
        const items: any[] = data?.data ?? [];
        const mapped: ModelData[] = items.map((m) => ({
          id: m.id,
          name: `${m.id}`,
          provider: `Cerebras • ${m.owned_by || "Unknown"}`,
          size: "—",
          // ... keep dynamic placeholders for unknowns (telemetry not provided by API)
          energyPerToken: 0.001, // conservative placeholder until telemetry exists
          co2PerToken: 0.4,
          waterPerToken: 0.006,
          costPerToken: 0,
          efficiency: "medium",
          capabilities: ["Text", "Code"],
        }));
        if (!cancelled && mapped.length) {
          const existingIds = new Set(baseModels.map((b) => b.id));
          const dedup = mapped.filter((m) => !existingIds.has(m.id));
          setModels((prev) => [...prev, ...dedup]);
        }
      } catch (_) {
        // silent fail - keep base list
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchModels();
    return () => {
      cancelled = true;
    };
  }, []);

  const currentModel = models.find(m => m.id === selectedModel) || models[0];
  const baselineModel = models[0]; // GPT-4o as baseline

  const getEfficiencyColor = (efficiency: string) => {
    switch (efficiency) {
      case "high": return "neon-text-green";
      case "medium": return "neon-text-aqua";
      case "low": return "text-red-400";
      default: return "text-muted-foreground";
    }
  };

  const getEfficiencyGlow = (efficiency: string) => {
    switch (efficiency) {
      case "high": return "neon-glow-green";
      case "medium": return "neon-glow-aqua";
      case "low": return "";
      default: return "";
    }
  };

  const calculateSavings = (metric: keyof Pick<ModelData, 'energyPerToken' | 'co2PerToken' | 'waterPerToken' | 'costPerToken'>) => {
    const baseline = baselineModel[metric];
    const current = currentModel[metric];
    const savings = ((baseline - current) / baseline) * 100;
    return Math.round(savings);
  };

  return (
    <Card className={`glass-strong rounded-2xl p-6 ${className}`}>
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-full glass neon-glow-aqua">
          <Cpu className="w-6 h-6 neon-text-aqua" />
        </div>
        <div>
          <h3 className="text-xl font-bold neon-text-aqua">AI Model Selector</h3>
          <p className="text-muted-foreground text-sm">Choose your model and see the environmental impact</p>
        </div>
      </div>

      {/* Model Selector */}
      <div className="mb-6">
        <label className="text-sm font-medium text-foreground mb-2 block">
          Select AI Model {loading ? <span className="ml-2 text-xs text-muted-foreground">(loading Cerebras…)</span> : null}
        </label>
        <Select value={selectedModel} onValueChange={onModelSelect}>
          <SelectTrigger className="glass border-border/50 focus:border-primary/50">
            <SelectValue placeholder="Choose a model" />
          </SelectTrigger>
          <SelectContent className="glass-strong border-border">
            {models.map((model) => (
              <SelectItem key={model.id} value={model.id} className="focus:bg-primary/10">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${
                    model.efficiency === "high" ? "bg-green-400" :
                    model.efficiency === "medium" ? "bg-cyan-400" : "bg-red-400"
                  }`}></div>
                  <span>{model.name}</span>
                  <Badge variant="outline" className="text-xs">
                    {model.provider}
                  </Badge>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Model Details */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-4"
        >
          <div className={`glass rounded-lg p-4 ${getEfficiencyGlow(currentModel.efficiency)}`}>
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-foreground">{currentModel.name}</h4>
              <Badge 
                variant="outline" 
                className={`${getEfficiencyColor(currentModel.efficiency)} border-current`}
              >
                {currentModel.efficiency} efficiency
              </Badge>
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Provider</span>
                <span className="font-medium">{currentModel.provider}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Model Size</span>
                <span className="font-medium">{currentModel.size}</span>
              </div>
            </div>

            <div className="mt-3">
              <div className="text-xs text-muted-foreground mb-2">Capabilities</div>
              <div className="flex flex-wrap gap-1">
                {currentModel.capabilities.map((cap) => (
                  <Badge key={cap} variant="secondary" className="text-xs">
                    {cap}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Impact Metrics */}
          <div className="grid grid-cols-2 gap-3">
            <div className="glass rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-4 h-4 neon-text-aqua" />
                <span className="text-xs font-medium">Energy</span>
              </div>
              <div className="text-sm font-bold neon-text-aqua">
                {currentModel.energyPerToken.toFixed(6)} kWh
              </div>
              <div className="text-xs text-muted-foreground">per 1k tokens</div>
            </div>

            <div className="glass rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <TreePine className="w-4 h-4 neon-text-violet" />
                <span className="text-xs font-medium">CO₂</span>
              </div>
              <div className="text-sm font-bold neon-text-violet">
                {currentModel.co2PerToken.toFixed(3)} g
              </div>
              <div className="text-xs text-muted-foreground">per 1k tokens</div>
            </div>

            <div className="glass rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <Droplets className="w-4 h-4 neon-text-green" />
                <span className="text-xs font-medium">Water</span>
              </div>
              <div className="text-sm font-bold neon-text-green">
                {currentModel.waterPerToken.toFixed(6)} L
              </div>
              <div className="text-xs text-muted-foreground">per 1k tokens</div>
            </div>

            <div className="glass rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-medium">💰</span>
                <span className="text-xs font-medium">Cost</span>
              </div>
              <div className="text-sm font-bold text-yellow-400">
                ${currentModel.costPerToken.toFixed(4)}
              </div>
              <div className="text-xs text-muted-foreground">per 1k tokens</div>
            </div>
          </div>
        </motion.div>

        {/* Comparison & Savings */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          <div className="glass rounded-lg p-4">
            <h4 className="font-semibold text-foreground mb-3">
              Savings vs GPT-4o (baseline)
            </h4>
            
            <div className="space-y-3">
              {[
                { 
                  label: "Energy Usage", 
                  metric: "energyPerToken" as const, 
                  icon: Zap, 
                  color: "neon-text-aqua" 
                },
                { 
                  label: "CO₂ Emissions", 
                  metric: "co2PerToken" as const, 
                  icon: TreePine, 
                  color: "neon-text-violet" 
                },
                { 
                  label: "Water Usage", 
                  metric: "waterPerToken" as const, 
                  icon: Droplets, 
                  color: "neon-text-green" 
                },
                { 
                  label: "Cost", 
                  metric: "costPerToken" as const, 
                  icon: () => <span>💰</span>, 
                  color: "text-yellow-400" 
                },
              ].map((item) => {
                const savings = calculateSavings(item.metric);
                const Icon = item.icon as any;
                const TrendIcon = savings > 0 ? TrendingDown : TrendingUp;
                
                return (
                  <div key={item.label} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Icon className={`w-4 h-4 ${item.color}`} />
                      <span className="text-sm">{item.label}</span>
                    </div>
                    <div className={`flex items-center gap-1 ${
                      savings > 0 ? "text-green-400" : "text-red-400"
                    }`}>
                      <TrendIcon className="w-4 h-4" />
                      <span className="font-bold">
                        {savings > 0 ? "-" : "+"}{Math.abs(savings)}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recommendation */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className={`glass rounded-lg p-4 ${getEfficiencyGlow(currentModel.efficiency)}`}
          >
            <h4 className={`font-semibold mb-2 ${getEfficiencyColor(currentModel.efficiency)}`}>
              Environmental Impact
            </h4>
            <p className="text-sm text-muted-foreground">
              {currentModel.efficiency === "high" && 
                "🌱 Excellent choice! This model offers great performance with minimal environmental impact."}
              {currentModel.efficiency === "medium" && 
                "⚖️ Balanced option. Good performance with moderate environmental impact."}
              {currentModel.efficiency === "low" && 
                "⚠️ High impact model. Consider using for complex tasks only."}
            </p>
          </motion.div>
        </motion.div>
      </div>
    </Card>
  );
}