import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Text,
  Hr,
} from 'npm:@react-email/components@0.0.22';
import * as React from 'npm:react@18.3.1';

interface DealerNotificationEmailProps {
  type: 'new_session' | 'session_update';
  userName: string;
  userEmail: string;
  sessionId: string;
  timestamp: string;
  action?: string;
  data?: any;
}

export const DealerNotificationEmail = ({
  type,
  userName,
  userEmail,
  sessionId,
  timestamp,
  action,
  data,
}: DealerNotificationEmailProps) => {
  const isNewSession = type === 'new_session';
  
  return (
    <Html>
      <Head />
      <Preview>
        {isNewSession 
          ? `Ny användare har registrerat sig: ${userName}` 
          : `${userName} har uppdaterat sina kalkyleringar`
        }
      </Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>
            {isNewSession ? '🎉 Ny Kalkylatorsession' : '📊 Session Uppdaterad'}
          </Heading>
          
          <Section style={section}>
            <Text style={text}>
              <strong>Användare:</strong> {userName}
            </Text>
            <Text style={text}>
              <strong>E-post:</strong> {userEmail}
            </Text>
            <Text style={text}>
              <strong>Session ID:</strong> {sessionId}
            </Text>
            <Text style={text}>
              <strong>Tidpunkt:</strong> {new Date(timestamp).toLocaleString('sv-SE')}
            </Text>
          </Section>

          {!isNewSession && action && (
            <>
              <Hr style={hr} />
              <Section style={section}>
                <Heading style={h2}>Senaste Aktivitet</Heading>
                <Text style={text}>
                  <strong>Åtgärd:</strong> {action}
                </Text>
                {data && (
                  <Text style={codeBlock}>
                    {JSON.stringify(data, null, 2)}
                  </Text>
                )}
              </Section>
            </>
          )}

          <Hr style={hr} />
          
          <Section style={section}>
            <Text style={text}>
              {isNewSession 
                ? 'En ny potentiell kund har registrerat sig och börjat använda intäktskalkylatorn.'
                : 'Användaren har gjort ändringar i kalkylatorn som kan indikera fortsatt intresse.'
              }
            </Text>
            
            <Link 
              href={`https://supabase.com/dashboard/project/ejwbhvzmkmuimfqlishm/editor`}
              style={button}
            >
              Visa fullständiga loggar
            </Link>
          </Section>

          <Text style={footer}>
            Detta meddelande skickades automatiskt från din intäktskalkylator.
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

export default DealerNotificationEmail;

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
};

const section = {
  padding: '0 48px',
};

const h1 = {
  color: '#333',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '40px 0',
  padding: '0 48px',
};

const h2 = {
  color: '#333',
  fontSize: '18px',
  fontWeight: 'bold',
  margin: '20px 0 10px',
};

const text = {
  color: '#333',
  fontSize: '16px',
  lineHeight: '26px',
  margin: '16px 0',
};

const button = {
  backgroundColor: '#007ee6',
  borderRadius: '4px',
  color: '#fff',
  fontSize: '16px',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
  width: '200px',
  padding: '12px 0',
  margin: '20px 0',
};

const hr = {
  borderColor: '#e6ebf1',
  margin: '20px 0',
};

const footer = {
  color: '#8898aa',
  fontSize: '12px',
  lineHeight: '16px',
  padding: '0 48px',
};

const codeBlock = {
  backgroundColor: '#f4f4f4',
  border: '1px solid #e1e8ed',
  borderRadius: '4px',
  color: '#333',
  fontSize: '12px',
  fontFamily: 'Consolas, Monaco, "Andale Mono", "Ubuntu Mono", monospace',
  padding: '16px',
  whiteSpace: 'pre-wrap' as const,
  wordBreak: 'break-all' as const,
};