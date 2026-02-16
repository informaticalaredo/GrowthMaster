
import { 
  BASE_SESSIONS, 
  INITIAL_AOV, 
  MARGIN, 
  FIXED_COSTS, 
  ADS_COST_PER_ROUND, 
  ACTIONS_CATALOG 
} from './constants';
import { 
  RoundResult, 
  FunnelMetrics, 
  Rates, 
  Financials, 
  SimulationAction, 
  RandomEvent 
} from './types';

const INITIAL_RATES: Rates = {
  viewRate: 0.65,
  atcRate: 0.12,
  checkoutRate: 0.35,
  purchaseRate: 0.28,
  crTotal: 0
};

export function calculateRound(
  round: number,
  activeActionsIds: Set<string>,
  previousResult: RoundResult | null
): RoundResult {
  const activeActions = ACTIONS_CATALOG.filter(a => activeActionsIds.has(a.id));
  
  // Base rates from initial or previous
  let currentRates = { ...(previousResult?.rates || INITIAL_RATES) };
  let currentSessions = BASE_SESSIONS * (1 + (round * 0.02)); // Natural slight organic growth
  let currentAOV = INITIAL_AOV;
  let retentionBonus = 1.0;

  // Apply impacts from active actions
  activeActions.forEach(action => {
    action.impacts.forEach(impact => {
      switch (impact.metric) {
        case 'viewRate': currentRates.viewRate *= impact.multiplier; break;
        case 'atcRate': currentRates.atcRate *= impact.multiplier; break;
        case 'checkoutRate': currentRates.checkoutRate *= impact.multiplier; break;
        case 'purchaseRate': currentRates.purchaseRate *= impact.multiplier; break;
        case 'sessions': currentSessions *= impact.multiplier; break;
        case 'aov': currentAOV *= impact.multiplier; break;
        case 'retention': retentionBonus *= impact.multiplier; break;
      }
    });
  });

  // Random Events Logic
  let event: RandomEvent | undefined;
  const roll = Math.random();
  if (roll < 0.2) {
    const events: RandomEvent[] = [
      { title: "Competidor baja precios", description: "Un rival directo lanzó oferta agresiva. -5% AOV para competir.", impactType: 'negative' },
      { title: "Problema de Logística", description: "Huelga de transportes afecta la confianza. -4% en tasa de compra.", impactType: 'negative' },
      { title: "Mención de Influencer", description: "Un micro-influencer nos recomendó. +25% de tráfico extra esta semana.", impactType: 'positive' },
      { title: "Fallo en el Servidor", description: "La web estuvo lenta 4 horas. -10% en tasa de checkout.", impactType: 'negative' }
    ];
    event = events[Math.floor(Math.random() * events.length)];
    
    // Apply event effects
    if (event.title.includes("Competidor")) currentAOV *= 0.95;
    if (event.title.includes("Logística")) currentRates.purchaseRate *= 0.96;
    if (event.title.includes("Influencer")) currentSessions *= 1.25;
    if (event.title.includes("Servidor")) currentRates.checkoutRate *= 0.90;
  }

  // Ensure rates don't exceed realistic bounds (though growth is encouraged)
  currentRates.viewRate = Math.min(0.95, currentRates.viewRate);
  currentRates.atcRate = Math.min(0.35, currentRates.atcRate);
  currentRates.checkoutRate = Math.min(0.70, currentRates.checkoutRate);
  currentRates.purchaseRate = Math.min(0.60, currentRates.purchaseRate);

  // Calculate Funnel
  const productViews = Math.round(currentSessions * currentRates.viewRate);
  const addToCart = Math.round(productViews * currentRates.atcRate);
  const checkoutStart = Math.round(addToCart * currentRates.checkoutRate);
  const basePurchases = Math.round(checkoutStart * currentRates.purchaseRate);
  
  // Retention multiplier for volume
  const purchases = Math.round(basePurchases * retentionBonus);

  const metrics: FunnelMetrics = {
    sessions: Math.round(currentSessions),
    productViews,
    addToCart,
    checkoutStart,
    purchases
  };

  currentRates.crTotal = purchases / currentSessions;

  // Financials
  const revenue = purchases * currentAOV;
  const grossProfit = revenue * MARGIN;
  const actionCosts = activeActions.reduce((sum, a) => sum + (a.oneTime ? 0 : a.cost * 0.2), 0); // Recurrent maintenance is 20%
  const oneTimeActionCosts = activeActions
    .filter(a => a.oneTime && !previousResult?.actionsTaken.includes(a.id))
    .reduce((sum, a) => sum + a.cost, 0);

  const totalCosts = FIXED_COSTS + ADS_COST_PER_ROUND + actionCosts + oneTimeActionCosts;
  const netProfit = grossProfit - totalCosts;
  const cac = ADS_COST_PER_ROUND / (purchases || 1);
  const roi = (grossProfit - ADS_COST_PER_ROUND) / ADS_COST_PER_ROUND;

  const financials: Financials = {
    revenue,
    grossProfit,
    netProfit,
    cac,
    roi,
    totalCosts
  };

  return {
    round,
    metrics,
    rates: currentRates,
    financials,
    actionsTaken: Array.from(activeActionsIds),
    event
  };
}
