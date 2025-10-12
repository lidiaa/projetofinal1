//importar a classe Processo.js
const Processo = require("../src/processo/Processo");

//funções describe e tests
//Número CNJ: NNNNNNN-DD.AAAA.J.TR.OOOO

//gerador de número de processo judicial https://processogerador.paulosales.com.br/

//matchers do jest: https://jestjs.io/docs/using-matchers

describe("Itens válidos", () => {

    //regras
    test("Deve possuir os atributos corretos", () => {
        const p = new Processo("5567449-02.2025.7.07.5260");
        expect(p.numeroProcessoCompleto).toBe("5567449-02.2025.7.07.5260");
    });    

    test("Deve possuir 25 caracteres (contando os números e pontuação)", () => {
        const p = new Processo("5567449-02.2025.7.07.5260");
        expect(p.numeroProcessoCompleto).toHaveLength(25);
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
