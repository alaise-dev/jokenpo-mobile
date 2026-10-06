# Pedra, Papel e Tesoura

Projeto desenvolvido para a disciplina de **Programação para Dispositivos Móveis**.

A aplicação consiste em um jogo de **Pedra, Papel e Tesoura**, no qual o jogador realiza partidas contra o servidor. O aplicativo se comunica com uma API, que é responsável por escolher a jogada do servidor, calcular o resultado e armazenar as rodadas.

O aplicativo também possui uma tela de histórico e um placar com vitórias, derrotas e empates.

## Tecnologias utilizadas

### Aplicativo

* React Native
* Expo
* TypeScript
* Expo Router

### API

* Python 3.14+
* FastAPI
* Uvicorn

### Banco de dados

* SQLite

## Estrutura do projeto

```text
Jokenpo-Mobile/
├── api/
│   ├── database.py
│   ├── jogos.db
│   ├── main.py
│   └── requirements.txt
├── app/
│   ├── src/
│   ├── assets/
│   ├── package.json
│   └── ...
├── README.md
└── RESPOSTAS.md
```

A pasta `api` contém a API e o banco de dados SQLite.

A pasta `app` contém o aplicativo mobile.

O arquivo `RESPOSTAS.md` contém as respostas referentes à parte teórica da avaliação.

## Versões utilizadas

Durante o desenvolvimento foram utilizadas:

* Python 3.14.7
* Node.js 24.21.0
* npm 11.19.0

## Instalação das dependências

Antes de executar o projeto, é necessário instalar as dependências da **API** e do **aplicativo**. As instruções abaixo mostram como configurar cada parte do projeto.

A API utiliza as dependências listadas no arquivo `requirements.txt`.

O aplicativo utiliza as dependências listadas no arquivo `package.json`, instaladas por meio do `npm install`.

## Como executar a API

Entre na pasta da API:

```bash
cd api
```

Crie o ambiente virtual Python:

```bash
python -m venv .venv
```

Ative o ambiente virtual no Windows PowerShell:

```powershell
.\.venv\Scripts\Activate.ps1
```

Instale as dependências:

```bash
pip install -r requirements.txt
```

Inicie a API:

```bash
python -m uvicorn main:app --reload
```

A API ficará disponível em:

```text
http://127.0.0.1:8000
```

A documentação interativa da API pode ser acessada em:

```text
http://127.0.0.1:8000/docs
```

## Como executar o aplicativo

Em outro terminal, entre na pasta do aplicativo:

```bash
cd app
```

Instale as dependências:

```bash
npm install
```

Inicie o Expo:

```bash
npx expo start
```

Após iniciar, o Expo disponibiliza um **QR Code** que pode ser utilizado para abrir o aplicativo em um dispositivo compatível com o Expo Go.

Também é possível executar o aplicativo em um emulador Android.

## Comunicação entre o aplicativo e a API

Quando o aplicativo é executado em um emulador Android, ele utiliza:

```text
http://10.0.2.2:8000
```

O endereço `10.0.2.2` permite que o emulador Android acesse a API executada no computador.

Quando o aplicativo é executado em um dispositivo Android físico, pode ser necessário utilizar o endereço IP do computador na rede local.

A API deve estar em execução para que o aplicativo consiga realizar partidas e consultar o histórico.

## Funcionamento do jogo

O jogador escolhe uma das opções:

* Pedra
* Papel
* Tesoura

Depois, toca no botão **Jogar**.

O aplicativo envia a jogada escolhida para a API por meio de uma requisição HTTP.

A API escolhe aleatoriamente a jogada do servidor, calcula o resultado oficial da rodada e salva os dados no banco de dados.

As regras utilizadas são:

* Pedra vence Tesoura.
* Tesoura vence Papel.
* Papel vence Pedra.
* Jogadas iguais resultam em empate.

Os resultados utilizados pela API são:

* `vitoria`
* `derrota`
* `empate`

A API é responsável pelo cálculo oficial do resultado. O aplicativo não define nem altera o resultado recebido.

## API

A API possui dois endpoints principais.

### POST `/rodadas`

Cria uma nova rodada.

A requisição deve conter somente a jogada do jogador.

Exemplo:

```json
{
  "jogada": "pedra"
}
```

As jogadas aceitas são:

```text
pedra
papel
tesoura
```

