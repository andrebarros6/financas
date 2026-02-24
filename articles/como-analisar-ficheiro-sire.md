# Como Analisar o Ficheiro SIRE dos Teus Recibos Verdes

Quando exportas os teus recibos verdes do Portal das Finanças, recebes um ficheiro chamado **SIRE** — que significa **Sistema de Informação de Recibos Eletrónicos**. É o formato oficial que a Autoridade Tributária (AT) usa para registar e disponibilizar todos os recibos emitidos por trabalhadores independentes em Portugal.

Neste guia explicamos o que está dentro desse ficheiro, como lê-lo, e o que fazer com a informação.

---

## O que é o ficheiro SIRE?

O SIRE é um ficheiro em formato **XML** que contém o histórico completo dos teus recibos eletrónicos emitidos via Portal das Finanças. Cada recibo é representado como um bloco de dados estruturado, com campos para:

- Data de emissão
- Valor bruto
- Retenção na fonte
- IVA (se aplicável)
- NIF do prestador (tu) e do adquirente (o teu cliente)
- Descrição do serviço
- Estado do recibo (emitido ou anulado)

O AT gera este ficheiro automaticamente a partir dos recibos que emitiste. Não é um formato que preenchas manualmente — é uma exportação fiel do que está nos seus sistemas.

---

## Como abrir o ficheiro SIRE

O ficheiro tem extensão `.xml`. Tens três opções:

### Opção 1 — Abrir diretamente no browser
Arrasta o ficheiro para o Chrome ou Firefox. Vais ver o XML em bruto — útil para confirmar que o ficheiro não está corrompido, mas difícil de ler.

### Opção 2 — Abrir no Excel
1. Abre o Excel
2. Vai a **Dados → Obter Dados → De Ficheiro → XML**
3. Seleciona o ficheiro SIRE
4. O Excel vai mapear os campos automaticamente para colunas

Resultado: uma tabela com todos os teus recibos. Funciona, mas perde algum contexto estrutural do XML.

### Opção 3 — Importar no Painel dos Recibos
O [Painel dos Recibos](https://paineldosrecibos.barrosbuilds.com) lê o SIRE diretamente e apresenta os dados já formatados: totais por mês, por cliente, retenção acumulada, e gráficos de evolução. Não precisas de perceber o XML.

---

## Estrutura do ficheiro SIRE — os campos principais

Se queres perceber o que está no ficheiro, aqui estão os campos mais relevantes e o que significam:

| Campo | O que representa |
|---|---|
| `DataEmissao` | Data em que o recibo foi emitido |
| `ValorBase` | Valor bruto do serviço (antes de retenções) |
| `ValorRetencao` | Montante retido na fonte pelo cliente |
| `ValorIVA` | IVA cobrado (0 para a maioria dos recibos verdes) |
| `ValorLiquido` | O que recebeste efetivamente (base − retenção) |
| `NifPrestador` | O teu NIF |
| `NifAdquirente` | NIF do teu cliente |
| `Estado` | "N" = emitido, "A" = anulado |
| `Descricao` | Descrição do serviço que preencheste |

---

## O que podes fazer com estes dados

### Conferir a retenção na fonte acumulada
Soma todos os valores de `ValorRetencao` do ano. Este número é o total que os teus clientes retiveram e entregaram ao AT em teu nome — vai aparecer no teu IRS automaticamente, mas é útil confirmares.

### Identificar recibos anulados
Filtra por `Estado = "A"`. Recibos anulados não contam para o teu rendimento declarado.

### Cruzar com o que recebeste
O `ValorLiquido` de cada recibo é o que devias ter recebido. Se tens discrepâncias com os teus extratos bancários, o SIRE ajuda a identificar qual recibo não foi pago.

### Preparar o IRS
O Anexo B da declaração de IRS pede os rendimentos brutos (soma de `ValorBase` dos recibos não anulados). O SIRE é a fonte de verdade para este cálculo.

---

## Importar o SIRE para o Painel dos Recibos

O **Painel dos Recibos** foi construído especificamente para trabalhadores independentes portugueses. Basta carregares o teu ficheiro SIRE e em segundos tens:

- Total faturado por mês e por cliente
- Retenção na fonte calculada e acumulada
- Gráficos de evolução de rendimento
- Comparação entre anos
- Exportação para Excel

[Experimenta gratuitamente →](https://paineldosrecibos.barrosbuilds.com)

---

## Perguntas frequentes

**O meu ficheiro SIRE está vazio — porquê?**
Provavelmente filtraste um período sem recibos, ou selecionaste o formato errado na exportação. Tenta exportar sem filtros de data para confirmar que o ficheiro tem conteúdo.

**Tenho recibos em papel antigos que não aparecem no SIRE — são incluídos no IRS?**
Não automaticamente. O SIRE só contém recibos emitidos eletronicamente pelo Portal das Finanças. Recibos em papel antigos (anteriores à obrigatoriedade eletrónica) têm de ser declarados manualmente.

**O NIF do adquirente aparece em branco — é normal?**
Sim, em alguns casos o cliente pode não ter fornecido o NIF. O recibo é válido na mesma, mas não fica associado a uma empresa específica.

---

*Guia atualizado em fevereiro de 2026.*
