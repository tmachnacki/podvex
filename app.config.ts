export const config = {
  domain:
    process.env.NODE_ENV === "production"
      ? process.env.NEXT_PUBLIC_URL
      : "http://localhost:3000",
};
