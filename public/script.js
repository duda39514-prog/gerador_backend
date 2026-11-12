
const arquivoSQL = document.getElementById("arquivoSQL");
const nomeArquivo = document.getElementById("nomeArquivo");
const btnGerar = document.getElementById("btnGerar");
const mensagem = document.getElementById("mensagem");

arquivoSQL.addEventListener("change", () => {
    const arquivo = arquivoSQL.files[0];

    nomeArquivo.textContent = arquivo
        ? arquivo.name
        : "Nenhum arquivo selecionado";
});

btnGerar.addEventListener("click", async () => {

    const arquivo = arquivoSQL.files[0];

    if (!arquivo) {
        mensagem.textContent = "Selecione um arquivo SQL primeiro!";
        mensagem.style.color = "#ff7777";
        return;
    }

    if (!arquivo.name.toLowerCase().endsWith(".sql")) {
        mensagem.textContent = "Envie um arquivo .sql válido.";
        mensagem.style.color = "#ff7777";
        return;
    }

    const formData = new FormData();
    formData.append("database", arquivo);

    btnGerar.disabled = true;
    btnGerar.textContent = "GERANDO...";
    mensagem.textContent = "Analisando banco de dados...";

    try {

        const resposta = await fetch("/gerar", {
            method: "POST",
            body: formData
        });

        if (!resposta.ok) {
            const erro = await resposta.json();
            throw new Error(erro.erro || "Erro ao gerar projeto.");
        }

        const blob = await resposta.blob();

        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.download = "backend-gerado.zip";

        document.body.appendChild(link);
        link.click();
        link.remove();

        URL.revokeObjectURL(url);

        mensagem.textContent = "Backend gerado com sucesso!";
        mensagem.style.color = "#70ffae";

    } catch (erro) {

        mensagem.textContent = erro.message;
        mensagem.style.color = "#ff7777";

    } finally {

        btnGerar.disabled = false;
        btnGerar.textContent = "GERAR BACKEND";

    }

});
