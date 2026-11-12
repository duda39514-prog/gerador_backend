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

Como utilizar o Backend Generator
## 1. Prepare o banco de dados
- Tenha um banco de dados MySQL com suas tabelas criadas.
- Exporte a estrutura do banco em um arquivo .sql pelo MySQL Workbench.

## 2. Inicie o Backend Generator
- Abra a pasta do gerador no VS Code.
- No terminal, execute:
node server.js


- Acesse http://localhost:3000 pelo navegador.

## 3. Gere seu backend
- Clique em selecionar arquivo.
- Escolha seu arquivo .sql.
- Clique em Gerar Backend.
- Aguarde o download do arquivo backend-gerado.zip.
  
## 4. Configure o projeto
- Extraia o arquivo ZIP.
- Abra a pasta extraída no VS Code.
- No terminal, execute:
npm install


- Copie o arquivo .env.example e renomeie a cópia para .env.
- Configure os dados de acesso ao MySQL.
## 5. Execute o backend

No terminal, execute:
node server.js


Se tudo estiver configurado corretamente, o servidor será iniciado.

## 6. Teste com o Insomnia
- Abra o Insomnia.
- Crie uma requisição com o endereço do servidor.
- Escolha o método HTTP (GET, POST, PUT ou DELETE).
- Envie a requisição para testar as rotas geradas.
Pronto!
 Seu backend está configurado e pronto para ser testado.
