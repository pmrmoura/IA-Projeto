export interface PatientData {
  age: number;
  sex: number;
  cp: number;
  trestbps: number;
  chol: number;
  fbs: number;
  restecg: number;
  thalach: number;
  exang: number;
  oldpeak: number;
  slope: number;
  ca: number;
  thal: number;
  target: number;
}

// Generate mock data for 100 patients
export const mockPatients: PatientData[] = Array.from({ length: 100 }, () => ({
  age: Math.floor(Math.random() * (80 - 30) + 30),
  sex: Math.round(Math.random()),
  cp: Math.floor(Math.random() * 4),
  trestbps: Math.floor(Math.random() * (200 - 90) + 90),
  chol: Math.floor(Math.random() * (400 - 120) + 120),
  fbs: Math.round(Math.random()),
  restecg: Math.floor(Math.random() * 3),
  thalach: Math.floor(Math.random() * (220 - 70) + 70),
  exang: Math.round(Math.random()),
  oldpeak: Number((Math.random() * 6).toFixed(1)),
  slope: Math.floor(Math.random() * 3) + 1,
  ca: Math.floor(Math.random() * 4),
  thal: Math.floor(Math.random() * 3),
  target: Math.round(Math.random()),
}));

export const featureImportance = [
  { feature: 'Chest Pain', importance: 0.85 },
  { feature: 'Maximum Heart Rate', importance: 0.78 },
  { feature: 'Number of Vessels', importance: 0.75 },
  { feature: 'ST Depression', importance: 0.72 },
  { feature: 'Exercise Angina', importance: 0.68 },
  { feature: 'Age', importance: 0.65 },
  { feature: 'Cholesterol', importance: 0.62 },
  { feature: 'Blood Pressure', importance: 0.58 },
  { feature: 'Thalassemia', importance: 0.55 },
  { feature: 'Resting ECG', importance: 0.45 },
  { feature: 'Blood Sugar', importance: 0.35 },
  { feature: 'Sex', importance: 0.32 },
];

export const getMockPrediction = (data: Partial<PatientData>): { probability: number; prediction: number } => {
  // Simple mock prediction logic
  const probability = Math.random();
  return {
    probability,
    prediction: probability > 0.5 ? 1 : 0,
  };
};