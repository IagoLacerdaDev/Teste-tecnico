import logging
from contextlib import contextmanager
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys # Importante: importar a classe Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

YAHOO_SEARCH_PAGE_URL = "https://br.search.yahoo.com" 
TERMO_DE_BUSCA = "Pacto Soluções"

SEARCH_INPUT_SELECTOR = (By.ID, "yschsp")
RESULTS_CONTAINER_SELECTOR = (By.ID, "results")

@contextmanager
def config_driver():
    driver = webdriver.Chrome()
    try:
        yield driver
    finally:
        logging.info("Fechando o navegador.")
        driver.quit()

def teste_interface_de_busca_yahoo():
    with config_driver() as driver:
        driver.get(YAHOO_SEARCH_PAGE_URL)
        logging.info(f"Acessando a página de busca: {YAHOO_SEARCH_PAGE_URL}")

        wait = WebDriverWait(driver, 15)

       
        search_input = wait.until(EC.visibility_of_element_located(SEARCH_INPUT_SELECTOR))
        
        search_input.send_keys(TERMO_DE_BUSCA)
        logging.info(f"Preenchendo o campo de busca com '{TERMO_DE_BUSCA}'...")
   
        search_input.send_keys(Keys.RETURN)
        logging.info("Pressionando 'Enter' para submeter a busca...")

        wait.until(EC.visibility_of_element_located(RESULTS_CONTAINER_SELECTOR))
        logging.info("Aguardando e validando o contêiner de resultados...")
        
        wait.until(EC.title_contains(TERMO_DE_BUSCA))
        logging.info("Validando o título da página...")
        
        logging.info('\nSucesso! O fluxo de busca via "Enter" foi validado.')

if __name__ == "__main__":
    teste_interface_de_busca_yahoo()