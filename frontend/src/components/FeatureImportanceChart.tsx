import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { featureImportance } from '../mockData';

const FeatureImportanceChart: React.FC = () => {
  return (
    <div className="w-full h-[400px]">
      <ResponsiveContainer>
        <BarChart
          data={featureImportance}
          layout="vertical"
          margin={{ top: 5, right: 30, left: 120, bottom: 5 }}
        >
          <XAxis type="number" domain={[0, 1]} />
          <YAxis dataKey="feature" type="category" />
          <Tooltip />
          <Bar dataKey="importance" fill="#3b82f6" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default FeatureImportanceChart;