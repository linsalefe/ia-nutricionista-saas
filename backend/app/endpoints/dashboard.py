# app/endpoints/dashboard.py

from fastapi import APIRouter, Depends, Query
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime, timedelta

from app.auth import get_current_user

# Removido prefix interno para que a rota seja apenas /api/dashboard/metrics
router = APIRouter(tags=["dashboard"])


class LogItem(BaseModel):
    date: str
    weight: float


class DashboardMetricsOut(BaseModel):
    objective: Optional[str]
    height_cm: Optional[float]
    initial_weight: Optional[float]
    current_weight: Optional[float]
    weight_lost: Optional[float]
    bmi: Optional[float]
    history: List[LogItem]


@router.get("/metrics", response_model=DashboardMetricsOut)
def get_dashboard_metrics(
    period: Optional[str] = Query(None, description="e.g. '7d', '30d', '1y'"),
    current_user: dict = Depends(get_current_user),
):
    """
    Retorna métricas de evolução do usuário:
    - objective, height_cm, initial_weight
    - current_weight (último registro no período ou total)
    - weight_lost (initial_weight - current_weight)
    - bmi (peso atual / altura²)
    - history: lista de registros filtrados pelo período
    """

    # 1) Recupera todos os registros de peso
    raw_logs = current_user.get("weight_logs", []) or []

    # 2) Converte recorded_at para datetime e ordena
    logs = [
        {
            "recorded_at": datetime.fromisoformat(item["recorded_at"]),
            "weight": item["weight"],
        }
        for item in raw_logs
    ]
    logs.sort(key=lambda x: x["recorded_at"])

    # 3) Filtra por período, se informado
    if period and logs:
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

    # 4) Monta o histórico de saída
    history = [
        LogItem(date=l["recorded_at"].date().isoformat(), weight=l["weight"])
        for l in logs
    ]

    # 5) Calcula métricas adicionais
    initial = current_user.get("initial_weight") or 0
    height_cm = current_user.get("height_cm") or 0
    current_weight = history[-1].weight if history else None
    weight_lost = (initial - current_weight) if (initial and current_weight) else None
    bmi = (
        current_weight / ((height_cm / 100) ** 2)
        if (current_weight and height_cm)
        else None
    )

    # 6) Retorna o payload completo
    return DashboardMetricsOut(
        objective=current_user.get("objetivo"),
        height_cm=height_cm,
        initial_weight=initial,
        current_weight=current_weight,
        weight_lost=weight_lost,
        bmi=bmi,
        history=history,
    )
