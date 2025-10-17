const dadosProcesso = {
            "0001234-59.2023.8.26.0456": {
                numeroProcesso: "0001234-59.2023.8.26.0456",
                classe: "Ação de Cobrança",
                formato: "Eletrônico",
                orgao: "Justiça Estadual - TJSP",
                distribuicao: "2023-03-15",
                atualizacao: "2023-03-20"
            },
            "0005678-34.2022.5.15.0321": {
                numeroProcesso: "0005678-34.2022.5.15.0321",
                classe: "Segredo de justiça - Resolução Nº 121 de 05/10/2010 (Art. 1º, parágrafo único)",
                formato: "Segredo de justiça - Resolução Nº 121 de 05/10/2010 (Art. 1º, parágrafo único)",
                orgao: "Segredo de justiça - Resolução Nº 121 de 05/10/2010 (Art. 1º, parágrafo único)",
                distribuicao: "Segredo de justiça - Resolução Nº 121 de 05/10/2010 (Art. 1º, parágrafo único)",
                atualizacao: "Segredo de justiça - Resolução Nº 121 de 05/10/2010 (Art. 1º, parágrafo único)"
            },
            "0009876-02.2021.4.01.0067": {
                numeroProcesso: "0009876-02.2021.4.01.0067",
                classe: "Mandado de Segurança",
                formato: "Eletrônico",
                orgao: "Justiça Federal - TRF1",
                distribuicao: "2021-06-11",
                atualizacao: "2021-06-18"
            },
            "0003456-77.2024.8.19.0302": {
                numeroProcesso: "0003456-77.2024.8.19.0302",
                classe: "Ação de Indenização",
                formato: "Eletrônico",
                orgao: "Justiça Estadual - TJRJ",
                distribuicao: "2024-01-22",
                atualizacao: "2024-01-29"
            },
            "0012345-16.2020.6.27.0008": {
                numeroProcesso: "0012345-16.2020.6.27.0008",
                classe: "Representação Eleitoral",
                formato: "Eletrônico",
                orgao: "Justiça Eleitoral - TRE/RO",
                distribuicao: "2020-08-19",
                atualizacao: "2020-08-21"
            },
            "0002222-81.2023.3.00.0000": {
                numeroProcesso: "0002222-81.2023.3.00.0000",
                classe: "Recurso Especial",
                formato: "Eletrônico",
                orgao: "Superior Tribunal de Justiça",
                distribuicao: "2023-05-03",
                atualizacao: "2023-05-10"
            },
            "0008765-45.2025.8.12.0777": {
                numeroProcesso: "0008765-45.2025.8.12.0777",
                classe: "Ação de Família",
                formato: "Eletrônico",
                orgao: "Justiça Estadual - TJMS",
                distribuicao: "2025-02-17",
                atualizacao: "2025-02-20"
            },
            "0004321-90.2022.5.02.0089": {
                numeroProcesso: "0004321-90.2022.5.02.0089",
                classe: "Execução Trabalhista",
                formato: "Eletrônico",
                orgao: "Justiça do Trabalho - TRT2",
                distribuicao: "2022-04-10",
                atualizacao: "2022-04-13"
            },
            "0006789-13.2021.4.05.0034": {
                numeroProcesso: "0006789-13.2021.4.05.0034",
                classe: "Ação Previdenciária",
                formato: "Eletrônico",
                orgao: "Justiça Federal - TRF5",
                distribuicao: "2021-11-25",
                atualizacao: "2021-12-01"
            },
            "0000011-27.2024.9.26.0003": {
                numeroProcesso: "0000011-27.2024.9.26.0003",
                classe: "Ação Penal Militar",
                formato: "Eletrônico",
                orgao: "Justiça Militar Estadual - TJM/SP",
                distribuicao: "2024-07-07",
                atualizacao: "2024-07-10"
            }
        };


//armazenar o histórico dos processos pesquisados no localStorage
const STORAGE_KEY = "historico"; 

function getHistorico() {
    const historicoJSON = localStorage.getItem(STORAGE_KEY);
    return historicoJSON ? JSON.parse(historicoJSON) : [];
}

function salvarNoHistorico(numero) {
    let historico = getHistorico();
    const numeroLimpo = numero.trim();

    if (!numeroLimpo) return;
    historico = historico.filter(item => item !== numeroLimpo);
    historico.unshift(numeroLimpo); // o último vai para o topo da lista

    const maxItems = 10; //limite do histórico
    if (historico.length > maxItems) {
        historico = historico.slice(0, maxItems);
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(historico));
}

function limparHistorico() { //ref botão de apagar o histórico
    localStorage.removeItem(STORAGE_KEY);
}


