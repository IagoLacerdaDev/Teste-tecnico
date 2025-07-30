// Listener global para ignorar erros do script da página do UOL
Cypress.on('uncaught:exception', (err, runnable) => {
  return false;
});

describe('Validação do item "Segurança e privacidade" do UOL', () => {

  const UOL_URL = 'https://www.uol.com.br/';
  const PRIVACY_LINK_TEXT = 'Segurança e privacidade';

  it('Deve validar se a página informa quando foi atualizada', () => {
    
    cy.log('SETUP: Acessando a home do UOL e navegando para a página de privacidade...');
    cy.visit(UOL_URL);

    cy.get('body').then(($body) => {
      if ($body.find('#didomi-notice-agree-button').length) {
        cy.get('#didomi-notice-agree-button').click();
      }
    });
    cy.scrollTo('bottom');
    cy.contains(PRIVACY_LINK_TEXT).click();
    cy.origin('https://sobreuol.noticias.uol.com.br', () => {

      cy.log('--- INÍCIO DA VALIDAÇÃO ---');
      cy.log('VALIDAÇÃO: Buscando o parágrafo que deve conter a data de atualização...');

      cy.get('p:contains("Atualização:")')
        .should('be.visible')
        .then(($paragraph) => {
          cy.log(`Elemento encontrado: "${$paragraph.text().trim()}"`);
          
          expect($paragraph.text()).to.contain('Atualização:');

          const updateDate = $paragraph.text().split(':')[1].trim();

          cy.log('-> A página contém a informação de quando foi atualizada.');
          cy.log(`-> Data encontrada: ${updateDate}`);
          cy.log('--- FIM DA VALIDAÇÃO ---');

          cy.wrap($paragraph)
            .scrollIntoView()
            .invoke('attr', 'style', 'border: 4px solid green; background-color: #f2fff2; padding: 10px; border-radius: 8px;');
        });
    });
  });
});