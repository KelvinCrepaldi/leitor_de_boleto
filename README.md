# Leitor de Boleto

Projeto para um desafio técnico: uma API que lê e valida **linhas digitáveis de boleto** no padrão brasileiro (FEBRABAN), suportando:

- **Título** — boleto bancário (47 dígitos)
- **Convênio** — pagamento de concessionárias / arrecadação (48 dígitos)

A API valida os dígitos verificadores (DV), identifica o tipo do boleto e retorna o código de barras, valor e data de vencimento.

## Sobre o projeto

Este projeto nasceu de um **desafio técnico** proposto para implementar um leitor de linha digitável de boleto. O objetivo era validar códigos no padrão brasileiro (FEBRABAN) e retornar as informações principais — código de barras, valor e vencimento — quando o boleto fosse válido.

A maior dificuldade não foi a API em si, e sim **entender as regras dos algoritmos como um todo**: como os dígitos verificadores são calculados, quando usar módulo 10 ou módulo 11, e principalmente **as diferenças entre boleto título (47 dígitos) e convênio (48 dígitos)**. Cada tipo tem estrutura de campos, validações e regras de DV distintas, o que exigiu leitura da documentação FEBRABAN e bastante teste para garantir que a implementação refletisse o padrão correto.

> **Refatorações e legibilidade**  
> Projeto originalmente desenvolvido em 2022. Refatorado utilizando IA como ferramenta de produtividade para melhorar arquitetura, tipagem, performance, testes e organização do código.
>
> Desde a primeira versão do algoritmo, foram feitas diversas refatorações para tornar o código mais fácil de ler e de entender. A ideia foi aproximar a implementação dos passos descritos na documentação FEBRABAN com comentários que espelham o passo a passo do README (na seção do readme sobre a FEBRABAN). Buscando reduzir funções aninhadas e abstrações difíceis de entender, priorizando um código que qualquer pessoa consiga percorrer do início ao fim sem precisar saltar entre muitos arquivos.



## Tecnologias


| Tecnologia  | Versão          |
| ----------- | --------------- |
| Node.js     | 18+ recomendado |
| pnpm        | 10.13.1         |
| TypeScript  | 4.9.5           |
| Express     | 4.22.2          |
| Jest        | 28.1.3          |
| ts-jest     | 28.0.8          |
| ts-node-dev | 2.0.0           |
| supertest   | 6.3.4           |




## Como rodar



### 1. Instalar dependências

```bash
pnpm install
```



### 2. Configurar porta (opcional)

Copie o arquivo de exemplo e ajuste se necessário:

```bash
cp .env.example .env
```

Por padrão, a aplicação roda na porta **8080**.

### 3. Iniciar o servidor

```bash
pnpm dev
```



### 4. Rodar os testes

```bash
pnpm test
```



## Endpoint

```
GET /boleto/:code
```

**Exemplo:**

```
http://localhost:8080/boleto/21290001192110001210904475617405975870000002000
```



### Resposta de sucesso (título)

```json
{
  "barCode": "21299758700000020000001121100012100447561740",
  "amount": "20.00",
  "expirationDate": "2018-07-16",
  "type": "titulo"
}
```



### Resposta de sucesso (convênio)

```json
{
  "barCode": "8174000000001093675970411310797030014337083",
  "amount": "0.10",
  "type": "convenio"
}
```



### Resposta de erro

```json
{
  "message": "Verification code is invalid."
}
```



## Exemplos para testar



### Título bancário (47 dígitos)


| Descrição                   | Linha digitável                                   |
| --------------------------- | ------------------------------------------------- |
| Boleto com vencimento       | `21290001192110001210904475617405975870000002000` |
| Outro boleto com vencimento | `26090468898617118593663800000000590150000020759` |


```bash
curl http://localhost:8080/boleto/21290001192110001210904475617405975870000002000
```



### Convênio / arrecadação (48 dígitos)


