
const express = require("express");
const multer = require("multer");
const path = require("path");

const { gerarProjeto } = require("./gerador/analisador");

const app = express();
const PORT = 3000;

// Configuração do upload.
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024
    },
    fileFilter: (req, file, callback) => {

        if (path.extname(file.originalname).toLowerCase() !== ".sql") {
            return callback(new Error("Envie somente arquivos SQL."));
        }

        callback(null, true);
    }
});

// Arquivos do site.
app.use(express.static(path.join(__dirname, "public")));

// Rota principal do gerador.
app.post("/gerar", (req, res) => {

    upload.single("database")(req, res, async (erro) => {

        if (erro) {
            return res.status(400).json({
                erro: erro.message
            });
        }

        try {

            if (!req.file) {
                return res.status(400).json({
                    erro: "Nenhum arquivo foi enviado."
                });
            }

            const sql = req.file.buffer.toString("utf8");

            const zip = await gerarProjeto(sql);

            res.setHeader(
                "Content-Type",
                "application/zip"
            );

            res.setHeader(
                "Content-Disposition",
                'attachment; filename="backend-gerado.zip"'
            );

            res.send(zip);

        } catch (erro) {

            console.error(erro);

            res.status(400).json({
                erro: erro.message
            });

        }

    });

});

// Tratamento de erros.
app.use((erro, req, res, next) => {

    res.status(400).json({
        erro: erro.message
    });

});

app.listen(PORT, () => {
    console.log(`Backend Generator rodando em http://localhost:${PORT}`);
});
