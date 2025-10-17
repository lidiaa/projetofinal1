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

O projeto objetiva **integrar-se à API DataJud** (de forma simulada, com mockup) para acessar, visualizar e manipular os metadados de processos judiciais. O foco é obter informações rápidas de acordo com o número do processo informado, melhorando a prestação jurisdicional no cartório, possibilitando, através de um único local, informar os dados referentes ao Tribunal responsável, à classe, ao tipo de processo e à distribuição, redirecionando, assim, as informações necessárias ao servidor ou ao interessado.

---

## Dependências

Para rodar este sistema, você precisará das seguintes dependências:

- **Node.js** 
- **Express**
- **jest"** "^30.2.0"
- **axios**: "^1.12.2"
- **@cucumber/gherkin**: "^36.0.0"
- **jest-cucumber**: "^4.5.0"
- **puppeteer**: "^24.24.1"

E a extensão **Live Server** - GoLive - para o link do index pelo servidor


---

## Criar a base do projeto

Criar a pasta backend: comando **express backend** na pasta do projeto

Na pasta **backend**, rodar o comando **npm install** para instalar todas as dependências e pacotes

Ainda na pasta backend, instalar a biblioteca que possibilita os testes unitários: **npm instal --save-dev jest**

Criar as pastas src > processo > e o arquivo Processo.js

Criar também a pasta tests > e o arquivo Processo.test.js

No **package.json** do backend, adicionar a linha  **"test": "npx jest"** e **"test:coverage": "npx jest --coverage"** em "scripts"

Transformar a pasta raiz do projeto em projeto node através do comando **npm init -y**

Para os testes de aceitação, é necessário instalar na pasta raiz os pacotes **npm i -D @cucumber/gherkin jest jest-cucumber puppeteer**

No **package.json** da pasta raiz, adicionar em script: **"test:acceptance": "jest"** e, depois das devDependences:
**"jest": {**
    "testMatch": [
      "<rootDir>/tests/acceptance/**/*.steps.js"
    ]
}

Na pasta raiz, criar as pastas **tests** > **features** > e o arquivo **processo.feature**

Depois, novamente em **tests**, criar o diretório **acceptance** > e o arquivo **processo.steps.js**

---

## Testes

Para rodar os testes **unitários** e de **integração**, utilizar o comando **npm run test** na pasta backend

Para verificar as **métricas dos testes**, utilizar o comando **npm run test:coverage** na pasta backend

Para rodar os testes de **aceitação**, utilizar o comando **npm run test:acceptance** na pasta raiz do projeto