
export enum ActionCategory {
  TOFU = 'Atracción (TOFU)',
  MOFU = 'Consideración (MOFU)',
  BOFU = 'Conversión (BOFU)',
  RECOVERY = 'Recuperación',
  RETENTION = 'Retención'
}

export interface SimulationAction {
  id: string;
  name: string;
  description: string;
  category: ActionCategory;
  cost: number;
  impacts: {
    metric: 'viewRate' | 'atcRate' | 'checkoutRate' | 'purchaseRate' | 'sessions' | 'aov' | 'retention';
    multiplier: number;
  }[];
  risk?: {
    probability: number;
    failureImpact: number;
  };
  oneTime: boolean;
}

export interface FunnelMetrics {
  sessions: number;
  productViews: number;
  addToCart: number;
  checkoutStart: number;
  purchases: number;
}

export interface Rates {
  viewRate: number;
  atcRate: number;
  checkoutRate: number;
  purchaseRate: number;
  crTotal: number;
}

export interface Financials {
  revenue: number;
  grossProfit: number;
  netProfit: number;
  cac: number;
  roi: number;
  totalCosts: number;
}

export interface RoundResult {
  round: number;
  metrics: FunnelMetrics;
  rates: Rates;
  financials: Financials;
  actionsTaken: string[];
  event?: RandomEvent;
}

export interface RandomEvent {
  title: string;
  description: string;
  impactType: 'positive' | 'negative' | 'neutral';
}

export interface AppState {
  currentRound: number;
  history: RoundResult[];
  activeActions: Set<string>;
  totalBudget: number;
  gameStatus: 'intro' | 'playing' | 'ended';
}
