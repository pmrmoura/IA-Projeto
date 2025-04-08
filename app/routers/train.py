from fastapi import APIRouter, UploadFile, File, HTTPException, status
from fastapi.responses import JSONResponse
import pandas as pd
import app.services.training_service as training_service

router = APIRouter()

@router.post("/")
def train_model(file: UploadFile = File(...)):
    """
    Endpoint: POST /train/
    - Recebe um arquivo CSV via UploadFile.
    - Lê e converte em DataFrame.
    - Se já existir um modelo, considera-se "retreino" e retorna 200 OK.
      Se não existir modelo, considera-se "primeiro treino" e retorna 201 Created.
    - Retorna métricas (acurácia, precisão, etc.).
    """
    # Checa se o arquivo é CSV
    if not file.filename.endswith(".csv"):
        raise HTTPException(status_code=400, detail="Envie um arquivo CSV válido.")

    # Lê o CSV e imprime info de debug
    try:
        df_new = pd.read_csv(file.file)
        print(df_new.info())
        print(df_new.head(3))
    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=f"Erro ao ler CSV: {e}"
        )

    # Detecta se já existe ou não um modelo antes do treino
    model_existed = training_service.is_model_ready()

    # Chama o fluxo de treino
    try:
        result = training_service.train_model_from_df(df_new)
    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=f"Erro no treinamento: {e}"
        )

    # Define o status code de retorno:
    # - 201 Created se não havia modelo antes,
    # - 200 OK se o modelo já existia (retreino)
    status_code = status.HTTP_201_CREATED if not model_existed else status.HTTP_200_OK

    # Retorna resultado como JSON com status apropriado
    return JSONResponse(content=result, status_code=status_code)
