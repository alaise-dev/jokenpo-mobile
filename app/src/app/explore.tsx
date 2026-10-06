import { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  ScrollView,
} from "react-native";

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

export default function Historico() {
  const [rodadas, setRodadas] = useState<Rodada[]>([]);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");

  async function carregarHistorico() {
    setCarregando(true);
    setErro("");

    const controlador = new AbortController();

    const tempoLimite = setTimeout(() => {
      controlador.abort();
    }, 15000);

    try {
      const resposta = await fetch(`${API_URL}/rodadas`, {
        signal: controlador.signal,
      });

      if (!resposta.ok) {
        throw new Error("Erro ao buscar histórico");
      }

      const dados = await resposta.json();

      setRodadas(dados);
    } catch (erro: any) {
      if (erro.name === "AbortError") {
        setErro(
          "A API demorou mais de 15 segundos. " +
          "Não foi possível carregar o histórico."
        );
      } else {
        setErro(
          "Não foi possível carregar o histórico. " +
          "Verifique se a API está funcionando."
        );
      }
    } finally {
      clearTimeout(tempoLimite);
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregarHistorico();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Histórico</Text>

      <Pressable
        style={styles.botao}
        onPress={carregarHistorico}
        disabled={carregando}
      >
        <Text style={styles.textoBotao}>
          {carregando ? "Carregando..." : "Atualizar histórico"}
        </Text>
      </Pressable>

      {erro !== "" && (
        <Text style={styles.erro}>
          {erro}
        </Text>
      )}

      <ScrollView style={styles.lista}>
        {rodadas.length === 0 && !carregando && erro === "" && (
          <Text style={styles.mensagem}>
            Nenhuma rodada registrada.
          </Text>
        )}

        {rodadas.map((rodada) => (
          <View style={styles.rodada} key={rodada.id}>
            <Text style={styles.texto}>
              Você: {rodada.jogada_jogador}
            </Text>

            <Text style={styles.texto}>
              Servidor: {rodada.jogada_servidor}
            </Text>

            <Text style={styles.resultado}>
              Resultado:{" "}
              {rodada.resultado === "vitoria"
                ? "Vitória"
                : rodada.resultado === "derrota"
                  ? "Derrota"
                  : "Empate"}
            </Text>

            <Text style={styles.data}>
              {new Date(rodada.criada_em).toLocaleString()}
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 60,
  },

  titulo: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },

  botao: {
    backgroundColor: "#222",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 20,
  },

  textoBotao: {
    color: "white",
    fontSize: 18,
  },

  lista: {
    flex: 1,
  },

  rodada: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
  },

  texto: {
    fontSize: 17,
    marginBottom: 5,
  },

  resultado: {
    fontSize: 17,
    fontWeight: "bold",
    marginTop: 5,
  },

  data: {
    fontSize: 14,
    marginTop: 10,
  },

  mensagem: {
    fontSize: 17,
    textAlign: "center",
    marginTop: 20,
  },

  erro: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 15,
  },
});
