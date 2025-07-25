# app/endpoints/user.py

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field
from typing import Optional
from uuid import uuid4

from app.auth import get_current_user, create_access_token, verify_password, hash_password
from app.db import buscar_usuario, salvar_usuario

# Removido prefix interno para evitar /api/user/user/…
router = APIRouter(tags=["user"])


class UserSignup(BaseModel):
    username: str = Field(..., description="E-mail ou nome de usuário único")
    password: str = Field(..., min_length=6, description="Senha com no mínimo 6 caracteres")
    nome: Optional[str] = Field(None, description="Nome completo")
    height_cm: Optional[float] = Field(None, description="Altura em centímetros")
    initial_weight: Optional[float] = Field(None, description="Peso inicial em kg")
    objetivo: Optional[str] = Field(None, description="Objetivo nutricional")


class UserLogin(BaseModel):
    username: str
    password: str


class TokenOut(BaseModel):
    access_token: str
    token_type: str = "bearer"


class UserUpdate(BaseModel):
    nome: Optional[str]
    height_cm: Optional[float]
    initial_weight: Optional[float]
    objetivo: Optional[str]


@router.post("/signup", status_code=201)
def signup(data: UserSignup):
    """
    Cadastra um novo usuário. Retorna 400 se já existir.
    """
    if buscar_usuario(data.username):
        raise HTTPException(status_code=400, detail="Usuário já existe")
    hashed = hash_password(data.password)
    user = {
        "id": str(uuid4()),
        "username": data.username,
        "password": hashed,
        "nome": data.nome,
        "height_cm": data.height_cm,
        "initial_weight": data.initial_weight,
        "objetivo": data.objetivo,
        "weight_logs": [],
        "refeicoes": [],
    }
    salvar_usuario(user)
    return {"msg": "Usuário criado com sucesso"}


@router.post("/login", response_model=TokenOut)
def login(data: UserLogin):
    """
    Autentica usuário e retorna JWT.
    """
    user = buscar_usuario(data.username)
    if not user or not verify_password(data.password, user["password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Credenciais inválidas",
            headers={"WWW-Authenticate": "Bearer"},
        )
    token = create_access_token({"sub": user["username"], "nome": user.get("nome")})
    return TokenOut(access_token=token)


@router.patch("", response_model=UserUpdate)
def update_profile(
    payload: UserUpdate,
    current_user: dict = Depends(get_current_user),
):
    """
    Atualiza campos do perfil: nome, altura, peso inicial e objetivo.
    """
    updates = payload.dict(exclude_none=True)
    current_user.update(updates)
    salvar_usuario(current_user)
    return updates
