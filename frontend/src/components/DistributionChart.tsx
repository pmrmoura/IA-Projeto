import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { PatientData, mockPatients } from '../mockData';

interface Props {
  feature: keyof PatientData;
  title: string;
}

const DistributionChart: React.FC<Props> = ({ feature, title }) => {
  const getBinData = () => {
    const values = mockPatients.map(patient => patient[feature] as number);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const binCount = 10;
    const binSize = (max - min) / binCount;
    
    const bins = Array.from({ length: binCount }, (_, i) => ({
      range: `${(min + i * binSize).toFixed(0)}-${(min + (i + 1) * binSize).toFixed(0)}`,
      healthy: 0,
      diseased: 0,
    }));

    mockPatients.forEach(patient => {
      const value = patient[feature] as number;
      const binIndex = Math.min(Math.floor((value - min) / binSize), binCount - 1);
      if (patient.target === 0) {
        bins[binIndex].healthy++;
      } else {
        bins[binIndex].diseased++;
      }
    });

    return bins;
  };

  return (
    <div className="w-full h-[300px]">
      <h3 className="text-lg font-semibold mb-2">{title} Distribution</h3>
      <ResponsiveContainer>
        <BarChart data={getBinData()} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <XAxis dataKey="range" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="healthy" fill="#22c55e" name="Healthy" />
          <Bar dataKey="diseased" fill="#ef4444" name="Heart Disease" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DistributionChart;