\# Prova de Programação para Dispositivos Móveis



\## Identificação



Aluno: Alaise Caetano


Disciplina: Programação para Dispositivos Móveis



\## Sobre o projeto



Este projeto foi desenvolvido para a prova de Programação para Dispositivos Móveis.



A aplicação é um jogo de \*\*Pedra, Papel e Tesoura\*\*, onde o jogador escolhe uma das três opções e joga contra o servidor.



Quando o jogador faz uma jogada, o aplicativo envia a escolha para a API. A API escolhe aleatoriamente uma jogada para o servidor, calcula quem venceu e salva a rodada no banco de dados.



O aplicativo também possui uma tela de histórico, onde é possível visualizar as rodadas que já foram realizadas, e um placar com a quantidade de vitórias, derrotas e empates.



\## Tecnologias utilizadas



\### Aplicativo



\* React Native

\* Expo

\* TypeScript

\* Expo Router



\### API



\* Python 3.14.7

\* FastAPI

\* Uvicorn



\### Banco de dados



\* SQLite



\## Estrutura do projeto



O projeto está dividido em duas partes principais:



```text

ProvaMobile/

├── api/

├── app/

├── README.md

└── RESPOSTAS.md

```



A pasta `api` contém o código da API e o banco de dados.



A pasta `app` contém o aplicativo mobile.



O arquivo `RESPOSTAS.md` contém as respostas da Parte I da prova.



\## Versões utilizadas



Durante o desenvolvimento foram utilizadas as seguintes versões:



\* Python 3.14.7

\* Node.js 24.21.0

\* npm 11.19.0



\## Como executar a API



Primeiro, abra um terminal e entre na pasta `api`:



```powershell

cd api

```



Depois, ative o ambiente virtual:



```powershell

.\\.venv\\Scripts\\Activate.ps1

```



Caso seja necessário instalar as dependências:



```powershell

pip install -r requirements.txt

```



Depois, execute a API:



```powershell

python -m uvicorn main:app --reload

```



A API será executada em:



```text

http://127.0.0.1:8000

```



Também é possível acessar a documentação da API pelo Swagger:



```text

http://127.0.0.1:8000/docs

```



\## Como executar o aplicativo



Em outro terminal, entre na pasta do aplicativo:



```powershell

cd app

```



Instale as dependências:



```powershell

npm install

```



Depois execute:



```powershell

npx expo start

```



O aplicativo deve ser executado em um ambiente Android, como um emulador Android ou um celular Android compatível.



\## Comunicação entre o aplicativo e a API



No emulador Android, o aplicativo utiliza:



```text

http://10.0.2.2:8000

```



O endereço `10.0.2.2` permite que o emulador Android acesse a API que está sendo executada no computador.



Se o aplicativo for executado em um celular Android físico, pode ser necessário trocar esse endereço pelo endereço IP do computador na mesma rede.



\## Como o jogo funciona



O jogador escolhe:



\* Pedra

\* Papel

\* Tesoura



Depois toca no botão \*\*Jogar\*\*.



O aplicativo envia a escolha para a API.



A API escolhe aleatoriamente uma jogada para o servidor e calcula o resultado.



As regras são:



\* Pedra ganha de Tesoura.

\* Tesoura ganha de Papel.

\* Papel ganha de Pedra.

\* Quando as duas jogadas são iguais, o resultado é empate.



Os resultados utilizados pela API são:



\* `vitoria`

\* `derrota`

\* `empate`



Depois de calcular o resultado, a API salva a rodada no banco de dados e devolve os dados para o aplicativo.



\## Histórico e placar



O aplicativo possui uma segunda tela chamada \*\*Histórico\*\*.



Nessa tela são mostradas as rodadas realizadas, contendo:



\* Jogada do jogador;

\* Jogada do servidor;

\* Resultado;

\* Data e hora.



As rodadas aparecem da mais recente para a mais antiga.



O histórico pode ser atualizado pelo botão \*\*Atualizar histórico\*\*.



O placar da tela do jogo é calculado a partir das rodadas que estão salvas na API. Assim, as informações continuam disponíveis mesmo depois de fechar e abrir o aplicativo novamente.



\## API



A API possui dois endpoints principais.



\### POST `/rodadas`



É utilizado para criar uma nova rodada.



Exemplo de envio:



```json

{

&#x20; "jogada": "pedra"

}

```



A API escolhe a jogada do servidor, calcula o resultado, salva a rodada e retorna os dados.



\### GET `/rodadas`



É utilizado para buscar todas as rodadas salvas.



As rodadas são retornadas da mais recente para a mais antiga.



\## Validação das requisições



A API aceita somente as jogadas:



```text

pedra

papel

tesoura

```



Caso seja enviada uma jogada inválida, a API retorna erro `422`.



Também não é permitido enviar campos extras para tentar definir o resultado ou a jogada do servidor.



Por exemplo, uma requisição como:



```json

{

&#x20; "jogada": "pedra",

&#x20; "resultado": "vitoria"

}

```



é rejeitada pela API.



O mesmo acontece se alguém tentar enviar a jogada do servidor:



```json

{

&#x20; "jogada": "pedra",

&#x20; "jogada\_servidor": "papel"

}

```



Nesses casos, a API retorna `422` e não salva a rodada.



\## Banco de dados



Foi utilizado o \*\*SQLite\*\* para armazenar as rodadas.



O banco é criado automaticamente pela API e fica no arquivo:



```text

api/jogos.db

```



Cada rodada salva:



\* ID;

\* Jogada do jogador;

\* Jogada do servidor;

\* Resultado;

\* Data e hora.



As informações continuam salvas mesmo quando a API é desligada e iniciada novamente.



O aplicativo não acessa o banco de dados diretamente. O acesso ao banco é feito somente pela API.



\## Tratamento de erros



Durante uma jogada, o aplicativo mostra que está carregando e impede que o usuário envie várias jogadas ao mesmo tempo.



Foi definido um limite de 15 segundos para a comunicação da jogada.



Caso aconteça algum problema de comunicação com a API, o aplicativo mostra uma mensagem informando o problema.



Quando existe possibilidade de a rodada ter sido salva mesmo com uma falha de comunicação, o aplicativo informa essa situação e orienta a consultar o histórico antes de tentar novamente.



O aplicativo não inventa resultados e não faz novas tentativas automaticamente.



\## Limitações



Como o projeto foi desenvolvido para a avaliação, algumas funcionalidades ficaram fora do projeto:



\* Não possui login;

\* Não possui cadastro de usuários;

\* Não possui multiplayer;

\* Não possui ranking;

\* Não possui funcionamento offline;

\* Não possui edição ou exclusão de rodadas;

\* A API precisa estar funcionando para o aplicativo realizar as operações.



\## Referências



Para desenvolver o projeto foram consultadas as documentações das tecnologias utilizadas, principalmente:



\* Python;

\* FastAPI;

\* SQLite;

\* React Native;

\* Expo;

\* Expo Router.



O projeto foi desenvolvido com foco nos requisitos apresentados na prova.



