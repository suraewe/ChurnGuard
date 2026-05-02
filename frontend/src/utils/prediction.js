/**
 * Backend API integration for churn prediction.
 * 
 * ── HOW TO CONNECT YOUR BACKEND ──
 * Change the API_BASE_URL below to your backend server URL.
 * 
 * Examples:
 *   Local Flask:   "http://127.0.0.1:5000"
 *   Local Django:  "http://127.0.0.1:8000"
 *   Deployed:      "https://your-api.onrender.com"
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

/**
 * Sends customer data to your backend and returns the prediction.
 * 
 * Your backend's /predict endpoint should return JSON like:
 * {
 *   prediction: 0 or 1,          (0 = stay, 1 = churn)
 *   probability: 0.0 - 1.0,      (churn probability)
 *   riskScore: 0 - 100,           (risk percentage)
 *   confidence: 0.0 - 1.0,        (model confidence)
 *   factors: [                     (optional - contributing factors)
 *     { label: "Low Credit Score", impact: "high", direction: "risk" },
 *     { label: "Active Member",    impact: "high", direction: "safe" },
 *   ],
 *   modelVersion: "v1.0",         (optional)
 *   timestamp: "ISO string"       (optional - added automatically if missing)
 * }
 */
export const predictChurn = async (formData) => {
  const payload = {
    CreditScore: Number(formData.creditScore),
    Age: Number(formData.age),
    Tenure: Number(formData.tenure),
    Balance: parseFloat(formData.balance),
    EstimatedSalary: parseFloat(formData.estimatedSalary),
    Geography: formData.geography,
    Gender: formData.gender,
    NumOfProducts: Number(formData.numProducts),
    HasCrCard: formData.hasCrCard ? 1 : 0,
    IsActiveMember: formData.isActiveMember ? 1 : 0,
  };

  const response = await fetch(`${API_BASE_URL}/predict`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Server error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();

  // Add timestamp if backend doesn't provide one
  if (!data.timestamp) {
    data.timestamp = new Date().toISOString();
  }

  // Add model version if backend doesn't provide one
  if (!data.modelVersion) {
    data.modelVersion = "ChurnGuard API";
  }

  return data;
};

export const getRiskLevel = (score) => {
  if (score >= 75) return { label: "Critical Risk", color: "#ff3b5c", bg: "rgba(255,59,92,0.1)" };
  if (score >= 55) return { label: "High Risk", color: "#f97316", bg: "rgba(249,115,22,0.1)" };
  if (score >= 35) return { label: "Moderate Risk", color: "#fbbf24", bg: "rgba(251,191,36,0.1)" };
  return { label: "Low Risk", color: "#00e676", bg: "rgba(0,230,118,0.1)" };
};
