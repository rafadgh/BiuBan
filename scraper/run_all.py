from nike import scrape as scrape_nike
from save_to_supabase import upsert_products

def run():
    products = []

    print("Scraping Nike...")
    products.extend(scrape_nike())

    print(f"Total productos recolectados: {len(products)}")

    upsert_products(products)

    print("Productos subidos a Supabase")


if __name__ == "__main__":
    run()