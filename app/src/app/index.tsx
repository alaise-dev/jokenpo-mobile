import { useEffect, useState } from "react";
import { StyleSheet, Text, View, Pressable } from "react-native";

import { Platform } from "react-native";

const API_URL =
  Platform.OS === "web"
    ? "http://127.0.0.1:8000"
    : "http://10.0.2.2:8000";

type Rodada = {
  id: number;
  jogada_jogador: string;
  jogada_servidor: string;
  resultado: string;
  criada_em: string;
};

export default function Index() {
  const [jogada, setJogada] = useState("");
  const [resultado, setResultado] = useState("");
  const [rodadas, setRodadas] = useState<Rodada[]>([]);
  const [carregando, setCarregando] = useState(false);
  const [carregandoPlacar, setCarregandoPlacar] = useState(true);
  const [erro, setErro] = useState("");
  const [placarDisponivel, setPlacarDisponivel] = useState(false);

  const vitorias = rodadas.filter(
    (rodada) => rodada.resultado === "vitoria"
  ).length;

  const derrotas = rodadas.filter(
    (rodada) => rodada.resultado === "derrota"
  ).length;

  const empates = rodadas.filter(
    (rodada) => rodada.resultado === "empate"
  ).length;

  async function carregarPlacar() {
    setCarregandoPlacar(true);

    try {
      const resposta = await fetch(`${API_URL}/rodadas`);

      if (!resposta.ok) {
        throw new Error("Erro ao buscar placar");
      }

      const dados = await resposta.json();

      setRodadas(dados);
      setPlacarDisponivel(true);
    } catch (erro) {
      setPlacarDisponivel(false);
      setErro("Não foi possível atualizar o placar.");
    } finally {
      setCarregandoPlacar(false);
    }
  }

  async function jogar() {
    if (jogada === "" || carregando) {
      return;
    }

    setCarregando(true);
    setErro("");
    setResultado("");

    const controlador = new AbortController();

    const tempoLimite = setTimeout(() => {
      controlador.abort();
    }, 15000);

    try {
      const resposta = await fetch(`${API_URL}/rodadas`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jogada: jogada,
        }),
        signal: controlador.signal,
      });

      if (!resposta.ok) {
        throw new Error("Erro ao jogar");
      }

      const dados = await resposta.json();

      const resultadoTexto =
        dados.resultado === "vitoria"
          ? "Vitória"
          : dados.resultado === "derrota"
            ? "Derrota"
            : "Empate";

      setResultado(
        `Você: ${dados.jogada_jogador}\n` +
        `Servidor: ${dados.jogada_servidor}\n` +
        `Resultado: ${resultadoTexto}`
      );

      await carregarPlacar();
    } catch (erro: any) {
      if (erro.name === "AbortError") {
        setErro(
          "A API demorou mais de 15 segundos. " +
          "A rodada pode ter sido registrada. " +
          "Consulte o histórico antes de tentar novamente."
        );
      } else {
        setErro(
          "Não foi possível confirmar a resposta da API. " +
          "A rodada pode ter sido registrada. " +
          "Consulte o histórico antes de tentar novamente."
        );
      }
    } finally {
      clearTimeout(tempoLimite);
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregarPlacar();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Pedra, Papel e Tesoura</Text>

      <Text style={styles.subtitulo}>
        Escolha sua jogada:
      </Text>

      <View style={styles.opcoes}>
        <Pressable
          style={styles.botao}
          onPress={() => setJogada("pedra")}
          disabled={carregando}
        >
          <Text style={styles.textoBotao}>Pedra</Text>
        </Pressable>

        <Pressable
          style={styles.botao}
          onPress={() => setJogada("papel")}
          disabled={carregando}
        >
          <Text style={styles.textoBotao}>Papel</Text>
        </Pressable>

        <Pressable
          style={styles.botao}
          onPress={() => setJogada("tesoura")}
          disabled={carregando}
        >
          <Text style={styles.textoBotao}>Tesoura</Text>
        </Pressable>
      </View>

      <Pressable
        style={styles.botaoJogar}
        onPress={jogar}
        disabled={carregando}
      >
        <Text style={styles.textoBotao}>
          {carregando ? "Jogando..." : "Jogar"}
        </Text>
      </Pressable>

      {jogada !== "" && (
        <Text style={styles.escolha}>
          Você escolheu: {jogada}
        </Text>
      )}

      {resultado !== "" && (
        <Text style={styles.resultado}>
          {resultado}
        </Text>
      )}

      {erro !== "" && (
        <Text style={styles.erro}>
          {erro}
        </Text>
      )}

      <View style={styles.placar}>
        <Text style={styles.placarTitulo}>Placar</Text>

        {carregandoPlacar ? (
          <Text style={styles.placarTexto}>
            Carregando placar...
          </Text>
        ) : placarDisponivel ? (
          <>
            <Text style={styles.placarTexto}>
              Vitórias: {vitorias}
            </Text>

            <Text style={styles.placarTexto}>
              Derrotas: {derrotas}
            </Text>

            <Text style={styles.placarTexto}>
              Empates: {empates}
            </Text>
          </>
        ) : (
          <Text style={styles.placarTexto}>
            Placar indisponível.
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  titulo: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },

  subtitulo: {
    fontSize: 18,
    marginBottom: 20,
  },

  opcoes: {
    gap: 10,
    width: "100%",
  },

  botao: {
    backgroundColor: "#222",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },

  botaoJogar: {
    backgroundColor: "green",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    width: "100%",
    marginTop: 20,
  },

  textoBotao: {
    color: "white",
    fontSize: 18,
  },

  escolha: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: "bold",
  },

  resultado: {
    marginTop: 15,
    fontSize: 18,
    textAlign: "center",
    fontWeight: "bold",
  },

  erro: {
    marginTop: 15,
    fontSize: 16,
    textAlign: "center",
  },

  placar: {
    marginTop: 25,
    alignItems: "center",
  },

  placarTitulo: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
  },

  placarTexto: {
    fontSize: 17,
    marginBottom: 3,
  },
});