| Descrição                | Linha digitável                                    |
| ------------------------ | -------------------------------------------------- |
| Módulo 10 (moeda 6 ou 7) | `817700000000010936759702411310797039001433708318` |
| Módulo 11 (moeda 8 ou 9) | `848000000006010936759701241131079700390014337082` |


```bash
curl http://localhost:8080/boleto/817700000000010936759702411310797039001433708318
```



### Exemplos de erro


| Situação                  | Linha digitável                                     |
| ------------------------- | --------------------------------------------------- |
| Tamanho inválido          | `2609046889861711859366380000000590150000020759`    |
| Caractere inválido        | `2609046889861711859x66380000000590150000020759000` |
| DV inválido (título)      | `21290001102110001210904475617405975870000002000`   |
| Moeda inválida (convênio) | `812300000000010936759702411310797039001433708318`  |




## Estrutura do projeto

```
src/
├── controllers/   # Rotas HTTP
├── middlewares/   # Validação de formato (Passo 0: numérico + tamanho)
├── services/      # Algoritmos FEBRABAN passo a passo (getBoleto, getBoletoTitulo, getBoletoConvenio)
├── utils/boleto/  # Primitivas reutilizáveis (constants, types, dv)
└── tests/         # Testes unitários e de integração
```



## Algoritmos FEBRABAN — passo a passo

Este projeto segue as regras de validação definidas pela FEBRABAN para linha digitável e código de barras. Abaixo está o resumo dos métodos usados em cada tipo de boleto.

### Referências oficiais


