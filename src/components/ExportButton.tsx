import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, FileText, Mail, Share2, Loader2 } from 'lucide-react';
import { useCalculator } from '@/context/CalculatorContext';
import { formatCurrency } from '@/utils/formatUtils';
import { useToast } from '@/hooks/use-toast';
import jsPDF from 'jspdf';
import { supabase } from '@/integrations/supabase/client';

interface ExportOptions {
  includeDetails: boolean;
  includeCharts: boolean;
  includeAssumptions: boolean;
  includeScenarios: boolean;
  format: 'pdf' | 'excel' | 'word';
  recipientEmail?: string;
  customNotes?: string;
  companyLogo: boolean;
}

const ExportButton = () => {
  const { selectedMachine, treatmentsPerDay, customerPrice, revenue, operatingCost, leasingCost, netResults } = useCalculator();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportOptions, setExportOptions] = useState<ExportOptions>({
    includeDetails: true,
    includeCharts: true,
    includeAssumptions: true,
    includeScenarios: false,
    format: 'pdf',
    companyLogo: true
  });

  const generateReportData = () => {
    const reportData = {
      // Grundläggande information
      timestamp: new Date().toLocaleString('sv-SE'),
      machine: selectedMachine?.name || 'Ingen maskin vald',
      treatmentsPerDay,
      customerPrice: formatCurrency(customerPrice),
      
      // Ekonomiska resultat
      monthlyRevenue: formatCurrency(revenue?.monthlyRevenueIncVat || 0),
      monthlyRevenueExVat: formatCurrency(revenue?.monthlyRevenueExVat || 0),
      operatingCost: formatCurrency(operatingCost?.totalCost || 0),
      leasingCost: formatCurrency(leasingCost || 0),
      totalMonthlyCost: formatCurrency((operatingCost?.totalCost || 0) + (leasingCost || 0)),
      netPerMonth: formatCurrency(netResults?.netPerMonthExVat || 0),
      
      // Årliga projektioner
      annualRevenue: formatCurrency((revenue?.monthlyRevenueIncVat || 0) * 12),
      annualCosts: formatCurrency(((operatingCost?.totalCost || 0) + (leasingCost || 0)) * 12),
      annualProfit: formatCurrency((netResults?.netPerMonthExVat || 0) * 12),
      
      // ROI-beräkningar (förenklad)
      initialInvestment: selectedMachine?.priceEur || 0,
      paybackMonths: selectedMachine && netResults?.netPerMonthExVat ? 
        Math.ceil((selectedMachine.priceEur || 0) / (netResults.netPerMonthExVat || 1)) : 'N/A',
      
      // Antaganden
      assumptions: {
        workDaysPerMonth: 22,
        treatmentTime: '30 minuter',
        capacityUtilization: `${Math.round((treatmentsPerDay / 16) * 100)}%`,
        priceInflation: '2% per år'
      }
    };
    
    return reportData;
  };

  const handleExport = async () => {
    setIsExporting(true);
    
    try {
      const reportData = generateReportData();
      
      // Simulera export-process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      if (exportOptions.format === 'pdf') {
        await generatePDFReport(reportData);
      } else if (exportOptions.format === 'excel') {
        await generateExcelReport(reportData);
      } else if (exportOptions.format === 'word') {
        await generateWordReport(reportData);
      }
      
      if (exportOptions.recipientEmail) {
        await sendReportByEmail(reportData, exportOptions.recipientEmail);
      }
      
      toast({
        title: "Export framgångsrik!",
        description: `Rapporten har exporterats som ${exportOptions.format.toUpperCase()}.`,
      });
      
      setIsOpen(false);
    } catch (error) {
      toast({
        title: "Export misslyckades",
        description: "Något gick fel vid exporten. Försök igen.",
        variant: "destructive"
      });
    } finally {
      setIsExporting(false);
    }
  };

  const generatePDFReport = async (data: any) => {
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 20;
    let yPosition = margin;

    // Header
    pdf.setFontSize(20);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Finansiell Analysrapport', margin, yPosition);
    yPosition += 15;

    // Machine and date info
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Maskin: ${data.machine}`, margin, yPosition);
    yPosition += 8;
    pdf.text(`Datum: ${new Date().toLocaleDateString('sv-SE')}`, margin, yPosition);
    yPosition += 15;

    // Executive Summary
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Sammanfattning', margin, yPosition);
    yPosition += 10;

    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'normal');
    const summaryLines = [
      `Månadskostnad: ${data.totalMonthlyCost}`,
      `Månadsintäkt: ${data.monthlyRevenue}`,
      `Månadsnetto: ${data.netPerMonth}`,
      `Årsnetto: ${data.annualProfit}`,
      `Återbetalningstid: ${data.paybackMonths} månader`
    ];

    summaryLines.forEach(line => {
      pdf.text(line, margin, yPosition);
      yPosition += 6;
    });

    yPosition += 10;

    // Detailed Analysis
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Detaljerad Analys', margin, yPosition);
    yPosition += 10;

    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'normal');
    
    // Investment details
    pdf.text('Investeringsdata:', margin, yPosition);
    yPosition += 8;
    pdf.text(`• Leasingkostnad: ${data.leasingCost}`, margin + 5, yPosition);
    yPosition += 6;
    pdf.text(`• Driftskostnader: ${data.operatingCost}`, margin + 5, yPosition);
    yPosition += 6;
    pdf.text(`• Totala kostnader: ${data.totalMonthlyCost}`, margin + 5, yPosition);
    yPosition += 10;

    // Revenue analysis
    pdf.text('Intäktsanalys:', margin, yPosition);
    yPosition += 8;
    pdf.text(`• Behandlingar per dag: ${data.treatmentsPerDay}`, margin + 5, yPosition);
    yPosition += 6;
    pdf.text(`• Pris per behandling: ${data.customerPrice}`, margin + 5, yPosition);
    yPosition += 6;
    pdf.text(`• Månadsdagar: 22`, margin + 5, yPosition);
    yPosition += 10;

    // Custom notes
    if (exportOptions.customNotes) {
      pdf.text('Anteckningar:', margin, yPosition);
      yPosition += 8;
      const notes = pdf.splitTextToSize(exportOptions.customNotes, pageWidth - 2 * margin);
      notes.forEach((line: string) => {
        pdf.text(line, margin + 5, yPosition);
        yPosition += 6;
      });
    }

    // Footer
    yPosition = pageHeight - 30;
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'italic');
    pdf.text('Detta dokument är genererat automatiskt från Kalkylator systemet.', margin, yPosition);
    pdf.text(`Genererat: ${new Date().toLocaleString('sv-SE')}`, margin, yPosition + 5);

    // Save PDF
    const fileName = `${data.machine.replace(/\s+/g, '_')}_rapport_${new Date().toISOString().split('T')[0]}.pdf`;
    pdf.save(fileName);
  };

  const generateExcelReport = async (data: any) => {
    // Simulerad Excel-export
    const csvContent = createCSVContent(data);
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `intaktsberakning_${data.machine.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const generateWordReport = async (data: any) => {
    // Simulerad Word-export
    const content = createReportContent(data);
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `intaktsberakning_${data.machine.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.doc`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const sendReportByEmail = async (data: any, email: string) => {
    try {
      const { error } = await supabase.functions.invoke('send-report-email', {
        body: {
          reportData: {
            machineName: data.machine,
            monthlyCost: parseFloat(data.totalMonthlyCost.replace(/[^\d.-]/g, '')),
            monthlyRevenue: parseFloat(data.monthlyRevenue.replace(/[^\d.-]/g, '')),
            monthlyNet: parseFloat(data.netPerMonth.replace(/[^\d.-]/g, '')),
            yearlyNet: parseFloat(data.annualProfit.replace(/[^\d.-]/g, '')),
            roi: 0, // Simplified for now
            paybackMonths: typeof data.paybackMonths === 'number' ? data.paybackMonths : 0,
            leasingCost: parseFloat(data.leasingCost.replace(/[^\d.-]/g, '')),
            insurance: 0, // Will be calculated from operating costs
            slaLevel: 'Standard', // Simplified
            treatmentsPerDay: data.treatmentsPerDay,
            customerPrice: parseFloat(data.customerPrice.replace(/[^\d.-]/g, ''))
          },
          recipientEmail: email,
          format: exportOptions.format,
          customNotes: exportOptions.customNotes
        }
      });

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  };

  const createReportContent = (data: any) => {
    return `
INTÄKTSBERÄKNING - ERCHONIA NORDIC
Genererad: ${data.timestamp}

${exportOptions.companyLogo ? '=== ERCHONIA NORDIC - SWEDEN ===' : ''}

MASKIN: ${data.machine}
BERÄKNINGSPARAMETRAR:
- Behandlingar per dag: ${data.treatmentsPerDay}
- Pris per behandling: ${data.customerPrice}

MÅNATLIGA RESULTAT:
- Intäkter (inkl. moms): ${data.monthlyRevenue}
- Intäkter (exkl. moms): ${data.monthlyRevenueExVat}
- Driftskostnader: ${data.operatingCost}
- Leasingkostnader: ${data.leasingCost}
- Totala kostnader: ${data.totalMonthlyCost}
- Nettoresultat per månad: ${data.netPerMonth}

ÅRLIGA PROJEKTIONER:
- Årlig intäkt: ${data.annualRevenue}
- Årliga kostnader: ${data.annualCosts}
- Årlig vinst: ${data.annualProfit}

${exportOptions.includeAssumptions ? `
ANTAGANDEN:
- Arbetsdagar per månad: ${data.assumptions.workDaysPerMonth}
- Behandlingstid: ${data.assumptions.treatmentTime}
- Kapacitetsutnyttjande: ${data.assumptions.capacityUtilization}
- Prisinflation: ${data.assumptions.priceInflation}
` : ''}

${exportOptions.customNotes ? `
ANTECKNINGAR:
${exportOptions.customNotes}
` : ''}

Denna beräkning är en uppskattning baserad på angivna parametrar.
Faktiska resultat kan variera beroende på marknadsförhållanden och drifteffektivitet.

© Erchonia Nordic - Sweden
    `.trim();
  };

  const createCSVContent = (data: any) => {
    return `Kategori,Beskrivning,Värde
Maskin,Vald maskin,${data.machine}
Parameter,Behandlingar per dag,${data.treatmentsPerDay}
Parameter,Pris per behandling,${data.customerPrice}
Resultat,Månatlig intäkt (inkl moms),${data.monthlyRevenue}
Resultat,Månatlig intäkt (exkl moms),${data.monthlyRevenueExVat}
Resultat,Driftskostnader,${data.operatingCost}
Resultat,Leasingkostnader,${data.leasingCost}
Resultat,Totala kostnader,${data.totalMonthlyCost}
Resultat,Nettoresultat per månad,${data.netPerMonth}
Prognos,Årlig intäkt,${data.annualRevenue}
Prognos,Årliga kostnader,${data.annualCosts}
Prognos,Årlig vinst,${data.annualProfit}`;
  };

  if (!selectedMachine) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Exportera rapport
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Exportera intäktsberäkning
          </DialogTitle>
          <DialogDescription>
            Skapa en detaljerad rapport av din kalkylering för presentation eller arkivering.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Format Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Exportformat</CardTitle>
            </CardHeader>
            <CardContent>
              <Select 
                value={exportOptions.format} 
                onValueChange={(value: 'pdf' | 'excel' | 'word') => 
                  setExportOptions(prev => ({ ...prev, format: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pdf">PDF-rapport</SelectItem>
                  <SelectItem value="excel">Excel-kalkylblad</SelectItem>
                  <SelectItem value="word">Word-dokument</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Content Options */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Rapportinnehåll</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="details"
                  checked={exportOptions.includeDetails}
                  onCheckedChange={(checked) => 
                    setExportOptions(prev => ({ ...prev, includeDetails: !!checked }))
                  }
                />
                <Label htmlFor="details">Detaljerade kostnadsuppdelningar</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="charts"
                  checked={exportOptions.includeCharts}
                  onCheckedChange={(checked) => 
                    setExportOptions(prev => ({ ...prev, includeCharts: !!checked }))
                  }
                />
                <Label htmlFor="charts">Diagram och grafer</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="assumptions"
                  checked={exportOptions.includeAssumptions}
                  onCheckedChange={(checked) => 
                    setExportOptions(prev => ({ ...prev, includeAssumptions: !!checked }))
                  }
                />
                <Label htmlFor="assumptions">Antaganden och förutsättningar</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="scenarios"
                  checked={exportOptions.includeScenarios}
                  onCheckedChange={(checked) => 
                    setExportOptions(prev => ({ ...prev, includeScenarios: !!checked }))
                  }
                />
                <Label htmlFor="scenarios">Scenarioanalys (optimistisk/pessimistisk)</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="logo"
                  checked={exportOptions.companyLogo}
                  onCheckedChange={(checked) => 
                    setExportOptions(prev => ({ ...prev, companyLogo: !!checked }))
                  }
                />
                <Label htmlFor="logo">Inkludera företagslogotyp</Label>
              </div>
            </CardContent>
          </Card>

          {/* Email Options */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">E-post (valfritt)</CardTitle>
              <CardDescription>Skicka rapporten direkt via e-post</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="email">Mottagares e-postadress</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="exempel@företag.se"
                  value={exportOptions.recipientEmail || ''}
                  onChange={(e) => setExportOptions(prev => ({ 
                    ...prev, 
                    recipientEmail: e.target.value 
                  }))}
                />
              </div>
            </CardContent>
          </Card>

          {/* Custom Notes */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Egna anteckningar</CardTitle>
              <CardDescription>Lägg till anpassade kommentarer till rapporten</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Skriv eventuella anteckningar, anpassningar eller kommentarer som ska inkluderas i rapporten..."
                value={exportOptions.customNotes || ''}
                onChange={(e) => setExportOptions(prev => ({ 
                  ...prev, 
                  customNotes: e.target.value 
                }))}
                rows={4}
              />
            </CardContent>
          </Card>

          {/* Preview */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Förhandsvisning</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-50 p-4 rounded-lg text-sm space-y-2">
                <div><strong>Maskin:</strong> {selectedMachine?.name || 'Ingen maskin vald'}</div>
                <div><strong>Månatlig nettovinst:</strong> {formatCurrency(netResults?.netPerMonthExVat || 0)}</div>
                <div><strong>Årlig projekterad vinst:</strong> {formatCurrency((netResults?.netPerMonthExVat || 0) * 12)}</div>
                <div><strong>Format:</strong> {exportOptions?.format?.toUpperCase() || 'PDF'}</div>
                {exportOptions?.recipientEmail && (
                  <div><strong>Skickas till:</strong> {exportOptions.recipientEmail}</div>
                )}
                {!selectedMachine && (
                  <div className="text-orange-600 mt-2 p-2 bg-orange-50 rounded">
                    ⚠️ Välj en maskin för att se korrekt förhandsvisning
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-between pt-4">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Avbryt
            </Button>
            <Button onClick={handleExport} disabled={isExporting}>
              {isExporting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Exporterar...
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  Exportera rapport
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ExportButton;