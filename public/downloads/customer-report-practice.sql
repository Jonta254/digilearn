-- Fictional, read-only fixture: paste the entire statement into a SQL editor.
-- Expected rows (paid_orders, missing_amounts, known_paid_total):
-- Amina (1, 0, 120), Brian (1, 1, 0), Chen (0, 0, 0).
-- Zero known total does not establish that an unknown amount was zero.
WITH customers(id, name) AS (
  VALUES (1, 'Amina'), (2, 'Brian'), (3, 'Chen')
), orders(id, customer_id, amount, status) AS (
  VALUES (101, 1, 120, 'paid'), (102, 1, 80, 'pending'),
         (103, 2, NULL, 'paid')
)
SELECT c.name, COUNT(o.id) AS paid_orders,
       COUNT(o.id) - COUNT(o.amount) AS missing_amounts,
       COALESCE(SUM(o.amount), 0) AS known_paid_total
FROM customers AS c
LEFT JOIN orders AS o
  ON o.customer_id = c.id AND o.status = 'paid'
GROUP BY c.id, c.name
ORDER BY c.id;
