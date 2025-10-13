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

const axios = require ("axios");

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


    async consultaProcessual() {
        //serão criados 6 índices, nos termos da cota retro explicando NNNNNNN-DD.AAAA.J.TR.OOOO 
        //const partes = this.numeroProcessoCompleto.split(/[.-]/);
        //const urlReferente = obterLink(partes[3], partes[4]);

        const numeroProcessoTratado = this.numeroProcessoCompleto.replace(/\D/g, '');  
        
        const urlReferente = "https://api-publica.datajud.cnj.jus.br/api_publica_deacordocomotribunal/_search";

        const apiKey = "cDZHYzlZa0JadVREZDJCendQbXY6SkJlTzNjLV9TRENyQk1RdnFKZGRQdw==";
        
        try {
            const { data } = await axios.get(urlReferente, {
                params: {
                    q: numeroProcessoTratado
                },
                headers: {
                    'Authorization': `APIKey ${apiKey}` 
                }
            });
      console.log("Dados do processo:", data);      

            if (data.hits.total.value > 0) {

                const processoEncontrado = data.hits.hits[0]._source;; 
                //console.log("Processo encontrado:", processoEncontrado);
                //const assuntos = processoEncontrado._source.assuntos;
                //console.log("Assuntos:", assuntos);

                return {
                    classe: processoEncontrado.classe,
                    formato: processoEncontrado.formato,
                    orgao: processoEncontrado.orgao,
                    dataDistribuicao: processoEncontrado.dataDistribuicao,
                    ultimaAtualizacao: processoEncontrado.ultimaAtualizacao,
                };

            } else {
                console.log("Nenhum processo encontrado para o número informado.");
                return null;
            }

            //return data;

        } catch (error) {
            console.error("Erro ao realizar consulta processual:", error);
            return null;
        }
    }

}



//método responsável pela consulta processual

