
import React, { useState, useEffect, useCallback } from 'react';
import { 
  AppState, 
  ActionCategory, 
  SimulationAction, 
  RoundResult 
} from './types';
import { 
  ACTIONS_CATALOG, 
  MAX_ROUNDS, 
  INITIAL_BUDGET 
} from './constants';
import { calculateRound } from './engine';
import FunnelViz from './components/FunnelViz';
import AdvisorPanel from './components/AdvisorPanel';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    currentRound: 0,
    history: [],
    activeActions: new Set<string>(),
    totalBudget: INITIAL_BUDGET,
    gameStatus: 'intro'
  });

  const [selectedActionsThisRound, setSelectedActionsThisRound] = useState<Set<string>>(new Set());

  const startGame = () => {
    // Initial calculation for Round 0 (baseline)
    const initialResult = calculateRound(0, new Set(), null);
    setState(prev => ({
      ...prev,
      gameStatus: 'playing',
      history: [initialResult],
      currentRound: 1
    }));
  };

  const nextRound = () => {
    if (state.currentRound >= MAX_ROUNDS) {
      setState(prev => ({ ...prev, gameStatus: 'ended' }));
      return;
    }

    // Process selected actions
    const newActiveActions = new Set(state.activeActions);
    let roundCost = 0;
    
    selectedActionsThisRound.forEach(id => {
      const action = ACTIONS_CATALOG.find(a => a.id === id);
      if (action) {
        newActiveActions.add(id);
        roundCost += action.cost;
      }
    });

    const previousResult = state.history[state.history.length - 1];
    const newResult = calculateRound(state.currentRound, newActiveActions, previousResult);
    
    setState(prev => ({
      ...prev,
      history: [...prev.history, newResult],
      currentRound: prev.currentRound + 1,
      activeActions: newActiveActions,
      totalBudget: prev.totalBudget - roundCost + newResult.financials.netProfit
    }));

    setSelectedActionsThisRound(new Set());
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleActionSelection = (id: string) => {
    setSelectedActionsThisRound(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else if (next.size < 3) next.add(id);
      return next;
    });
  };

  if (state.gameStatus === 'intro') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-indigo-900 flex items-center justify-center p-6">
        <div className="max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="p-8 md:p-12 text-center">
            <div className="w-20 h-20 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-indigo-500/50">
              <i className="fas fa-rocket text-white text-4xl"></i>
            </div>
            <h1 className="text-4xl font-black text-slate-800 mb-4 tracking-tight">GrowthMaster</h1>
            <p className="text-slate-600 text-lg mb-8 leading-relaxed">
              Bienvenido, Growth Manager. Tu misión es optimizar un e-commerce real. 
              Tienes <strong>{MAX_ROUNDS} semanas</strong> para mejorar el embudo de ventas, 
              optimizar costos y maximizar la utilidad neta sin depender solo de subir el presupuesto.
            </p>
            <div className="grid grid-cols-3 gap-4 mb-10 text-sm">
              <div className="p-4 bg-slate-50 rounded-xl">
                <i className="fas fa-funnel-dollar text-indigo-600 mb-2 text-xl"></i>
                <div className="font-bold text-slate-800">Optimiza</div>
                <div className="text-slate-500">El Funnel</div>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl">
                <i className="fas fa-chart-line text-emerald-600 mb-2 text-xl"></i>
                <div className="font-bold text-slate-800">Maximiza</div>
                <div className="text-slate-500">Utilidad</div>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl">
                <i className="fas fa-shield-alt text-amber-600 mb-2 text-xl"></i>
                <div className="font-bold text-slate-800">Gestiona</div>
                <div className="text-slate-500">El Riesgo</div>
              </div>
            </div>
            <button 
              onClick={startGame}
              className="px-10 py-4 bg-indigo-600 text-white font-black rounded-full hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200 uppercase tracking-wider"
            >
              Comenzar Simulación
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentData = state.history[state.history.length - 1];

  if (state.gameStatus === 'ended') {
    const totalProfit = state.history.reduce((sum, h) => sum + h.financials.netProfit, 0);
    const finalCR = currentData.rates.crTotal;

    return (
      <div className="min-h-screen bg-slate-50 p-6 md:p-12">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="bg-white rounded-2xl p-10 shadow-xl text-center border-t-8 border-indigo-600">
            <h2 className="text-3xl font-black mb-2">Simulación Completada</h2>
            <p className="text-slate-500 mb-8">Has terminado tu gestión de 8 semanas. Aquí tus resultados finales:</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              <div className="p-6 bg-slate-50 rounded-2xl">
                <div className="text-sm font-bold text-slate-400 uppercase tracking-widest">Utilidad Total</div>
                <div className="text-3xl font-black text-indigo-600">${totalProfit.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
              </div>
              <div className="p-6 bg-slate-50 rounded-2xl">
                <div className="text-sm font-bold text-slate-400 uppercase tracking-widest">CR Final</div>
                <div className="text-3xl font-black text-emerald-600">{(finalCR * 100).toFixed(2)}%</div>
              </div>
              <div className="p-6 bg-slate-50 rounded-2xl">
                <div className="text-sm font-bold text-slate-400 uppercase tracking-widest">Presupuesto Final</div>
                <div className="text-3xl font-black text-amber-600">${state.totalBudget.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
              </div>
            </div>

            <div className="h-64 mb-10">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={state.history}>
                  <defs>
                    <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="round" label={{ value: 'Semana', position: 'insideBottom', offset: -5 }} />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="financials.netProfit" name="Utilidad Neta" stroke="#4f46e5" fillOpacity={1} fill="url(#colorProfit)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <button 
              onClick={() => window.location.reload()}
              className="px-8 py-3 bg-slate-800 text-white rounded-full font-bold hover:bg-black transition-all"
            >
              Reiniciar Simulación
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header Sticky */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-4 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-black text-xl">GM</div>
            <div>
              <h1 className="font-black text-slate-800 text-lg leading-none">GrowthMaster</h1>
              <span className="text-xs text-slate-500 font-bold uppercase tracking-widest">Semana {state.currentRound} de {MAX_ROUNDS}</span>
            </div>
          </div>
          
          <div className="flex gap-6 items-center">
            <div className="text-right">
              <div className="text-xs text-slate-400 font-bold uppercase">Saldo Disponible</div>
              <div className={`text-xl font-black ${state.totalBudget < 0 ? 'text-red-500' : 'text-slate-800'}`}>
                ${state.totalBudget.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </div>
            </div>
            <button 
              onClick={nextRound}
              className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all flex items-center gap-2"
            >
              <span>Ejecutar Ronda</span>
              <i className="fas fa-arrow-right"></i>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Metrics & Analysis */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Metrics Dashboard */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { label: 'Revenue', val: `$${currentData.financials.revenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}`, icon: 'fa-dollar-sign', color: 'text-indigo-600' },
              { label: 'Purchases', val: currentData.metrics.purchases, icon: 'fa-shopping-bag', color: 'text-emerald-600' },
              { label: 'CR Total', val: `${(currentData.rates.crTotal * 100).toFixed(2)}%`, icon: 'fa-percent', color: 'text-sky-600' },
              { label: 'CAC', val: `$${currentData.financials.cac.toFixed(2)}`, icon: 'fa-user-plus', color: 'text-rose-600' }
            ].map((stat, i) => (
              <div key={i} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
                <div className="flex items-center gap-3 mb-2">
                  <div className={`w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center ${stat.color}`}>
                    <i className={`fas ${stat.icon}`}></i>
                  </div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{stat.label}</span>
                </div>
                <div className="text-2xl font-black text-slate-800">{stat.val}</div>
              </div>
            ))}
          </div>

          {/* Event Alert */}
          {currentData.event && (
            <div className={`p-5 rounded-2xl border-2 flex gap-4 items-start ${
              currentData.event.impactType === 'positive' ? 'bg-emerald-50 border-emerald-100 text-emerald-800' : 'bg-rose-50 border-rose-100 text-rose-800'
            }`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                currentData.event.impactType === 'positive' ? 'bg-emerald-200' : 'bg-rose-200'
              }`}>
                <i className={`fas ${currentData.event.impactType === 'positive' ? 'fa-bolt' : 'fa-exclamation-triangle'}`}></i>
              </div>
              <div>
                <h4 className="font-bold">Evento Semanal: {currentData.event.title}</h4>
                <p className="text-sm opacity-90">{currentData.event.description}</p>
              </div>
            </div>
          )}

          {/* Funnel & Chart Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <h3 className="font-black text-slate-800 mb-6 flex items-center gap-2">
                <i className="fas fa-filter text-indigo-500"></i> Análisis de Embudo
              </h3>
              <FunnelViz metrics={currentData.metrics} rates={currentData.rates} />
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <h3 className="font-black text-slate-800 mb-6 flex items-center gap-2">
                <i className="fas fa-chart-area text-emerald-500"></i> Histórico de Utilidad
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={state.history}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="round" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="financials.netProfit" name="Utilidad Neta" stroke="#4f46e5" strokeWidth={3} dot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Advisor Panel (Gemini Integration) */}
          <AdvisorPanel latestResult={currentData} />
        </div>

        {/* Right Column: Strategic Actions */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 sticky top-28 h-fit max-h-[calc(100vh-140px)] flex flex-col">
            <div className="mb-4">
              <h3 className="font-black text-slate-800 text-xl flex items-center gap-2">
                <i className="fas fa-tasks text-indigo-500"></i> Acciones Tácticas
              </h3>
              <p className="text-xs text-slate-400 font-bold uppercase mb-2">Selecciona hasta 3 por semana</p>
              <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-indigo-500 transition-all" 
                  style={{ width: `${(selectedActionsThisRound.size / 3) * 100}%` }}
                ></div>
              </div>
            </div>

            <div className="overflow-y-auto pr-2 space-y-4 flex-grow custom-scrollbar">
              {Object.values(ActionCategory).map(cat => {
                const actionsInCat = ACTIONS_CATALOG.filter(a => a.category === cat);
                if (actionsInCat.length === 0) return null;
                
                return (
                  <div key={cat} className="space-y-3">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] pt-2 border-t border-slate-50">{cat}</h4>
                    {actionsInCat.map(action => {
                      const isAlreadyActive = state.activeActions.has(action.id);
                      const isSelected = selectedActionsThisRound.has(action.id);
                      
                      return (
                        <button
                          key={action.id}
                          disabled={isAlreadyActive}
                          onClick={() => toggleActionSelection(action.id)}
                          className={`w-full text-left p-4 rounded-xl border transition-all group ${
                            isAlreadyActive 
                              ? 'bg-slate-50 border-slate-100 opacity-50 cursor-not-allowed' 
                              : isSelected
                                ? 'bg-indigo-50 border-indigo-400 ring-2 ring-indigo-200'
                                : 'bg-white border-slate-200 hover:border-indigo-300'
                          }`}
                        >
                          <div className="flex justify-between items-start mb-1">
                            <span className="font-bold text-sm text-slate-800 leading-tight">{action.name}</span>
                            {isSelected && <i className="fas fa-check-circle text-indigo-500"></i>}
                          </div>
                          <p className="text-xs text-slate-500 mb-2 leading-snug">{action.description}</p>
                          <div className="flex justify-between items-center mt-3">
                            <span className="text-[10px] font-black bg-slate-100 text-slate-500 px-2 py-0.5 rounded uppercase">
                              ${action.cost}
                            </span>
                            <span className="text-[10px] text-indigo-500 font-bold group-hover:underline">
                              {isAlreadyActive ? 'Activo' : 'Seleccionar'}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                );
              })}
            </div>

            <div className="pt-4 mt-4 border-t border-slate-100">
               <div className="flex justify-between text-xs font-bold text-slate-500 mb-2">
                 <span>Inversión Seleccionada:</span>
                 <span className="text-indigo-600">
                   ${Array.from(selectedActionsThisRound).reduce((sum, id) => sum + (ACTIONS_CATALOG.find(a => a.id === id)?.cost || 0), 0)}
                 </span>
               </div>
               <button 
                  disabled={selectedActionsThisRound.size === 0}
                  onClick={nextRound}
                  className={`w-full py-3 rounded-xl font-black transition-all ${
                    selectedActionsThisRound.size > 0 
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100 hover:bg-indigo-700' 
                      : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  }`}
               >
                 Confirmar Acciones
               </button>
            </div>
          </div>
        </div>
      </main>

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }
      `}} />
    </div>
  );
};

export default App;
