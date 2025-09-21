export interface ModelData {
  id: string;
  name: string;
  provider: string;
  size: string;
  energyPerToken: number; // kWh per 1000 tokens
  co2PerToken: number; // grams CO₂ per 1000 tokens
  waterPerToken: number; // liters per 1000 tokens
  costPerToken: number; // USD per 1000 tokens
  efficiency: "low" | "medium" | "high";
  capabilities: string[];
}

// Base models populated from the user's provided real analysis data (midpoints where ranges were given)
export const baseModels: ModelData[] = [
  {
    id: "gpt-4o",
    name: "GPT-4o",
    provider: "OpenAI",
    size: "XL",
    energyPerToken: 0.008974,
    co2PerToken: 3.535,
    waterPerToken: 0.0578,
    costPerToken: 5.0, // USD per 1k tokens (est.)
    efficiency: "low",
    capabilities: ["Text", "Vision", "Code", "Reasoning"],
  },
  {
    id: "gpt-4o-mini",
    name: "GPT-4o Mini",
    provider: "OpenAI",
    size: "Small",
    energyPerToken: 0.000127,
    co2PerToken: 0.0501,
    waterPerToken: 0.000821,
    costPerToken: 0.15, // USD per 1k tokens (est.)
    efficiency: "high",
    capabilities: ["Text", "Vision", "Code"],
  },
  {
    id: "claude-3.5-sonnet",
    name: "Claude 3.5 Sonnet",
    provider: "Anthropic",
    size: "Large",
    energyPerToken: 0.002094,
    co2PerToken: 0.827,
    waterPerToken: 0.01349,
    costPerToken: 3.0, // USD per 1k tokens (est.)
    efficiency: "medium",
    capabilities: ["Text", "Code", "Analysis", "Creative"],
  },
  {
    id: "gemini-pro",
    name: "Gemini Pro",
    provider: "Google",
    size: "Large",
    energyPerToken: 0.000972,
    co2PerToken: 0.383,
    waterPerToken: 0.00626,
    costPerToken: 0.5, // USD per 1k tokens (est.)
    efficiency: "high",
    capabilities: ["Text", "Vision", "Code", "Multimodal"],
  },
  {
    id: "llama-3.1-8b",
    name: "Llama 3.1 8B",
    provider: "Meta",
    size: "8B",
    energyPerToken: 0.000119658,
    co2PerToken: 0.0471453,
    waterPerToken: 0.000770598,
    costPerToken: 0.05, // USD per 1k tokens (est., self/hosted)
    efficiency: "high",
    capabilities: ["Text", "Code", "Open Source"],
  },
  {
    id: "llama3.1-8b",
    name: "Llama 3.1 8B (Cerebras)",
    provider: "Cerebras • Meta",
    size: "8B",
    energyPerToken: 0.000119658,
    co2PerToken: 0.0471453,
    waterPerToken: 0.000770598,
    costPerToken: 0.06, // USD per 1k tokens (est., hosted)
    efficiency: "high",
    capabilities: ["Text", "Code", "Open Source"],
  },
  {
    id: "llama-3.3-70b",
    name: "Llama 3.3 70B (Cerebras)",
    provider: "Cerebras • Meta",
    size: "70B",
    energyPerToken: 0.00104701,
    co2PerToken: 0.412521,
    waterPerToken: 0.00674274,
    costPerToken: 0.6, // USD per 1k tokens (est.)
    efficiency: "medium",
    capabilities: ["Text", "Code", "Reasoning", "Open Source"],
  },
  {
    id: "gpt-oss-120b",
    name: "GPT-OSS 120B (Cerebras)",
    provider: "Cerebras",
    size: "120B",
    energyPerToken: 0.00179487,
    co2PerToken: 0.707179,
    waterPerToken: 0.011559,
    costPerToken: 0.8, // USD per 1k tokens (est.)
    efficiency: "medium",
    capabilities: ["Text", "Code", "Reasoning"],
  },
  {
    id: "llama-4-maverick-17b-128e-instruct",
    name: "llama-4-maverick-17b-128e-instruct",
    provider: "Cerebras",
    size: "MoE (≈34B active)",
    energyPerToken: 0.000508547,
    co2PerToken: 0.200368,
    waterPerToken: 0.00327504,
    costPerToken: 0.2, // USD per 1k tokens (est.)
    efficiency: "high",
    capabilities: ["Text", "Code", "MoE"],
  },
  {
    id: "llama-4-scout-17b-16e-instruct",
    name: "llama-4-scout-17b-16e-instruct",
    provider: "Cerebras",
    size: "MoE (≈34B active)",
    energyPerToken: 0.000508547,
    co2PerToken: 0.200368,
    waterPerToken: 0.00327504,
    costPerToken: 0.18, // USD per 1k tokens (est.)
    efficiency: "high",
    capabilities: ["Text", "Code", "MoE"],
  },
  {
    id: "qwen-3-32b",
    name: "qwen-3-32b",
    provider: "Cerebras",
    size: "32B",
    energyPerToken: 0.000478632,
    co2PerToken: 0.188581,
    waterPerToken: 0.00308239,
    costPerToken: 0.1, // USD per 1k tokens (est.)
    efficiency: "high",
    capabilities: ["Text", "Code"],
  },
  {
    id: "qwen-3-235b-a22b-instruct-2507",
    name: "qwen-3-235b-a22b-instruct-2507",
    provider: "Cerebras",
    size: "MoE (≈22B active)",
    energyPerToken: 0.00032906,
    co2PerToken: 0.12965,
    waterPerToken: 0.00211915,
    costPerToken: 0.25, // USD per 1k tokens (est.)
    efficiency: "high",
    capabilities: ["Text", "Code", "MoE"],
  },
  {
    id: "qwen-3-235b-a22b-thinking-2507",
    name: "qwen-3-235b-a22b-thinking-2507",
    provider: "Cerebras",
    size: "MoE (≈22B active)",
    energyPerToken: 0.00032906,
    co2PerToken: 0.12965,
    waterPerToken: 0.00211915,
    costPerToken: 0.27, // USD per 1k tokens (est.)
    efficiency: "high",
    capabilities: ["Text", "Reasoning", "MoE"],
  },
  {
    id: "qwen-3-coder-480b",
    name: "qwen-3-coder-480b",
    provider: "Cerebras",
    size: "MoE (active 32–96B)",
    energyPerToken: 0.000957,
    co2PerToken: 0.3775,
    waterPerToken: 0.006165,
    costPerToken: 0.9, // USD per 1k tokens (est.)
    efficiency: "high",
    capabilities: ["Text", "Code", "MoE"],
  },
];