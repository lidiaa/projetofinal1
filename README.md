# IF Sudeste MG
Pós-graduação em Desenvolvimento Full Stack

Disciplina: DFS03007 - Engenharia de Software - T01 (2025.2)

Aluna: Lidia M. de Bem B. da Silva

---

# Projeto de Integração com a API DataJud

## API Escolhida: [DataJud - Base Nacional de Dados do Poder Judiciário]

A **API Pública do DataJud** é uma poderosa ferramenta que oferece acesso público aos metadados de processos judiciais em todo o Brasil. Ela é proveniente da **Base Nacional de Dados do Poder Judiciário (DataJud)** e segue rigorosamente os critérios estipulados pela Portaria n. 160 de 09/09/2020, garantindo a proteção de processos sigilosos e informações das partes envolvidas.

### Links referentes ao contexto jurídico da API:
- [Documentação Oficial da API](https://www.cnj.jus.br/sistemas/datajud/api-publica/)
- [Wiki sobre a API DataJud](https://datajud-wiki.cnj.jus.br/api-publica/)
- [Resolução Nº 65 de 16/12/2008 Dispõe sobre a uniformização do número dos processos nos órgãos do Poder Judiciário e dá outras providências](https://atos.cnj.jus.br/atos/detalhar/atos-normativos?documento=119)

---


## Objetivo do Sistema

O projeto objetiva **integrar-se à API DataJud** para acessar, visualizar e manipular os metadados de processos judiciais. O foco é obter informações rápidas de acordo com o número do processo informado, melhorando a prestação jurisdicional no cartório, possibilitando, através de um único local, informar os dados referentes ao Tribunal responsável, à classe, ao tipo de processo e à distribuição, redirecionando, assim, as informações necessárias ao servidor ou ao interessado.

---

## Dependências

Para rodar este sistema, você precisará das seguintes dependências:

- **Node.js** 
- **Express**
- **jest"** "^30.2.0"


---

## Criar a base do projeto

Criar a pasta backend: comando **express backend** na pasta do projeto

Na pasta **backend**, rodar o comando **npm install** para instalar todas as dependências e pacotes

Ainda na pasta backend, instalar a biblioteca que possibilita os testes unitários: **npm instal --save-dev jest**

Criar as pastas src > processo > e o arquivo Processo.js

Criar também a pasta tests > e o arquivo Processo.test.js

No **package.json**, adicionar a linha  **"test": "npx jest"** em "Scripts"

no **package.json**, adicionar o comando **"test:coverage": "npx jest --coverage"** em "scripts"


---

## Testes

Para rodar os testes **unitários**, utilizar o comando **npm run test**

Para verificar as **métricas dos testes**, utilizar o comando **npm run test:coverage**



