// Single price for unlocking a paid course, in Kenyan shillings.
// Reference prices are stored as KES integers. No payment provider is active.
// ~KES 199 is roughly US$1.50 at typical rates — a deliberate micro-price.
// Change this one constant to reprice; the server charges exactly this value.
export const COURSE_PRICE_KES = 199;

export const formatKES = (n: number) => `KES ${n.toLocaleString("en-KE")}`;
