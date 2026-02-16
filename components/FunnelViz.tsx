
import React from 'react';
import { FunnelMetrics, Rates } from '../types';

interface Props {
  metrics: FunnelMetrics;
  rates: Rates;
}

const FunnelViz: React.FC<Props> = ({ metrics, rates }) => {
  const steps = [
    { label: 'Visitas', value: metrics.sessions, color: 'bg-indigo-500', rate: '100%' },
    { label: 'Vistas de Producto', value: metrics.productViews, color: 'bg-blue-500', rate: (rates.viewRate * 100).toFixed(1) + '%' },
    { label: 'Añadir Carrito', value: metrics.addToCart, color: 'bg-sky-500', rate: (rates.atcRate * 100).toFixed(1) + '%' },
    { label: 'Inicio Checkout', value: metrics.checkoutStart, color: 'bg-teal-500', rate: (rates.checkoutRate * 100).toFixed(1) + '%' },
    { label: 'Compras', value: metrics.purchases, color: 'bg-emerald-500', rate: (rates.purchaseRate * 100).toFixed(1) + '%' },
  ];

  const maxVal = metrics.sessions;

  return (
    <div className="space-y-4 py-4">
      {steps.map((step, idx) => {
        const width = (step.value / maxVal) * 100;
        return (
          <div key={idx} className="relative">
            <div className="flex justify-between items-center mb-1 text-xs font-semibold uppercase text-slate-500">
              <span>{step.label}</span>
              <span>{step.value.toLocaleString()}</span>
            </div>
            <div className="h-8 bg-slate-100 rounded-full overflow-hidden shadow-inner flex items-center">
              <div 
                className={`${step.color} h-full transition-all duration-700 ease-out flex items-center justify-end px-3`}
                style={{ width: `${Math.max(width, 10)}%` }}
              >
                {width > 20 && <span className="text-white text-[10px] font-bold">{step.rate}</span>}
              </div>
            </div>
          </div>
        );
      })}
      <div className="mt-4 pt-4 border-t border-slate-200">
        <div className="flex justify-between items-center">
          <span className="text-sm font-bold text-slate-700">Tasa de Conversión Global (CR):</span>
          <span className="text-lg font-black text-emerald-600">{(rates.crTotal * 100).toFixed(2)}%</span>
        </div>
      </div>
    </div>
  );
};

export default FunnelViz;
