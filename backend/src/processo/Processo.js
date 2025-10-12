/*
A regra de padronização do número CNJ é de 20 dígitos, no formato NNNNNNN-DD.AAAA.J.TR.OOOO

A numeração dos processos é formada por:
- 7 dígitos sequenciais (NNNNNNN)
- 2 dígitos verificadores calculados matematicamente a partir dos outros números (DD)
- 4 dígitos que indicam o ano do ajuizamento (AAAA)
- 1 dígito que representa o órgão ou segmento do Poder Judiciário (J) [de 1 à 9]
- 2 dígitos que identificam o Tribunal (TR)
- 4 dígitos que correspondem à unidade de distribuição do processo (OOOO) [não pode ser maior que o ano atual]

Referências: https://atos.cnj.jus.br/atos/detalhar/atos-normativos?documento=119
*/

class Processo{
    constructor (numeroProcessoCompleto){
        numeroProcessoCompleto = String(numeroProcessoCompleto);
        //cria um array que separa cada pedacinho do número do processo de acordo com os pontos e traços
        //serão criados 6 índices, nos termos da cota retro explicando NNNNNNN-DD.AAAA.J.TR.OOOO
        const partes = numeroProcessoCompleto.split(/[.-]/);

        //para averiguar se a pontuação do número CNJ está correta
        const regex = /^\d{7}-\d{2}\.\d{4}\.\d{1}\.\d{2}\.\d{4}$/;

        //exceções: os erros que podem ocorrer ao passar o número do processo:
        //se o número do processo não existir ou se ele for diferente de uma string
        if(!numeroProcessoCompleto || typeof numeroProcessoCompleto !== "string"){
            throw new Error("Número CNJ inválido");
        }

        //se o número de processo estiver com letras 
        if (/[a-zA-Z]/.test(numeroProcessoCompleto)) {
            throw new Error("Número CNJ não deve possuir letras");
        }

        //se tem exatos 25 caracteres
        if (numeroProcessoCompleto.length!=25){
            throw new Error("Número CNJ deve possuir 25 caracteres");
        }

        //se o número de processo estiver fora da pontuação CNJ
        if (!regex.test(numeroProcessoCompleto)) {
            throw new Error("Número CNJ fora da formatação NNNNNNN-DD.AAAA.J.TR.OOOO");
        }

        //o ano do processo tem que ser, no mínimo, até o nosso ano corrente, então ainda não existe um ano 2026
        // cortando os últimos 4 dígitos do número do processo:
        let anoProcesso = parseInt(partes[2]); //parte AAAA
        const anoAtual = parseInt(new Date().getFullYear());
        if (anoProcesso > anoAtual){
            throw new Error("Ano de distribuição não pode ser maior do que o ano atual"); 
        }

        //o dígito J é apenas de 1 a 9, não existe 0, nos termos do artigo 4º da Resolução Nº 65 de 16/12/2008.
        /*Supremo Tribunal Federal: 1       Conselho Nacional de Justiça: 2 
        Superior Tribunal de Justiça: 3     Justiça Federal: 4
        Justiça do Trabalho: 5              Justiça Eleitoral: 6
        Justiça Militar da União: 7         Justiça dos Estados e do DF e T: 8
        Justiça Militar Estadual: 9
        */

        let digitoJ = parseInt(partes[3]); //parte J
        if(digitoJ == "0"){
            throw new Error("O dígito ref. ao Poder Judiciário não pode ser 0"); 
        }



        //regras: se deu certo
        this.numeroProcessoCompleto = numeroProcessoCompleto;

    }
}

module.exports = Processo;