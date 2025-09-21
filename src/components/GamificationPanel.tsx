"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Award, 
  Leaf, 
  Target, 
  Zap, 
  Crown, 
  Star,
  Lock,
  Unlock,
  TrendingUp
} from "lucide-react";
import { useState } from "react";

interface BadgeData {
  id: string;
  name: string;
  description: string;
  icon: any;
  earned: boolean;
  progress: number;
  maxProgress: number;
  rarity: "common" | "rare" | "epic" | "legendary";
}

interface GamificationPanelProps {
  className?: string;
}

export default function GamificationPanel({ className = "" }: GamificationPanelProps) {
  const [selectedCategory, setSelectedCategory] = useState<"badges" | "leaderboard">("badges");

  const badges: BadgeData[] = [
    {
      id: "carbon-saver",
      name: "Carbon Saver",
      description: "Reduce CO₂ emissions by 100g",
      icon: Leaf,
      earned: true,
      progress: 100,
      maxProgress: 100,
      rarity: "common",
    },
    {
      id: "eco-engineer",
      name: "Eco Engineer",
      description: "Optimize 10 prompts successfully",
      icon: Target,
      earned: true,
      progress: 10,
      maxProgress: 10,
      rarity: "rare",
    },
    {
      id: "one-shot-master",
      name: "One-Shot Master",
      description: "Get perfect results in 1 attempt",
      icon: Star,
      earned: false,
      progress: 3,
      maxProgress: 5,
      rarity: "epic",
    },
    {
      id: "energy-guardian",
      name: "Energy Guardian",
      description: "Save 1 kWh of energy",
      icon: Zap,
      earned: false,
      progress: 0.7,
      maxProgress: 1.0,
      rarity: "epic",
    },
    {
      id: "planet-protector",
      name: "Planet Protector",
      description: "Achieve 100 efficient prompts",
      icon: Crown,
      earned: false,
      progress: 23,
      maxProgress: 100,
      rarity: "legendary",
    },
  ];

  const leaderboard = [
    { rank: 1, name: "EcoMaster_42", score: 1247, badge: "legendary" },
    { rank: 2, name: "GreenCoder", score: 1156, badge: "epic" },
    { rank: 3, name: "PromptNinja", score: 1089, badge: "epic" },
    { rank: 4, name: "You", score: 847, badge: "rare" },
    { rank: 5, name: "AIOptimizer", score: 792, badge: "rare" },
  ];

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "common": return "text-gray-400";
      case "rare": return "neon-text-aqua";
      case "epic": return "neon-text-violet";
      case "legendary": return "text-yellow-400";
      default: return "text-muted-foreground";
    }
  };

  const getRarityGlow = (rarity: string) => {
    switch (rarity) {
      case "common": return "";
      case "rare": return "neon-glow-aqua";
      case "epic": return "neon-glow-violet";
      case "legendary": return "shadow-yellow-500/50";
      default: return "";
    }
  };

  return (
    <Card className={`glass-strong rounded-2xl p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-full glass neon-glow-violet">
            <Award className="w-6 h-6 neon-text-violet" />
          </div>
          <div>
            <h3 className="text-xl font-bold neon-text-violet">Achievements</h3>
            <p className="text-muted-foreground text-sm">Track your eco-impact progress</p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            variant={selectedCategory === "badges" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory("badges")}
            className={selectedCategory === "badges" ? "neon-glow-violet" : "glass"}
          >
            Badges
          </Button>
          <Button
            variant={selectedCategory === "leaderboard" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory("leaderboard")}
            className={selectedCategory === "leaderboard" ? "neon-glow-violet" : "glass"}
          >
            Leaderboard
          </Button>
        </div>
      </div>

      {selectedCategory === "badges" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {badges.map((badge, index) => {
            const Icon = badge.icon;
            const LockIcon = badge.earned ? Unlock : Lock;
            
            return (
              <motion.div
                key={badge.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className={`glass rounded-xl p-4 ${getRarityGlow(badge.rarity)} ${
                  badge.earned ? "opacity-100" : "opacity-60"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-2 rounded-lg glass ${getRarityGlow(badge.rarity)}`}>
                    <Icon className={`w-6 h-6 ${getRarityColor(badge.rarity)}`} />
                  </div>
                  <div className="flex items-center gap-1">
                    <LockIcon className="w-4 h-4 text-muted-foreground" />
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${getRarityColor(badge.rarity)} border-current`}
                    >
                      {badge.rarity}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className={`font-semibold ${badge.earned ? getRarityColor(badge.rarity) : "text-muted-foreground"}`}>
                    {badge.name}
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    {badge.description}
                  </p>

                  {!badge.earned && (
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Progress</span>
                        <span className={getRarityColor(badge.rarity)}>
                          {badge.progress}/{badge.maxProgress}
                        </span>
                      </div>
                      <Progress
                        value={(badge.progress / badge.maxProgress) * 100}
                        className="h-2"
                      />
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      )}

      {selectedCategory === "leaderboard" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-3"
        >
          {leaderboard.map((entry, index) => (
            <motion.div
              key={entry.rank}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`glass rounded-lg p-4 ${
                entry.name === "You" ? "neon-glow-aqua border border-primary/30" : ""
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`
                    w-8 h-8 rounded-full flex items-center justify-center font-bold
                    ${entry.rank === 1 ? "bg-yellow-400 text-black" :
                      entry.rank === 2 ? "bg-gray-300 text-black" :
                      entry.rank === 3 ? "bg-amber-600 text-white" :
                      "glass border border-border"}
                  `}>
                    {entry.rank}
                  </div>
                  <div>
                    <div className={`font-semibold ${
                      entry.name === "You" ? "neon-text-aqua" : "text-foreground"
                    }`}>
                      {entry.name}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {entry.score} efficiency points
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Badge 
                    variant="outline" 
                    className={`${getRarityColor(entry.badge)} border-current`}
                  >
                    {entry.badge}
                  </Badge>
                  {entry.name === "You" && (
                    <TrendingUp className="w-4 h-4 text-green-400" />
                  )}
                </div>
              </div>
            </motion.div>
          ))}

          {/* Your stats summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="glass-strong rounded-lg p-4 neon-glow-aqua mt-6"
          >
            <h4 className="font-semibold neon-text-aqua mb-3">Your Progress</h4>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold neon-text-green">23</div>
                <div className="text-xs text-muted-foreground">Optimizations</div>
              </div>
              <div>
                <div className="text-2xl font-bold neon-text-aqua">847</div>
                <div className="text-xs text-muted-foreground">Points</div>
              </div>
              <div>
                <div className="text-2xl font-bold neon-text-violet">2.3</div>
                <div className="text-xs text-muted-foreground">kWh Saved</div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </Card>
  );
}