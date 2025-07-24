from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from pydantic import BaseModel
from tinydb import TinyDB, Query
from app.auth import SECRET_KEY, ALGORITHM
import os
from datetime import datetime

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/user/login")
router = APIRouter()
DB_PATH = os.path.join(os.path.dirname(__file__), '../../chat_db.json')
db = TinyDB(DB_PATH)
UserQ = Query()

class ChatMsg(BaseModel):
    role: str  # "user" ou "bot"
    text: str
    type: str = "text"
    created_at: str = None

def get_current_username(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Token inválido ou expirado",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        return username
    except JWTError:
        raise credentials_exception

@router.get("/history")
def get_chat_history(username: str = Depends(get_current_username)):
    user_data = db.get(UserQ.username == username)
    if not user_data or "chat" not in user_data:
        return []
    return user_data["chat"]

@router.post("/save")
def save_chat_message(msg: ChatMsg, username: str = Depends(get_current_username)):
    if not msg.created_at:
        msg.created_at = datetime.now().isoformat()
    user_data = db.get(UserQ.username == username)
    if not user_data:
        user_data = {"username": username, "chat": []}
    if "chat" not in user_data:
        user_data["chat"] = []
    user_data["chat"].append(msg.dict())
    db.upsert(user_data, UserQ.username == username)
    return {"ok": True}
