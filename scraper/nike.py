import requests
from utils import make_product_group
from save_to_supabase import upsert_products

def scrape():

    url = "https://api.nike.com/cic/browse/v2?queryid=products&country=mx&language=es-419"

    response = requests.get(url)
    data = response.json()

    products = []

    for item in data.get("data", {}).get("products", []):

        name = item.get("title")
        price = item.get("price", {}).get("currentPrice", 0)

        images = item.get("images", {})
        image = images.get("portraitURL") or images.get("squarishURL")

        product = {
            "name": name,
            "brand": "Nike",
            "category": "sneakers",
            "color": "",
            "price": price,
            "store": "Nike",
            "image": image,
            "url": "https://nike.com",
            "product_group": make_product_group("Nike", name),
            "discount": 0,
            "available": True
        }

        products.append(product)

    upsert_products(products)

if __name__ == "__main__":
    scrape()
