
import React from 'react';

interface KPICardProps {
  label: string;
  value: string | number;
  icon: string;
  iconBg: string;
  iconColor: string;
  trend?: string;
  trendColor?: string;
}

const KPICard: React.FC<KPICardProps> = ({ label, value, icon, iconBg, iconColor, trend, trendColor }) => {
  return (
    <div className="bg-white dark:bg-primary/5 p-6 rounded-xl border border-slate-200 dark:border-primary/10 transition-all hover:border-primary/30">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-2 ${iconBg} rounded-lg`}>
          <span className={`material-icons ${iconColor}`}>{icon}</span>
        </div>
        {trend && (
          <span className={`text-xs font-bold ${trendColor} flex items-center`}>{trend}</span>
        )}
      </div>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">{label}</p>
      <h3 className="text-2xl font-bold">{value}</h3>
    </div>
  );
};

export default KPICard;
