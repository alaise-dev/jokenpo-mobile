# RESPOSTAS.md

## 1. Dispositivos móveis

### a)

No smartphone, a tela é menor e a interação é feita principalmente por toque. No computador de mesa, normalmente usamos uma tela maior, mouse e teclado.

Adaptações:

* No smartphone, usar botões grandes e fáceis de tocar para pedra, papel e tesoura.
* Organizar as informações de forma simples e vertical, para facilitar a visualização em uma tela pequena.

### b)

Os dados mantidos apenas na memória do aplicativo, como uma variável do placar, podem ser perdidos quando o sistema operacional encerra o aplicativo.

As rodadas salvas no servidor continuam existindo porque estão armazenadas no banco de dados.

Ao abrir o aplicativo novamente, ele deve consultar a API usando `GET /rodadas`. Com o histórico retornado, o aplicativo mostra as rodadas e calcula novamente o placar.

---

## 2. Arquitetura e infraestrutura

### a)

```text
Aplicativo React Native
        |
        | HTTP / JSON
        v
      API FastAPI
        |
        | SQL
        v
      Banco SQLite
```

Responsabilidades:

* **Aplicativo:** interface, escolha do jogador e exibição dos resultados.
* **API:** validação da jogada, sorteio da jogada do servidor, cálculo do resultado e comunicação com o banco.
* **Banco:** armazenamento das rodadas.

O aplicativo não deve decidir o resultado oficial porque o usuário poderia alterar o aplicativo ou a requisição e tentar informar que ganhou. O resultado deve ser calculado pela API, que é a parte responsável pela regra oficial do jogo.

### b)

**Verificação 1 — endereço da API**

Verificaria se o aplicativo está usando o endereço correto para acessar o computador que executa a API.

Teste: abrir a documentação da API ou fazer uma requisição para a API a partir do ambiente usado pelo aplicativo.

**Verificação 2 — acesso à porta da API**

Verificaria se a API está realmente executando na porta configurada e se o emulador consegue alcançar essa porta.

Teste: iniciar a API e tentar acessar a rota pelo endereço configurado no emulador. Se funcionar no computador, mas não no emulador, verificaria o endereço usado pelo emulador e a configuração de rede.

---

## 3. Interface móvel

### a)

```text
+-----------------------------+
|     PEDRA PAPEL TESOURA     |
|                             |
|  [ PEDRA ]                  |
|  [ PAPEL ]                  |
|  [ TESOURA ]                |
|                             |
|       [ JOGAR ]             |
|                             |
| Você: Pedra                 |
| Servidor: Tesoura           |
|                             |
| Resultado: VITÓRIA          |
|                             |
| Vitórias: 3                 |
| Derrotas: 1                 |
| Empates: 2                  |
|                             |
|       [ HISTÓRICO ]         |
+-----------------------------+
```

As opções devem ser botões grandes, com espaço suficiente para serem tocadas facilmente.

O resultado deve ser mostrado também em texto, por exemplo:

* `Vitória`
* `Derrota`
* `Empate`

Assim, a informação não depende somente de cores.

### b)

Na tela de histórico:

* **Carregando:** mostrar uma mensagem como `Carregando histórico...`.
* **Consulta concluída sem rodadas:** mostrar `Nenhuma rodada encontrada`.
* **Consulta concluída com rodadas:** listar as rodadas da mais recente para a mais antiga, mostrando as escolhas, o resultado e a data/hora.
* **Falha na consulta:** mostrar uma mensagem de erro, como `Não foi possível consultar o histórico`.

Uma falha de comunicação não deve ser tratada como histórico vazio, porque isso poderia fazer o usuário pensar que não existem rodadas quando, na verdade, a consulta apenas falhou.

---

## 4. Comunicação e segurança

### a)

```text
jogador escolhe uma opção

bloquear botão Jogar
mostrar carregamento
iniciar limite de 15 segundos

tentar enviar:
    POST /rodadas
    JSON: {"jogada": escolha}

se resposta HTTP for 201:
    verificar se a resposta possui os dados esperados
    mostrar resultado
    liberar interface

se houver erro HTTP:
    mostrar mensagem de erro
    não mostrar resultado como confirmado
    liberar interface

se houver falha de comunicação ou timeout:
    informar que não foi possível confirmar a rodada
    permitir consultar o histórico
    liberar interface
```

Não deve existir reenvio automático da jogada.

### b)

A API deve rejeitar a requisição e retornar erro `422`, sem salvar a rodada.

O aplicativo não pode ser a única parte responsável pela validação porque o usuário pode alterar a requisição diretamente, sem passar pelas regras do aplicativo.

Por isso, a API deve aceitar somente a jogada válida do jogador e calcular o resultado e a jogada do servidor internamente.

Por exemplo, a API deve rejeitar:

```json
{
  "jogada": "pedra",
  "resultado": "vitoria"
}
```

porque o cliente não pode informar o resultado oficial.

---

## 5. Plataformas móveis

### a)

**Android:**

* O desenvolvimento e os testes podem ser feitos em um ambiente Android, usando emulador ou aparelho.
* Para este projeto, o aplicativo precisa funcionar em Android, conforme o requisito da prova.

**iOS:**

* O desenvolvimento e os testes dependem do ambiente e das ferramentas específicas da plataforma Apple.
* Para este projeto, não é necessário executar em iOS, pois a prova exige apenas Android.

Na distribuição, Android e iOS possuem processos próprios para disponibilização dos aplicativos. Neste projeto isso não será necessário porque a prova não exige publicação em loja.

### b)

**Vantagem do React Native:**

Para uma equipe que conhece JavaScript, React Native permite desenvolver o aplicativo usando JavaScript e compartilhar grande parte do código entre plataformas.

**Limitação:**

O React Native possui uma camada entre o código JavaScript e os recursos nativos. Em algumas situações específicas pode ser necessário utilizar código ou recursos próprios da plataforma.

Para este projeto, a vantagem é poder desenvolver a interface do jogo com JavaScript sem precisar criar dois aplicativos nativos separados.
