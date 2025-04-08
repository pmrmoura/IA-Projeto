import pandas as pd
from sklearn.impute import KNNImputer

def run_pipeline(df: pd.DataFrame) -> pd.DataFrame:
    """
    Executa o pipeline de pré-processamento:
      - Remove duplicatas
      - (Opcional) Realiza mapeamentos adicionais se necessário
      - Aplica KNNImputer em colunas numéricas com NA
      - Retorna o DataFrame pré-processado
    """
    df = df.copy()
    df.drop_duplicates(inplace=True)
    # Se for necessário, mapeamentos já foram aplicados na leitura ou via endpoints.
    cols_with_na = [col for col in df.columns if df[col].isnull().sum() > 0]
    if cols_with_na:
        numeric_na = [col for col in cols_with_na if pd.api.types.is_numeric_dtype(df[col])]
        if numeric_na:
            imputer = KNNImputer(n_neighbors=3)
            df[numeric_na] = imputer.fit_transform(df[numeric_na])
    return df
