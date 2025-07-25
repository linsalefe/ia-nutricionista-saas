# app/endpoints/weight_logs.py

from fastapi import APIRouter, Depends, Query
from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime, timedelta

from app.auth import get_current_user
from app.db import salvar_usuario

# Agora definimos o prefixo aqui, e no main.py montamos em "/api"
router = APIRouter(prefix="/weight-logs", tags=["weight-logs"])

class WeightLogIn(BaseModel):
    weight: float = Field(..., gt=0, description="Peso em kg")
    recorded_at: Optional[datetime] = Field(
        None, description="Data do registro (padrão: agora)"
    )

class WeightLogOut(BaseModel):
    weight: float
    recorded_at: str

@router.post("", response_model=WeightLogOut, status_code=201)
def create_weight_log(
    payload: WeightLogIn,
    current_user: dict = Depends(get_current_user)
):
    """
    Adiciona um novo registro de peso ao usuário.
    """
    record_time = payload.recorded_at or datetime.now()
    new_log = {"weight": payload.weight, "recorded_at": record_time.isoformat()}

    logs = current_user.get("weight_logs") or []
    logs.append(new_log)
    current_user["weight_logs"] = logs

    salvar_usuario(current_user)

    return WeightLogOut(weight=payload.weight, recorded_at=record_time.isoformat())

@router.get("", response_model=List[WeightLogOut])
def list_weight_logs(
    period: Optional[str] = Query(None, description="e.g. '7d', '30d', '1y'"),
    current_user: dict = Depends(get_current_user)
):
    """
    Lista logs de peso, opcionalmente filtrados por período.
    """
    raw_logs = current_user.get("weight_logs", []) or []
    logs = sorted(
        [
            {
                "weight": l["weight"],
                "recorded_at": datetime.fromisoformat(l["recorded_at"]),
            }
            for l in raw_logs
        ],
        key=lambda x: x["recorded_at"],
    )

    if period:
        qty, unit = int(period[:-1]), period[-1]
        now = datetime.now()
        if unit == "d":
            cutoff = now - timedelta(days=qty)
        elif unit == "y":
            cutoff = now - timedelta(days=qty * 365)
        else:
            cutoff = None
        if cutoff:
            logs = [l for l in logs if l["recorded_at"] >= cutoff]

    return [
        WeightLogOut(weight=l["weight"], recorded_at=l["recorded_at"].isoformat())
        for l in logs
    ]
