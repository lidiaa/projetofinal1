//definir a feature, carregar a feature e definir a linguagem
const {defineFeature, loadFeature, setDefaultLanguage} = require("jest-cucumber");
//indicação do caminho do arquivo
const path = require ("path");
const puppeteer = require('puppeteer');
//inserindo os arquivos do backend
jest.setTimeout(20000); // alterar o timeout (tempo limite) para 20 segundos - SEM ISSO NÃO DEU CERTO

//indicação do caminho processo.feature
const feature = loadFeature(path.join(__dirname, "../features/processo.feature"));

//escrita do teste de aceitação
defineFeature(feature, (test) => {
    
    let browser, page;

    //colocar o endereço do front
    const filePatch = "http://127.0.0.1:5500/frontend/index.html" //usando o liveserver (GoLive)

    beforeAll(async()=>{ //configurações antes de todos os cenários => abrir o navegador
            browser = await puppeteer.launch({ //instanciando o browser
                headless: false, //ver as ações no navegador ou não (False é para ver o navegador);
                slowMo: 30, //é o delay do sistema, igual do power automate desktop
            });
            //criar uma nova página:
            page = await browser.newPage(); //abrir uma nova aba
            await page.goto(filePatch, { waitUntil: 'domcontentloaded' }); //vou para a minha aplicação //e esperar ate que o documento seja carregado
    });

    afterAll(async()=>{ //configurações depois de todos os cenários => fechar o navegador
        await browser.close(); //fechar o navegador que foi aberto para o teste
    });
    

    beforeEach(async () => {
        await page.goto(filePatch, { waitUntil: 'domcontentloaded' }); //volta para o index.html
    })

   
    //cenários de teste definidos no processo.feature

    //pesquisa bem-sucedida, de um número de processo com resultado
    test("Pesquisa bem-sucedida", ({ given, and, when, then }) =>{
        given("que o usuário acessou o sistema", async() =>{
            const title = await page.title();
            expect(title).toBe("Consulta de Processo - DataJud");
        });
        and ("clicou no campo de pesquisar", async() =>{
            await page.click("#numero-processo");
        });
        when(/^ele informa os autos "(.*)"$/, async (numeroDoProcesso) => {
            await page.type("#numero-processo", numeroDoProcesso);
        });
        and ("clica no botão de pesquisa", async() =>{
            await page.click("#btn-consultar");
        });
        then ("o sistema deve redirecionar para a página de detalhes", async() =>{
            await page.waitForSelector("#numero-processo-detalhes");
            await page.waitForFunction(selector => document.querySelector(selector).textContent.trim().length > 0, {timeout:10000}, '#numero-processo-detalhes');
            const detailsTitle = await page.title();
            expect(detailsTitle).toBe("Detalhes do Processo - DataJud");
        });
        and('informar os dados processuais solicitados', async() => {
            const numeroProcesso = await page.$eval("#numero-processo-detalhes", (el) => el.textContent);
            const classe = await page.$eval("#classe", (el) => el.textContent);
            const formato = await page.$eval("#formato", (el) => el.textContent);
            const orgao = await page.$eval("#orgao", (el) => el.textContent);
            const distribuicao = await page.$eval("#distribuicao", (el) => el.textContent);
            const atualizacao = await page.$eval("#atualizacao", (el) => el.textContent);

            expect(numeroProcesso).toBe("0001234-59.2023.8.26.0456");
            expect(classe).toBe("Ação de Cobrança");
            expect(formato).toBe("Eletrônico");
            expect(orgao).toBe("Justiça Estadual - TJSP");
            expect(distribuicao).toBe("2023-03-15");
            expect(atualizacao).toBe("2023-03-20");
        })
    },10000);

    //verifica o acesso de um processo que já foi consultado e está no histórico
    test("Consulta de processo do histórico", ({ given, and, when, then }) =>{
        given("que o usuário acessou o sistema", async() =>{
            const title = await page.title();
            expect(title).toBe("Consulta de Processo - DataJud");
        });
        and ("clica no botão de histórico", async() =>{
            await page.click("#btn-historico");
        });
        then("a página deve ser a de histórico", async () => {
            const title = await page.title();
            expect(title).toBe("Histórico de Consultas - DataJud");
        });
        when(/^clica no botão de consultar novamente o processo "(.*)"$/, async (numeroDoProcesso) => {
            await page.waitForSelector('a[href="detalhes.html?numero-processo=0001234-59.2023.8.26.0456"]', { visible: true, timeout: 10000 });
            await page.click('a[href="detalhes.html?numero-processo=0001234-59.2023.8.26.0456"]');
        });
        then ("o sistema deve retornar a tela de detalhes", async() =>{
            await page.waitForSelector("#numero-processo-detalhes");
            await page.waitForFunction(selector => document.querySelector(selector).textContent.trim().length > 0, {timeout:10000}, '#numero-processo-detalhes');
            const detailsTitle = await page.title();
            expect(detailsTitle).toBe("Detalhes do Processo - DataJud");
        });
        and('informar os dados processuais solicitados', async() => {
            const numeroProcesso = await page.$eval("#numero-processo-detalhes", (el) => el.textContent);
            const classe = await page.$eval("#classe", (el) => el.textContent);
            const formato = await page.$eval("#formato", (el) => el.textContent);
            const orgao = await page.$eval("#orgao", (el) => el.textContent);
            const distribuicao = await page.$eval("#distribuicao", (el) => el.textContent);
            const atualizacao = await page.$eval("#atualizacao", (el) => el.textContent);

            expect(numeroProcesso).toBe("0001234-59.2023.8.26.0456");
            expect(classe).toBe("Ação de Cobrança");
            expect(formato).toBe("Eletrônico");
            expect(orgao).toBe("Justiça Estadual - TJSP");
            expect(distribuicao).toBe("2023-03-15");
            expect(atualizacao).toBe("2023-03-20");
        })
    },20000);

    
    //realizar a consulta de um processo com segredo de justiça
    test("Pesquisa de processo com segredo de justiça", ({ given, and, when, then }) =>{
        given("que o usuário acessou o sistema", async() =>{
            const title = await page.title();
            expect(title).toBe("Consulta de Processo - DataJud");
        });
        and ("clicou no campo de pesquisar", async() =>{
            await page.click("#numero-processo");
        });
        when(/^ele informa os autos "(.*)"$/, async (numeroDoProcesso) => {
            await page.type("#numero-processo", numeroDoProcesso);
        });
        and ("clica no botão de pesquisa", async() =>{
            await page.click("#btn-consultar");
        });
        then ("o sistema deve redirecionar para a página de detalhes", async() =>{
            await page.waitForSelector("#numero-processo-detalhes");
            await page.waitForFunction(selector => document.querySelector(selector).textContent.trim().length > 0, {timeout:10000}, '#numero-processo-detalhes');
            const detailsTitle = await page.title();
            expect(detailsTitle).toBe("Detalhes do Processo - DataJud");
        });
        and('informar os dados processuais solicitados', async() => {
            var segredoDeJustica = "Segredo de justiça - Resolução Nº 121 de 05/10/2010 (Art. 1º, parágrafo único)";
            const numeroProcesso = await page.$eval("#numero-processo-detalhes", (el) => el.textContent);
            const classe = await page.$eval("#classe", (el) => el.textContent);
            const formato = await page.$eval("#formato", (el) => el.textContent);
            const orgao = await page.$eval("#orgao", (el) => el.textContent);
            const distribuicao = await page.$eval("#distribuicao", (el) => el.textContent);
            const atualizacao = await page.$eval("#atualizacao", (el) => el.textContent);

            expect(numeroProcesso).toBe("0005678-34.2022.5.15.0321");
            expect(classe).toBe(segredoDeJustica);
            expect(formato).toBe(segredoDeJustica);
            expect(orgao).toBe(segredoDeJustica);
            expect(distribuicao).toBe(segredoDeJustica);
            expect(atualizacao).toBe(segredoDeJustica);
        })
    },10000);


    //verifica se os processos pesquisados estão na lista do histórico
    test("Acesso a tela do histórico", ({ given, and, when, then }) =>{
        given("que o usuário acessou o sistema", async() =>{
            const title = await page.title();
            expect(title).toBe("Consulta de Processo - DataJud");
        });
        and ("clica no botão de histórico", async() =>{
            await page.click("#btn-historico");
           
        });
        then ("a página deve ser a de histórico", async() =>{
             const title = await page.title();
            expect(title).toBe("Histórico de Consultas - DataJud");
            slowMo: 3000;
        });
        and('clica no botão de voltar a home', async() => {
             await page.click("#btn-voltar-historico");
        });
        then ("o sistema deve retornar ao index", async() =>{
             const title = await page.title();
            expect(title).toBe("Consulta de Processo - DataJud");
        });
    },10000);


    //verifica se é exibido um alerta se for informado um num de feito menor do que o requerido
    test("Consulta com número incompleto", ({ given, and, when, then }) =>{
        given("que o usuário acessou o sistema", async() =>{
            const title = await page.title();
            expect(title).toBe("Consulta de Processo - DataJud");
        });
        and ("clicou no campo de pesquisar", async() =>{
            await page.click("#numero-processo");
        });
        when(/^ele informa os autos "(.*)"$/, async (numeroDoProcesso) => {
            await page.type("#numero-processo", numeroDoProcesso);
        });
        and ("clica no botão de pesquisa", async() =>{
            await page.click("#btn-consultar");
        });
        then ("o sistema deve exibir o alerta de número incompleto", async() =>{
                const displayValue = await page.$eval("#alerta-processo", (el) => {
                return window.getComputedStyle(el).display;
            });
            expect(displayValue).toBe("block");
        });
    },10000);

    //realiza uma consulta processual e clica no botão de voltar a página principal
    test("Realizar consulta processual e clicar no botão voltar", ({ given, and, when, then }) =>{
        given("que o usuário acessou o sistema", async() =>{
            const title = await page.title();
            expect(title).toBe("Consulta de Processo - DataJud");
        });
        and ("clicou no campo de pesquisar", async() =>{
            await page.click("#numero-processo");
        });
        when(/^ele informa os autos "(.*)"$/, async (numeroDoProcesso) => {
            await page.type("#numero-processo", numeroDoProcesso);
        });
        and ("clica no botão de pesquisa", async() =>{
            await page.click("#btn-consultar");
        });
        then ("o sistema deve redirecionar para a página de detalhes", async() =>{
            await page.waitForSelector("#numero-processo-detalhes");
            await page.waitForFunction(selector => document.querySelector(selector).textContent.trim().length > 0, {timeout:10000}, '#numero-processo-detalhes');
            const detailsTitle = await page.title();
            expect(detailsTitle).toBe("Detalhes do Processo - DataJud");
        });
        and('informar os dados processuais solicitados', async() => {
            const numeroProcesso = await page.$eval("#numero-processo-detalhes", (el) => el.textContent);
            const classe = await page.$eval("#classe", (el) => el.textContent);
            const formato = await page.$eval("#formato", (el) => el.textContent);
            const orgao = await page.$eval("#orgao", (el) => el.textContent);
            const distribuicao = await page.$eval("#distribuicao", (el) => el.textContent);
            const atualizacao = await page.$eval("#atualizacao", (el) => el.textContent);

            expect(numeroProcesso).toBe("0009876-02.2021.4.01.0067");
            expect(classe).toBe("Mandado de Segurança");
            expect(formato).toBe("Eletrônico");
            expect(orgao).toBe("Justiça Federal - TRF1");
            expect(distribuicao).toBe("2021-06-11");
            expect(atualizacao).toBe("2021-06-18");
        })
        when("ele clica no botão voltar", async () => {
            await page.click("#btn-voltar");
        });
        then("o sistema deve redirecionar para a página de index", async() =>{
            const title = await page.title();
            expect(title).toBe("Consulta de Processo - DataJud");
        });
        
    },10000);

    //limpa do histórico os processos consultados
    test("Limpar o histórico de consultas processuais", ({ given, and, when, then }) =>{
        given("que o usuário acessou o sistema", async() =>{
            const title = await page.title();
            expect(title).toBe("Consulta de Processo - DataJud");
        });
        and ("clica no botão de acesso ao histórico", async() =>{
            await page.click("#btn-historico");
           
        });
        then ("a página deve ser a do histórico", async() =>{
            const title = await page.title();
            expect(title).toBe("Histórico de Consultas - DataJud");
            slowMo: 3000;
        });
        when('ele clica no botão de limpar o histórico', async() => {
            //alert
            await page.on('dialog', async dialog => {
                await dialog.accept(); //aceita que o histórico seja limpo
            });

            await page.click("#btn-limpar-historico");
        })
        then ("a lista de processos consultados deve ficar vazia", async() =>{ 
           await page.waitForFunction(() => {
            const liText = document.querySelector("#lista-historico li")?.textContent;
            return liText && liText.includes("Nenhum processo consultado.");
            }, { timeout: 30000 });  

        const listaHistoricoVazia = await page.$$eval("#lista-historico li", items => {
            const liText = items[0]?.textContent; 
            return liText && liText.includes("Nenhum processo consultado.");
        });

        expect(listaHistoricoVazia).toBe(true);
        });
    },10000);

    //pesquisa de processo inexistente
    test("Consulta de processo inexistente", ({ given, and, when, then }) =>{
        given("que o usuário acessou o sistema", async() =>{
            const title = await page.title();
            expect(title).toBe("Consulta de Processo - DataJud");
        });
        and ("clicou no campo de pesquisar", async() =>{
            await page.click("#numero-processo");
        });
        when(/^ele informa os autos "(.*)"$/, async (numeroDoProcesso) => {
            await page.type("#numero-processo", numeroDoProcesso);
        });
        then("o sistema deve exibir o alerta de processo inexistente ao clicar em pesquisar", async () => {
            await page.click("#btn-consultar");
    });
        and ("o sistema deve permanecer na página inicial", async() =>{
            const title = await page.title();
            expect(title).toBe("Consulta de Processo - DataJud");
        });
    },10000);

});



