from fastapi import FastAPI
from app.routers import train, predict

def create_app() -> FastAPI:
    app = FastAPI(
        title="API Previsão de Doenças Cardíacas (SVM)",
        description=(
            "Endpoints para treinar e prever usando SVM com pipeline completo. "
            "Se já existir um modelo treinado, o upload de um novo CSV unifica os dados e retreina o modelo. "
            "A predição só é realizada se houver um modelo ativo."
        ),
        version="1.0.0"
    )

    # Apenas para debugar o sys.path
    import sys
    print("sys.path:", sys.path)

    # Registra os routers
    app.include_router(train.router, prefix="/train", tags=["Treinamento"])
    app.include_router(predict.router, prefix="/predict", tags=["Predição"])
    return app

app = create_app()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
