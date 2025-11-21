"use client";

import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';

interface AuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: 'signin' | 'signup';
}

export function AuthDialog({ open, onOpenChange, mode }: AuthDialogProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement actual authentication logic
    console.log('Auth submit:', { mode, email, password, name });
    alert(`${mode === 'signin' ? 'Sign In' : 'Sign Up'} functionality coming soon!`);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-carpet-black border-carpet-antique-gold/20">
        <DialogHeader>
          <DialogTitle className="text-2xl font-display text-carpet-antique-gold">
            {mode === 'signin' ? 'Sign In' : 'Get Started'}
          </DialogTitle>
          <DialogDescription className="text-carpet-cream/70">
            {mode === 'signin'
              ? 'Welcome back! Sign in to your account.'
              : 'Create an account to start your journey with Persian Kerman Carpets.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {mode === 'signup' && (
            <div className="space-y-2">
              <Label htmlFor="name" className="text-carpet-cream">
                Full Name
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="bg-carpet-black/50 border-carpet-antique-gold/30 text-carpet-cream placeholder:text-carpet-cream/40"
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email" className="text-carpet-cream">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-carpet-black/50 border-carpet-antique-gold/30 text-carpet-cream placeholder:text-carpet-cream/40"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-carpet-cream">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="bg-carpet-black/50 border-carpet-antique-gold/30 text-carpet-cream placeholder:text-carpet-cream/40"
            />
          </div>

          <div className="flex flex-col gap-3 pt-4">
            <Button
              type="submit"
              className="w-full bg-carpet-antique-gold text-carpet-black hover:bg-carpet-antique-gold/90 transition-all duration-300"
            >
              {mode === 'signin' ? 'Sign In' : 'Create Account'}
            </Button>

            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              className="w-full text-carpet-cream hover:text-carpet-antique-gold"
            >
              Cancel
            </Button>
          </div>

          <div className="text-center text-sm text-carpet-cream/60 pt-2">
            {mode === 'signin' ? (
              <>
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    onOpenChange(false);
                    // Will be handled by parent component
                  }}
                  className="text-carpet-antique-gold hover:underline"
                >
                  Sign up
                </button>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    onOpenChange(false);
                    // Will be handled by parent component
                  }}
                  className="text-carpet-antique-gold hover:underline"
                >
                  Sign in
                </button>
              </>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
