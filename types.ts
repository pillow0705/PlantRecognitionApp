export interface CareGuide {
  water: string;
  light: string;
  soil: string;
  toxicity: string;
}

export interface PlantIdentificationResult {
  commonName: string;
  scientificName: string;
  description: string;
  care: CareGuide;
  funFact: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  isError?: boolean;
}

export enum AppView {
  HOME = 'HOME',
  IDENTIFY = 'IDENTIFY',
  CHAT = 'CHAT'
}