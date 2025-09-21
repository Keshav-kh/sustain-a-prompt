"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Server, 
  Zap, 
  Brain, 
  Database, 
  Thermometer,
  Factory,
  Lightbulb,
  TrendingUp,
  Info
} from "lucide-react";

interface HPCEducationCardProps {
  className?: string;
}

export default function HPCEducationCard({ className = "" }: HPCEducationCardProps) {
  const trainingFacts = [
    {
      model: "GPT-4",
      trainingTime: "3-6 months",
      energyUsed: "50,000 MWh",
      co2Emissions: "25,000 tons",
      cost: "$100M+",
      gpuHours: "25M GPU hours",
    },
    {
      model: "Claude-3",
      trainingTime: "4-8 months",
      energyUsed: "45,000 MWh",
      co2Emissions: "22,500 tons",
      cost: "$80M+",
      gpuHours: "20M GPU hours",
    },
    {
      model: "Llama-2-70B",
      trainingTime: "2-4 months",
      energyUsed: "20,000 MWh",
      co2Emissions: "10,000 tons",
      cost: "$20M+",
      gpuHours: "10M GPU hours",
    },
  ];

  const comparisonData = [
    {
      activity: "Training GPT-4",
      energy: "50,000 MWh",
      equivalent: "Powers 4,600 homes for 1 year",
      icon: Server,
      color: "neon-text-violet",
    },
    {
      activity: "1 Hour of Inference",
      energy: "1-5 kWh",
      equivalent: "Charging 50-250 smartphones",
      icon: Brain,
      color: "neon-text-aqua",
    },
    {
      activity: "Data Center Cooling",
      energy: "40% of total usage",
      equivalent: "Nearly half of AI energy goes to cooling",
      icon: Thermometer,
      color: "text-blue-400",
    },
    {
      activity: "Global AI by 2027",
      energy: "85-134 TWh/year",
      equivalent: "Same as Argentina's electricity use",
      icon: Factory,
      color: "text-red-400",
    },
  ];

  return (
    <Card className={`glass-strong rounded-2xl p-6 ${className}`}>
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-full glass neon-glow-green">
          <Lightbulb className="w-6 h-6 neon-text-green" />
        </div>
        <div>
          <h3 className="text-xl font-bold neon-text-green">HPC Energy Education</h3>
          <p className="text-muted-foreground text-sm">Understanding AI's environmental footprint</p>
        </div>
      </div>

      <Tabs defaultValue="training" className="w-full">
        <TabsList className="grid w-full grid-cols-3 glass">
          <TabsTrigger value="training" className="data-[state=active]:neon-glow-violet">
            Training
          </TabsTrigger>
          <TabsTrigger value="inference" className="data-[state=active]:neon-glow-aqua">
            Inference
          </TabsTrigger>
          <TabsTrigger value="comparison" className="data-[state=active]:neon-glow-green">
            Impact Scale
          </TabsTrigger>
        </TabsList>

        <TabsContent value="training" className="space-y-4 mt-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-lg p-4 neon-glow-violet"
          >
            <div className="flex items-center gap-2 mb-3">
              <Server className="w-5 h-5 neon-text-violet" />
              <h4 className="font-semibold neon-text-violet">Model Training Costs</h4>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Training large language models requires massive computational resources. Here's what it takes:
            </p>

            <div className="space-y-3">
              {trainingFacts.map((fact, index) => (
                <motion.div
                  key={fact.model}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="glass rounded-lg p-3"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="font-semibold text-foreground">{fact.model}</h5>
                    <Badge variant="outline" className="neon-text-violet border-violet-400/30">
                      {fact.trainingTime}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-muted-foreground">Energy:</span>
                      <div className="font-semibold neon-text-violet">{fact.energyUsed}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">CO₂:</span>
                      <div className="font-semibold text-red-400">{fact.co2Emissions}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Cost:</span>
                      <div className="font-semibold text-yellow-400">{fact.cost}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">GPU Hours:</span>
                      <div className="font-semibold neon-text-aqua">{fact.gpuHours}</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </TabsContent>

        <TabsContent value="inference" className="space-y-4 mt-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="glass rounded-lg p-4 neon-glow-aqua">
              <div className="flex items-center gap-2 mb-3">
                <Brain className="w-5 h-5 neon-text-aqua" />
                <h4 className="font-semibold neon-text-aqua">Inference vs Training</h4>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="glass rounded-lg p-3">
                  <h5 className="font-semibold text-foreground mb-2">Training Phase</h5>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• One-time massive computation</li>
                    <li>• Months of continuous processing</li>
                    <li>• Thousands of GPUs/TPUs</li>
                    <li>• 99% of total energy consumption</li>
                  </ul>
                </div>
                
                <div className="glass rounded-lg p-3">
                  <h5 className="font-semibold text-foreground mb-2">Inference Phase</h5>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Per-query computation</li>
                    <li>• Real-time responses</li>
                    <li>• Optimized for speed</li>
                    <li>• 1% but grows with usage</li>
                  </ul>
                </div>
              </div>

              <div className="bg-info/10 border border-info/20 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                  <Info className="w-4 h-4 text-blue-400" />
                  <span className="font-semibold text-blue-400">Key Insight</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  While training is energy-intensive, <strong>inference efficiency matters more</strong> as 
                  billions of users interact with AI daily. Optimizing prompts reduces inference costs significantly.
                </p>
              </div>
            </div>
          </motion.div>
        </TabsContent>

        <TabsContent value="comparison" className="space-y-4 mt-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="glass rounded-lg p-4 neon-glow-green">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 neon-text-green" />
                <h4 className="font-semibold neon-text-green">Energy in Perspective</h4>
              </div>

              <div className="space-y-3">
                {comparisonData.map((item, index) => {
                  const Icon = item.icon;
                  
                  return (
                    <motion.div
                      key={item.activity}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center gap-4 glass rounded-lg p-3"
                    >
                      <div className="p-2 rounded-full glass">
                        <Icon className={`w-5 h-5 ${item.color}`} />
                      </div>
                      
                      <div className="flex-1">
                        <div className="font-semibold text-foreground">{item.activity}</div>
                        <div className="text-sm text-muted-foreground">{item.equivalent}</div>
                      </div>
                      
                      <div className={`font-bold ${item.color}`}>
                        {item.energy}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="glass rounded-lg p-4 border border-green-400/20"
            >
              <h4 className="font-semibold neon-text-green mb-2">What You Can Do</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• <strong>Optimize prompts</strong> - Reduce token usage by 30-50%</li>
                <li>• <strong>Choose efficient models</strong> - Smaller models for simple tasks</li>
                <li>• <strong>Batch requests</strong> - Process multiple queries together</li>
                <li>• <strong>Cache results</strong> - Reuse responses when possible</li>
              </ul>
            </motion.div>
          </motion.div>
        </TabsContent>
      </Tabs>
    </Card>
  );
}