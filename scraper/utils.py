from slugify import slugify


def to_float_price(value: str):
    if not value:
        return None
    cleaned = (
        value.replace("$", "")
        .replace(",", "")
        .replace("MXN", "")
        .replace("mxn", "")
        .strip()
    )
    try:
        return float(cleaned)
    except ValueError:
        return None


def make_product_group(brand: str, name: str, color: str = "") -> str:
    base = f"{brand} {name} {color}".strip()
    return slugify(base)


def infer_discount(current_price, original_price):
    if not current_price or not original_price or original_price <= 0:
        return 0.0
    if original_price <= current_price:
        return 0.0
    return round(((original_price - current_price) / original_price) * 100, 2)