/*  Mocks
	    numero, classe, formato, orgao, dataDistribuicao, ultimaAtualizacao
    	["0001234-59.2023.8.26.0456", "Ação de Cobrança", "Eletrônico", "Justiça Estadual - TJSP", "2023-03-15", "2023-03-20"],
        ["0005678-34.2022.5.15.0321", "Reclamatória Trabalhista", "Eletrônico", "Justiça do Trabalho - TRT15", "2022-09-01", "2022-09-05"],
        ["0009876-02.2021.4.01.0067", "Mandado de Segurança", "Eletrônico", "Justiça Federal - TRF1", "2021-06-11", "2021-06-18"],
        ["0003456-77.2024.8.19.0302", "Ação de Indenização", "Eletrônico", "Justiça Estadual - TJRJ", "2024-01-22", "2024-01-29"],
        ["0012345-16.2020.6.27.0008", "Representação Eleitoral", "Eletrônico", "Justiça Eleitoral - TRE/RO", "2020-08-19", "2020-08-21"],
        ["0002222-81.2023.3.00.0000", "Recurso Especial", "Eletrônico", "Superior Tribunal de Justiça", "2023-05-03", "2023-05-10"],
        ["0008765-45.2025.8.12.0777", "Ação de Família", "Eletrônico", "Justiça Estadual - TJMS", "2025-02-17", "2025-02-20"],
        ["0004321-90.2022.5.02.0089", "Execução Trabalhista", "Eletrônico", "Justiça do Trabalho - TRT2", "2022-04-10", "2022-04-13"],
        ["0006789-13.2021.4.05.0034", "Ação Previdenciária", "Eletrônico", "Justiça Federal - TRF5", "2021-11-25", "2021-12-01"],
        ["0000011-27.2024.9.26.0003", "Ação Penal Militar", "Eletrônico", "Justiça Militar Estadual - TJM/SP", "2024-07-07", "2024-07-10"],
*/