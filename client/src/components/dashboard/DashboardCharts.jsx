import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';

const data = [
  { name: 'Mon', tasks: 12, projects: 2 },
  { name: 'Tue', tasks: 19, projects: 3 },
  { name: 'Wed', tasks: 15, projects: 3 },
  { name: 'Thu', tasks: 22, projects: 4 },
  { name: 'Fri', tasks: 30, projects: 5 },
  { name: 'Sat', tasks: 10, projects: 5 },
  { name: 'Sun', tasks: 8, projects: 5 },
];

const DashboardCharts = () => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data}>
        <defs>
          <linearGradient id="colorTasks" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.1}/>
            <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
        <XAxis 
          dataKey="name" 
          axisLine={false} 
          tickLine={false} 
          tick={{ fill: '#94a3b8', fontSize: 12 }}
          dy={10}
        />
        <YAxis 
          axisLine={false} 
          tickLine={false} 
          tick={{ fill: '#94a3b8', fontSize: 12 }}
        />
        <Tooltip 
          contentStyle={{ 
            borderRadius: '12px', 
            border: 'none', 
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
            padding: '12px'
          }} 
        />
        <Area 
          type="monotone" 
          dataKey="tasks" 
          stroke="#0ea5e9" 
          strokeWidth={3}
          fillOpacity={1} 
          fill="url(#colorTasks)" 
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default DashboardCharts;
