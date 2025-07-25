# app/endpoints/chat_history.py

from fastapi import APIRouter, Depends
from pydantic import BaseModel
from typing import List, Optional

from app.auth import get_current_user
from app.db import salvar_usuario

router = APIRouter(prefix="/chat-history", tags=["chat-history"])


class ChatMessage(BaseModel):
    role: str
    text: str
    type: Optional[str] = None
    imageUrl: Optional[str] = None
    created_at: str


@router.get("", response_model=List[ChatMessage])
def get_chat_history(current_user: dict = Depends(get_current_user)):
    """
    Retorna todo o histórico de chat do usuário.
    """
    return current_user.get("chat_history", [])


@router.post("/save", response_model=ChatMessage, status_code=201)
def save_chat_message(
    msg: ChatMessage, current_user: dict = Depends(get_current_user)
):
    """
    Persiste uma nova mensagem de chat no histórico do usuário.
    """
    history = current_user.get("chat_history") or []
    history.append(msg.dict())
    current_user["chat_history"] = history
    salvar_usuario(current_user)
    return msg
