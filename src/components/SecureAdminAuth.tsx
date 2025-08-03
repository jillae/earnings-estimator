import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { ArrowLeft, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';

interface SecureAdminAuthProps {
  children: React.ReactNode;
}

export const SecureAdminAuth: React.FC<SecureAdminAuthProps> = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showLogin, setShowLogin] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSigningIn, setIsSigningIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    checkAdminStatus();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          await checkAdminStatus();
        } else if (event === 'SIGNED_OUT') {
          setIsAdmin(false);
          setShowLogin(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const checkAdminStatus = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setIsAdmin(false);
        setIsLoading(false);
        return;
      }

      const { data: adminUser, error } = await supabase
        .from('admin_users')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error checking admin status:', error);
        setIsAdmin(false);
      } else {
        setIsAdmin(!!adminUser);
      }
    } catch (error) {
      console.error('Error checking admin status:', error);
      setIsAdmin(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSigningIn(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast.error('Inloggning misslyckades: ' + error.message);
      } else {
        toast.success('Inloggning lyckades!');
        // checkAdminStatus kommer att kallas via onAuthStateChange
      }
    } catch (error) {
      console.error('Sign in error:', error);
      toast.error('Ett oväntat fel inträffade');
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        toast.error('Utloggning misslyckades: ' + error.message);
      } else {
        toast.success('Du har loggats ut');
        navigate('/');
      }
    } catch (error) {
      console.error('Sign out error:', error);
      toast.error('Ett oväntat fel inträffade vid utloggning');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Laddar...</div>
      </div>
    );
  }

  if (!isAdmin) {
    if (!showLogin) {
      return (
        <div className="container mx-auto py-10">
          <div className="flex flex-col items-center">
            <div className="w-full max-w-md mb-6">
              <Link to="/">
                <Button variant="outline" size="sm" className="mb-8">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Tillbaka till kalkylator
                </Button>
              </Link>
            </div>
            
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle>Administratörsbehörighet krävs</CardTitle>
                <CardDescription>
                  Du behöver vara en registrerad administratör för att komma åt denna sida.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={() => setShowLogin(true)}
                  className="w-full"
                >
                  Logga in som administratör
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      );
    }

    return (
      <div className="container mx-auto py-10">
        <div className="flex flex-col items-center">
          <div className="w-full max-w-md mb-6">
            <Link to="/">
              <Button variant="outline" size="sm" className="mb-8">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Tillbaka till kalkylator
              </Button>
            </Link>
          </div>
          
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Admin-inloggning</CardTitle>
              <CardDescription>
                Logga in med din registrerade administratörsemail
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">E-post</Label>
                  <Input 
                    id="email"
                    type="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    placeholder="admin@exempel.se"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password">Lösenord</Label>
                  <Input 
                    id="password"
                    type="password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    placeholder="Ange lösenord"
                    required
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={isSigningIn}
                >
                  {isSigningIn ? 'Loggar in...' : 'Logga in'}
                </Button>
              </form>
              
              <div className="mt-4 text-center">
                <Button 
                  variant="link" 
                  onClick={() => setShowLogin(false)}
                  className="text-sm"
                >
                  ← Tillbaka
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Admin is authenticated, show admin content with logout option
  return (
    <div>
      <div className="border-b">
        <div className="container mx-auto py-4 flex justify-between items-center">
          <Link to="/">
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Tillbaka till kalkylator
            </Button>
          </Link>
          
          <Button variant="outline" size="sm" onClick={handleSignOut}>
            <LogOut className="mr-2 h-4 w-4" />
            Logga ut admin
          </Button>
        </div>
      </div>
      
      {children}
    </div>
  );
};