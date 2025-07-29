import logging
import time
from contextlib import contextmanager
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import StaleElementReferenceException

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

UOL_URL = "https://www.uol.com.br/" 

PRIVACY_LINK_SELECTOR = (By.LINK_TEXT, "Segurança e privacidade")
COOKIE_BUTTON_SELECTOR = (By.ID, "didomi-notice-agree-button")
UPDATE_DATE_SELECTOR = (By.XPATH, "//strong[contains(text(), 'Atualização:')]/parent::p")


@contextmanager
def config_driver():
    driver = webdriver.Chrome()
    try:
        yield driver
    finally:
        logging.info("Fechando o navegador.")
        driver.quit()

def handle_uol_cookie_consent(driver, timeout=10):
    try:
        wait = WebDriverWait(driver, timeout)
        accept_button = wait.until(EC.element_to_be_clickable(COOKIE_BUTTON_SELECTOR))
        accept_button.click()
        logging.info("Banner de consentimento do UOL foi aceito.")
    except Exception:
        logging.warning("Banner de consentimento não encontrado ou não foi necessário.")

def test_validacao_ultima_atualizacao():
    with config_driver() as driver:
        logging.info(f"Acessando {UOL_URL}")
        driver.get(UOL_URL)
        driver.maximize_window()
        handle_uol_cookie_consent(driver)
        logging.info("Rolando até o final da página...")
        driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
        time.sleep(1)
        MAX_ATTEMPTS = 3
        for attempt in range(MAX_ATTEMPTS):
            try:
                logging.info(f"Tentativa {attempt + 1} de {MAX_ATTEMPTS} para clicar no link...")
                wait = WebDriverWait(driver, 10)
                privacy_link = wait.until(EC.element_to_be_clickable(PRIVACY_LINK_SELECTOR))
                driver.execute_script("arguments[0].click();", privacy_link)
                logging.info("Clique bem-sucedido! Saindo do loop de tentativas.")
                break
            except StaleElementReferenceException:
                logging.warning("Elemento 'stale' detectado. A página mudou. Tentando novamente em 1 segundo...")
                time.sleep(1)
        else:
            raise Exception(f"Não foi possível clicar no link de privacidade após {MAX_ATTEMPTS} tentativas.")
        
        wait = WebDriverWait(driver, 10)
        logging.info("Buscando a data de atualização na nova página...")
        update_paragraph = wait.until(EC.visibility_of_element_located(UPDATE_DATE_SELECTOR))
        
        full_text = update_paragraph.text
        update_date = full_text.split(":")[-1].strip()

        print("\n--- RESULTADO ---")
        print(f"Data da ultima atualizacao: {update_date}")
        print("-----------------\n")
        
        
        logging.info("Teste concluído com sucesso!")


if __name__ == "__main__":
    test_validacao_ultima_atualizacao()