import React from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { PatientData, mockPatients } from '../mockData';

interface Props {
  xFeature: keyof PatientData;
  yFeature: keyof PatientData;
  xLabel: string;
  yLabel: string;
}

const ScatterPlot: React.FC<Props> = ({ xFeature, yFeature, xLabel, yLabel }) => {
  const healthyData = mockPatients
    .filter(patient => patient.target === 0)
    .map(patient => ({
      x: patient[xFeature],
      y: patient[yFeature],
    }));

  const diseasedData = mockPatients
    .filter(patient => patient.target === 1)
    .map(patient => ({
      x: patient[xFeature],
      y: patient[yFeature],
    }));

  return (
    <div className="w-full h-[400px]">
      <ResponsiveContainer>
        <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
          <XAxis dataKey="x" name={xLabel} />
          <YAxis dataKey="y" name={yLabel} />
          <Tooltip cursor={{ strokeDasharray: '3 3' }} />
          <Legend />
          <Scatter name="Healthy" data={healthyData} fill="#22c55e" />
          <Scatter name="Heart Disease" data={diseasedData} fill="#ef4444" />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ScatterPlot;