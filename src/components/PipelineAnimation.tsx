"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Brain, Cpu, Zap, ArrowRight, Activity } from "lucide-react";
import { Card } from "@/components/ui/card";

interface PipelineAnimationProps {
  isActive: boolean;
  stage: "idle" | "tokenizing" | "processing" | "generating" | "complete";
}

export default function PipelineAnimation({ isActive, stage }: PipelineAnimationProps) {
  const stages = [
    {
      id: "tokenize",
      icon: Zap,
      label: "Tokenize",
      description: "Breaking down your prompt",
      color: "neon-text-violet",
      glow: "neon-glow-violet",
    },
    {
      id: "process",
      icon: Brain,
      label: "Process",
      description: "AI model inference",
      color: "neon-text-aqua",
      glow: "neon-glow-aqua",
    },
    {
      id: "generate",
      icon: Cpu,
      label: "Generate",
      description: "Optimizing response",
      color: "neon-text-green",
      glow: "neon-glow-green",
    },
  ];

  const getCurrentStageIndex = () => {
    switch (stage) {
      case "tokenizing":
        return 0;
      case "processing":
        return 1;
      case "generating":
        return 2;
      default:
        return -1;
    }
  };

  const currentStageIndex = getCurrentStageIndex();

  return (
    <Card className="glass rounded-2xl p-6 max-w-4xl mx-auto">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-foreground mb-2">Processing Pipeline</h3>
        <p className="text-muted-foreground">Real-time AI processing visualization</p>
      </div>

      <div className="flex items-center justify-between relative">
        {stages.map((stageData, index) => {
          const Icon = stageData.icon;
          const isActive = index === currentStageIndex;
          const isCompleted = index < currentStageIndex || stage === "complete";
          
          return (
            <div key={stageData.id} className="flex-1 flex flex-col items-center relative">
              {/* Stage Circle */}
              <motion.div
                className={`
                  w-20 h-20 rounded-full border-2 flex items-center justify-center relative
                  ${isActive 
                    ? `border-current ${stageData.glow} ${stageData.color}` 
                    : isCompleted 
                    ? "border-green-400 bg-green-400/20" 
                    : "border-border"
                  }
                `}
                animate={{
                  scale: isActive ? [1, 1.05, 1] : 1,
                  borderColor: isActive ? undefined : isCompleted ? "#4ade80" : undefined,
                }}
                transition={{
                  duration: 2,
                  repeat: isActive ? Infinity : 0,
                  ease: "easeInOut",
                }}
              >
                <Icon 
                  className={`w-8 h-8 ${
                    isActive 
                      ? stageData.color 
                      : isCompleted 
                      ? "text-green-400" 
                      : "text-muted-foreground"
                  }`} 
                />
                
                {/* Pulsing ring for active stage */}
                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      className={`absolute inset-0 rounded-full border-2 ${stageData.color.replace('text', 'border')}`}
                      initial={{ scale: 1, opacity: 0.5 }}
                      animate={{ scale: 1.5, opacity: 0 }}
                      exit={{ scale: 1, opacity: 0 }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeOut",
                      }}
                    />
                  )}
                </AnimatePresence>

                {/* Activity indicator */}
                {isActive && (
                  <motion.div
                    className="absolute -top-1 -right-1"
                    animate={{
                      scale: [1, 1.2, 1],
                      rotate: [0, 180, 360],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  >
                    <Activity className={`w-4 h-4 ${stageData.color}`} />
                  </motion.div>
                )}
              </motion.div>

              {/* Stage Label */}
              <div className="mt-4 text-center">
                <h4 className={`font-semibold ${
                  isActive 
                    ? stageData.color 
                    : isCompleted 
                    ? "text-green-400" 
                    : "text-muted-foreground"
                }`}>
                  {stageData.label}
                </h4>
                <p className="text-sm text-muted-foreground mt-1">
                  {stageData.description}
                </p>
              </div>

              {/* Arrow between stages */}
              {index < stages.length - 1 && (
                <motion.div
                  className="absolute top-10 left-[60%] w-[80%] flex items-center justify-center"
                  animate={{
                    opacity: isActive || isCompleted ? 1 : 0.3,
                  }}
                >
                  <motion.div
                    className="flex items-center"
                    animate={{
                      x: isActive ? [0, 10, 0] : 0,
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: isActive ? Infinity : 0,
                      ease: "easeInOut",
                    }}
                  >
                    <ArrowRight 
                      className={`w-6 h-6 ${
                        isCompleted 
                          ? "text-green-400" 
                          : isActive 
                          ? "text-primary" 
                          : "text-muted-foreground"
                      }`} 
                    />
                  </motion.div>
                </motion.div>
              )}
            </div>
          );
        })}
      </div>

      {/* Progress bar */}
      <div className="mt-8 w-full bg-border/30 rounded-full h-2">
        <motion.div
          className="h-full bg-gradient-to-r from-violet-500 via-cyan-500 to-green-500 rounded-full"
          animate={{
            width: stage === "idle" 
              ? "0%" 
              : stage === "tokenizing" 
              ? "33%" 
              : stage === "processing" 
              ? "66%" 
              : "100%",
          }}
          transition={{
            duration: 0.5,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Energy consumption indicator */}
      <div className="mt-4 text-center">
        <motion.div
          className="inline-flex items-center gap-2 text-sm"
          animate={{
            opacity: isActive ? [0.7, 1, 0.7] : 0.7,
          }}
          transition={{
            duration: 2,
            repeat: isActive ? Infinity : 0,
            ease: "easeInOut",
          }}
        >
          <Zap className="w-4 h-4 text-yellow-400" />
          <span className="text-muted-foreground">
            {isActive ? "Consuming energy..." : "Idle"}
          </span>
        </motion.div>
      </div>
    </Card>
  );
}