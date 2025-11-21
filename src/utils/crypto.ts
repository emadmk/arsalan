import axios from 'axios';
import type { CryptoSymbol, CryptoPrice } from '../types';

// Supported cryptocurrencies with their CoinGecko IDs
export const SUPPORTED_CRYPTOS: Record<CryptoSymbol, { name: string; coinGeckoId: string; icon: string }> = {
  BTC: { name: 'Bitcoin', coinGeckoId: 'bitcoin', icon: '₿' },
  ETH: { name: 'Ethereum', coinGeckoId: 'ethereum', icon: 'Ξ' },
  USDT: { name: 'Tether', coinGeckoId: 'tether', icon: '₮' },
  USDC: { name: 'USD Coin', coinGeckoId: 'usd-coin', icon: '$' },
  BNB: { name: 'BNB', coinGeckoId: 'binancecoin', icon: 'BNB' },
  SOL: { name: 'Solana', coinGeckoId: 'solana', icon: 'SOL' },
  ADA: { name: 'Cardano', coinGeckoId: 'cardano', icon: 'ADA' },
  MATIC: { name: 'Polygon', coinGeckoId: 'matic-network', icon: 'MATIC' },
  DOT: { name: 'Polkadot', coinGeckoId: 'polkadot', icon: 'DOT' },
  AVAX: { name: 'Avalanche', coinGeckoId: 'avalanche-2', icon: 'AVAX' },
};

// Cache for crypto prices (5 minutes)
const priceCache = new Map<string, { price: CryptoPrice; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Fetch current crypto prices from CoinGecko
 */
export async function fetchCryptoPrices(): Promise<CryptoPrice[]> {
  try {
    const ids = Object.values(SUPPORTED_CRYPTOS)
      .map(crypto => crypto.coinGeckoId)
      .join(',');

    const response = await axios.get(
      `https://api.coingecko.com/api/v3/simple/price`,
      {
        params: {
          ids,
          vs_currencies: 'usd',
          include_24hr_change: true,
        },
      }
    );

    const prices: CryptoPrice[] = Object.entries(SUPPORTED_CRYPTOS).map(([symbol, crypto]) => {
      const data = response.data[crypto.coinGeckoId];
      return {
        symbol: symbol as CryptoSymbol,
        name: crypto.name,
        price_usd: data?.usd || 0,
        change_24h: data?.usd_24h_change || 0,
        icon: crypto.icon,
      };
    });

    // Update cache
    prices.forEach(price => {
      priceCache.set(price.symbol, { price, timestamp: Date.now() });
    });

    return prices;
  } catch (error) {
    console.error('Error fetching crypto prices:', error);

    // Return cached prices if available
    const cachedPrices: CryptoPrice[] = [];
    priceCache.forEach(({ price }) => cachedPrices.push(price));

    if (cachedPrices.length > 0) {
      return cachedPrices;
    }

    // Fallback prices (should be replaced with actual API in production)
    return getFallbackPrices();
  }
}

/**
 * Get price for a specific cryptocurrency
 */
export async function getCryptoPrice(symbol: CryptoSymbol): Promise<number> {
  // Check cache first
  const cached = priceCache.get(symbol);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.price.price_usd;
  }

  // Fetch fresh prices
  const prices = await fetchCryptoPrices();
  const price = prices.find(p => p.symbol === symbol);
  return price?.price_usd || 0;
}

/**
 * Convert USD to crypto amount
 */
export async function convertUsdToCrypto(
  usdAmount: number,
  cryptoSymbol: CryptoSymbol
): Promise<{ cryptoAmount: number; exchangeRate: number }> {
  const price = await getCryptoPrice(cryptoSymbol);

  if (price === 0) {
    throw new Error(`Unable to get price for ${cryptoSymbol}`);
  }

  const cryptoAmount = usdAmount / price;

  return {
    cryptoAmount,
    exchangeRate: price,
  };
}

/**
 * Convert crypto to USD amount
 */
export function convertCryptoToUsd(
  cryptoAmount: number,
  exchangeRate: number
): number {
  return cryptoAmount * exchangeRate;
}

/**
 * Format crypto amount with appropriate decimals
 */
export function formatCryptoAmount(amount: number, symbol: CryptoSymbol): string {
  // Stablecoins get 2 decimals, others get 6
  const decimals = ['USDT', 'USDC'].includes(symbol) ? 2 : 6;
  return amount.toFixed(decimals);
}

/**
 * Format USD amount
 */
export function formatUsdAmount(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Fallback prices (for development/demo)
 */
function getFallbackPrices(): CryptoPrice[] {
  return [
    { symbol: 'BTC', name: 'Bitcoin', price_usd: 45000, change_24h: 2.5, icon: '₿' },
    { symbol: 'ETH', name: 'Ethereum', price_usd: 2800, change_24h: 3.2, icon: 'Ξ' },
    { symbol: 'USDT', name: 'Tether', price_usd: 1.00, change_24h: 0.01, icon: '₮' },
    { symbol: 'USDC', name: 'USD Coin', price_usd: 1.00, change_24h: 0.00, icon: '$' },
    { symbol: 'BNB', name: 'BNB', price_usd: 320, change_24h: 1.8, icon: 'BNB' },
    { symbol: 'SOL', name: 'Solana', price_usd: 98, change_24h: -0.5, icon: 'SOL' },
    { symbol: 'ADA', name: 'Cardano', price_usd: 0.48, change_24h: 1.2, icon: 'ADA' },
    { symbol: 'MATIC', name: 'Polygon', price_usd: 0.85, change_24h: 2.1, icon: 'MATIC' },
    { symbol: 'DOT', name: 'Polkadot', price_usd: 7.2, change_24h: 0.8, icon: 'DOT' },
    { symbol: 'AVAX', name: 'Avalanche', price_usd: 38, change_24h: 1.5, icon: 'AVAX' },
  ];
}

/**
 * Get the configured wallet address for receiving payments
 */
export function getPaymentWalletAddress(): string {
  const address = import.meta.env.VITE_CRYPTO_WALLET_ADDRESS;

  if (!address) {
    console.warn('Payment wallet address not configured. Please set VITE_CRYPTO_WALLET_ADDRESS in .env file.');
    return '0x0000000000000000000000000000000000000000'; // Placeholder
  }

  return address;
}

/**
 * Validate Ethereum-style address
 */
export function isValidEthAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

/**
 * Shorten address for display (0x1234...5678)
 */
export function shortenAddress(address: string, chars = 4): string {
  if (!address) return '';
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
}
