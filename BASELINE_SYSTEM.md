# Baseline System för Kalkylatorns Beräkningsmotor

## Översikt

Baseline-systemet är ett omfattande test- och kvalitetssäkringssystem som skapar en "ögonblicksbild" av kalkylatorns korrekta beteende. Detta används för:

- **Regressionstestning**: Säkerställa att nya ändringar inte bryter befintlig funktionalitet
- **Kvalitetssäkring**: Verifiera att alla beräkningar fungerar korrekt
- **Versionhantering**: Spåra förändringar i systemets beteende över tid

## Vad testas i baselinen?

### 1. Omfattande Testfall
- **6 viktiga maskiner**: Emerald, Zerona, FX-635, FX-405, GVL, EVRL
- **3 leasingperioder**: 36, 48, 60 månader
- **2 försäkringsalternativ**: Ja/Nej
- **3 SLA-nivåer**: Brons, Silver, Guld
- **4 behandlingsvolymer**: 2, 4, 6, 8 behandlingar per dag
- **2 leasingmodeller**: Grundleasing och Strategisk
- **3 slidersteg** för grundleasing: 0, 1, 2

**Total**: ~2000+ testfall som täcker alla viktiga kombinationer

### 2. Testsuiter Inkluderade
- **Förbättrade tester**: Moderna strukturerade tester med detaljerad validering
- **Äldre tester**: Kompatibilitet med befintliga testfunktioner
- **Kontantbetalning**: Validering av cash-alternativet

## Hur man använder Baseline-systemet

### Steg 1: Skapa en ny baseline
1. Logga in på admin-panelen
2. Gå till fliken "Beräkningstester"
3. Klicka på **"Skapa Omfattande Baseline"**
4. Vänta medan systemet kör alla tester (kan ta 2-5 minuter)

### Steg 2: Granska resultaten
Efter att baselinen har skapats ser du:
- **Totala testfall**: Antal scenarier som testades
- **Lyckade/Misslyckade**: Framgångsstatistik
- **Framgångsgrad**: Procentuell framgång
- **Detaljerad breakdown**: Per testsvit

### Steg 3: Exportera baselinen
1. Klicka på **"Exportera Resultat"**
2. Två filer laddas ner:
   - `baseline_YYYY-MM-DD.json`: Den officiella baselinen
   - `test-results-YYYY-MM-DD.json`: Komplett testdata

### Steg 4: Spara för versionhantering
- Baselinfilen `baseline_YYYY-MM-DD.json` bör sparas i versionssystemet
- Detta blir "källan till sanning" för systemets förväntade beteende

## Baseline-filens struktur

```json
{
  "metadata": {
    "timestamp": "2024-01-15T10:30:00.000Z",
    "version": "1.0.0",
    "testCases": 2160,
    "environment": "production"
  },
  "testResults": {
    "enhanced": { /* Resultat från förbättrade tester */ },
    "legacy": { /* Resultat från äldre tester */ }
  },
  "detailedCalculations": [
    {
      "testCase": { /* Input-parametrar */ },
      "results": {
        "leasingCost": 25406,
        "creditPrice": 224,
        "netResults": { /* Nettoresultat */ },
        /* ... alla viktiga beräkningsresultat */
      },
      "success": true,
      "errors": []
    }
    /* ... för alla ~2000 testfall */
  ],
  "summary": {
    "totalTests": 2160,
    "successful": 2158,
    "failed": 2,
    "totalErrors": 2,
    "totalWarnings": 0
  }
}
```

## Användning för regressionstestning

### När ska baseline köras?
- **Före större ändringar**: Skapa baseline innan du gör omfattande kodändringar
- **Efter bugfixar**: Verifiera att fixen inte brutit något annat
- **Regelbundet**: Månadsvis eller vid release-planering
- **Vid tvivel**: När något verkar fungera fel

### Vad indikerar en bra baseline?
- **Framgångsgrad > 95%**: Majoriteten av testfall lyckas
- **Konsistenta resultat**: Samma input ger samma output
- **Få/inga kritiska fel**: Inga crash eller ogiltiga värden
- **Logiska värden**: Alla beräkningsresultat är rimliga

### Varningssignaler
- **Framgångsgrad < 90%**: Indikerar systemiska problem
- **Många kritiska fel**: Grundläggande beräkningslogik är trasig
- **Orimliga värden**: T.ex. negativa kostnader eller extremt höga priser
- **Inkonsistens**: Samma input ger olika output

## Exempel på använding

### Scenarie 1: Före en stor uppdatering
```bash
# Skapa baseline före ändring
1. Kör "Skapa Omfattande Baseline"
2. Exportera som "baseline_before_update_YYYY-MM-DD.json"
3. Gör dina ändringar
4. Kör baseline igen
5. Jämför resultaten
```

### Scenarie 2: Debugging en beräkningsbugg
```bash
# Använd baseline för att isolera problemet
1. Kör baseline för att se vilka testfall som misslyckas
2. Fokusera på specifika maskiner/scenarier som har problem
3. Använd "Test Emerald" eller "Test Zerona" för snabbare iteration
4. Fixa problemet
5. Verifiera med ny baseline
```

## Tekniska detaljer

### Testfall-generering
Systemet genererar testfall genom att kombinera alla relevanta parametrar:
- Maskiner filtreras baserat på om de använder credits
- Kontantbetalning testas för utvalda maskiner
- Flatrate aktiveras automatiskt för Silver/Guld SLA

### Normalisering
- Växelkurs normaliseras till 11.4926 för konsistenta jämförelser
- Avrundning sker konsekvent enligt systemets regler
- Tidsvariabler standardiseras

### Felhantering
- Kritiska fel loggas men bryter inte hela baseline-körningen
- Varningar samlas och rapporteras separat
- Timeout-hantering för långsamma beräkningar

## Framtida förbättringar

### Planerade funktioner
- **Baseline-jämförelse**: Automatisk jämförelse mellan två baselines
- **Trendanalys**: Spåra förändringar över tid
- **Automatiserade rapporter**: Schemalagda baseline-körningar
- **Performance-mätning**: Tid för olika beräkningstyper

### Integration med CI/CD
Baseline-systemet kan integreras med automatiserad testing:
- Kör baseline vid varje deployment
- Automatisk varning vid degradation
- Blockera releases med för många fel

## Support och felsökning

### Vanliga problem
1. **Låg framgångsgrad**: Kontrollera nyligen gjorda ändringar i beräkningsmotorn
2. **Långsam körning**: Normalt 2-5 minuter, kontakta utvecklare om längre
3. **Export misslyckas**: Kontrollera webbläsarens download-inställningar

### Få hjälp
- Kontrollera konsoll-loggar för detaljerade felmeddelanden
- Exportera resultat och skicka till utvecklingsteamet
- Använd specifika maskintester för snabbare debugging

---

*Senast uppdaterad: 2024-01-15*
*Version: 1.0.0*