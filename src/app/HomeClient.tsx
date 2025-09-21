"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import PromptConsole from "@/components/PromptConsole";
import PipelineAnimation from "@/components/PipelineAnimation";
import ImpactStats from "@/components/ImpactStats";
import OptimizedPrompt from "@/components/OptimizedPrompt";
import Globe3D from "@/components/Globe3D";
import GamificationPanel from "@/components/GamificationPanel";
import ModelPicker from "@/components/ModelPicker";
import HPCEducationCard from "@/components/HPCEducationCard";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sparkles, Globe, Award, BookOpen } from "lucide-react";
import { baseModels } from "@/data/models";
import { useSession } from "@/lib/auth-client";
import GlobalLeaderboard from "@/components/GlobalLeaderboard";
import AILearningTips from "@/components/AILearningTips";

export const HomeClient = () => {
  const [currentTab, setCurrentTab] = useState("optimize");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [pipelineStage, setPipelineStage] = useState<
    "idle" | "tokenizing" | "processing" | "generating" | "complete"
  >("idle");
  const [impactData, setImpactData] = useState<any>(null);
  const [optimizedData, setOptimizedData] = useState<any>(null);
  const [selectedModel, setSelectedModel] = useState("llama3.1-8b");
  const { data: session, isPending } = useSession();

  // Persist pending continent to profile once user is authenticated
  useEffect(() => {
    const persistContinent = async () => {
      if (typeof window === "undefined") return;
      const pending = localStorage.getItem("pending_continent");
      if (!pending || !session?.user) return;
      try {
        const token = localStorage.getItem("bearer_token") || "";
        await fetch("/api/profile", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ continent: pending }),
        });
      } catch (e) {
        // no-op
      } finally {
        localStorage.removeItem("pending_continent");
      }
    };
    if (!isPending) persistContinent();
  }, [isPending, session]);

  const handlePromptAnalyze = async (prompt: string) => {
    setIsAnalyzing(true);
    setImpactData(null);
    setOptimizedData(null);

    try {
      setPipelineStage("tokenizing");
      await new Promise((r) => setTimeout(r, 500));

      setPipelineStage("processing");

      const token =
        typeof window !== "undefined" ? localStorage.getItem("bearer_token") : null;
      const isGemini = selectedModel.toLowerCase().includes("gemini");
      const res = await fetch(
        isGemini ? "/api/gemini/optimize" : "/api/cerebras/chat",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify(
            isGemini
              ? { model: "gemini-1.5-flash", prompt }
              : { model: selectedModel, prompt }
          ),
        }
      );

      setPipelineStage("generating");

      if (!res.ok) {
        // Fallback: keep old local estimation if API fails
        const tokens = prompt.split(" ").length * 1.3;
        // --- New: model-aware, scaled-to-10M impact ---
        const model = baseModels.find((m) => m.id === selectedModel) || baseModels[0];
        const perTokEnergy = model.energyPerToken / 1000; // kWh per token
        const perTokCO2 = model.co2PerToken / 1000; // g per token
        const perTokWater = model.waterPerToken / 1000; // L per token
        const usedTokens = Math.max(1, Math.round(tokens));
        const targetTokens = 10_000_000;
        const peopleEq = Math.ceil(targetTokens / usedTokens);
        const scaledTokens = targetTokens; // exactly 10M tokens
        const energy = perTokEnergy * scaledTokens;
        const co2 = perTokCO2 * scaledTokens;
        const water = perTokWater * scaledTokens;
        // legends
        const homesPerDayKwh = 30; // avg household daily electricity
        const houses = Math.max(1, Math.round(energy / homesPerDayKwh));
        const energyLegend = `Enough electricity to power ~${houses.toLocaleString()} homes for 1 day.`;
        const drinkingPerPersonPerDayL = 2; // daily drinking water
        const peopleWaterDays = Math.max(1, Math.round(water / drinkingPerPersonPerDayL));
        const waterLegend = `Enough drinking water for ~${peopleWaterDays.toLocaleString()} people for 1 day.`;
        const gPerKm = 120; // g CO₂ per km typical car
        const km = co2 / gPerKm;
        const co2Legend = `Equivalent to driving ~${km.toFixed(1)} km in a typical car.`;

        setImpactData({
          energy,
          co2,
          water,
          tokens: scaledTokens,
          efficiency: model.efficiency,
          peopleEquivalent: peopleEq,
          energyLegend,
          waterLegend,
          co2Legend,
        });
        setOptimizedData({
          originalPrompt: prompt,
          optimizedPrompt: prompt,
          savings: { energy: 0, co2: 0, water: 0, tokens: 0 },
          llmAnswer: null,
        });
        setPipelineStage("complete");
        setIsAnalyzing(false);
        return;
      }

      const data = await res.json();
      const optimizedPrompt = (data?.optimizedPrompt as string) || "";
      const answer = (data?.answer as string) || null;

      // Usage tokens from API if available
      const usage = data?.usage || null;
      const totalTokens =
        usage?.total_tokens ?? (usage?.prompt_tokens ?? 0) + (usage?.completion_tokens ?? 0);

      // Estimate tokens for impact if API didn't return usage
      const estimatedOriginalTokens = prompt.split(" ").length * 1.3;
      const estimatedOptimizedTokens = (optimizedPrompt || prompt).split(" ").length * 1.3;

      const usedTokens = totalTokens || Math.round(estimatedOptimizedTokens);

      // --- New: model-aware, scaled-to-10M impact ---
      const model = baseModels.find((m) => m.id === selectedModel) || baseModels[0];
      const perTokEnergy = model.energyPerToken / 1000; // kWh per token
      const perTokCO2 = model.co2PerToken / 1000; // g per token
      const perTokWater = model.waterPerToken / 1000; // L per token
      const targetTokens = 10_000_000;
      const peopleEq = Math.ceil(targetTokens / Math.max(1, usedTokens));
      const scaledTokens = targetTokens; // show impact for 10M tokens total
      const energy = perTokEnergy * scaledTokens;
      const co2 = perTokCO2 * scaledTokens;
      const water = perTokWater * scaledTokens;
      // legends
      const homesPerDayKwh = 30;
      const houses = Math.max(1, Math.round(energy / homesPerDayKwh));
      const energyLegend = `Enough electricity to power ~${houses.toLocaleString()} homes for 1 day.`;
      const drinkingPerPersonPerDayL = 2;
      const peopleWaterDays = Math.max(1, Math.round(water / drinkingPerPersonPerDayL));
      const waterLegend = `Enough drinking water for ~${peopleWaterDays.toLocaleString()} people for 1 day.`;
      const gPerKm = 120;
      const km = co2 / gPerKm;
      const co2Legend = `Equivalent to driving ~${km.toFixed(1)} km in a typical car.`;

      const impact = {
        energy,
        co2,
        water,
        tokens: scaledTokens,
        efficiency: model.efficiency as "low" | "medium" | "high",
        peopleEquivalent: peopleEq,
        energyLegend,
        waterLegend,
        co2Legend,
      } as any;

      const savings = {
        energy: Math.round(
          ((estimatedOriginalTokens - estimatedOptimizedTokens) / estimatedOriginalTokens) * 100
        ),
        co2: Math.round(
          ((estimatedOriginalTokens - estimatedOptimizedTokens) / estimatedOriginalTokens) * 100
        ),
        water: Math.round(
          ((estimatedOriginalTokens - estimatedOptimizedTokens) / estimatedOriginalTokens) * 100
        ),
        tokens: Math.max(0, Math.round(estimatedOriginalTokens - estimatedOptimizedTokens)),
      };

      setImpactData(impact);
      setOptimizedData({
        originalPrompt: prompt,
        optimizedPrompt: optimizedPrompt || prompt,
        savings,
        llmAnswer: answer,
      });

      setPipelineStage("complete");
    } catch (err) {
      // Soft-fail to local estimation on any unexpected error
      const tokens = prompt.split(" ").length * 1.3;
      const model = baseModels.find((m) => m.id === selectedModel) || baseModels[0];
      const perTokEnergy = model.energyPerToken / 1000;
      const perTokCO2 = model.co2PerToken / 1000;
      const perTokWater = model.waterPerToken / 1000;
      const usedTokens = Math.max(1, Math.round(tokens));
      const targetTokens = 10_000_000;
      const peopleEq = Math.ceil(targetTokens / usedTokens);
      const scaledTokens = targetTokens;
      const energy = perTokEnergy * scaledTokens;
      const co2 = perTokCO2 * scaledTokens;
      const water = perTokWater * scaledTokens;
      const homesPerDayKwh = 30;
      const houses = Math.max(1, Math.round(energy / homesPerDayKwh));
      const energyLegend = `Enough electricity to power ~${houses.toLocaleString()} homes for 1 day.`;
      const drinkingPerPersonPerDayL = 2;
      const peopleWaterDays = Math.max(1, Math.round(water / drinkingPerPersonPerDayL));
      const waterLegend = `Enough drinking water for ~${peopleWaterDays.toLocaleString()} people for 1 day.`;
      const gPerKm = 120;
      const km = co2 / gPerKm;
      const co2Legend = `Equivalent to driving ~${km.toFixed(1)} km in a typical car.`;

      setImpactData({
        energy,
        co2,
        water,
        tokens: scaledTokens,
        efficiency: model.efficiency,
        peopleEquivalent: peopleEq,
        energyLegend,
        waterLegend,
        co2Legend,
      } as any);
      setOptimizedData({
        originalPrompt: prompt,
        optimizedPrompt: prompt,
        savings: { energy: 0, co2: 0, water: 0, tokens: 0 },
        llmAnswer: null,
      });
      setPipelineStage("complete");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen cyber-grid">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Decorative animated glow behind title */}
        <div aria-hidden className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="w-[60vw] h-[60vw] max-w-[900px] max-h-[900px] rounded-full gradient-violet-aqua gradient-animated blur-3xl opacity-20" />
        </div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="container mx-auto px-6 py-12">
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="inline-flex items-center gap-4 mb-6"
            >
              <div className="p-3 rounded-full glass">
                <Sparkles className="w-8 h-8 text-primary" />
              </div>
              <h1 className="font-display text-6xl md:text-8xl font-extrabold tracking-tight text-transparent bg-clip-text gradient-violet-aqua gradient-animated drop-shadow-xl">
                Sustain‑A‑Prompt
              </h1>
              <div className="p-3 rounded-full glass">
                <Globe className="w-8 h-8 text-primary" />
              </div>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto mb-8"
            >
              Optimize your AI prompts for environmental impact. Reduce energy consumption,
              lower CO₂ emissions, and save water while maintaining quality.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-wrap gap-4 justify-center"
            >
              <Button onClick={() => setCurrentTab("optimize")} className="px-8 py-3 text-lg shadow-sm">
                <Sparkles className="w-5 h-5 mr-2" />
                Start Optimizing
              </Button>
              <Button variant="outline" onClick={() => setCurrentTab("learn")} className="px-8 py-3 text-lg">
                <BookOpen className="w-5 h-5 mr-2" />
                Learn More
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Main Navigation */}
      <div className="container mx-auto px-6">
        <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 glass-strong max-w-2xl mx-auto mb-8">
            <TabsTrigger
              value="optimize"
              className="flex items-center gap-2 data-[state=active]:bg-secondary data-[state=active]:text-foreground"
            >
              <Sparkles className="w-4 h-4" />
              Optimize
            </TabsTrigger>
            <TabsTrigger
              value="globe"
              className="flex items-center gap-2 data-[state=active]:bg-secondary data-[state=active]:text-foreground"
            >
              <Globe className="w-4 h-4" />
              Global
            </TabsTrigger>
            <TabsTrigger
              value="gamify"
              className="flex items-center gap-2 data-[state=active]:bg-secondary data-[state=active]:text-foreground"
            >
              <Award className="w-4 h-4" />
              Achieve
            </TabsTrigger>
            <TabsTrigger
              value="learn"
              className="flex items-center gap-2 data-[state=active]:bg-secondary data-[state=active]:text-foreground"
            >
              <BookOpen className="w-4 h-4" />
              Learn
            </TabsTrigger>
          </TabsList>

          {/* Optimization Tab */}
          <TabsContent value="optimize" className="space-y-8">
            <PromptConsole onAnalyze={handlePromptAnalyze} isAnalyzing={isAnalyzing} />

            {(isAnalyzing || pipelineStage !== "idle") && (
              <PipelineAnimation isActive={isAnalyzing} stage={pipelineStage} />
            )}

            {impactData && <ImpactStats data={impactData} isVisible={!isAnalyzing} />}

            {optimizedData && (
              <OptimizedPrompt
                originalPrompt={optimizedData.originalPrompt}
                optimizedPrompt={optimizedData.optimizedPrompt}
                savings={optimizedData.savings}
                isVisible={!isAnalyzing && pipelineStage === "complete"}
                llmAnswer={optimizedData.llmAnswer}
              />
            )}

            {/* Model Picker */}
            <ModelPicker selectedModel={selectedModel} onModelSelect={setSelectedModel} />
          </TabsContent>

          {/* Global Activity Tab */}
          <TabsContent value="globe">
            <div className="space-y-6">
              <Globe3D />
              <GlobalLeaderboard />
            </div>
          </TabsContent>

          {/* Gamification Tab */}
          <TabsContent value="gamify">
            <GamificationPanel />
          </TabsContent>

          {/* Learning Tab */}
          <TabsContent value="learn">
            <div className="space-y-6">
              <HPCEducationCard />
              <AILearningTips />
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Footer */}
      <footer className="container mx-auto px-6 py-12 mt-20">
        <div className="text-center">
          <div className="glass rounded-2xl p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-primary mb-4">Join the Green AI Revolution</h3>
            <p className="text-muted-foreground mb-6">
              Every optimized prompt contributes to a more sustainable future.
              Together, we can reduce AI's environmental footprint while maintaining innovation.
            </p>
            <div className="flex flex-wrap gap-4 justify-center text-sm text-muted-foreground">
              <span>🌱 Carbon Neutral AI</span>
              <span>💧 Water Conservation</span>
              <span>⚡ Energy Efficiency</span>
              <span>🌍 Global Impact</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};