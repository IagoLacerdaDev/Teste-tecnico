import { test, expect } from '@playwright/test';

const UOL_URL = 'https://www.uol.com.br/';
const COOKIE_BUTTON_SELECTOR = '#didomi-notice-agree-button';
const UPDATE_DATE_SELECTOR = 'p:has-text("Atualização:")';

test.describe('Extração de Dados do UOL', () => {
  
  test('Deve encontrar a data de atualização da política de privacidade', async ({ page }) => {
    
    await page.goto(UOL_URL);
    console.log(`Acessando ${UOL_URL}`);

    try {
      await page.locator(COOKIE_BUTTON_SELECTOR).click({ timeout: 5000 });
      console.log(' Banner de consentimento do UOL foi aceito.');
    } catch (error) {
      console.log(' Banner de consentimento não encontrado ou não foi necessário.');
    }

    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    console.log(' Rolando até o final da página...');

    const privacyLink = page.getByRole('link', { name: 'Segurança e privacidade' }).last();
    console.log(" Link 'Segurança e privacidade' encontrado. Clicando...");
    await privacyLink.click();

    
    console.log('Buscando a data de atualização na nova página...');
    const updateParagraph = page.locator(UPDATE_DATE_SELECTOR);

    await expect(updateParagraph).toBeVisible();

    const fullText = await updateParagraph.textContent();
    const updateDate = fullText?.split(':')[1]?.trim(); 

    console.log("\n--- RESULTADO UOL ---");
    console.log(`Data da ultima atualizacao: ${updateDate}`);
    console.log("-----------------\n");

    expect(updateDate).toBeTruthy(); 
  });
});