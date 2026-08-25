CREATE TABLE service_orders (
  order_id INTEGER PRIMARY KEY,
  region VARCHAR(40) NOT NULL,
  service_name VARCHAR(80) NOT NULL,
  total_kes INTEGER CHECK (total_kes >= 0),
  order_date DATE NOT NULL
);

SELECT region, SUM(total_kes) AS revenue_kes
FROM service_orders
GROUP BY region
ORDER BY revenue_kes DESC;
