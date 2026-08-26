orders = [{"amount": 74500}, {"amount": 110000}]
valid_orders = [order for order in orders if order["amount"] > 0]
total = sum(order["amount"] for order in valid_orders)
print(f"Revenue: KES {total:,.0f}")