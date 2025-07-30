import { test, expect } from '@playwright/test';

test.describe('Validação da Interface de Busca do Yahoo por Input', () => {

  const YAHOO_SEARCH_PAGE_URL = 'https://br.search.yahoo.com';
  const SEARCH_TERM = 'Pacto Soluções';

  const SEARCH_INPUT_SELECTOR = '#yschsp'; 

  const RESULTS_CONTAINER_SELECTOR = '#results'; 

  test('Deve usar o input e a tecla Enter para pesquisar e validar', async ({ page }) => {
    
    await page.goto(YAHOO_SEARCH_PAGE_URL);
    console.log(`Acessando a página de busca: ${YAHOO_SEARCH_PAGE_URL}`);
    const searchInput = page.locator(SEARCH_INPUT_SELECTOR);

    await searchInput.fill(SEARCH_TERM);
    console.log(`Preenchendo a busca com "${SEARCH_TERM}"...`);
    
    await searchInput.press('Enter');
    console.log('Pressionando "Enter" no campo de busca...');

    const resultsContainer = page.locator(RESULTS_CONTAINER_SELECTOR);
    await expect(resultsContainer).toBeVisible({ timeout: 15000 });
    console.log('Aguardando e validando o contêiner de resultados...');

    await expect(page).toHaveTitle(new RegExp(SEARCH_TERM));
    console.log('Validando o título da página...');

    console.log('\n Sucesso! O fluxo de busca via "Enter" foi validado.');
  });
});