"use client";

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/auth';
import { useOrders } from '../../hooks/useOrders';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Progress } from '../../components/ui/progress';
import {
  Package,
  CreditCard,
  User,
  Download,
  Clock,
  CheckCircle,
  Loader2,
} from 'lucide-react';
import { formatUsdAmount } from '../../utils/crypto';
import type { Order } from '../../types';

export function UserDashboard() {
  const navigate = useNavigate();
  const user = useAuthStore(state => state.user);
  const { data: orders, isLoading } = useOrders();
  const [activeTab, setActiveTab] = useState('orders');

  useEffect(() => {
    if (!user) {
      navigate('/');
    }
  }, [user, navigate]);

  if (!user) {
    return null;
  }

  const getOrderProgress = (status: Order['status']): number => {
    const progressMap = {
      pending_payment: 0,
      payment_received: 25,
      in_production: 50,
      completed: 100,
      cancelled: 0,
    };
    return progressMap[status];
  };

  const getStatusLabel = (status: Order['status']): string => {
    const labels = {
      pending_payment: 'Awaiting Payment',
      payment_received: 'Payment Confirmed',
      in_production: 'Being Handwoven',
      completed: 'Completed & Shipped',
      cancelled: 'Cancelled',
    };
    return labels[status];
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold mb-2">
            Welcome, {user.full_name || 'Customer'}!
          </h1>
          <p className="text-muted-foreground">
            Track your orders and manage your Persian carpet investment
          </p>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 max-w-md">
            <TabsTrigger value="orders">
              <Package className="w-4 h-4 mr-2" />
              Orders
            </TabsTrigger>
            <TabsTrigger value="payments">
              <CreditCard className="w-4 h-4 mr-2" />
              Payments
            </TabsTrigger>
            <TabsTrigger value="profile">
              <User className="w-4 h-4 mr-2" />
              Profile
            </TabsTrigger>
          </TabsList>

          {/* Orders Tab */}
          <TabsContent value="orders" className="mt-6">
            {isLoading ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
                  <p>Loading your orders...</p>
                </CardContent>
              </Card>
            ) : orders && orders.length > 0 ? (
              <div className="space-y-6">
                {orders.map((order) => (
                  <Card key={order.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">
                            {order.product?.name || 'Persian Kerman Carpet'}
                          </CardTitle>
                          <CardDescription>
                            Order #{order.id.slice(0, 8).toUpperCase()}
                          </CardDescription>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-carpet-antique-gold">
                            {formatUsdAmount(Number(order.total_amount_usd))}
                          </p>
                          {order.grid_position && (
                            <p className="text-sm text-muted-foreground">
                              Grid Position: {order.grid_position}
                            </p>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Progress */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium">{getStatusLabel(order.status)}</span>
                          <span className="text-muted-foreground">
                            {getOrderProgress(order.status)}%
                          </span>
                        </div>
                        <Progress value={getOrderProgress(order.status)} />
                      </div>

                      {/* Status Badge */}
                      <div className="flex items-center justify-between">
                        <Badge
                          variant={
                            order.payment_status === 'completed'
                              ? 'default'
                              : order.payment_status === 'failed'
                              ? 'destructive'
                              : 'secondary'
                          }
                        >
                          {order.payment_status === 'completed' && <CheckCircle className="w-3 h-3 mr-1" />}
                          {order.payment_status === 'pending' && <Clock className="w-3 h-3 mr-1" />}
                          Payment: {order.payment_status}
                        </Badge>

                        <p className="text-sm text-muted-foreground">
                          Ordered on {new Date(order.created_at).toLocaleDateString()}
                        </p>
                      </div>

                      {/* Transaction Info */}
                      {order.transactions && order.transactions.length > 0 && (
                        <div className="bg-muted rounded-lg p-4">
                          <p className="text-sm font-medium mb-2">Payment Details</p>
                          <div className="space-y-1 text-sm">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Crypto:</span>
                              <span className="font-medium">
                                {order.transactions[0].crypto_currency}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Amount:</span>
                              <span className="font-medium font-mono">
                                {order.transactions[0].crypto_amount}
                              </span>
                            </div>
                            {order.transactions[0].transaction_hash && (
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Tx Hash:</span>
                                <span className="font-mono text-xs">
                                  {order.transactions[0].transaction_hash.slice(0, 10)}...
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex gap-3">
                        {order.status === 'pending_payment' && (
                          <Button className="flex-1">
                            Complete Payment
                          </Button>
                        )}
                        {order.status === 'completed' && (
                          <Button variant="outline" className="flex-1">
                            <Download className="w-4 h-4 mr-2" />
                            Download Certificate
                          </Button>
                        )}
                        <Button variant="outline">
                          View Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <Package className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">No orders yet</h3>
                  <p className="text-muted-foreground mb-6">
                    Start your Persian carpet investment today!
                  </p>
                  <Button onClick={() => navigate('/')}>
                    Browse Carpets
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Payments Tab */}
          <TabsContent value="payments" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Payment History</CardTitle>
                <CardDescription>View all your crypto transactions</CardDescription>
              </CardHeader>
              <CardContent>
                {orders && orders.some(o => o.transactions && o.transactions.length > 0) ? (
                  <div className="space-y-4">
                    {orders.flatMap(order => order.transactions || []).map((tx) => (
                      <div key={tx.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <p className="font-medium">{tx.crypto_currency} Payment</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(tx.created_at).toLocaleString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">{formatUsdAmount(Number(tx.usd_amount))}</p>
                          <Badge variant={tx.status === 'confirmed' ? 'default' : 'secondary'}>
                            {tx.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground py-8">No transactions yet</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Manage your account details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Email</label>
                  <p className="text-lg">{user.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Full Name</label>
                  <p className="text-lg">{user.full_name || 'Not set'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Wallet Address</label>
                  <p className="text-lg font-mono text-sm">
                    {user.wallet_address || 'Not connected'}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Account Type</label>
                  <p className="text-lg capitalize">{user.role}</p>
                </div>
                <Button variant="outline" className="w-full">
                  Edit Profile
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
