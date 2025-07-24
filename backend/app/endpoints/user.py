# app/endpoints/user.py

from fastapi import APIRouter, HTTPException, status
from app.models import UserCreate, UserLogin
from app.db import salvar_usuario, buscar_usuario
from app.auth import hash_password, verify_password, create_access_token


router = APIRouter()

@router.post("/signup")
def signup(user: UserCreate):
    if buscar_usuario(user.username):
        raise HTTPException(status_code=400, detail="Usuário já existe")
    usuario = {
        "username": user.username,
        "nome": user.nome,
        "objetivo": user.objetivo,
        "password": hash_password(user.password),
        "refeicoes": []
    }
    salvar_usuario(usuario)
    return {"msg": "Usuário criado com sucesso"}

@router.post("/login")
def login(login_data: UserLogin):
    usuario = buscar_usuario(login_data.username)
    if not usuario or not verify_password(login_data.password, usuario['password']):
        raise HTTPException(status_code=401, detail="Usuário ou senha inválidos")
    token = create_access_token({"sub": usuario['username']})
    return {"access_token": token, "token_type": "bearer"}
