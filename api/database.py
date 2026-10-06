import sqlite3

DATABASE = "jogos.db"


def conectar():
    return sqlite3.connect(DATABASE)


def criar_tabela():
    conexao = conectar()

    conexao.execute("""
        CREATE TABLE IF NOT EXISTS rodadas (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            jogada_jogador TEXT NOT NULL,
            jogada_servidor TEXT NOT NULL,
            resultado TEXT NOT NULL,
            criada_em TEXT NOT NULL
        )
    """)

    conexao.commit()
    conexao.close()


def salvar_rodada(jogada_jogador, jogada_servidor, resultado, criada_em):
    conexao = conectar()

    cursor = conexao.execute(
        """
        INSERT INTO rodadas
        (jogada_jogador, jogada_servidor, resultado, criada_em)
        VALUES (?, ?, ?, ?)
        """,
        (jogada_jogador, jogada_servidor, resultado, criada_em)
    )

    id_rodada = cursor.lastrowid

    conexao.commit()
    conexao.close()

    return id_rodada


def buscar_rodadas():
    conexao = conectar()

    cursor = conexao.execute("""
        SELECT id, jogada_jogador, jogada_servidor, resultado, criada_em
        FROM rodadas
        ORDER BY id DESC
    """)

    rodadas = cursor.fetchall()

    conexao.close()

    return rodadas