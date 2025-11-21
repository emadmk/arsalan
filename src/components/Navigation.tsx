"use client";

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Menu, X, User, LogOut, LayoutDashboard } from 'lucide-react';
import { useAuthStore } from '../store/auth';
import logoImage from 'figma:asset/d3935e4ca5955af1343d8bcabb52536d2f9ae833.png';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

interface NavigationProps {
  onLoginClick?: () => void;
  onSignUpClick?: () => void;
}

export function Navigation({ onLoginClick, onSignUpClick }: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const user = useAuthStore(state => state.user);
  const signOut = useAuthStore(state => state.signOut);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-dark border-b border-carpet-antique-gold/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <div className="flex items-center gap-3">
              <img 
                src={logoImage} 
                alt="Safiralux Logo" 
                className="w-8 h-8 object-contain"
              />
              <h2 className="font-display text-xl text-carpet-antique-gold">
                Safiralux
              </h2>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="bg-transparent border-carpet-antique-gold text-carpet-antique-gold hover:bg-carpet-antique-gold hover:text-carpet-black"
                  >
                    <User className="w-4 h-4 mr-2" />
                    {user.full_name || user.email}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={() => navigate(user.role === 'admin' ? '/admin' : '/dashboard')}>
                    <LayoutDashboard className="w-4 h-4 mr-2" />
                    Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button
                  variant="ghost"
                  onClick={onLoginClick}
                  className="text-carpet-cream hover:text-carpet-antique-gold"
                >
                  Sign In
                </Button>
                <Button
                  variant="outline"
                  onClick={onSignUpClick}
                  className="bg-transparent border-carpet-antique-gold text-carpet-antique-gold hover:bg-carpet-antique-gold hover:text-carpet-black"
                >
                  Get Started
                </Button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
              className="text-carpet-cream hover:text-carpet-antique-gold"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-2 border-t border-carpet-antique-gold/20 glass-dark">
              {user ? (
                <>
                  <Button
                    variant="outline"
                    className="w-full bg-transparent border-carpet-antique-gold text-carpet-antique-gold hover:bg-carpet-antique-gold hover:text-carpet-black"
                    onClick={() => {
                      navigate(user.role === 'admin' ? '/admin' : '/dashboard');
                      setIsOpen(false);
                    }}
                  >
                    <LayoutDashboard className="w-4 h-4 mr-2" />
                    Dashboard
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full bg-transparent border-carpet-deep-red text-carpet-deep-red hover:bg-carpet-deep-red hover:text-white"
                    onClick={() => {
                      handleSignOut();
                      setIsOpen(false);
                    }}
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="outline"
                    className="w-full bg-transparent border-carpet-antique-gold text-carpet-antique-gold hover:bg-carpet-antique-gold hover:text-carpet-black"
                    onClick={() => {
                      onLoginClick?.();
                      setIsOpen(false);
                    }}
                  >
                    Sign In
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full bg-carpet-antique-gold text-carpet-black hover:bg-carpet-bright-gold"
                    onClick={() => {
                      onSignUpClick?.();
                      setIsOpen(false);
                    }}
                  >
                    Get Started
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}