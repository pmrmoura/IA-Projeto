from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

from ..services import inference_service

router = APIRouter()


class PatientData(BaseModel):
    age: float
    sex: float
    cp: float
    thalch: float = Field(..., alias="thalch")   # agora bate com o CSV
    exang: float
    oldpeak: float
    ca: float
    trestbps: float
    chol: float
    restecg: float
    slope: float

    class Config:
        allow_population_by_field_name = True   # aceita alias ou nome interno

@router.post("/")
def predict_disease(data: PatientData):
    """
    Endpoint: POST /predict/
    - Recebe JSON com os dados do paciente.
    - Se não houver modelo treinado, retorna erro.
    - Caso contrário, retorna a predição (0 ou 1) e a probabilidade da classe 1.
    """
    if not inference_service.is_model_ready():
        raise HTTPException(
            status_code=400,
            detail="Nenhum modelo ativo. Treine o modelo primeiro usando /train/."
        )

    try:
        result = inference_service.predict(data)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Erro na predição: {e}")
    return result
