
const JSZip = require("jszip");

// ANALISAR BANCO DE DADOS
function analisarBanco(sql) {
    const tabelas = [];

    const regex = /CREATE TABLE\s+(?:IF NOT EXISTS\s+)?(?:`?[\w]+`?\.)?`?([\w]+)`?\s*\(([\s\S]*?)\)\s*(?:ENGINE[\s\S]*?)?;/gi;

    let resultado;

    while ((resultado = regex.exec(sql)) !== null) {
        const nomeTabela = resultado[1];
        const definicoes = resultado[2].split(",");

        const colunas = [];
        let chavePrimaria = null;

        for (const definicao of definicoes) {
            const texto = definicao.trim();

            const chave = texto.match(
                /^PRIMARY KEY\s*\(\s*`?([\w]+)`?\s*\)/i
            );

            if (chave) {
                chavePrimaria = chave[1];
                continue;
            }

            if (/^(CONSTRAINT|FOREIGN KEY|UNIQUE|KEY|INDEX)/i.test(texto)) {
                continue;
            }

            const coluna = texto.match(
                /^`?(\w+)`?\s+(.+)$/
            );

            if (!coluna) continue;

            const nome = coluna[1];
            const tipo = coluna[2];

            colunas.push({ nome, tipo });

            if (/PRIMARY KEY/i.test(tipo)) {
                chavePrimaria = nome;
            }
        }

        if (!chavePrimaria && colunas.length > 0) {
            chavePrimaria = colunas[0].nome;
        }

        if (colunas.length > 0) {
            tabelas.push({
                nome: nomeTabela,
                colunas,
                chavePrimaria
            });
        }
    }

    if (tabelas.length === 0) {
        throw new Error("Nenhuma tabela encontrada no SQL.");
    }

    return tabelas;
}

// GERAR CONTROLLER
function gerarController(tabela) {
    const nome = JSON.stringify(tabela.nome);
    const chave = JSON.stringify(tabela.chavePrimaria);
    const colunas = JSON.stringify(tabela.colunas.map(c => c.nome));

    return `
const db = require("../config/db");

const tabela = ${nome};
const chave = ${chave};
const colunas = ${colunas};

const q = String.fromCharCode(96);

function tratarErro(res, erro) {
    console.error(erro);
    res.status(500).json({ erro: "Erro no banco de dados." });
}

// LISTAR
exports.listar = async (req, res) => {
    try {
        const [dados] = await db.query("SELECT * FROM " + q + tabela + q);
        res.json(dados);
    } catch (erro) {
        tratarErro(res, erro);
    }
};

// BUSCAR
exports.buscar = async (req, res) => {
    try {
        const sql = "SELECT * FROM " + q + tabela + q +
            " WHERE " + q + chave + q + " = ?";

        const [dados] = await db.query(sql, [req.params.id]);

        if (dados.length === 0) {
            return res.status(404).json({ erro: "Não encontrado." });
        }

        res.json(dados[0]);
    } catch (erro) {
        tratarErro(res, erro);
    }
};

// CADASTRAR
exports.criar = async (req, res) => {
    try {
        const campos = Object.keys(req.body).filter(
            c => colunas.includes(c) && c !== chave
        );

        if (campos.length === 0) {
            return res.status(400).json({ erro: "Dados inválidos." });
        }

        const valores = campos.map(c => req.body[c]);

        const sql = "INSERT INTO " + q + tabela + q +
            " (" + campos.map(c => q + c + q).join(", ") + ")" +
            " VALUES (" + campos.map(() => "?").join(", ") + ")";

        const [resultado] = await db.query(sql, valores);

        res.status(201).json({
            mensagem: "Cadastrado com sucesso!",
            id: resultado.insertId
        });
    } catch (erro) {
        tratarErro(res, erro);
    }
};

// ATUALIZAR
exports.atualizar = async (req, res) => {
    try {
        const campos = Object.keys(req.body).filter(
            c => colunas.includes(c) && c !== chave
        );

        if (campos.length === 0) {
            return res.status(400).json({ erro: "Dados inválidos." });
        }

        const set = campos.map(
            c => q + c + q + " = ?"
        ).join(", ");

        const valores = campos.map(c => req.body[c]);
        valores.push(req.params.id);

        const sql = "UPDATE " + q + tabela + q +
            " SET " + set +
            " WHERE " + q + chave + q + " = ?";

        const [resultado] = await db.query(sql, valores);

        if (resultado.affectedRows === 0) {
            return res.status(404).json({ erro: "Não encontrado." });
        }

        res.json({ mensagem: "Atualizado com sucesso!" });
    } catch (erro) {
        tratarErro(res, erro);
    }
};

// EXCLUIR
exports.excluir = async (req, res) => {
    try {
        const sql = "DELETE FROM " + q + tabela + q +
            " WHERE " + q + chave + q + " = ?";

        const [resultado] = await db.query(sql, [req.params.id]);

        if (resultado.affectedRows === 0) {
            return res.status(404).json({ erro: "Não encontrado." });
        }

        res.json({ mensagem: "Excluído com sucesso!" });
    } catch (erro) {
        tratarErro(res, erro);
    }
};
`;
}

// GERAR ROTAS
function gerarRotas(tabela) {
    return `
const express = require("express");
const router = express.Router();

const controller = require("../controllers/${tabela.nome}Controller");

router.get("/", controller.listar);
router.get("/:id", controller.buscar);
router.post("/", controller.criar);
router.put("/:id", controller.atualizar);
router.delete("/:id", controller.excluir);

module.exports = router;
`;
}

// GERAR PROJETO ZIP
async function gerarProjeto(sql) {
    const tabelas = analisarBanco(sql);
    const zip = new JSZip();

    zip.file("package.json", JSON.stringify({
        name: "backend-gerado",
        version: "1.0.0",
        scripts: {
            start: "node server.js"
        },
        dependencies: {
            express: "^5.1.0",
            mysql2: "^3.14.0",
            dotenv: "^16.4.7"
        }
    }, null, 2));

    zip.file(".env.example", 
`DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=nome_do_banco
PORT=3000
`);

    zip.file("config/db.js", `
const mysql = require("mysql2/promise");

const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

module.exports = db;
`);

    zip.file("server.js", `
require("dotenv").config();
const express = require("express");
const app = express();

app.use(express.json());

${tabelas.map(t => `
const ${t.nome}Routes = require("./routes/${t.nome}Routes");
app.use("/${t.nome}", ${t.nome}Routes);
`).join("\n")}

app.listen(process.env.PORT || 3000, () => {
    console.log("Backend funcionando!");
});
`);

    for (const tabela of tabelas) {
        zip.file(
            "controllers/" + tabela.nome + "Controller.js",
            gerarController(tabela)
        );

        zip.file(
            "routes/" + tabela.nome + "Routes.js",
            gerarRotas(tabela)
        );
    }

    zip.file("README.md", `
# Backend Gerado

Execute npm install e configure o arquivo .env.

Tabelas:
${tabelas.map(t => "- " + t.nome).join("\n")}
`);

    return await zip.generateAsync({
        type: "nodebuffer",
        compression: "DEFLATE"
    });
}

module.exports = {
    analisarBanco,
    gerarProjeto
};
