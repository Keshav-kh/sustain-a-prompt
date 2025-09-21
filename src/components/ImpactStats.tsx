"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Zap, Droplets, TreePine, TrendingDown, TrendingUp, Leaf } from "lucide-react";

interface ImpactData {
  energy: number; // kWh
  co2: number; // grams
  water: number; // liters
  tokens: number;
  efficiency: "low" | "medium" | "high";
  // New optional narrative fields
  peopleEquivalent?: number;
  energyLegend?: string;
  waterLegend?: string;
  co2Legend?: string;
}

interface ImpactStatsProps {
  data: ImpactData | null;
  isVisible: boolean;
}

export default function ImpactStats({ data, isVisible }: ImpactStatsProps) {
  if (!data || !isVisible) {
    return null;
  }

  const getEfficiencyColor = (efficiency: string) => {
    switch (efficiency) {
      case "high":
        return "neon-text-green";
      case "medium":
        return "neon-text-aqua";
      case "low":
        return "text-red-400";
      default:
        return "text-muted-foreground";
    }
  };

  const getEfficiencyGlow = (efficiency: string) => {
    switch (efficiency) {
      case "high":
        return "neon-glow-green";
      case "medium":
        return "neon-glow-aqua";
      case "low":
        return "shadow-red-500/30";
      default:
        return "";
    }
  };

  const stats = [
    {
      icon: Zap,
      label: "Energy Usage",
      value: data.energy.toFixed(3),
      unit: "kWh",
      color: "neon-text-aqua",
      glow: "neon-glow-aqua",
      comparison: data.energy > 0.05 ? "high" : data.energy > 0.02 ? "medium" : "low",
      legend: data.energyLegend,
    },
    {
      icon: TreePine,
      label: "CO₂ Emissions",
      value: data.co2.toFixed(1),
      unit: "g CO₂",
      color: "neon-text-violet",
      glow: "neon-glow-violet",
      comparison: data.co2 > 25 ? "high" : data.co2 > 10 ? "medium" : "low",
      legend: data.co2Legend,
    },
    {
      icon: Droplets,
      label: "Water Usage",
      value: data.water.toFixed(2),
      unit: "L",
      color: "neon-text-green",
      glow: "neon-glow-green",
      comparison: data.water > 0.5 ? "high" : data.water > 0.2 ? "medium" : "low",
      legend: data.waterLegend,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto"
    >
      {/* People-equivalent narrative (scaled to 10M tokens) */}
      {typeof data.peopleEquivalent === "number" && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="md:col-span-3"
        >
          <Card className="glass rounded-2xl p-4">
            <p className="text-sm text-muted-foreground">
              Assuming a total of <span className="font-semibold text-foreground">10,000,000 tokens</span>: that's roughly
              <span className="font-semibold text-foreground"> {data.peopleEquivalent.toLocaleString()} people</span>
              {" "}asking this same-length question.
            </p>
          </Card>
        </motion.div>
      )}

      {stats.map((stat, index) => {
        const Icon = stat.icon;
        const ComparisonIcon = stat.comparison === "low" ? TrendingDown : TrendingUp;
        
        return (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card className={`glass-strong rounded-2xl p-6 ${stat.glow} pulse-slow`}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-full glass ${stat.glow}`}>
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                  <h3 className="font-semibold text-foreground">{stat.label}</h3>
                </div>
                <div className={`flex items-center gap-1 ${
                  stat.comparison === "low" ? "text-green-400" : "text-red-400"
                }`}>
                  <ComparisonIcon className="w-4 h-4" />
                  <span className="text-xs font-medium">
                    {stat.comparison === "low" ? "Low" : stat.comparison === "medium" ? "Med" : "High"}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-baseline gap-2">
                  <motion.span
                    className={`text-3xl font-bold ${stat.color}`}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ 
                      type: "spring", 
                      stiffness: 200, 
                      delay: 0.3 + index * 0.1 
                    }}
                  >
                    {stat.value}
                  </motion.span>
                  <span className="text-muted-foreground">{stat.unit}</span>
                </div>

                {/* Visual meter */}
                <div className="w-full bg-border/30 rounded-full h-2">
                  <motion.div
                    className={`h-full rounded-full bg-gradient-to-r ${
                      stat.comparison === "low" 
                        ? "from-green-500 to-emerald-400"
                        : stat.comparison === "medium"
                        ? "from-yellow-500 to-orange-400"
                        : "from-red-500 to-pink-400"
                    }`}
                    initial={{ width: 0 }}
                    animate={{ 
                      width: stat.comparison === "low" 
                        ? "30%" 
                        : stat.comparison === "medium"
                        ? "60%"
                        : "90%"
                    }}
                    transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                  />
                </div>

                {/* Legend for concrete equivalence */}
                {stat.legend && (
                  <p className="text-xs text-muted-foreground mt-2">{stat.legend}</p>
                )}
              </div>
            </Card>
          </motion.div>
        );
      })}

      {/* Overall Efficiency Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, delay: 0.4 }}
        className="md:col-span-3"
      >
        <Card className={`glass-strong rounded-2xl p-6 ${getEfficiencyGlow(data.efficiency)}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-full glass ${getEfficiencyGlow(data.efficiency)}`}>
                <Leaf className={`w-8 h-8 ${getEfficiencyColor(data.efficiency)}`} />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-1">
                  Prompt Efficiency Score
                </h3>
                <p className="text-muted-foreground">
                  Based on {data.tokens.toLocaleString()} tokens processed (scaled scenario)
                </p>
              </div>
            </div>

            <div className="text-right">
              <motion.div
                className={`text-4xl font-bold ${getEfficiencyColor(data.efficiency)} mb-2`}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, delay: 0.6 }}
              >
                {data.efficiency === "high" ? "A+" : data.efficiency === "medium" ? "B" : "C-"}
              </motion.div>
              <div className={`text-sm ${getEfficiencyColor(data.efficiency)} uppercase tracking-wide`}>
                {data.efficiency} Impact
              </div>
            </div>
          </div>

          {/* Progress bar for overall score */}
          <div className="mt-6 w-full bg-border/30 rounded-full h-3">
            <motion.div
              className={`h-full rounded-full ${
                data.efficiency === "high" 
                  ? "bg-gradient-to-r from-green-500 to-emerald-400"
                  : data.efficiency === "medium"
                  ? "bg-gradient-to-r from-cyan-500 to-blue-400"
                  : "bg-gradient-to-r from-red-500 to-pink-400"
              }`}
              initial={{ width: 0 }}
              animate={{ 
                width: data.efficiency === "high" 
                  ? "85%" 
                  : data.efficiency === "medium"
                  ? "60%"
                  : "30%"
              }}
              transition={{ duration: 1.5, delay: 0.7 }}
            />
          </div>

          {/* Narrative reminder */}
          {typeof data.peopleEquivalent === "number" && (
            <p className="mt-4 text-xs text-muted-foreground">
              Figures shown reflect a scenario scaled to 10,000,000 tokens total (~{data.peopleEquivalent.toLocaleString()} people asking this same-length prompt).
            </p>
          )}
        </Card>
      </motion.div>
    </motion.div>
  );
}