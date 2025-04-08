from fastapi import FastAPI
from app.routers import predict

from fastapi.middleware.cors import CORSMiddleware

def create_app() -> FastAPI:
    app = FastAPI(
        title="API Previsão de Doenças Cardíacas",
        description=(
            "Recebe dados de um paciente e retorna a probabilidade de doença cardíaca usando um modelo SVM treinado previamente."
        ),
        version="1.0.0"
    )

    # Habilita CORS (ajuste se precisar restringir origens)
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Registra somente a rota de predição
    app.include_router(predict.router, prefix="/predict", tags=["Predição"])
    return app

app = create_app()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
