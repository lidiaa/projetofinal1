#language: pt

Funcionalidade: Realizar pesquisa processual
    Como usuário do sistema
    Eu gostaria de fazer uma pesquisa processual
    Para que eu possa obter dados sobre o feito

    Cenário: Pesquisa bem-sucedida
        Dado que o usuário acessou o sistema
        E clicou no campo de pesquisar
        Quando ele informa os autos "0001234-59.2023.8.26.0456"
        E clica no botão de pesquisa
        Então o sistema deve redirecionar para a página de detalhes
        E informar os dados processuais solicitados

    Cenário: Pesquisa de processo com segredo de justiça
        Dado que o usuário acessou o sistema
        E clicou no campo de pesquisar
        Quando ele informa os autos "0005678-34.2022.5.15.0321"
        E clica no botão de pesquisa
        Então o sistema deve redirecionar para a página de detalhes
        E informar os dados processuais solicitados

    Cenário: Acesso a tela do histórico
        Dado que o usuário acessou o sistema
        E clica no botão de histórico
        Então a página deve ser a de histórico
        E clica no botão de voltar
        Então o sistema deve retornar ao index

    Cenário: Consulta de processo do histórico
        Dado que o usuário acessou o sistema
        E clica no botão de histórico
        Então a página deve ser a de histórico
        E clica no botão de consultar novamente o processo "0001234-59.2023.8.26.0456"
        Então o sistema deve retornar a tela de detalhes
        E informar os dados processuais solicitados



