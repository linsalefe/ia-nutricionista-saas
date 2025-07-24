from fastapi import FastAPI
from app.endpoints.user import router as user_router
from app.endpoints.chat import router as chat_router
from app.endpoints.image import router as image_router
from app.endpoints.meal import router as meal_router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="IA Nutricionista SaaS",
    description="API backend do projeto de IA Nutricionista com upload de imagem, análise nutricional e chat.",
    version="0.1.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # ou ["http://localhost:5173"] para permitir só seu front
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"msg": "API IA Nutricionista SaaS está online!"}

app.include_router(user_router, prefix="/api/user")
app.include_router(chat_router, prefix="/api/chat")
app.include_router(image_router, prefix="/api/image")
app.include_router(meal_router, prefix="/api/meal")
