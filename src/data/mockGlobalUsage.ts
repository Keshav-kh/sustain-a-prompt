export type UsageScore = 1 | 2 | 3 | 4 | 5; // 1=red (poor), 5=green (great)

export interface CountryUsage {
  id: string;
  country: string;
  lat: number; // latitude in degrees
  lng: number; // longitude in degrees
  people: number; // number of people using prompts
  score: UsageScore; // prompt quality score
}

// Hand-crafted mock data across regions
export const mockGlobalUsage: CountryUsage[] = [
  { id: "us", country: "United States", lat: 37.1, lng: -95.7, people: 5200, score: 4 },
  { id: "ca", country: "Canada", lat: 56.1, lng: -106.3, people: 900, score: 3 },
  { id: "mx", country: "Mexico", lat: 23.6, lng: -102.5, people: 650, score: 2 },
  { id: "br", country: "Brazil", lat: -14.2, lng: -51.9, people: 1400, score: 3 },
  { id: "ar", country: "Argentina", lat: -38.4, lng: -63.6, people: 420, score: 4 },
  { id: "uk", country: "United Kingdom", lat: 55.3, lng: -3.4, people: 1150, score: 5 },
  { id: "de", country: "Germany", lat: 51.2, lng: 10.4, people: 1800, score: 4 },
  { id: "fr", country: "France", lat: 46.2, lng: 2.2, people: 1400, score: 4 },
  { id: "es", country: "Spain", lat: 40.5, lng: -3.7, people: 900, score: 3 },
  { id: "it", country: "Italy", lat: 41.9, lng: 12.6, people: 1000, score: 3 },
  { id: "se", country: "Sweden", lat: 60.1, lng: 18.6, people: 350, score: 5 },
  { id: "ru", country: "Russia", lat: 61.5, lng: 105.3, people: 1700, score: 2 },
  { id: "cn", country: "China", lat: 35.9, lng: 104.2, people: 4200, score: 3 },
  { id: "jp", country: "Japan", lat: 36.2, lng: 138.3, people: 2100, score: 5 },
  { id: "kr", country: "South Korea", lat: 35.9, lng: 127.8, people: 1200, score: 4 },
  { id: "in", country: "India", lat: 20.6, lng: 78.9, people: 5000, score: 2 },
  { id: "sg", country: "Singapore", lat: 1.35, lng: 103.8, people: 480, score: 5 },
  { id: "au", country: "Australia", lat: -25.3, lng: 133.8, people: 800, score: 4 },
  { id: "za", country: "South Africa", lat: -30.6, lng: 22.9, people: 600, score: 3 },
  { id: "ng", country: "Nigeria", lat: 9.1, lng: 8.7, people: 950, score: 2 },
  { id: "eg", country: "Egypt", lat: 26.8, lng: 30.8, people: 700, score: 3 },
  { id: "sa", country: "Saudi Arabia", lat: 23.9, lng: 45.1, people: 520, score: 2 },
  { id: "ae", country: "UAE", lat: 23.4, lng: 53.8, people: 480, score: 4 },
  { id: "tr", country: "Türkiye", lat: 38.96, lng: 35.24, people: 800, score: 3 },
  { id: "ir", country: "Iran", lat: 32.4, lng: 53.7, people: 780, score: 2 },
  { id: "id", country: "Indonesia", lat: -0.8, lng: 113.9, people: 1300, score: 3 },
  { id: "vn", country: "Vietnam", lat: 14.1, lng: 108.3, people: 740, score: 3 },
  { id: "th", country: "Thailand", lat: 15.8, lng: 101.0, people: 620, score: 4 },
  { id: "ph", country: "Philippines", lat: 12.9, lng: 121.8, people: 680, score: 3 },
  { id: "pk", country: "Pakistan", lat: 30.4, lng: 69.3, people: 900, score: 2 },
];

export const scoreToLabel = (score: UsageScore) => {
  switch (score) {
    case 5: return "Great (Green)";
    case 4: return "Good (Yellow-Green)";
    case 3: return "Average (Orange)";
    case 2: return "Poor (Orange-Red)";
    case 1: return "Bad (Red)";
  }
};