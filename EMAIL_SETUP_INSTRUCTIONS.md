För att använda e-postfunktionaliteten behöver du konfigurera en Resend API-nyckel.

<lov-actions>
  <lov-secret-form name="RESEND_API_KEY"></lov-secret-form>
</lov-actions>

När du har lagt till API-nyckeln kommer systemet att automatiskt skicka e-postnotifikationer till återförsäljaren när:
1. En ny användare registrerar sig och startar en kalkylatorsession
2. Användaren gör betydelsefulla justeringar i kalkylatorn

Du behöver också uppdatera e-postadressen i `supabase/functions/send-dealer-notification/index.ts` från `dealer@example.com` till din faktiska e-postadress.