//após o carregamento da página
document.addEventListener("DOMContentLoaded", function () {

    const numeroProcessoInput = document.getElementById("numero-processo");

    if (numeroProcessoInput) {
        numeroProcessoInput.addEventListener('input', function(event) {
            let valor = event.target.value.replace(/\D/g, ''); //regex para tirar os pontos e traços do número do feito
        
            //é para a formatação do input; se a pessoa for digitando apenas números, ele automaticamente insere os pontos e traço nos locais corretos  
            if (valor.length <= 7) {
                valor = valor.replace(/(\d{7})(\d{0,2})/, '$1-$2');
            } else if (valor.length <= 11) {
                valor = valor.replace(/(\d{7})(\d{2})(\d{0,4})/, '$1-$2.$3');
            } else if (valor.length <= 16) {
                valor = valor.replace(/(\d{7})(\d{2})(\d{4})(\d{0,1})/, '$1-$2.$3.$4');
            } else if (valor.length <= 18) {
                valor = valor.replace(/(\d{7})(\d{2})(\d{4})(\d{1})(\d{0,2})/, '$1-$2.$3.$4.$5');
            } else {
                valor = valor.replace(/(\d{7})(\d{2})(\d{4})(\d{1})(\d{2})(\d{0,4})/, '$1-$2.$3.$4.$5.$6');
            }
        
            //é o limite do campo input, vez que, com a formatação, terá exatos 25 caracteres (NNNNNNN-DD.AAAA.J.TR.OOOO)
            if (valor.length > 25) {
                valor = valor.substring(0, 25);
            }

            event.target.value = valor;
        });
    }

// index.html - parte da consulta processual
    const formConsulta = document.getElementById("form-consulta");
    const alertaDiv = document.getElementById('alerta-processo');
    
    if (formConsulta) {
        
        formConsulta.addEventListener("submit", function (e) { //função de enviar os dados
            e.preventDefault(); 
    
            if (numeroProcessoInput && numeroProcessoInput.value) {
                const numeroProcesso = numeroProcessoInput.value.trim();
                
                //valida o número dos autos; se não tiver 25 caracteres, não envia
                if (numeroProcesso.length !== 25) {
                    alertaDiv.style.display = 'block'; //exibe a div
                    //alert('Por favor, digite o número do processo completo, no formato 0000000-00.0000.0.00.0000 (25 caracteres).');
                    numeroProcessoInput.focus();
                    return;
                }

                //verifica se o número do processo existe no mock de dados
                const processoExistente = dadosProcesso[numeroProcesso];
                if (!processoExistente) {
                    alert("Processo inexistente!");
                    return; 
                }

                //anotação no histórico do processo digitado
                salvarNoHistorico(numeroProcesso); 
                
                //encaminha para o arquivo detalhes.html
                window.location.href = "detalhes.html?numero-processo=" + numeroProcesso;
            }
        });
    }


//histórico.html
    const listaHistorico = document.getElementById("lista-historico");
    const btnLimparHistorico = document.getElementById("btn-limpar-historico");

    if (listaHistorico) {
        
        function carregarHistorico() {
            let historico = getHistorico(); //recebe o histórico salvo
            listaHistorico.innerHTML = ""; 
    
            if (historico.length === 0) { //se for vazio, ainda não tem histórico
                listaHistorico.innerHTML = "<li>Nenhum processo consultado.</li>";
                if (btnLimparHistorico) {
                    btnLimparHistorico.disabled = true; //botão de limpar desativado, pois a lista está vazia
                }
            } else {
                if (btnLimparHistorico) {
                    btnLimparHistorico.disabled = false;
                }
                
                historico.forEach(processo => {
                    const item = document.createElement("li");
                    item.innerHTML = `
                        <span>Processo: ${processo}</span>
                        <a href="detalhes.html?numero-processo=${processo}" class="button-reconsultar">Consultar Novamente</a>
                    `;
                    listaHistorico.appendChild(item);
                });
            }
        }
    
        //ao abrir a página, carrega o histórico
        carregarHistorico();
    
        if (btnLimparHistorico) {
            btnLimparHistorico.addEventListener("click", function () {
                if (confirm('Tem certeza que deseja limpar todo o histórico?')) {
                    limparHistorico(); 
                    carregarHistorico(); 
                }
            });
        }
    }
    

    //detalhes.html
    function getUrlParameter(name) {
        name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
        const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
        const results = regex.exec(location.search);
        return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
    }

    if (window.location.pathname.includes("detalhes.html")) {
        const numeroProcessoDetalhes = document.getElementById("numero-processo-detalhes");
        const orgao = document.getElementById("orgao");
        const classe = document.getElementById("classe");
        const formato = document.getElementById("formato");
        const distribuicao = document.getElementById("distribuicao");
        const atualizacao = document.getElementById("atualizacao");
        const btnVoltar = document.getElementById("btn-voltar");
        const numeroProcessoNaURL = getUrlParameter('numero-processo');
        
        
        const processo = dadosProcesso[numeroProcessoNaURL];

        if (processo) {
            numeroProcessoDetalhes.textContent = processo.numeroProcesso;
            classe.textContent = processo.classe;
            formato.textContent = processo.formato;
            orgao.textContent = processo.orgao;
            distribuicao.textContent = processo.distribuicao;
            atualizacao.textContent = processo.atualizacao;
        } else {
            
        }
        
        //botão de voltar ao início
        if (btnVoltar) {
            btnVoltar.addEventListener("click", function () {
                window.history.back();
            });
        }
    }
});