
import React from 'react';

interface DataPoint {
  day: string;
  value: number;
}

interface AnalyticsChartProps {
  data: DataPoint[];
  color?: string;
}

export const AnalyticsChart: React.FC<AnalyticsChartProps> = ({ 
  data, 
  color = '#6366f1' 
}) => {
  const width = 600;
  const height = 200;
  const padding = 40;

  const maxVal = Math.max(...data.map(d => d.value)) * 1.2;
  const minVal = 0;

  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * (width - padding * 2) + padding;
    const y = height - ((d.value - minVal) / (maxVal - minVal)) * (height - padding * 2) - padding;
    return { x, y };
  });

  const linePath = points.map((p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`)).join(' ');
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z`;

  return (
    <div className="w-full bg-white rounded-[2.5rem] border border-slate-200 p-8 shadow-sm">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Performance Index</h4>
          <h3 className="text-xl font-bold text-slate-900 tracking-tight">Financial Velocity</h3>
        </div>
        <div className="flex items-center gap-4">
           <div className="flex items-center gap-2">
             <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }}></div>
             <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Yield</span>
           </div>
        </div>
      </div>

      <div className="relative h-[200px] w-full">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
          {/* Grid Lines */}
          {[0, 0.5, 1].map((p, i) => {
            const y = height - padding - p * (height - padding * 2);
            return (
              <line 
                key={i} 
                x1={padding} 
                y1={y} 
                x2={width - padding} 
                y2={y} 
                stroke="#f1f5f9" 
                strokeWidth="1" 
              />
            );
          })}

          {/* Area under line */}
          <path d={areaPath} fill={`url(#gradient-${color.replace('#', '')})`} opacity="0.1" />
          
          {/* Line */}
          <path 
            d={linePath} 
            fill="none" 
            stroke={color} 
            strokeWidth="4" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className="animate-in fade-in duration-1000"
          />

          {/* Points */}
          {points.map((p, i) => (
            <circle 
              key={i} 
              cx={p.x} 
              cy={p.y} 
              r="6" 
              fill="white" 
              stroke={color} 
              strokeWidth="3" 
              className="hover:r-8 transition-all cursor-pointer"
            >
              <title>{data[i].day}: ${data[i].value}</title>
            </circle>
          ))}

          {/* Labels */}
          {data.map((d, i) => (
            <text 
              key={i} 
              x={points[i].x} 
              y={height - 10} 
              textAnchor="middle" 
              className="text-[10px] font-black fill-slate-400 uppercase tracking-tighter"
            >
              {d.day}
            </text>
          ))}

          <defs>
            <linearGradient id={`gradient-${color.replace('#', '')}`} x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor={color} />
              <stop offset="100%" stopColor="transparent" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
};
