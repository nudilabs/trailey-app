const ENV = {
  ALCHEMY_ID: process.env.ALCHEMY_ID || '',
  NEXTAUTH_URL: process.env.NEXTAUTH_URL || '',
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET || '',
  NEXT_PUBLIC_TX_LIMIT: process.env.NEXT_PUBLIC_TX_LIMIT || 20000,
  NEXT_PUBLIC_REVALIDATE_TIME:
    Number(process.env.NEXT_PUBLIC_REVALIDATE_TIME) || 5000
};

export default ENV;
