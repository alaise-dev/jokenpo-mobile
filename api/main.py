

from datetime import datetime, timezone
import random

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from pydantic import BaseModel, ConfigDict

from database import criar_tabela, salvar_rodada, buscar_rodadas


app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


OPCOES = ["pedra", "papel", "tesoura"]


class Jogada(BaseModel):
    model_config = ConfigDict(extra="forbid")

    jogada: str


def calcular_resultado(jogador, servidor):
    if jogador == servidor:
        return "empate"

    if (
        (jogador == "pedra" and servidor == "tesoura")
        or (jogador == "tesoura" and servidor == "papel")
        or (jogador == "papel" and servidor == "pedra")
    ):
        return "vitoria"

    return "derrota"


criar_tabela()


@app.post("/rodadas", status_code=201)
def criar_rodada(dados: Jogada):

    if dados.jogada not in OPCOES:
        raise HTTPException(
            status_code=422,
            detail="A jogada deve ser pedra, papel ou tesoura."
        )

    jogada_servidor = random.choice(OPCOES)

    resultado = calcular_resultado(
        dados.jogada,
        jogada_servidor
    )

    criada_em = datetime.now(timezone.utc).isoformat()

    id_rodada = salvar_rodada(
        dados.jogada,
        jogada_servidor,
        resultado,
        criada_em
    )

    return {
        "id": id_rodada,
        "jogada_jogador": dados.jogada,
        "jogada_servidor": jogada_servidor,
        "resultado": resultado,
        "criada_em": criada_em
    }


@app.get("/rodadas")
def listar_rodadas():
    rodadas = buscar_rodadas()

    return [
        {
            "id": rodada[0],
            "jogada_jogador": rodada[1],
            "jogada_servidor": rodada[2],
            "resultado": rodada[3],
            "criada_em": rodada[4]
        }
        for rodada in rodadas
    ]