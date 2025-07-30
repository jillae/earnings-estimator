import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
  Hr,
  Section,
} from 'npm:@react-email/components@0.0.22';
import * as React from 'npm:react@18.3.1';

interface QuoteRequestEmailProps {
  userInfo: {
    name: string;
    email: string;
    phone?: string;
    company?: string;
  };
  configuration: {
    selectedMachine: string;
    clinicSize: string;
    paymentOption: string;
    leasingPeriod?: string;
    insurance?: string;
    slaLevel: string;
    driftpaket: string;
    treatmentsPerDay: number;
    customerPrice: number;
    leasingCost?: number;
    netPerMonth: number;
    netPerYear: number;
  };
  timestamp: string;
}

export const QuoteRequestEmail = ({
  userInfo,
  configuration,
  timestamp,
}: QuoteRequestEmailProps) => (
  <Html>
    <Head />
    <Preview>Ny offertförfrågan från {userInfo.name}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Offertförfrågan från Kalkylator</Heading>
        
        <Text style={text}>
          En ny offertförfrågan har kommit in via kalkylatorn.
        </Text>

        <Hr style={hr} />

        <Section style={section}>
          <Heading style={h2}>Kunduppgifter</Heading>
          <Text style={text}><strong>Namn:</strong> {userInfo.name}</Text>
          <Text style={text}><strong>E-post:</strong> {userInfo.email}</Text>
          {userInfo.phone && <Text style={text}><strong>Telefon:</strong> {userInfo.phone}</Text>}
          {userInfo.company && <Text style={text}><strong>Företag:</strong> {userInfo.company}</Text>}
        </Section>

        <Hr style={hr} />

        <Section style={section}>
          <Heading style={h2}>Konfiguration</Heading>
          <Text style={text}><strong>Maskin:</strong> {configuration.selectedMachine}</Text>
          <Text style={text}><strong>Klinikstorlek:</strong> {configuration.clinicSize}</Text>
          <Text style={text}><strong>Betalningsalternativ:</strong> {configuration.paymentOption === 'leasing' ? 'Leasing' : 'Kontant'}</Text>
          {configuration.leasingPeriod && <Text style={text}><strong>Leasingperiod:</strong> {configuration.leasingPeriod}</Text>}
          {configuration.insurance && <Text style={text}><strong>Försäkring:</strong> {configuration.insurance}</Text>}
          <Text style={text}><strong>SLA-nivå:</strong> {configuration.slaLevel}</Text>
          <Text style={text}><strong>Driftpaket:</strong> {configuration.driftpaket}</Text>
          <Text style={text}><strong>Behandlingar per dag:</strong> {configuration.treatmentsPerDay}</Text>
          <Text style={text}><strong>Kundpris per behandling:</strong> {configuration.customerPrice.toLocaleString('sv-SE')} kr</Text>
          {configuration.leasingCost && <Text style={text}><strong>Leasingkostnad per månad:</strong> {configuration.leasingCost.toLocaleString('sv-SE')} kr</Text>}
        </Section>

        <Hr style={hr} />

        <Section style={section}>
          <Heading style={h2}>Resultat</Heading>
          <Text style={text}><strong>Netto per månad:</strong> {configuration.netPerMonth.toLocaleString('sv-SE')} kr (exkl. moms)</Text>
          <Text style={text}><strong>Netto per år:</strong> {configuration.netPerYear.toLocaleString('sv-SE')} kr (exkl. moms)</Text>
        </Section>

        <Hr style={hr} />

        <Text style={footer}>
          Skickat: {new Date(timestamp).toLocaleString('sv-SE')}
        </Text>
      </Container>
    </Body>
  </Html>
);

const main = {
  backgroundColor: '#ffffff',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: '0 auto',
  padding: '20px 0 48px',
  maxWidth: '600px',
};

const h1 = {
  color: '#333',
  fontSize: '28px',
  fontWeight: 'bold',
  margin: '40px 0',
  padding: '0',
};

const h2 = {
  color: '#333',
  fontSize: '20px',
  fontWeight: 'bold',
  margin: '30px 0 15px',
  padding: '0',
};

const text = {
  color: '#333',
  fontSize: '16px',
  lineHeight: '26px',
  margin: '0 0 10px',
};

const section = {
  margin: '20px 0',
};

const hr = {
  borderColor: '#e6ebf1',
  margin: '20px 0',
};

const footer = {
  color: '#8898aa',
  fontSize: '12px',
  margin: '20px 0 0',
};