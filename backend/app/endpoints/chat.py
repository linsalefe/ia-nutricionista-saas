from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from pydantic import BaseModel
from app.auth import SECRET_KEY, ALGORITHM
from langchain_openai import ChatOpenAI
from langchain.chains import ConversationChain
from langchain.memory import ConversationBufferMemory
import os
from dotenv import load_dotenv


load_dotenv()
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/user/login")

# Memória de chat por usuário (MVP, memória só em RAM)
user_memories = {}

class ChatMessage(BaseModel):
    message: str

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

@router.post("/send")
def chat_with_ia(msg: ChatMessage, username: str = Depends(get_current_username)):
    if username not in user_memories:
        user_memories[username] = ConversationBufferMemory()
    llm = ChatOpenAI(model="gpt-3.5-turbo", openai_api_key=OPENAI_API_KEY)
    chain = ConversationChain(llm=llm, memory=user_memories[username])
    prompt = f"Responda sempre em português do Brasil, de forma clara, simples e educativa. {msg.message}"
    resposta = chain.predict(input=prompt)
    return {"response": resposta}

