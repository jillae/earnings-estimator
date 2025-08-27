import { useState, useCallback, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { setSecureItem, getSecureItem } from '@/utils/security/secureStorage';
import { getSecurityHeaders, apiRequestLimiter, handleSecureError } from '@/utils/security/inputSecurity';

export interface UserData {
  name: string;
  email: string;
  sessionId: string;
}

export function useGatedAccess() {
  const [isUnlocked, setIsUnlocked] = useState(true); // TEMPORÄRT: Alltid unlocked
  const [userData, setUserData] = useState<UserData | null>(null);
  const [showOptIn, setShowOptIn] = useState(false);
  const [interactionCount, setInteractionCount] = useState(0);
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
  
  const { toast } = useToast();

  // Tröskelvärde för när registrering ska triggas
  const INTERACTION_THRESHOLD = 3;

  // Hjälpfunktion för att logga ny session
  const logNewSessionStart = useCallback(async (userData: UserData) => {
    // Rate limiting check
    if (!apiRequestLimiter.isAllowed('session-start')) {
      console.warn('Session start rate limited');
      return;
    }

    try {
      await fetch('https://ejwbhvzmkmuimfqlishm.supabase.co/functions/v1/calculator-log', {
        method: 'POST',
        headers: getSecurityHeaders(),
        body: JSON.stringify({
          action: 'session_start',
          sessionId: userData.sessionId,
          userData,
          timestamp: new Date().toISOString(),
        }),
      });

      // AVSTÄNGD - Automatiska notifikationer
      // await fetch('https://ejwbhvzmkmuimfqlishm.supabase.co/functions/v1/send-dealer-notification', {
      //   method: 'POST',
      //   headers: { 
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVqd2Jodnpta211aW1mcWxpc2htIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMwODU0NzEsImV4cCI6MjA1ODY2MTQ3MX0.IoF29f8q4G1hOMmU7bP6QqV_rCWPtXcJi9d6Wx0WHEo`
      //   },
      //   body: JSON.stringify({
      //     type: 'returning_session',
      //     userData,
      //     sessionId: userData.sessionId,
      //   }),
      // });
    } catch (error) {
      console.error('Error logging returning session:', error);
    }
  }, []);

  // Check if user has already done opt-in (with secure storage and expiry)
  useEffect(() => {
    const storedUserData = getSecureItem<UserData>('calculator_user_data');
    
    if (storedUserData) {
      // Skapa ny session men använd sparad användardata
      const newUserData = { ...storedUserData, sessionId };
      setUserData(newUserData);
      setIsUnlocked(true);
      
      // Logga ny session start automatiskt
      logNewSessionStart(newUserData);
    }
  }, [sessionId, logNewSessionStart]);

  // Signifikanta interaktioner som ska räknas
  const logSignificantInteraction = useCallback((action: string) => {
    const significantActions = [
      'machine_changed',
      'slider_adjusted', 
      'treatments_changed',
      'customer_price_changed',
      'leasing_period_changed',
      'insurance_changed'
    ];

    if (significantActions.includes(action) && !isUnlocked) {
      setInteractionCount(prev => {
        const newCount = prev + 1;
        console.log(`Signifikant interaktion: ${action} (${newCount}/${INTERACTION_THRESHOLD})`);
        
        // Trigga registreringsmodal när tröskelvärdet nås
        if (newCount >= INTERACTION_THRESHOLD && !showOptIn) {
          console.log(`Triggar registrering efter ${newCount} interaktioner`);
          setShowOptIn(true);
        }
        
        return newCount;
      });
    }
  }, [isUnlocked, INTERACTION_THRESHOLD, showOptIn]);

  const triggerOptIn = useCallback(() => {
    if (isUnlocked) return true;
    
    // Denna funktion används bara som fallback - huvudtrigger sker nu i logSignificantInteraction
    // Kan användas för manuell trigger från UI om behövs
    if (!showOptIn) {
      console.log('Manuell trigger av registrering');
      setShowOptIn(true);
    }
    
    return false;
  }, [isUnlocked, showOptIn]);

  const handleOptInSuccess = useCallback(async (name: string, email: string) => {
    const newUserData: UserData = { name, email, sessionId };
    
    try {
      // Spara användardata lokalt
      setUserData(newUserData);
      setIsUnlocked(true);
      setShowOptIn(false);
      
      // Spara säkert med automatisk expiry (30 dagar)
      setSecureItem('calculator_user_data', newUserData, 30);
      
      // Logga session start med säkerhetskontroller
      if (apiRequestLimiter.isAllowed('session-start')) {
        await fetch('https://ejwbhvzmkmuimfqlishm.supabase.co/functions/v1/calculator-log', {
          method: 'POST',
          headers: getSecurityHeaders(),
          body: JSON.stringify({
            action: 'session_start',
            sessionId,
            userData: newUserData,
            timestamp: new Date().toISOString(),
          }),
        });
      }

      // AVSTÄNGD - Automatiska notifikationer  
      // await fetch('https://ejwbhvzmkmuimfqlishm.supabase.co/functions/v1/send-dealer-notification', {
      //   method: 'POST',
      //   headers: { 
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVqd2Jodnpta211aW1mcWxpc2htIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMwODU0NzEsImV4cCI6MjA1ODY2MTQ3MX0.IoF29f8q4G1hOMmU7bP6QqV_rCWPtXcJi9d6Wx0WHEo`
      //   },
      //   body: JSON.stringify({
      //     type: 'new_session',
      //     userData: newUserData,
      //     sessionId,
      //   }),
      // });
      
      toast({
        title: "Kalkylatorn är nu upplåst!",
        description: "Du kan nu justera alla värden och se dina personliga beräkningar.",
      });
      
    } catch (error) {
      console.error('Error logging session start:', handleSecureError(error));
      // Låt användaren fortsätta även om loggning misslyckas
    }
  }, [sessionId, toast]);

  // Uppdaterad logInteraction som också hanterar interaktionsräknaren
  const logInteraction = useCallback(async (action: string, data: any) => {
    // Logga signifikanta interaktioner även när användaren inte är upplåst
    logSignificantInteraction(action);
    
    if (!userData || !isUnlocked) return;

    // Rate limiting check
    if (!apiRequestLimiter.isAllowed('interaction-log')) {
      console.warn('Interaction logging rate limited');
      return;
    }
    
    try {
      await fetch('https://ejwbhvzmkmuimfqlishm.supabase.co/functions/v1/calculator-log', {
        method: 'POST',
        headers: getSecurityHeaders(),
        body: JSON.stringify({
          action,
          sessionId,
          userData,
          data,
          timestamp: new Date().toISOString(),
        }),
      });

      // AVSTÄNGD - Automatiska session update notifikationer
      // if (['machine_changed', 'significant_adjustment', 'payment_option_changed'].includes(action)) {
      //   await fetch('https://ejwbhvzmkmuimfqlishm.supabase.co/functions/v1/send-dealer-notification', {
      //     method: 'POST',
      //     headers: { 
      //       'Content-Type': 'application/json',
      //       'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVqd2Jodnpta211aW1mcWxpc2htIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMwODU0NzEsImV4cCI6MjA1ODY2MTQ3MX0.IoF29f8q4G1hOMmU7bP6QqV_rCWPtXcJi9d6Wx0WHEo`
      //     },
      //     body: JSON.stringify({
      //       type: 'session_update',
      //       userData,
      //       sessionId,
      //       action,
      //       data,
      //     }),
      //   });
      // }
    } catch (error) {
      console.error('Error logging interaction:', handleSecureError(error));
    }
  }, [userData, sessionId, isUnlocked, logSignificantInteraction]);

  return {
    isUnlocked,
    userData,
    showOptIn,
    setShowOptIn,
    triggerOptIn,
    handleOptInSuccess,
    logInteraction,
    sessionId,
    interactionCount,
    logSignificantInteraction,
  };
}