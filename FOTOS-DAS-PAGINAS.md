# Fotos das subpáginas

As pastas já estão ligadas aos espaços de fotos das duas páginas. Para trocar uma imagem:

1. Abra `assets/img/paginas` e entre na pasta do assunto desejado.
2. Copie sua foto real para essa pasta. Aceita **JPG, JPEG, PNG ou WEBP**; pode manter o nome do arquivo.
3. Dê dois cliques em **`ATUALIZAR-FOTOS.cmd`**, na pasta principal do projeto.
4. Confira a página local. Para aparecer online, as páginas atualizadas e as fotos precisam ser publicadas juntas.

O comando usa Node.js somente no seu computador. O site publicado continua sendo HTML estático e não precisa de Node.js na hospedagem.

## Onde colocar cada foto

```text
assets/img/paginas/
├── acampamento-pesca-acessorios/
│   ├── pesca/                     → equipamentos de pesca
│   ├── iscas-linhas-acessorios/   → iscas, linhas e acessórios
│   ├── oculos-vestuario/          → óculos e vestuário
│   └── camping/                  → equipamentos para acampamento
└── embarcacoes-nautica/
    ├── embarcacoes/
    │   ├── modelo-01/             → primeiro modelo de embarcação
    │   ├── modelo-02/             → segundo modelo de embarcação
    │   └── modelo-03/             → terceiro modelo de embarcação
    ├── caiaques/
    ├── garmin/
    └── manutencao/
```

As quatro primeiras pastas atualizam `/pesca-camping-acessorios-palmas-to/`. As demais atualizam `/embarcacoes-nautica-palmas-to/`.

## Escolher, trocar e retirar

- **Uma foto é exibida por pasta.** Se houver várias, o comando escolhe a primeira em ordem de nome. Use `01-capa.webp`, `02-detalhe.jpg` etc. para facilitar a organização.
- Para trocar, substitua a foto escolhida ou remova a anterior e copie a nova. Execute `ATUALIZAR-FOTOS.cmd` novamente.
- Para retirar, remova as fotos da pasta e execute o comando. Volta a imagem original ou o aviso de foto pendente, conforme o bloco.
- Subpastas dentro de cada assunto não são lidas. Os arquivos `.gitkeep` apenas mantêm as pastas no Git e não aparecem no site.
- Os nomes e as características dos três modelos continuam aguardando confirmação. Adicionar fotos não altera esses textos nem comprova disponibilidade.
- Dê preferência a fotos nítidas e horizontais, já reduzidas para a web. O comando conecta as imagens, sem converter ou comprimir os arquivos.

Pelo terminal, o mesmo comando é `node scripts/atualizar-fotos-paginas.mjs`.
