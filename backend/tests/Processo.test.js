//importar a classe Processo.js
const Processo = require("../src/processo/Processo");
const axios = require("axios"); //para mockar os dados
jest.mock("axios");

//funções describe e tests
//Número CNJ: NNNNNNN-DD.AAAA.J.TR.OOOO

//gerador de número de processo judicial https://processogerador.paulosales.com.br/

//matchers do jest: https://jestjs.io/docs/using-matchers

describe("Itens válidos", () => {

    let p; //processo

    //cria o objeto processo válido antes dos testes
    beforeEach(() =>{
        p = new Processo("5567449-02.2025.7.07.5260"); 
    });

    afterEach(() => {
        p = null;
        console.log("o número de processo foi resetado para ",p);
    })

    //regras
    test("Deve possuir os atributos corretos", () => {
        expect(p.numeroProcessoCompleto).toBe("5567449-02.2025.7.07.5260");
    });    

    test("Deve possuir 25 caracteres (contando os números e pontuação)", () => {
        expect(p.numeroProcessoCompleto).toHaveLength(25);
    });
    
    test("Deve possuir a formatação CNJ correta", () => {
        const cnjRegex = /^\d{7}-\d{2}\.\d{4}\.\d\.\d{2}\.\d{4}$/;
        expect(p.numeroProcessoCompleto).toMatch(cnjRegex);
    });

});
describe("Itens inválidos", () => {
    //exceções
    test("deve lançar erro se o número do processo for vazio", () => {
        expect(() => new Processo("")).toThrow("Número CNJ inválido");
    });

    test("deve lançar erro se o número do processo conter letras", () => {
        expect(() => new Processo("556B49-02.2025.7.07.5260")).toThrow("Número CNJ não deve possuir letras");
        expect(() => new Processo("NNNNNNN-DD.AAAA.J.TR.OOOO")).toThrow("Número CNJ não deve possuir letras");
    });

    test("deve lançar erro se o número do processo for diferente de 25 caracteres", () => {
        expect(() => new Processo("556749-02.2024.7.07.5260")).toThrow("Número CNJ deve possuir 25 caracteres");
        expect(() => new Processo("55674")).toThrow("Número CNJ deve possuir 25 caracteres");
    });

    test("deve lançar erro se o número do processo não possuir um ano válido", () => {
        expect(() => new Processo("5567449-02.2027.7.07.5260")).toThrow("Ano de distribuição não pode ser maior do que o ano atual");
        expect(() => new Processo("1563449-02.2030.7.07.1260")).toThrow("Ano de distribuição não pode ser maior do que o ano atual");
    });

    test("deve lançar erro se o número do processo estiver fora da formatação de pontos", () => {
        expect(() => new Processo("556.449-02.2024.7.07.5.20")).toThrow("Número CNJ fora da formatação NNNNNNN-DD.AAAA.J.TR.OOOO");
        expect(() => new Processo("556.4?9-02.20/4.7.07...20")).toThrow("Número CNJ fora da formatação NNNNNNN-DD.AAAA.J.TR.OOOO");
    });  

    test("deve lançar erro se o dígito ref. ao órgão for 0", () => {
        expect(() => new Processo("5567449-02.2023.0.07.5260")).toThrow("O dígito ref. ao Poder Judiciário não pode ser 0");
    });
})

describe("Lista de processos", () => {
    //https://processogerador.paulosales.com.br/

    beforeAll(() => {
            listaProcessos = [
                new Processo("7451165-19.2025.4.02.3334"),
                new Processo("2076757-26.2025.7.05.4744"),
                new Processo("2514877-59.2025.2.00.2439"),
                new Processo("9300783-93.2025.3.00.2824"),
                new Processo("7335728-40.2025.7.04.0838"),
            ];
    });

    afterAll(() => {
        listaProcessos = null;
        console.log("A lista de processos foi resetada para "+listaProcessos)
    })

    test("Deve ter cinco processos na lista", () => {
        expect(listaProcessos.length).toBe(5);
    });

    test("Deve possuir o processo 9300783-93.2025.3.00.2824", () => {
        const numeros = listaProcessos.map(p => p.numeroProcessoCompleto);
        expect(numeros).toContain("9300783-93.2025.3.00.2824");
    });
})

describe("Chamando a API Mockada", () => {
    jest.clearAllMocks(); 

    test.each([
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
    ])(
        "deve apresentar os dados de processo para o feito %s",
        async (numero, classe, formato, orgao, dataDistribuicao, ultimaAtualizacao) => {
            axios.get.mockResolvedValue({
                data: {
                    hits: {
                        total: { value: 1 },
                        hits: [
                            {
                                _source: {
                                    classe,
                                    formato,
                                    orgao,
                                    dataDistribuicao,
                                    ultimaAtualizacao
                                }
                            }
                        ]
                    }
                }
            });

            const processo = new Processo(numero);
            const dados = await processo.consultaProcessual(); 

            expect(dados.classe).toBe(classe);
            expect(dados.formato).toBe(formato);
            expect(dados.orgao).toBe(orgao);
            expect(dados.dataDistribuicao).toBe(dataDistribuicao);
            expect(dados.ultimaAtualizacao).toBe(ultimaAtualizacao);
        }
    );
     test("Deve retornar erro caso não encontre o processo", async () => {
        const processo = new Processo("0009999-00.2023.1.00.0000");

        axios.get.mockResolvedValue({
            data: {
                hits: {
                    total: { value: 0 },
                    hits: []
                }
            }
        });

        const resultado = await processo.consultaProcessual();
        expect(resultado).toBeNull();
    });
})