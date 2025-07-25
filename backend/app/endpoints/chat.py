# app/endpoints/user.py

from fastapi import APIRouter, HTTPException, status, Depends
from datetime import datetime
from pydantic import BaseModel
from typing import Optional

from app.models import UserCreate, UserLogin, UserDB, WeightLog
from app.db import salvar_usuario, buscar_usuario
from app.auth import hash_password, verify_password, create_access_token, get_current_user

router = APIRouter()

# --- Pydantic schema para atualização de perfil ---
class UserUpdate(BaseModel):
    nome: Optional[str] = None
    objetivo: Optional[str] = None
    height_cm: Optional[float] = None
    current_weight: Optional[float] = None


@router.post("/signup", status_code=status.HTTP_201_CREATED)
def signup(user: UserCreate):
    if buscar_usuario(user.username):
        raise HTTPException(status_code=400, detail="Usuário já existe")

    # Monta usuário com campos do questionário inicial
    usuario = {
        "username": user.username,
        "nome": user.nome,
        "objetivo": user.objetivo,
        "height_cm": user.height_cm,
        "initial_weight": user.initial_weight,
        "password": hash_password(user.password),
        "weight_logs": [],
        "refeicoes": [],
    }
    # Se forneceu peso inicial, registra primeiro log
    if user.initial_weight is not None:
        usuario["weight_logs"].append({
            "weight": user.initial_weight,
            "recorded_at": datetime.utcnow().isoformat()
        })

    salvar_usuario(usuario)
    return {"msg": "Usuário criado com sucesso"}


@router.post("/login")
def login(login_data: UserLogin):
    usuario = buscar_usuario(login_data.username)
    if not usuario or not verify_password(login_data.password, usuario['password']):
        raise HTTPException(status_code=401, detail="Usuário ou senha inválidos")
    token = create_access_token({"sub": usuario['username']})
    return {"access_token": token, "token_type": "bearer"}


@router.get("/me", response_model=UserDB)
def read_profile(current_user: dict = Depends(get_current_user)):
    # Retorna dados do usuário, incluindo weight_logs
    return current_user


@router.put("/me", response_model=UserDB)
def update_profile(
    update: UserUpdate,
    current_user: dict = Depends(get_current_user)
):
    # Busca usuário atual do DB
    usuario = buscar_usuario(current_user['username'])

    # Atualiza campos permitidos
    if update.nome is not None:
        usuario['nome'] = update.nome
    if update.objetivo is not None:
        usuario['objetivo'] = update.objetivo
    if update.height_cm is not None:
        usuario['height_cm'] = update.height_cm

    # Se veio peso atual, cria novo WeightLog
    if update.current_weight is not None:
        log: WeightLog = {
            'weight': update.current_weight,
            'recorded_at': datetime.utcnow().isoformat()
        }
        usuario.setdefault('weight_logs', []).append(log)

    # Salva alterações
    salvar_usuario(usuario)
    return usuario
