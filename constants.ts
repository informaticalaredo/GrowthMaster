
import { ActionCategory, SimulationAction } from './types';

export const MAX_ROUNDS = 8;
export const INITIAL_BUDGET = 25000;
export const BASE_SESSIONS = 10000;
export const INITIAL_AOV = 65;
export const MARGIN = 0.65;
export const FIXED_COSTS = 2000;
export const ADS_COST_PER_ROUND = 3000;

export const ACTIONS_CATALOG: SimulationAction[] = [
  // TOFU
  {
    id: 'seo_opt',
    name: 'Optimización SEO (Títulos/Meta)',
    description: 'Mejora la visibilidad orgánica a largo plazo.',
    category: ActionCategory.TOFU,
    cost: 1500,
    impacts: [{ metric: 'sessions', multiplier: 1.05 }],
    oneTime: false
  },
  {
    id: 'landing_page',
    name: 'Landing Page Específica',
    description: 'Crea una página de aterrizaje enfocada en el producto estrella.',
    category: ActionCategory.TOFU,
    cost: 2000,
    impacts: [{ metric: 'viewRate', multiplier: 1.08 }],
    oneTime: true
  },
  {
    id: 'value_prop',
    name: 'Claridad en Propuesta de Valor',
    description: 'Rediseño del Hero Section y bullets de beneficios.',
    category: ActionCategory.TOFU,
    cost: 800,
    impacts: [{ metric: 'viewRate', multiplier: 1.05 }],
    oneTime: true
  },
  // MOFU
  {
    id: 'media_quality',
    name: 'Fotos y Vídeos HD',
    description: 'Producción profesional de contenido visual para el catálogo.',
    category: ActionCategory.MOFU,
    cost: 2500,
    impacts: [{ metric: 'atcRate', multiplier: 1.06 }],
    oneTime: true
  },
  {
    id: 'reviews',
    name: 'Reseñas Verificadas',
    description: 'Implementar sistema de social proof y estrellas.',
    category: ActionCategory.MOFU,
    cost: 1200,
    impacts: [
      { metric: 'atcRate', multiplier: 1.04 },
      { metric: 'purchaseRate', multiplier: 1.03 }
    ],
    oneTime: true
  },
  {
    id: 'chat_support',
    name: 'Chat/WhatsApp Soporte',
    description: 'Resuelve dudas pre-venta en tiempo real.',
    category: ActionCategory.MOFU,
    cost: 1500,
    impacts: [{ metric: 'checkoutRate', multiplier: 1.03 }],
    oneTime: false
  },
  // BOFU
  {
    id: 'one_page_checkout',
    name: 'Checkout en una Página',
    description: 'Elimina pasos innecesarios en el proceso de pago.',
    category: ActionCategory.BOFU,
    cost: 3000,
    impacts: [{ metric: 'purchaseRate', multiplier: 1.08 }],
    oneTime: true
  },
  {
    id: 'guest_checkout',
    name: 'Compra como Invitado',
    description: 'Elimina la fricción del registro obligatorio.',
    category: ActionCategory.BOFU,
    cost: 1000,
    impacts: [{ metric: 'purchaseRate', multiplier: 1.05 }],
    oneTime: true
  },
  {
    id: 'trust_badges',
    name: 'Badges de Confianza',
    description: 'Certificados de seguridad, garantías y devoluciones.',
    category: ActionCategory.BOFU,
    cost: 500,
    impacts: [{ metric: 'purchaseRate', multiplier: 1.04 }],
    oneTime: true
  },
  {
    id: 'free_shipping_threshold',
    name: 'Envío Gratis > $X',
    description: 'Aumenta el ticket promedio pero reduce margen.',
    category: ActionCategory.BOFU,
    cost: 1000,
    impacts: [
      { metric: 'checkoutRate', multiplier: 1.06 },
      { metric: 'aov', multiplier: 1.12 }
    ],
    oneTime: false
  },
  // RECOVERY
  {
    id: 'abandoned_cart_email',
    name: 'Email de Carrito Abandonado',
    description: 'Automatización para recuperar usuarios que no terminaron.',
    category: ActionCategory.RECOVERY,
    cost: 800,
    impacts: [{ metric: 'purchaseRate', multiplier: 1.10 }],
    oneTime: false
  },
  {
    id: 'remarketing_ads',
    name: 'Campañas de Remarketing',
    description: 'Persigue a usuarios interesados en redes sociales.',
    category: ActionCategory.RECOVERY,
    cost: 2000,
    impacts: [{ metric: 'sessions', multiplier: 1.10 }],
    oneTime: false
  },
  // RETENTION
  {
    id: 'loyalty_program',
    name: 'Programa de Lealtad',
    description: 'Sistema de puntos para compras recurrentes.',
    category: ActionCategory.RETENTION,
    cost: 1500,
    impacts: [{ metric: 'retention', multiplier: 1.08 }],
    oneTime: true
  },
  {
    id: 'post_sale_followup',
    name: 'Seguimiento Post-Venta',
    description: 'Mejora satisfacción y reduce devoluciones.',
    category: ActionCategory.RETENTION,
    cost: 600,
    impacts: [{ metric: 'retention', multiplier: 1.05 }],
    oneTime: false
  }
];