| Documento                                                                                                                                                                                           | Uso neste projeto                                                                                     |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| [Convenção da Cobrança (FEBRABAN)](https://cmsarquivos.febraban.org.br/Arquivos/documentos/PDF/Conven%C3%A7%C3%A3o%20da%20Cobran%C3%A7a%20-%2005_02_2021_f.pdf)                                     | Boleto **título** (cobrança bancária, 47 dígitos) — Anexo V define código de barras e linha digitável |
| [Layout Padrão de Arrecadação — versão 8 (FEBRABAN)](https://cmsarquivos.febraban.org.br/Arquivos/documentos/PDF/Layout%20-%20C%C3%B3digo%20de%20Barras%20-%20Vers%C3%A3o%208%20-%2011_05_2026.pdf) | Boleto **convênio** (arrecadação, 48 dígitos) — módulo 10/11 por tipo de moeda                        |
| [Página de layouts FEBRABAN](https://portal.febraban.org.br/pagina/3425/33/pt-br/layout-febraban)                                                                                                   | Índice oficial com versões atualizadas dos manuais                                                    |


---



### Boleto título (47 dígitos)

A linha digitável é dividida em **5 campos**. Os três primeiros têm DV calculado por **módulo 10**. O quarto campo é o **DV geral do código de barras**, calculado por **módulo 11**.

**Estrutura da linha digitável:**


| Campo   | Posições (1-based) | Conteúdo                                       |
| ------- | ------------------ | ---------------------------------------------- |
| Campo 1 | 1–10               | Banco + moeda + início do campo livre + **DV** |
| Campo 2 | 11–21              | Continuação do campo livre + **DV**            |
| Campo 3 | 22–32              | Continuação do campo livre + **DV**            |
| Campo 4 | 33                 | **DV geral** do código de barras               |
| Campo 5 | 34–47              | Fator de vencimento + valor (centavos)         |




#### Passo 1 — Validar DVs dos campos 1, 2 e 3 (módulo 10)

Para cada bloco de 9 dígitos (sem o DV):

1. Percorra os dígitos **da direita para a esquerda**.
2. Multiplique alternadamente por **2** e **1** (começando por 2 na direita).
3. Se o produto tiver 2 dígitos, **some os dígitos** (ex.: 14 → 1 + 4 = 5).
4. Some todos os resultados.
5. Calcule `resto = soma % 10`.
6. O DV é o complemento: se `resto = 0`, DV = **0**; senão, DV = **10 − resto**.
7. Compare o DV calculado com o dígito na posição 10, 21 ou 32 do bloco correspondente.



#### Passo 2 — Validar DV geral do código de barras (módulo 11)

1. Monte o código de barras de 44 posições a partir da linha digitável (com placeholder no DV geral).
2. Separe as posições 1–4 e 6–44 (excluindo a posição 5, que é o DV).
3. Percorra **da direita para a esquerda**, multiplicando por pesos **2, 3, 4, 5, 6, 7, 8, 9** (reiniciando em 2 após 9).
4. Some todos os produtos e calcule `resto = soma % 11`.
5. Calcule `DV = 11 − resto`.
6. Se o resultado for **0, 10 ou 11**, o DV é **1** (regra FEBRABAN para cobrança).
7. Compare com o dígito na **posição 33** da linha digitável (campo 4 — DV geral).



#### Passo 3 — Extrair dados

- **Código de barras:** remontar os 44 dígitos com o DV geral calculado.
- **Valor:** posições 38–47 (últimos 10 dígitos do campo 5), em centavos.
- **Vencimento:** fator nas posições 34–37 somado à data base **07/10/1997** (quando o fator não começa com 0).

---



### Boleto convênio (48 dígitos)

A linha digitável tem **4 blocos de 11 dígitos** (10 dados + 1 DV cada). O tipo de cálculo depende do **identificador de valor** na **3ª posição** (código de moeda/segmento):


| 3ª posição     | Módulo dos blocos | Módulo do DV geral do código de barras |
| -------------- | ----------------- | -------------------------------------- |
| **6** ou **7** | Módulo 10         | Módulo 10                              |
| **8** ou **9** | Módulo 11         | Módulo 11                              |




#### Passo 1 — Validar DVs dos 4 blocos

Para cada bloco de 10 dígitos (sem o DV):

**Se moeda 6 ou 7 (módulo 10):**

1. Percorra os dígitos **da direita para a esquerda**.
2. Multiplique alternadamente por **2** e **1**.
3. Se o produto tiver 2 dígitos, some-os.
4. Some todos os resultados e calcule `resto = soma % 10`.
5. DV = **0** se `resto = 0`, senão **10 − resto**.
6. Compare com o DV nas posições 12, 24, 36 e 48.

**Se moeda 8 ou 9 (módulo 11):**

1. Percorra os dígitos **da direita para a esquerda**.
2. Multiplique por pesos **2 a 9** (reiniciando em 2 após 9).
3. Some os produtos e calcule `resto = soma % 11`.
4. Se `resto ≤ 1`, DV = **0**; se `resto = 10`, DV = **1**; senão, DV = **11 − resto**.
5. Compare com o DV de cada bloco.



#### Passo 2 — Montar código de barras e calcular DV geral

1. Una os 4 blocos removendo os DVs de campo → 44 dígitos de conteúdo.
2. Separe as 3 primeiras posições e as 40 restantes.
3. Aplique o mesmo módulo (10 ou 11) da moeda sobre esses 43 dígitos.
4. Insira o DV calculado na **4ª posição** do código de barras.



#### Passo 3 — Extrair valor

- O valor está nas posições 5–14 do código de barras (11 dígitos), em centavos.

---



### Resumo dos módulos


| Módulo                      | Onde é usado                         | Regra do DV                                                                               |
| --------------------------- | ------------------------------------ | ----------------------------------------------------------------------------------------- |
| **Módulo 10**               | DVs de campo (título e convênio 6/7) | `resto = soma % 10` → DV = 0 se resto 0, senão 10 − resto                                 |
| **Módulo 11 (cobrança)**    | DV geral do título                   | `resto = soma % 11` → DV = 1 se resto 0 ou 1, senão 11 − resto; se resultado ≥ 10, DV = 1 |
| **Módulo 11 (arrecadação)** | DVs de campo e geral do convênio 8/9 | `resto = soma % 11` → DV = 0 se resto ≤ 1, 1 se resto = 10, senão 11 − resto              |


