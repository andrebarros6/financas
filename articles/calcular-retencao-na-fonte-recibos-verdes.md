# Como Calcular a Retenção na Fonte nos Recibos Verdes

Se emites recibos verdes em Portugal, provavelmente já te deparaste com a retenção na fonte — o valor que o teu cliente desconta no pagamento e entrega diretamente ao Estado em teu nome. Mas como é que se calcula? Quem é obrigado a reter? E como confirmas que o valor está correto?

Este guia responde a essas perguntas de forma direta.

---

## O que é a retenção na fonte?

A retenção na fonte é um mecanismo de pagamento antecipado de IRS. Em vez de pagares todo o IRS de uma vez na declaração anual, os teus clientes (quando são empresas ou ENI) retêm uma percentagem de cada recibo e entregam-na ao AT.

No final do ano, esse valor já pago conta como crédito na tua liquidação de IRS — se retiveram demasiado, recebes devolução; se foi a menos, pagas a diferença.

---

## Quem é obrigado a fazer a retenção?

A obrigação de reter é do **adquirente** (o teu cliente), não tua. Mas tens de perceber as regras para emitir o recibo corretamente:

| Tipo de cliente | Obrigação de reter? |
|---|---|
| Empresa (pessoa coletiva) | Sim, sempre |
| ENI (empresário em nome individual) | Sim, se tiver contabilidade organizada |
| Particular (pessoa singular) | Não |

Se o teu cliente for um particular, emites o recibo sem retenção. Se for uma empresa, a retenção é obrigatória.

---

## Qual é a taxa de retenção?

A taxa padrão para trabalhadores independentes em Portugal é **25%** sobre o valor bruto do recibo.

Existem exceções:

- **11,5%** — para certas atividades específicas listadas no artigo 101.º do CIRS (ex: atividades agrícolas, algumas profissões liberais com tabela própria)
- **16,5%** — para rendimentos de propriedade intelectual e alguns outros casos
- **Isenção** — se o teu rendimento bruto anual previsto for inferior ao mínimo de subsistência (aplica-se declaração de dispensa)

Para a maioria dos trabalhadores independentes em Portugal, a taxa aplicável é **25%**.

---

## Como calcular a retenção — exemplos

### Exemplo 1: Serviço de 1.000 €

| | Valor |
|---|---|
| Valor bruto (base) | 1.000,00 € |
| Retenção (25%) | 250,00 € |
| Valor líquido recebido | 750,00 € |

O recibo é emitido por 1.000 €. O cliente paga-te 750 € e entrega 250 € ao AT.

### Exemplo 2: Serviço de 800 € com IVA isento

Mesmo raciocínio — a retenção calcula-se sobre o valor base, **antes de IVA** (se houver). Se o teu serviço é isento de IVA (o que é comum nos recibos verdes), não muda nada.

### Exemplo 3: Serviço de 1.200 € com IVA a 23%

| | Valor |
|---|---|
| Valor base | 1.200,00 € |
| IVA (23%) | 276,00 € |
| Retenção (25% sobre base) | 300,00 € |
| Total faturado | 1.476,00 € |
| Valor líquido recebido | 1.176,00 € |

A retenção incide **sempre sobre o valor base**, nunca sobre o IVA.

---

## Como verificar a retenção acumulada no ano

No final do ano, podes confirmar o total retido na fonte de duas formas:

### Via Portal das Finanças
Acede a **Portal das Finanças → Recibos → Consultar** e soma a coluna de retenção. Alternativamente, exporta o ficheiro SIRE e analisa o campo `ValorRetencao` de cada recibo.

### Via Painel dos Recibos
O [Painel dos Recibos](https://paineldosrecibos.barrosbuilds.com) calcula automaticamente a retenção acumulada a partir do teu ficheiro SIRE — por mês, por cliente, e no total anual.

Este valor deve corresponder ao que aparece na tua declaração de IRS pré-preenchida, no campo "Retenções na fonte — Categoria B".

---

## Posso pedir dispensa de retenção?

Sim, se o teu rendimento bruto anual previsto for abaixo do limiar legal (revisto anualmente pelo OE), podes apresentar uma **declaração de dispensa de retenção** ao teu cliente. O cliente fica assim dispensado de reter, e pagas o IRS na totalidade na declaração anual.

Esta opção pode ser vantajosa se tens rendimentos baixos e não queres ter capital imobilizado no AT durante o ano.

A declaração de dispensa não é entregue no AT — é entregue diretamente ao teu cliente, que a guarda para efeitos de fiscalização.

---

## Resumo rápido

- Taxa padrão: **25%** sobre o valor bruto
- Quem retém: o teu cliente (empresa ou ENI com contabilidade organizada)
- Base de cálculo: valor do serviço, **sem IVA**
- Para verificar: exporta o SIRE e soma `ValorRetencao`, ou usa o Painel dos Recibos
- No IRS: o total retido aparece automaticamente como crédito na tua liquidação

---

## Calcula a tua retenção automaticamente

O **Painel dos Recibos** importa o teu ficheiro SIRE e mostra a retenção acumulada por mês e no total anual — sem fórmulas, sem Excel.

[Experimenta gratuitamente →](https://paineldosrecibos.barrosbuilds.com)

---

*Guia atualizado em fevereiro de 2026. As taxas referem-se à legislação em vigor para 2026 — confirma sempre no Portal das Finanças ou com um contabilista.*
