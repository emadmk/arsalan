export function formatUsdAmount(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatCryptoAmount(amount: number, currency: string): string {
  const decimals = currency === 'BTC' ? 8 : currency === 'ETH' ? 6 : 2;
  return `${amount.toFixed(decimals)} ${currency}`;
}

export function shortenAddress(address: string, chars = 4): string {
  if (!address) return '';
  return `${address.substring(0, chars + 2)}...${address.substring(address.length - chars)}`;
}

export function getCryptoIcon(currency: string): string {
  const icons: Record<string, string> = {
    BTC: '₿',
    ETH: 'Ξ',
    USDT: '₮',
    USDC: '$',
  };
  return icons[currency] || '₿';
}
