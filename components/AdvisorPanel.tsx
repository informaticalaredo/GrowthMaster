
import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import { RoundResult } from '../types';

interface Props {
  latestResult: RoundResult;
}

const AdvisorPanel: React.FC<Props> = ({ latestResult }) => {
  const [advice, setAdvice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const getAdvice = async () => {
    setLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `
        Actúa como un Growth Manager Senior. Analiza los resultados de esta semana en mi e-commerce:
        - Sesiones: ${latestResult.metrics.sessions}
        - Tasa Vista de Producto: ${(latestResult.rates.viewRate * 100).toFixed(1)}%
        - Tasa ATC (Carrito): ${(latestResult.rates.atcRate * 100).toFixed(1)}%
        - Tasa Checkout: ${(latestResult.rates.checkoutRate * 100).toFixed(1)}%
        - Tasa Pago Final: ${(latestResult.rates.purchaseRate * 100).toFixed(1)}%
        - Utilidad Neta: $${latestResult.financials.netProfit.toFixed(0)}
        - CAC: $${latestResult.financials.cac.toFixed(2)}

        Identifica el mayor cuello de botella en el embudo y sugiera 2 tácticas específicas (SEO, UX, confianza, etc.) para mejorar la semana siguiente. Responde en español, tono profesional y conciso (máximo 100 palabras).
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });

      setAdvice(response.text || "No se pudo generar el consejo. ¡Sigue optimizando!");
    } catch (error) {
      console.error(error);
      setAdvice("Error al conectar con el asesor estratégico.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-indigo-900 text-white rounded-xl p-6 shadow-xl relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-10 text-6xl">
        <i className="fas fa-robot"></i>
      </div>
      <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
        <i className="fas fa-brain"></i> Asesor de Growth AI
      </h3>
      
      {!advice && !loading && (
        <button 
          onClick={getAdvice}
          className="w-full bg-white text-indigo-900 font-bold py-2 rounded-lg hover:bg-indigo-50 transition-colors"
        >
          Solicitar Análisis Estratégico
        </button>
      )}

      {loading && (
        <div className="flex items-center gap-3 animate-pulse">
          <div className="w-2 h-2 bg-white rounded-full"></div>
          <div className="w-2 h-2 bg-white rounded-full"></div>
          <div className="w-2 h-2 bg-white rounded-full"></div>
          <span className="text-sm italic">Analizando métricas...</span>
        </div>
      )}

      {advice && (
        <div className="text-sm leading-relaxed space-y-3">
          <p className="border-l-2 border-indigo-400 pl-3 italic text-indigo-100">
            {advice}
          </p>
          <button 
            onClick={() => setAdvice(null)}
            className="text-xs underline text-indigo-300 hover:text-white"
          >
            Limpiar consejo
          </button>
        </div>
      )}
    </div>
  );
};

export default AdvisorPanel;
