"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Alert, AlertDescription } from './ui/alert';
import {
  Bitcoin,
  TrendingUp,
  TrendingDown,
  Copy,
  Check,
  Loader2,
  AlertCircle,
  Wallet,
} from 'lucide-react';
import { useCryptoPrices } from '../hooks/useCrypto';
import {
  convertUsdToCrypto,
  formatCryptoAmount,
  formatUsdAmount,
  getPaymentWalletAddress,
  shortenAddress,
  SUPPORTED_CRYPTOS,
} from '../utils/crypto';
import type { CryptoSymbol } from '../types';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/auth';
import { toast } from 'sonner';

interface CryptoPaymentGatewayProps {
  amountUsd: number;
  orderId?: string;
  onPaymentInitiated?: (transactionId: string) => void;
  onPaymentComplete?: () => void;
}

export function CryptoPaymentGateway({
  amountUsd,
  orderId,
  onPaymentInitiated,
  onPaymentComplete,
}: CryptoPaymentGatewayProps) {
  const user = useAuthStore(state => state.user);
  const { data: prices, isLoading: pricesLoading } = useCryptoPrices();

  const [selectedCrypto, setSelectedCrypto] = useState<CryptoSymbol>('USDT');
  const [cryptoAmount, setCryptoAmount] = useState<number>(0);
  const [exchangeRate, setExchangeRate] = useState<number>(0);
  const [copied, setCopied] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [transactionHash, setTransactionHash] = useState('');
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'waiting' | 'confirmed' | 'failed'>('idle');

  const walletAddress = getPaymentWalletAddress();

  // Calculate crypto amount when USD amount or selected crypto changes
  useEffect(() => {
    async function calculate() {
      try {
        const { cryptoAmount, exchangeRate } = await convertUsdToCrypto(amountUsd, selectedCrypto);
        setCryptoAmount(cryptoAmount);
        setExchangeRate(exchangeRate);
      } catch (error) {
        console.error('Error calculating crypto amount:', error);
        toast.error('Failed to calculate crypto amount');
      }
    }

    if (amountUsd > 0) {
      calculate();
    }
  }, [amountUsd, selectedCrypto]);

  const handleCopyAddress = async () => {
    await navigator.clipboard.writeText(walletAddress);
    setCopied(true);
    toast.success('Address copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePaymentInitiated = async () => {
    if (!user || !orderId) {
      toast.error('Please log in to continue');
      return;
    }

    if (!transactionHash.trim()) {
      toast.error('Please enter your transaction hash');
      return;
    }

    try {
      setProcessing(true);

      // Create transaction record
      const { data: transaction, error } = await supabase
        .from('transactions')
        .insert({
          order_id: orderId,
          user_id: user.id,
          transaction_hash: transactionHash,
          crypto_currency: selectedCrypto,
          crypto_amount: cryptoAmount,
          usd_amount: amountUsd,
          exchange_rate: exchangeRate,
          wallet_to: walletAddress,
          status: 'pending',
        })
        .select()
        .single();

      if (error) throw error;

      setPaymentStatus('waiting');
      toast.success('Payment submitted! Waiting for confirmation...');

      if (onPaymentInitiated && transaction) {
        onPaymentInitiated(transaction.id);
      }

      // In a real app, you would:
      // 1. Monitor the blockchain for confirmation
      // 2. Update transaction status when confirmed
      // 3. Trigger onPaymentComplete when fully confirmed

      // For demo, auto-confirm after 5 seconds
      setTimeout(() => {
        setPaymentStatus('confirmed');
        toast.success('Payment confirmed!');
        if (onPaymentComplete) {
          onPaymentComplete();
        }
      }, 5000);
    } catch (error: any) {
      console.error('Error processing payment:', error);
      toast.error(error.message || 'Failed to process payment');
      setPaymentStatus('failed');
    } finally {
      setProcessing(false);
    }
  };

  const selectedPrice = prices?.find(p => p.symbol === selectedCrypto);

  return (
    <div className="space-y-6">
      {/* Crypto Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bitcoin className="w-5 h-5" />
            Select Cryptocurrency
          </CardTitle>
          <CardDescription>
            Choose your preferred payment method
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedCrypto} onValueChange={(value) => setSelectedCrypto(value as CryptoSymbol)}>
            <TabsList className="grid grid-cols-5 lg:grid-cols-10 gap-2">
              {Object.keys(SUPPORTED_CRYPTOS).map((symbol) => {
                const price = prices?.find(p => p.symbol === symbol);
                return (
                  <TabsTrigger
                    key={symbol}
                    value={symbol}
                    className="flex flex-col items-center gap-1 h-auto py-3"
                  >
                    <span className="font-bold">{symbol}</span>
                    {price && (
                      <span className="text-xs text-muted-foreground">
                        ${price.price_usd.toLocaleString()}
                      </span>
                    )}
                  </TabsTrigger>
                );
              })}
            </TabsList>
          </Tabs>

          {selectedPrice && (
            <div className="mt-4 p-4 bg-muted rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Current Price</p>
                  <p className="text-2xl font-bold">{formatUsdAmount(selectedPrice.price_usd)}</p>
                </div>
                <Badge
                  variant={selectedPrice.change_24h >= 0 ? 'default' : 'destructive'}
                  className="gap-1"
                >
                  {selectedPrice.change_24h >= 0 ? (
                    <TrendingUp className="w-3 h-3" />
                  ) : (
                    <TrendingDown className="w-3 h-3" />
                  )}
                  {selectedPrice.change_24h.toFixed(2)}%
                </Badge>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Payment Details */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Details</CardTitle>
          <CardDescription>
            Send the exact amount to complete your purchase
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 p-4 bg-muted rounded-lg">
            <div>
              <p className="text-sm text-muted-foreground">Amount in USD</p>
              <p className="text-xl font-bold">{formatUsdAmount(amountUsd)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Amount in {selectedCrypto}</p>
              <p className="text-xl font-bold">
                {formatCryptoAmount(cryptoAmount, selectedCrypto)} {selectedCrypto}
              </p>
            </div>
          </div>

          <Alert>
            <Wallet className="w-4 h-4" />
            <AlertDescription>
              <p className="font-medium mb-2">Payment Address</p>
              <div className="flex items-center gap-2">
                <code className="flex-1 p-2 bg-background rounded text-sm break-all">
                  {walletAddress}
                </code>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleCopyAddress}
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
            </AlertDescription>
          </Alert>

          <div className="space-y-2">
            <label className="text-sm font-medium">Transaction Hash (after sending payment)</label>
            <input
              type="text"
              placeholder="0x..."
              value={transactionHash}
              onChange={(e) => setTransactionHash(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
              disabled={paymentStatus === 'waiting' || paymentStatus === 'confirmed'}
            />
          </div>

          {paymentStatus === 'idle' && (
            <Button
              className="w-full"
              size="lg"
              onClick={handlePaymentInitiated}
              disabled={processing || !transactionHash.trim()}
            >
              {processing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                'I\'ve Sent the Payment'
              )}
            </Button>
          )}

          {paymentStatus === 'waiting' && (
            <Alert>
              <Loader2 className="w-4 h-4 animate-spin" />
              <AlertDescription>
                Waiting for blockchain confirmation... This may take a few minutes.
              </AlertDescription>
            </Alert>
          )}

          {paymentStatus === 'confirmed' && (
            <Alert className="border-green-500 bg-green-50">
              <Check className="w-4 h-4 text-green-600" />
              <AlertDescription className="text-green-600">
                Payment confirmed! Your order is being processed.
              </AlertDescription>
            </Alert>
          )}

          {paymentStatus === 'failed' && (
            <Alert variant="destructive">
              <AlertCircle className="w-4 h-4" />
              <AlertDescription>
                Payment verification failed. Please contact support.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      <Alert>
        <AlertCircle className="w-4 h-4" />
        <AlertDescription>
          <strong>Important:</strong> Please send the exact amount shown above. Network fees are not included.
          After sending, paste your transaction hash above and click the button.
        </AlertDescription>
      </Alert>
    </div>
  );
}