/* Caso fosse utilizada a API REAL: 
const urlMap = {
    1: {  // J = 1 → STF
        0: 'https://api-publica.datajud.cnj.jus.br/api_publica_tst/_search', 
    },

    //2

  // Justiça Superior
  3: {  // J = 3 → STJ
    0: 'https://api-publica.datajud.cnj.jus.br/api_publica_stj/_search'
  },

  // Justiça Federal (J = 4)
  4: {
    1: 'https://api-publica.datajud.cnj.jus.br/api_publica_trf1/_search',
    2: 'https://api-publica.datajud.cnj.jus.br/api_publica_trf2/_search',
    3: 'https://api-publica.datajud.cnj.jus.br/api_publica_trf3/_search',
    4: 'https://api-publica.datajud.cnj.jus.br/api_publica_trf4/_search',
    5: 'https://api-publica.datajud.cnj.jus.br/api_publica_trf5/_search',
    6: 'https://api-publica.datajud.cnj.jus.br/api_publica_trf6/_search'
  },

  // Justiça do Trabalho (J = 5)
  5: {
    1: 'https://api-publica.datajud.cnj.jus.br/api_publica_trt1/_search',
    2: 'https://api-publica.datajud.cnj.jus.br/api_publica_trt2/_search',
    3: 'https://api-publica.datajud.cnj.jus.br/api_publica_trt3/_search',
    4: 'https://api-publica.datajud.cnj.jus.br/api_publica_trt4/_search',
    5: 'https://api-publica.datajud.cnj.jus.br/api_publica_trt5/_search',
    6: 'https://api-publica.datajud.cnj.jus.br/api_publica_trt6/_search',
    7: 'https://api-publica.datajud.cnj.jus.br/api_publica_trt7/_search',
    8: 'https://api-publica.datajud.cnj.jus.br/api_publica_trt8/_search',
    9: 'https://api-publica.datajud.cnj.jus.br/api_publica_trt9/_search',
    10: 'https://api-publica.datajud.cnj.jus.br/api_publica_trt10/_search',
    11: 'https://api-publica.datajud.cnj.jus.br/api_publica_trt11/_search',
    12: 'https://api-publica.datajud.cnj.jus.br/api_publica_trt12/_search',
    13: 'https://api-publica.datajud.cnj.jus.br/api_publica_trt13/_search',
    14: 'https://api-publica.datajud.cnj.jus.br/api_publica_trt14/_search',
    15: 'https://api-publica.datajud.cnj.jus.br/api_publica_trt15/_search',
    16: 'https://api-publica.datajud.cnj.jus.br/api_publica_trt16/_search',
    17: 'https://api-publica.datajud.cnj.jus.br/api_publica_trt17/_search',
    18: 'https://api-publica.datajud.cnj.jus.br/api_publica_trt18/_search',
    19: 'https://api-publica.datajud.cnj.jus.br/api_publica_trt19/_search',
    20: 'https://api-publica.datajud.cnj.jus.br/api_publica_trt20/_search',
    21: 'https://api-publica.datajud.cnj.jus.br/api_publica_trt21/_search',
    22: 'https://api-publica.datajud.cnj.jus.br/api_publica_trt22/_search',
    23: 'https://api-publica.datajud.cnj.jus.br/api_publica_trt23/_search',
    24: 'https://api-publica.datajud.cnj.jus.br/api_publica_trt24/_search'
  },

  // Justiça Eleitoral (J = 6)
  6: {
    1: 'https://api-publica.datajud.cnj.jus.br/api_publica_tre-ac/_search',
    2: 'https://api-publica.datajud.cnj.jus.br/api_publica_tre-al/_search',
    3: 'https://api-publica.datajud.cnj.jus.br/api_publica_tre-am/_search',
    4: 'https://api-publica.datajud.cnj.jus.br/api_publica_tre-ap/_search',
    5: 'https://api-publica.datajud.cnj.jus.br/api_publica_tre-ba/_search',
    6: 'https://api-publica.datajud.cnj.jus.br/api_publica_tre-ce/_search',
    7: 'https://api-publica.datajud.cnj.jus.br/api_publica_tre-dft/_search',
    8: 'https://api-publica.datajud.cnj.jus.br/api_publica_tre-es/_search',
    9: 'https://api-publica.datajud.cnj.jus.br/api_publica_tre-go/_search',
    10: 'https://api-publica.datajud.cnj.jus.br/api_publica_tre-ma/_search',
    11: 'https://api-publica.datajud.cnj.jus.br/api_publica_tre-mg/_search',
    12: 'https://api-publica.datajud.cnj.jus.br/api_publica_tre-ms/_search',
    13: 'https://api-publica.datajud.cnj.jus.br/api_publica_tre-mt/_search',
    14: 'https://api-publica.datajud.cnj.jus.br/api_publica_tre-pa/_search',
    15: 'https://api-publica.datajud.cnj.jus.br/api_publica_tre-pb/_search',
    16: 'https://api-publica.datajud.cnj.jus.br/api_publica_tre-pe/_search', 
    17: 'https://api-publica.datajud.cnj.jus.br/api_publica_tre-pi/_search',
    18: 'https://api-publica.datajud.cnj.jus.br/api_publica_tre-pr/_search',
    19: 'https://api-publica.datajud.cnj.jus.br/api_publica_tre-rj/_search',
    20: 'https://api-publica.datajud.cnj.jus.br/api_publica_tre-rn/_search',
    21: 'https://api-publica.datajud.cnj.jus.br/api_publica_tre-ro/_search',
    22: 'https://api-publica.datajud.cnj.jus.br/api_publica_tre-rr/_search',
    23: 'https://api-publica.datajud.cnj.jus.br/api_publica_tre-rs/_search',
    24: 'https://api-publica.datajud.cnj.jus.br/api_publica_tre-sc/_search',
    25: 'https://api-publica.datajud.cnj.jus.br/api_publica_tre-se/_search',
    26: 'https://api-publica.datajud.cnj.jus.br/api_publica_tre-sp/_search',
    27: 'https://api-publica.datajud.cnj.jus.br/api_publica_tre-to/_search'
  },

  7: { 0: 'https://api-publica.datajud.cnj.jus.br/api_publica_stm/_search' },

  // Justiça Estadual / dos Estados e DF (J = 8)
  8: {
    1: 'https://api-publica.datajud.cnj.jus.br/api_publica_tjac/_search',
    2: 'https://api-publica.datajud.cnj.jus.br/api_publica_tjal/_search',
    3: 'https://api-publica.datajud.cnj.jus.br/api_publica_tjap/_search',
    4: 'https://api-publica.datajud.cnj.jus.br/api_publica_tjam/_search',
    5: 'https://api-publica.datajud.cnj.jus.br/api_publica_tjba/_search',
    6: 'https://api-publica.datajud.cnj.jus.br/api_publica_tjce/_search',
    7: 'https://api-publica.datajud.cnj.jus.br/api_publica_tjdft/_search',
    8: 'https://api-publica.datajud.cnj.jus.br/api_publica_tjes/_search',
    9: 'https://api-publica.datajud.cnj.jus.br/api_publica_tjgo/_search',
    10: 'https://api-publica.datajud.cnj.jus.br/api_publica_tjma/_search',
    11: 'https://api-publica.datajud.cnj.jus.br/api_publica_tjmt/_search',
    12: 'https://api-publica.datajud.cnj.jus.br/api_publica_tjms/_search',
    13: 'https://api-publica.datajud.cnj.jus.br/api_publica_tjmg/_search',
    14: 'https://api-publica.datajud.cnj.jus.br/api_publica_tjpa/_search',
    15: 'https://api-publica.datajud.cnj.jus.br/api_publica_tjpb/_search',
    16: 'https://api-publica.datajud.cnj.jus.br/api_publica_tjpr/_search',
    17: 'https://api-publica.datajud.cnj.jus.br/api_publica_tjpe/_search',
    18: 'https://api-publica.datajud.cnj.jus.br/api_publica_tjpi/_search',
    19: 'https://api-publica.datajud.cnj.jus.br/api_publica_tjrj/_search',
    20: 'https://api-publica.datajud.cnj.jus.br/api_publica_tjrn/_search',
    21: 'https://api-publica.datajud.cnj.jus.br/api_publica_tjrs/_search',
    22: 'https://api-publica.datajud.cnj.jus.br/api_publica_tjro/_search',
    23: 'https://api-publica.datajud.cnj.jus.br/api_publica_tjrr/_search',
    24: 'https://api-publica.datajud.cnj.jus.br/api_publica_tjsc/_search',
    25: 'https://api-publica.datajud.cnj.jus.br/api_publica_tjse/_search',
    26: 'https://api-publica.datajud.cnj.jus.br/api_publica_tjsp/_search',
    27: 'https://api-publica.datajud.cnj.jus.br/api_publica_tjto/_search'
  },

  // Justiça Militar Estadual (J = 9)
  9: {
    13: 'https://api-publica.datajud.cnj.jus.br/api_publica_tjmmg/_search',
    21: 'https://api-publica.datajud.cnj.jus.br/api_publica_tjmrs/_search',
    26: 'https://api-publica.datajud.cnj.jus.br/api_publica_tjmsp/_search'
  },

  superior: {
    tst: 'https://api-publica.datajud.cnj.jus.br/api_publica_tst/_search',
    tse: 'https://api-publica.datajud.cnj.jus.br/api_publica_tse/_search',
    stm: 'https://api-publica.datajud.cnj.jus.br/api_publica_stm/_search'
  }
};


function obterLink(j, tj) {
    const segmentJ = parseInt(j, 10);
    const tribunalTR = parseInt(tj, 10);
    return urlMap[segmentJ]?.[tribunalTR] || null;
}

const numeroProcessoTest = "";  
consultaProcessual(numeroProcessoTest)
    .then(data => {
        console.log("Dados do processo:", data);
    })
    .catch(err => {
        console.error("Erro na consulta:", err);
    });


*/
module.exports = Processo;