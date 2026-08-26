export function HeroCodeDemo() {
  return (
    <figure className="lesson-proof" aria-labelledby="hero-demo-caption">
      <figcaption id="hero-demo-caption">
        <span>sales-summary.py</span>
        <strong><span aria-hidden="true">✓</span> Test passed</strong>
      </figcaption>
      <pre aria-label="Python example"><code>{`orders = [{"amount": 74500}, {"amount": 110000}]
valid_orders = [order for order in orders if order["amount"] > 0]
total = sum(order["amount"] for order in valid_orders)
print(f"Revenue: KES {total:,.0f}")`}</code></pre>
      <section className="preview-output" aria-label="Program output">
        <span>Expected output</span>
        <samp>Revenue: KES 184,500</samp>
        <small>2 valid orders · output verified</small>
      </section>
      <ul aria-label="Example qualities"><li>Readable source code</li><li>Verified output</li><li>Downloadable example</li></ul>
    </figure>
  );
}