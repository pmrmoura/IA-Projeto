import os
import joblib
import pandas as pd
import json

from sklearn.inspection import permutation_importance
from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.preprocessing import StandardScaler
from sklearn.impute import KNNImputer
from sklearn.svm import SVC
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score

MODEL_FILE = "app/models/model_svm.pkl"
SCALER_FILE = "app/models/scaler.pkl"
FEATURES_FILE = "app/models/features.txt"
MODEL_INFO_FILE = "app/models/model_info.json"

model = None
scaler = None
feature_names = []
trained = False

def is_model_ready():
    """Verifica se já existe um modelo treinado salvo em disco."""
    return (
        os.path.exists(MODEL_FILE)
        and os.path.exists(SCALER_FILE)
        and os.path.exists(FEATURES_FILE)
    )

def _load_model_and_scaler():
    global model, scaler, feature_names, trained

    if not is_model_ready():
        raise RuntimeError("Modelo ou scaler ou arquivo de features não encontrados.")

    if model is None:
        model = joblib.load(MODEL_FILE)
    if scaler is None:
        scaler = joblib.load(SCALER_FILE)
    if not feature_names:
        with open(FEATURES_FILE, "r") as f:
            feature_names = f.read().strip().split(",")

    trained = True
    return model, scaler

def load_model_info() -> dict:
    """Lê o arquivo JSON contendo as métricas do modelo."""
    if os.path.exists(MODEL_INFO_FILE):
        with open(MODEL_INFO_FILE, "r") as f:
            return json.load(f)
    return {}

def train_model_from_df(df: pd.DataFrame) -> dict:
    """
    Fluxo principal de treino a partir de um DataFrame:
      1) Cria 'target' se necessário.
      2) Remove colunas extras ('id', 'dataset', etc.).
      3) Faz mapeamento de colunas categóricas (strings) para numéricas
         (corrigindo para as minúsculas do dataset).
      4) Remove colunas que NÃO estão em mandatory_features (exceto 'target').
      5) Para colunas que tenham +60% de NA, preenche pela mediana.
      6) Aplica KNNImputer nas colunas remanescentes com NA (somente colunas numéricas).
      7) Separa X e y e executa GridSearchCV p/ SVM.
      8) Salva modelo, scaler, features e métricas.
      9) Retorna dicionário com métricas e parâmetros.
    """
    global model, scaler, feature_names, trained

    # 1) Se 'target' não existe, criar a partir de 'num'
    if 'target' not in df.columns:
        if 'num' in df.columns:
            # no dataset, se num>0 => doente (1)
            df['target'] = df['num'].apply(lambda x: 1 if x > 0 else 0)
        else:
            raise ValueError("O CSV não possui 'target' nem 'num' para criação da coluna alvo.")

    # 2) Remove colunas que não queremos
    df = df.drop(columns=['id', 'dataset'], errors='ignore')

    # 3) Mapeamentos.
    mappings = {
        'sex': {
            'male': 1, 'female': 0
        },
        'exang': {
            'true': 1, 'false': 0
        },
        'fbs': {
            'true': 1, 'false': 0
        },
        'cp': {
            'typical angina': 0,
            'atypical angina': 1,
            'non-anginal': 2,
            'asymptomatic': 3
        },
        'restecg': {
            'normal': 0,
            'lv hypertrophy': 1,
            'left vent hypertrophy': 1,  # caso apareça
            'st-t wave abnormality': 2,
            'ST-T wave abnormality': 2
        },
        'slope': {
            'downsloping': 1,
            'flat': 2,
            'upsloping': 3
        },
        'thal': {
            'normal': 0,
            'fixed defect': 1,
            'reversable defect': 2,     # do dataset
            'reversible defect': 2      # caso venha escrito "reversible"
        }
    }

    # Converte tudo para minúsculo antes de mapear
    # (apenas nas colunas que existem no DF)
    for col, mapping in mappings.items():
        if col in df.columns:
            df[col] = df[col].astype(str).str.lower().map(mapping)

    # 4) Definição das features obrigatórias. No seu dataset:
    #    'thalch' em vez de 'thalach'.
    mandatory_features = [
        'age', 'sex', 'cp', 'thalch', 'exang',
        'oldpeak', 'ca', 'trestbps', 'chol', 'restecg', 'slope'
    ]
    # Garante que iremos manter somente as colunas mandatórias + target
    keep_cols = mandatory_features + ['target']
    df = df[[c for c in df.columns if c in keep_cols]]

    # Verifica se todas as mandatory_features estão presentes agora
    missing_feats = [feat for feat in mandatory_features if feat not in df.columns]
    if missing_feats:
        raise ValueError(f"Faltam colunas obrigatórias: {missing_feats}")

    # 5) Para colunas numéricas com >60% de NA, preenche pela mediana
    numeric_cols_all = df.select_dtypes(include=['number']).columns
    for col in numeric_cols_all:
        na_ratio = df[col].isnull().mean()
        if na_ratio > 0.60:
            # Se mediana for NaN, indica que a coluna não tem valor algum.
            median_value = df[col].median()
            df[col] = df[col].fillna(median_value)

    # 6) Aplica KNNImputer SOMENTE nas colunas numéricas que ainda tenham NA
    cols_with_na_after = [c for c in numeric_cols_all if df[c].isnull().any()]
    if cols_with_na_after:
        imputer = KNNImputer(n_neighbors=3)
        # Transforma apenas essas colunas
        vals_imputed = imputer.fit_transform(df[cols_with_na_after])
        # Atribui de volta
        df[cols_with_na_after] = vals_imputed

    # 7) Separa X e y e faz train/test + normalização
    X = df[mandatory_features].copy()
    y = df['target'].copy()

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, stratify=y, random_state=42
    )
    scaler_local = StandardScaler()
    X_train_scaled = scaler_local.fit_transform(X_train)
    X_test_scaled = scaler_local.transform(X_test)

    # GridSearch p/ SVM
    svm_base = SVC(probability=True, random_state=42)
    param_grid = {
        'C': [0.01, 0.1, 1, 10],
        'kernel': ['linear', 'rbf'],
        'gamma': ['scale', 'auto']
    }
    grid_search = GridSearchCV(svm_base, param_grid, cv=5, scoring='accuracy')
    grid_search.fit(X_train_scaled, y_train)

    best_model = grid_search.best_estimator_

    # Avaliação
    y_pred = best_model.predict(X_test_scaled)
    acc = accuracy_score(y_test, y_pred)
    prec = precision_score(y_test, y_pred)
    rec = recall_score(y_test, y_pred)
    f1 = f1_score(y_test, y_pred)

    # 8) Salva modelo, scaler e lista de features
    joblib.dump(best_model, MODEL_FILE)
    joblib.dump(scaler_local, SCALER_FILE)
    with open(FEATURES_FILE, 'w') as f:
        f.write(",".join(mandatory_features))

    # Cria dicionário de métricas
    model_info = {
        "status": "SVM treinado com sucesso!",
        "best_params": grid_search.best_params_,
        "accuracy": round(float(acc), 4),
        "precision": round(float(prec), 4),
        "recall": round(float(rec), 4),
        "f1_score": round(float(f1), 4),
        "features": mandatory_features
    }

    # Salva métricas em JSON (opcional)
    with open(MODEL_INFO_FILE, 'w') as f:
        json.dump(model_info, f, indent=2)

    trained = True
    return model_info
