# app/models.py

from pydantic import BaseModel
from typing import Optional, List

class UserCreate(BaseModel):
    username: str
    password: str
    nome: Optional[str] = None
    objetivo: Optional[str] = None

class UserLogin(BaseModel):
    username: str
    password: str

class UserDB(BaseModel):
    id: str
    username: str
    nome: Optional[str]
    objetivo: Optional[str]
    refeicoes: Optional[List[dict]] = []
