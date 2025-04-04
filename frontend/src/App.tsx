import React, { useState } from 'react';
import { Heart, Activity, AlertCircle, CheckCircle2, Loader2, BarChart as ChartBar } from 'lucide-react';
import { PatientData, getMockPrediction } from './mockData';
import FeatureImportanceChart from './components/FeatureImportanceChart';
import DistributionChart from './components/DistributionChart';
import ScatterPlot from './components/ScatterPlot';

function App() {
  const [formData, setFormData] = useState<Partial<PatientData>>({
    age: 45,
    sex: 1,
    cp: 0,
    trestbps: 120,
    chol: 200,
    fbs: 0,
    restecg: 0,
    thalach: 150,
    exang: 0,
    oldpeak: 0,
    slope: 1,
    ca: 0,
    thal: 0,
  });
  
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ probability: number; prediction: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showDashboard, setShowDashboard] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API call with mock data
      await new Promise(resolve => setTimeout(resolve, 1000));
      const prediction = getMockPrediction(formData);
      setResult(prediction);
    } catch (err) {
      setError('Failed to get prediction. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const value = e.target.type === 'number' ? Number(e.target.value) : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Heart className="w-12 h-12 text-red-500 mr-3" />
            <h1 className="text-4xl font-bold text-gray-800">HeartGuard AI</h1>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Advanced AI-powered heart disease risk assessment tool. Enter your medical data below for an instant risk evaluation.
          </p>
        </header>

        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sex</label>
                <select
                  name="sex"
                  value={formData.sex}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value={1}>Male</option>
                  <option value={0}>Female</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Chest Pain Type</label>
                <select
                  name="cp"
                  value={formData.cp}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value={0}>Typical Angina</option>
                  <option value={1}>Atypical Angina</option>
                  <option value={2}>Non-Anginal Pain</option>
                  <option value={3}>Asymptomatic</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Resting Blood Pressure (mm Hg)</label>
                <input
                  type="number"
                  name="trestbps"
                  value={formData.trestbps}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cholesterol (mg/dl)</label>
                <input
                  type="number"
                  name="chol"
                  value={formData.chol}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fasting Blood Sugar</label>
                <select
                  name="fbs"
                  value={formData.fbs}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value={0}>Less than 120 mg/dl</option>
                  <option value={1}>Greater than 120 mg/dl</option>
                </select>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Resting ECG</label>
                <select
                  name="restecg"
                  value={formData.restecg}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value={0}>Normal</option>
                  <option value={1}>ST-T Wave Abnormality</option>
                  <option value={2}>Left Ventricular Hypertrophy</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Maximum Heart Rate</label>
                <input
                  type="number"
                  name="thalach"
                  value={formData.thalach}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Exercise Induced Angina</label>
                <select
                  name="exang"
                  value={formData.exang}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value={0}>No</option>
                  <option value={1}>Yes</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ST Depression</label>
                <input
                  type="number"
                  step="0.1"
                  name="oldpeak"
                  value={formData.oldpeak}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Number of Major Vessels</label>
                <input
                  type="number"
                  min="0"
                  max="3"
                  name="ca"
                  value={formData.ca}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Thalassemia</label>
                <select
                  name="thal"
                  value={formData.thal}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value={0}>Normal</option>
                  <option value={1}>Fixed Defect</option>
                  <option value={2}>Reversible Defect</option>
                </select>
              </div>
            </div>

            <div className="md:col-span-2 space-y-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin mr-2" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Activity className="mr-2" />
                    Analyze Risk
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setShowDashboard(!showDashboard)}
                className="w-full bg-indigo-100 hover:bg-indigo-200 text-indigo-700 font-semibold py-3 px-6 rounded-lg transition duration-200 flex items-center justify-center"
              >
                <ChartBar className="mr-2" />
                {showDashboard ? 'Hide Analytics Dashboard' : 'Show Analytics Dashboard'}
              </button>
            </div>
          </form>

          {error && (
            <div className="mt-6 p-4 bg-red-50 rounded-lg flex items-center text-red-700">
              <AlertCircle className="w-5 h-5 mr-2" />
              {error}
            </div>
          )}

          {result && (
            <div className="mt-6 p-6 bg-gray-50 rounded-lg">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <CheckCircle2 className="w-6 h-6 mr-2 text-green-500" />
                Analysis Results
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-white rounded-lg shadow">
                  <p className="text-gray-600">Risk Probability</p>
                  <p className="text-3xl font-bold text-blue-600">
                    {(result.probability * 100).toFixed(1)}%
                  </p>
                </div>
                <div className="p-4 bg-white rounded-lg shadow">
                  <p className="text-gray-600">Risk Status</p>
                  <p className={`text-3xl font-bold ${
                    result.prediction === 0 ? 'text-green-500' : 'text-red-500'
                  }`}>
                    {result.prediction === 0 ? 'Low Risk' : 'High Risk'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {showDashboard && (
            <div className="mt-8 space-y-8">
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h3 className="text-xl font-semibold mb-4">Feature Importance Analysis</h3>
                <FeatureImportanceChart />
              </div>

              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h3 className="text-xl font-semibold mb-4">Age Distribution</h3>
                <DistributionChart feature="age" title="Age" />
              </div>

              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h3 className="text-xl font-semibold mb-4">Age vs. Maximum Heart Rate</h3>
                <ScatterPlot
                  xFeature="age"
                  yFeature="thalach"
                  xLabel="Age"
                  yLabel="Maximum Heart Rate"
                />
              </div>
            </div>
          )}
        </div>

        <footer className="mt-12 text-center text-gray-600 text-sm">
          <p>This tool is for informational purposes only and should not replace professional medical advice.</p>
          <p className="mt-2">Always consult with a healthcare provider for medical decisions.</p>
        </footer>
      </div>
    </div>
  );
}

export default App;