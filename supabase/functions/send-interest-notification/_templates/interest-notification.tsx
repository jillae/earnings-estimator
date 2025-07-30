import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Text,
  Section,
  Hr,
} from 'npm:@react-email/components@0.0.22';
import * as React from 'npm:react@18.3.1';

interface InterestNotificationEmailProps {
  userInfo: {
    name: string;
    email: string;
    company?: string;
    message?: string;
  };
  timestamp: string;
}

export const InterestNotificationEmail = ({
  userInfo,
  timestamp,
}: InterestNotificationEmailProps) => (
  <Html>
    <Head />
    <Preview>Ny intresseanmälan för KlinikOptimering</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>🎯 Ny intresseanmälan - KlinikOptimering</Heading>
        
        <Text style={text}>
          En ny person har anmält sitt intresse för KlinikOptimering!
        </Text>

        <Section style={section}>
          <Text style={text}><strong>Namn:</strong> {userInfo.name}</Text>
          <Text style={text}><strong>E-post:</strong> {userInfo.email}</Text>
          {userInfo.company && <Text style={text}><strong>Klinik/Företag:</strong> {userInfo.company}</Text>}
          {userInfo.message && (
            <>
              <Text style={text}><strong>Meddelande:</strong></Text>
              <Text style={messageStyle}>{userInfo.message}</Text>
            </>
          )}
        </Section>

        <Hr style={hr} />

        <Text style={text}>
          <strong>Tidpunkt:</strong> {new Date(timestamp).toLocaleString('sv-SE')}
        </Text>

        <Section style={ctaSection}>
          <Text style={text}>
            🚀 Kom ihåg att följa upp med denna potentiella kund!
          </Text>
        </Section>

        <Hr style={hr} />
        
        <Text style={footer}>
          Detta meddelande skickades automatiskt från KlinikOptimering landing page.
        </Text>
      </Container>
    </Body>
  </Html>
);

export default InterestNotificationEmail;

const main = {
  backgroundColor: '#ffffff',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: '0 auto',
  padding: '20px 0 48px',
  maxWidth: '560px',
};

const h1 = {
  color: '#333',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '40px 0',
  padding: '0',
};

const text = {
  color: '#333',
  fontSize: '14px',
  lineHeight: '26px',
  margin: '16px 0',
};

const section = {
  backgroundColor: '#f8f9fa',
  borderRadius: '8px',
  padding: '24px',
  margin: '16px 0',
};

const messageStyle = {
  ...text,
  backgroundColor: '#fff',
  border: '1px solid #e1e5e9',
  borderRadius: '4px',
  padding: '12px',
  fontStyle: 'italic',
};

const ctaSection = {
  backgroundColor: '#e3f2fd',
  borderRadius: '8px',
  padding: '20px',
  margin: '24px 0',
  textAlign: 'center' as const,
};

const hr = {
  borderColor: '#e1e5e9',
  margin: '20px 0',
};

const footer = {
  color: '#898989',
  fontSize: '12px',
  lineHeight: '16px',
  marginTop: '12px',
  textAlign: 'center' as const,
};