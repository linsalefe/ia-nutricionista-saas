# app/main.py

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

# Carregar variáveis do .env
load_dotenv()

# Import dos routers individuais
from app.endpoints.user import router as user_router
from app.endpoints.dashboard import router as dashboard_router
from app.endpoints.weight_logs import router as weight_logs_router
from app.endpoints.chat import router as chat_router
from app.endpoints.chat_history import router as chat_history_router
from app.endpoints.image import router as image_router
from app.endpoints.meal import router as meal_router

app = FastAPI(
    title="IA Nutricionista SaaS",
    description="API backend do projeto de IA Nutricionista com upload de imagem, análise nutricional e chat.",
    version="0.1.0",
)

# CORS — ajuste allow_origins conforme seu front-end
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # ou ["*"] em dev
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"msg": "API IA Nutricionista SaaS está online!"}

# Rotas de usuário: /api/user/signup e /api/user/login
app.include_router(user_router, prefix="/api/user", tags=["user"])

# Dashboard e métricas: /api/dashboard/metrics
app.include_router(dashboard_router, prefix="/api/dashboard", tags=["dashboard"])

# Weight logs: /api/weight-logs (GET e POST)
app.include_router(weight_logs_router, prefix="/api/weight-logs", tags=["weight-logs"])

# Chat e histórico de chat
app.include_router(chat_router, prefix="/api/chat", tags=["chat"])
app.include_router(chat_history_router, prefix="/api/chat-history", tags=["chat-history"])

# Análise de imagem: /api/image/analyze
app.include_router(image_router, prefix="/api/image", tags=["image"])

# Refeições / Meal detail: /api/meal
app.include_router(meal_router, prefix="/api/meal", tags=["meal"])
