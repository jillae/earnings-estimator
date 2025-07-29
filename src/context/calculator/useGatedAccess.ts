import { useState, useCallback, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

export interface UserData {
  name: string;
  email: string;
  sessionId: string;
}

export function useGatedAccess() {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [showOptIn, setShowOptIn] = useState(false);
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
  
  const { toast } = useToast();

  // Check if user has already unlocked in this session
  useEffect(() => {
    const storedUnlock = sessionStorage.getItem('calculator_unlocked');
    const storedUserData = sessionStorage.getItem('calculator_user_data');
    
    if (storedUnlock === 'true' && storedUserData) {
      setIsUnlocked(true);
      setUserData(JSON.parse(storedUserData));
    }
  }, []);

  const triggerOptIn = useCallback(() => {
    if (isUnlocked) return true;
    
    setShowOptIn(true);
    return false;
  }, [isUnlocked]);

  const handleOptInSuccess = useCallback(async (name: string, email: string) => {
    const newUserData: UserData = { name, email, sessionId };
    
    try {
      // Spara användardata lokalt
      setUserData(newUserData);
      setIsUnlocked(true);
      setShowOptIn(false);
      
      // Spara i session storage
      sessionStorage.setItem('calculator_unlocked', 'true');
      sessionStorage.setItem('calculator_user_data', JSON.stringify(newUserData));
      
      // Logga session start
      await fetch('/api/calculator-log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'session_start',
          sessionId,
          userData: newUserData,
          timestamp: new Date().toISOString(),
        }),
      });

      // Skicka e-postnotifikation till återförsäljaren
      await fetch('/api/send-dealer-notification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'new_session',
          userData: newUserData,
          sessionId,
        }),
      });
      
      toast({
        title: "Kalkylatorn är nu upplåst!",
        description: "Du kan nu justera alla värden och se dina personliga beräkningar.",
      });
      
    } catch (error) {
      console.error('Error logging session start:', error);
      // Låt användaren fortsätta även om loggning misslyckas
    }
  }, [sessionId, toast]);

  const logInteraction = useCallback(async (action: string, data: any) => {
    if (!userData || !isUnlocked) return;
    
    try {
      await fetch('/api/calculator-log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          sessionId,
          userData,
          data,
          timestamp: new Date().toISOString(),
        }),
      });

      // För viktiga interaktioner, skicka också notifikation
      if (['machine_changed', 'significant_adjustment', 'payment_option_changed'].includes(action)) {
        await fetch('/api/send-dealer-notification', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'session_update',
            userData,
            sessionId,
            action,
            data,
          }),
        });
      }
    } catch (error) {
      console.error('Error logging interaction:', error);
    }
  }, [userData, sessionId, isUnlocked]);

  return {
    isUnlocked,
    userData,
    showOptIn,
    setShowOptIn,
    triggerOptIn,
    handleOptInSuccess,
    logInteraction,
    sessionId,
  };
}