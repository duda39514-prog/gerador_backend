# Gerador de Backend

# Backend Generator

O **Backend Generator** é uma ferramenta desenvolvida para automatizar a criação da estrutura de um backend a partir de um arquivo SQL.

O projeto permite que o usuário envie um arquivo contendo a estrutura de um banco de dados MySQL e, a partir dele, gera automaticamente os principais arquivos necessários para um backend em Node.js, utilizando Express e MySQL.

### Funcionalidades
- Upload de arquivos SQL.
- Análise automática das tabelas e colunas do banco de dados.
- Identificação de chaves primárias.
- Geração automática de rotas e controllers com operações CRUD.
- Criação da configuração de conexão com o banco de dados.
- Organização dos arquivos em uma estrutura de projeto.
- Exportação do backend gerado em um arquivo ZIP.

### Tecnologias utilizadas
- HTML5
- CSS3
- JavaScript
- Node.js
- Express
- MySQL
- Multer
- JSZip

### Objetivo

O objetivo do projeto é facilitar e agilizar o desenvolvimento de backends, reduzindo o trabalho repetitivo na criação de estruturas, rotas e operações básicas de banco de dados.

Projeto desenvolvido com foco em aprendizado e aplicação prática de desenvolvimento web e integração com bancos de dados.

### Tecnologia:

- Html
- Css
- Node.js
- JavaScript

## Como usar:

## 1. Prepare seu banco de dados:
Primeiro, você precisa ter um banco de dados MySQL.

Por exemplo, imagine que você tenha uma tabela chamada alunos:
CREATE TABLE alunos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100),
    email VARCHAR(100),
    idade INT
);


Você precisa salvar a estrutura do banco em um arquivo com a extensão .sql.

Se estiver usando MySQL Workbench, pode exportar a estrutura do banco para um arquivo SQL.

## 2. Inicie o Backend Generator
Abra a pasta backend-generator no VS Code.

No terminal, execute:
node server.js


Se tudo estiver certo, aparecerá:
Backend Generator rodando em http://localhost:3000


Não feche o terminal enquanto estiver utilizando o gerador.

## 3. Abra o site no Edge
Abra o Microsoft Edge e acesse:
Backend Generator
Local

http://localhost:3000
 Copiar endereço
Você verá a página inicial do seu gerador.

## 4. Gere seu backend
Na página do gerador:
1. Clique no botão para selecionar um arquivo.
2. Escolha seu arquivo .sql.
3. Confira se o arquivo foi selecionado.
4. Clique em Gerar Backend.
5. Aguarde o processamento.
O arquivo precisa ser um SQL compatível com o analisador do projeto e respeitar o limite de 5 MB configurado.
Resultado esperado
O navegador receberá um arquivo chamado:

backend-gerado.zip
## 5. Extraia o arquivo ZIP
Depois de baixar:
1. Localize o arquivo ZIP na pasta Downloads.
2. Clique com o botão direito.
3. Escolha Extrair tudo.
4. Abra a pasta extraída no VS Code.
A estrutura gerada deverá ser semelhante a esta:
backend-gerado/
│
├── config/
│   └── db.js
│
├── controllers/
│   └── alunosController.js
│
├── routes/
│   └── alunosRoutes.js
│
├── server.js
├── package.json
├── .env.example
└── README.md


Os arquivos são gerados de acordo com as tabelas identificadas no SQL.
## 6. Configure o backend gerado
Agora você precisa preparar o projeto para funcionar.

Primeiro: abra o terminal na pasta extraída e execute:
npm install


Isso instala as dependências necessárias.

Segundo: procure o arquivo .env.example e crie uma cópia chamada .env.

Configure os dados de conexão com seu MySQL, conforme os nomes de variáveis definidos no arquivo de exemplo.

Por exemplo:
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=sua_senha
DB_NAME=seu_banco


Os nomes precisam corresponder aos utilizados no config/db.js.

Terceiro: confira se o banco de dados existe no MySQL e se suas tabelas estão criadas.
 ## 7. Execute o backend gerado
No terminal do projeto extraído:
node server.js


Se estiver tudo configurado corretamente, o servidor iniciará.

Agora você poderá testar as rotas geradas.
## 8. Teste com o Insomnia
O Insomnia é uma ferramenta complementar. Ele permite testar as rotas do backend enviando requisições HTTP.

Por exemplo, se o gerador criou uma rota para alunos:
Método	Rota	Função
GET	/alunos	Listar alunos
GET	/alunos/1	Buscar aluno
POST	/alunos	Cadastrar aluno
PUT	/alunos/1	Atualizar aluno
DELETE	/alunos/1	Excluir aluno

Esses são exemplos de rotas esperadas, desde que correspondam ao padrão implementado nos arquivos gerados.

No Insomnia, você configura o método, endereço e corpo da requisição e clica em Send.
