import os
from datetime import datetime, timezone
from supabase import create_client


def get_client():
    url = os.environ["SUPABASE_URL"]
    key = os.environ["SUPABASE_SERVICE_ROLE_KEY"]
    return create_client(url, key)


def upsert_products(products):
    if not products:
        print("No hay productos para subir.")
        return

    supabase = get_client()
    response = supabase.table("products").upsert(products).execute()
    print("Productos subidos:", len(products))

    # Guardar historial de precios para cada producto
    _save_price_history(supabase, products)

    return response


def _save_price_history(supabase, products):
    """Inserta un registro de precio por cada producto en price_history."""
    now = datetime.now(timezone.utc).isoformat()
    records = []

    for p in products:
        product_id = p.get("id")
        price = p.get("price")
        if not product_id or price is None:
            continue
        records.append({
            "product_id": str(product_id),
            "price": float(price),
            "original_price": float(p["original_price"]) if p.get("original_price") else None,
            "recorded_at": now,
        })

    if not records:
        return

    try:
        supabase.table("price_history").insert(records).execute()
        print(f"Historial de precios guardado: {len(records)} registros")
    except Exception as e:
        print(f"Error al guardar historial de precios: {e}")
