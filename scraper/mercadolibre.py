import requests
from utils import make_product_group

def scrape():

    url = "https://api.mercadolibre.com/sites/MLM/search?q=tenis"

    response = requests.get(url)
    data = response.json()

    products = []

    for item in data["results"][:50]:

        product = {
            "name": item["title"],
            "brand": item.get("brand", "Unknown"),
            "category": "sneakers",
            "color": "",
            "price": item["price"],
            "store": "MercadoLibre",
            "image": item["thumbnail"],
            "url": item["permalink"],
            "product_group": make_product_group("MercadoLibre", item["title"]),
            "discount": 0,
            "available": True
        }

        products.append(product)

    return products