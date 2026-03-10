import random
from utils import make_product_group
from save_to_supabase import upsert_products

def scrape():
    products = []

    for i in range(1000):
        price = random.randint(1800, 3500)

        product = {
            "name": f"Nike Air Force {i}",
            "brand": "Nike",
            "category": "sneakers",
            "color": "white",
            "price": price,
            "store": "Nike",
            "image": "https://static.nike.com/a/images/t_default/air-force-1.png",
            "url": "https://www.nike.com/mx/",
            "product_group": make_product_group("Nike", f"Air Force {i}"),
            "discount": 0,
            "available": True
        }

        products.append(product)

    return products


if __name__ == "__main__":
    products = scrape()
    upsert_products(products)