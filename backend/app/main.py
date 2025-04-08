from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers.predict import router as predict_router

def create_app() -> FastAPI:
    app = FastAPI(
        title="API Previsão de Doenças Cardíacas",
        description="Recebe dados do paciente e retorna a probabilidade de doença cardíaca.",
        version="1.0.0"
    )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_methods=["*"],
        allow_headers=["*"],
    )

    app.include_router(predict_router, prefix="/predict", tags=["Predição"])
    return app

app = create_app()
