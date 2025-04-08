import os
import joblib
import pandas as pd
from pydantic import BaseModel
from sklearn.inspection import permutation_importance
from sklearn.preprocessing import StandardScaler
from typing import Union

MODEL_FILE = "app/models/model_svm.pkl"
SCALER_FILE = "app/models/scaler.pkl"
FEATURES_FILE = "app/models/features.txt"

model = None
scaler = None
feature_names = []
trained = False

def is_model_ready():
    return (
        os.path.exists(MODEL_FILE)
        and os.path.exists(SCALER_FILE)
        and os.path.exists(FEATURES_FILE)
    )

def _load_model_and_scaler():
    global model, scaler, feature_names, trained

    if not is_model_ready():
        raise RuntimeError("Modelo ou scaler ou features não encontrados.")

    if model is None:
        model = joblib.load(MODEL_FILE)
    if scaler is None:
        scaler = joblib.load(SCALER_FILE)
    if not feature_names:
        with open(FEATURES_FILE, 'r') as f:
            feature_names = f.read().strip().split(',')

    trained = True
    return model, scaler

def predict(data: BaseModel):
    """
    Recebe um BaseModel (pydantic) contendo as features, 
    transforma em DataFrame, normaliza e faz a predição via SVM.
    """
    _load_model_and_scaler()

    input_dict = data.dict()
    df_input = pd.DataFrame([input_dict])

    # Verifica se as colunas recebidas batem com as features do modelo
    cols_received = set(df_input.columns)
    cols_expected = set(feature_names)
    if cols_received != cols_expected:
        raise ValueError(f"Colunas recebidas: {cols_received} | Esperadas: {cols_expected}")

    X_scaled = scaler.transform(df_input[feature_names])
    pred_class = model.predict(X_scaled)[0]
    pred_proba = model.predict_proba(X_scaled)[0, 1]

    return {
        "prediction": int(pred_class),
        "probability_class_1": round(float(pred_proba), 4)
    }

def get_feature_importance(X_test: pd.DataFrame, y_test: Union[pd.Series, list]):
    """
    (Opcional) Retorna a importância dos atributos (via coef_ ou Permutation Importance).
    """
    _load_model_and_scaler()

    X_test_scaled = scaler.transform(X_test[feature_names])

    if hasattr(model, 'coef_'):
        coefs = model.coef_[0]
        importance_df = pd.DataFrame({
            'Feature': feature_names,
            'Coef': coefs,
            'AbsCoef': abs(coefs)
        }).sort_values('AbsCoef', ascending=False)
        return importance_df
    else:
        # PermutationImportance caso seja kernel='rbf', etc.
        result = permutation_importance(
            model, X_test_scaled, y_test, n_repeats=10,
            scoring='accuracy', random_state=42
        )
        importance_df = pd.DataFrame({
            'Feature': feature_names,
            'Importance': result.importances_mean,
            'Std': result.importances_std
        }).sort_values('Importance', ascending=False)
        return importance_df
