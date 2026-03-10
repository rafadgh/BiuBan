from nike import scrape as scrape_nike
from mercadolibre import scrape as scrape_ml
from save_to_supabase import upsert_products

def run():

    products = []

    print("Scraping Nike...")
    nike_products = scrape_nike()
    products.extend(nike_products)

    print("Scraping MercadoLibre...")
    ml_products = scrape_ml()
    products.extend(ml_products)

    print(f"Total productos recolectados: {len(products)}")

    upsert_products(products)

    print("Productos subidos a Supabase")


if __name__ == "__main__":