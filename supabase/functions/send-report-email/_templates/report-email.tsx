import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
  Section,
  Row,
  Column,
} from 'npm:@react-email/components@0.0.22';
import * as React from 'npm:react@18.3.1';

interface ReportEmailProps {
  reportData: {
    machineName: string;
    monthlyCost: number;
    monthlyRevenue: number;
    monthlyNet: number;
    yearlyNet: number;
    roi: number;
    paybackMonths: number;
    leasingCost: number;
    insurance: number;
    slaLevel: string;
    treatmentsPerDay: number;
    customerPrice: number;
  };
  format: string;
  customNotes?: string;
  timestamp: string;
}

export const ReportEmail = ({
  reportData,
  format,
  customNotes,
  timestamp,
}: ReportEmailProps) => (
  <Html>
    <Head />
    <Preview>Finansiell analysrapport för {reportData.machineName}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Finansiell Analysrapport</Heading>
        
        <Section style={section}>
          <Text style={text}>
            <strong>Maskin:</strong> {reportData.machineName}
          </Text>
          <Text style={text}>
            <strong>Format:</strong> {format.toUpperCase()}
          </Text>
          <Text style={text}>
            <strong>Genererad:</strong> {new Date(timestamp).toLocaleString('sv-SE')}
          </Text>
        </Section>

        <Section style={section}>
          <Heading style={h2}>Ekonomisk Sammanfattning</Heading>
          
          <Row style={row}>
            <Column style={column}>
              <Text style={keyMetric}>
                <strong>Månadsnetto</strong><br />
                {reportData.monthlyNet?.toLocaleString('sv-SE')} kr
              </Text>
            </Column>
            <Column style={column}>
              <Text style={keyMetric}>
                <strong>Årsnetto</strong><br />
                {reportData.yearlyNet?.toLocaleString('sv-SE')} kr
              </Text>
            </Column>
          </Row>

          <Row style={row}>
            <Column style={column}>
              <Text style={keyMetric}>
                <strong>ROI</strong><br />
                {reportData.roi}%
              </Text>
            </Column>
            <Column style={column}>
              <Text style={keyMetric}>
                <strong>Återbetalningstid</strong><br />
                {reportData.paybackMonths} månader
              </Text>
            </Column>
          </Row>
        </Section>

        <Section style={section}>
          <Heading style={h2}>Investeringsdata</Heading>
          <Text style={text}>
            <strong>Månadskostnad:</strong> {reportData.monthlyCost?.toLocaleString('sv-SE')} kr
          </Text>
          <Text style={text}>
            <strong>- Leasing:</strong> {reportData.leasingCost?.toLocaleString('sv-SE')} kr
          </Text>
          <Text style={text}>
            <strong>- Försäkring:</strong> {reportData.insurance?.toLocaleString('sv-SE')} kr
          </Text>
          <Text style={text}>
            <strong>- Driftpaket:</strong> {reportData.slaLevel}
          </Text>
        </Section>

        <Section style={section}>
          <Heading style={h2}>Intäktsanalys</Heading>
          <Text style={text}>
            <strong>Månadsintäkt:</strong> {reportData.monthlyRevenue?.toLocaleString('sv-SE')} kr
          </Text>
          <Text style={text}>
            <strong>- Behandlingar/dag:</strong> {reportData.treatmentsPerDay}
          </Text>
          <Text style={text}>
            <strong>- Pris/behandling:</strong> {reportData.customerPrice?.toLocaleString('sv-SE')} kr
          </Text>
          <Text style={text}>
            <strong>- Arbetsdagar/månad:</strong> 22
          </Text>
        </Section>

        {customNotes && (
          <Section style={section}>
            <Heading style={h2}>Anteckningar</Heading>
            <Text style={text}>
              {customNotes}
            </Text>
          </Section>
        )}

        <Section style={section}>
          <Text style={disclaimer}>
            <em>
              Detta dokument är genererat automatiskt från Kalkylator systemet. 
              Alla siffror baseras på de inmatade värdena och antagandena i kalkylatorn. 
              Konsultera finansiell rådgivare för investeringsbeslut.
            </em>
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

export default ReportEmail;

const main = {
  backgroundColor: '#ffffff',
  fontFamily: 'Arial, sans-serif',
};

const container = {
  margin: '0 auto',
  padding: '20px',
  maxWidth: '600px',
};

const h1 = {
  color: '#1a202c',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '0 0 20px 0',
  textAlign: 'center' as const,
};

const h2 = {
  color: '#2d3748',
  fontSize: '18px',
  fontWeight: 'bold',
  margin: '20px 0 10px 0',
};

const section = {
  margin: '20px 0',
};

const text = {
  color: '#4a5568',
  fontSize: '14px',
  lineHeight: '1.6',
  margin: '5px 0',
};

const keyMetric = {
  color: '#2d3748',
  fontSize: '16px',
  fontWeight: 'bold',
  textAlign: 'center' as const,
  padding: '15px',
  backgroundColor: '#f7fafc',
  borderRadius: '8px',
  margin: '5px 0',
};

const row = {
  display: 'table',
  width: '100%',
  margin: '10px 0',
};

const column = {
  display: 'table-cell',
  width: '50%',
  padding: '0 10px',
};

const disclaimer = {
  color: '#718096',
  fontSize: '12px',
  lineHeight: '1.4',
  textAlign: 'center' as const,
  margin: '20px 0',
  padding: '15px',
  backgroundColor: '#edf2f7',
  borderRadius: '8px',
};