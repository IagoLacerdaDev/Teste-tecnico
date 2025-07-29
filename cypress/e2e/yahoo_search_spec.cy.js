describe('Validação da Interface de Busca do Yahoo', () => {

  const YAHOO_SEARCH_PAGE_URL = 'https://br.search.yahoo.com';
  const SEARCH_TERM = 'Pacto Soluções';
  const SEARCH_INPUT_SELECTOR = '#yschsp';
  const RESULTS_CONTAINER_SELECTOR = '#results';

  it('Deve usar o input e a tecla Enter para pesquisar e validar o resultado', () => {
    
    cy.log('SETUP: Acessando a página de busca e realizando a pesquisa...');
    cy.visit(YAHOO_SEARCH_PAGE_URL);
    cy.get(SEARCH_INPUT_SELECTOR)
      .should('be.visible')
      .type(`${SEARCH_TERM}{enter}`);

    cy.log('--- INÍCIO DAS VALIDAÇÕES ---');

    // Validação 1
    cy.log('VALIDAÇÃO 1: Verificando se o contêiner de resultados da busca está visível.');
    cy.get(RESULTS_CONTAINER_SELECTOR)
      .should('be.visible');
    cy.log('-> ✅ SUCESSO: O contêiner de resultados foi exibido.');

    // Validação 2
    cy.log('VALIDAÇÃO 2: Verificando se o título da página foi atualizado com o termo pesquisado.');
    cy.title()
      .should('include', SEARCH_TERM);
    cy.log(`-> O título da página contém "${SEARCH_TERM}".`);

    cy.log('--- VALIDAÇÕES CONCLUÍDAS ---');
  });
});