import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Loader2 } from 'lucide-react';

interface CryptoPaymentGatewayProps {
  amountUsd: number;
  onPaymentComplete: () => void;
}

export function CryptoPaymentGateway({ amountUsd, onPaymentComplete }: CryptoPaymentGatewayProps) {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);

    // Simulate payment processing
    setTimeout(() => {
      setLoading(false);
      onPaymentComplete();
    }, 2000);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Cryptocurrency Payment</CardTitle>
        <CardDescription>
          Pay securely with your preferred cryptocurrency
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-4 bg-muted rounded-lg">
          <div className="text-sm text-muted-foreground">Amount</div>
          <div className="text-3xl font-bold">${amountUsd.toFixed(2)} USD</div>
        </div>

        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            Select your payment method:
          </p>
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" className="h-20">
              <div className="flex flex-col items-center gap-2">
                <span className="text-lg">₿</span>
                <span className="text-xs">Bitcoin</span>
              </div>
            </Button>
            <Button variant="outline" className="h-20">
              <div className="flex flex-col items-center gap-2">
                <span className="text-lg">Ξ</span>
                <span className="text-xs">Ethereum</span>
              </div>
            </Button>
            <Button variant="outline" className="h-20">
              <div className="flex flex-col items-center gap-2">
                <span className="text-lg">₮</span>
                <span className="text-xs">USDT</span>
              </div>
            </Button>
            <Button variant="outline" className="h-20">
              <div className="flex flex-col items-center gap-2">
                <span className="text-lg">$</span>
                <span className="text-xs">USDC</span>
              </div>
            </Button>
          </div>
        </div>

        <Button
          onClick={handlePayment}
          disabled={loading}
          className="w-full"
          size="lg"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            'Proceed to Payment'
          )}
        </Button>

        <p className="text-xs text-center text-muted-foreground">
          Powered by NOWPayments • Secure & Encrypted
        </p>
      </CardContent>
    </Card>
  );
}
