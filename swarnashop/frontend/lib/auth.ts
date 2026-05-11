export const decodeRole = (token?: string) => (token?.includes("ADMIN") ? "ADMIN" : "CUSTOMER");