Após receber a requisição, a API:

1. valida a jogada;
2. escolhe aleatoriamente a jogada do servidor;
3. calcula o resultado;
4. salva a rodada no SQLite;
5. retorna os dados da rodada criada.

Em caso de sucesso, o endpoint retorna **HTTP 201**.

A resposta contém:

```json
{
  "id": 1,
  "jogada_jogador": "pedra",
  "jogada_servidor": "tesoura",
  "resultado": "vitoria",
  "criada_em": "2026-10-04T03:25:00+00:00"
}
```

### GET `/rodadas`

Retorna as rodadas armazenadas no banco de dados.

As rodadas são retornadas da mais recente para a mais antiga.

Quando não existem rodadas cadastradas, o endpoint retorna:

```json
[]
```

## Validação das requisições

A API aceita somente as jogadas:

```text
pedra
papel
tesoura
```

Uma jogada inválida ou ausente é rejeitada com **HTTP 422**.

A API também não permite campos adicionais na requisição.

Por exemplo, a seguinte requisição é inválida:

```json
{
  "jogada": "pedra",
  "resultado": "vitoria"
}
```

Também é inválida uma tentativa de definir a jogada do servidor:

```json
{
  "jogada": "pedra",
  "jogada_servidor": "papel"
}
```

Nesses casos, a requisição é rejeitada com **HTTP 422** e a rodada não é gravada no banco de dados.

## Banco de dados

O projeto utiliza **SQLite** para armazenar as rodadas.

O banco está localizado em:

```text
api/jogos.db
```

Cada rodada armazenada possui:

* `id`
* `jogada_jogador`
* `jogada_servidor`
* `resultado`
* `criada_em`

Os dados permanecem armazenados mesmo depois que a API é encerrada e iniciada novamente.

O aplicativo não acessa o SQLite diretamente. Toda comunicação com o banco é realizada pela API.

## Histórico e placar

O aplicativo possui uma tela de **Histórico**, na qual são apresentadas as rodadas realizadas.

Para cada rodada são exibidos:

* jogada do jogador;
* jogada do servidor;
* resultado;
* data e hora.

As rodadas são apresentadas da mais recente para a mais antiga.

O histórico pode ser atualizado pelo botão **Atualizar histórico**.

O placar da tela principal é calculado com base nas rodadas retornadas pela API, considerando:

* vitórias;
* derrotas;
* empates.

Dessa forma, o placar e o histórico continuam disponíveis após fechar e abrir novamente o aplicativo, desde que os dados permaneçam armazenados na API.

## Tratamento de erros e comunicação

Durante o envio de uma jogada:

* o aplicativo apresenta um estado de carregamento;
* o botão de jogar é desabilitado durante a requisição;
* não são permitidos envios simultâneos;
* existe um limite de **15 segundos** para a comunicação;
* erros HTTP ou de comunicação são informados ao usuário;
* o aplicativo não inventa um resultado quando a resposta da API não é recebida;
* não é realizada tentativa automática de repetição.

Quando existe possibilidade de a rodada ter sido registrada na API, mas a resposta não ter chegado corretamente ao aplicativo, o usuário é orientado a consultar o histórico antes de realizar uma nova jogada.

Caso a criação da rodada seja confirmada, mas ocorra uma falha ao atualizar o histórico, o resultado da partida é preservado e o aplicativo informa a falha de atualização.

## Persistência

As rodadas são persistidas no banco de dados SQLite.

A persistência permite que os dados continuem disponíveis mesmo após:

* encerramento da API;
* reinicialização da API;
* fechamento do aplicativo;
* abertura posterior do aplicativo.

O histórico e o placar são obtidos a partir dos dados armazenados pela API.

## Limitações

O projeto foi desenvolvido com foco nos requisitos da disciplina e não possui:

* sistema de login;
* cadastro de usuários;
* multiplayer;
* ranking;
* funcionamento offline;
* edição de rodadas;
* exclusão de rodadas.

A API precisa estar em execução para que o aplicativo possa criar novas rodadas ou consultar os dados armazenados.

## Referências

Foram utilizadas principalmente as documentações das tecnologias empregadas no projeto:

* Python
* FastAPI
* SQLite
* React Native
* Expo
* Expo Router

O desenvolvimento foi realizado considerando os requisitos propostos para a disciplina de **Programação para Dispositivos Móveis**.
