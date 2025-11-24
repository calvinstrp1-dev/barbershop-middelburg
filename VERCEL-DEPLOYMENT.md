# Vercel Deployment Instructies

## ⚠️ Belangrijke Database Informatie

**SQLite werkt NIET in Vercel's serverless omgeving!**

U moet overschakelen naar een productie-database zoals PostgreSQL.

## 🚀 Stap-voor-Stap Deployment

### 1. Database Setup (Vercel Postgres)

1. Ga naar uw Vercel project dashboard
2. Klik op de "Storage" tab
3. Klik op "Create Database"
4. Selecteer "Postgres"
5. Volg de instructies om de database aan te maken
6. Vercel zal automatisch de `DATABASE_URL` environment variable toevoegen

### 2. Prisma Schema Aanpassen voor PostgreSQL

Update `prisma/schema.prisma`:

```prisma
datasource db {
  provider = "postgresql"  // Verander van "sqlite" naar "postgresql"
}
```

### 3. Environment Variables in Vercel

Ga naar Project Settings > Environment Variables en voeg toe:

```
DATABASE_URL=<automatisch toegevoegd door Vercel Postgres>
RESEND_API_KEY=<uw Resend API key>
```

### 4. Database Migraties

Na deployment, run de migraties in Vercel CLI of via een deploy hook:

```bash
npx prisma migrate deploy
```

## 🔧 Alternatief: Externe Database Providers

Als u geen Vercel Postgres wilt gebruiken, zijn dit goede alternatieven:

### Option 1: Supabase (Gratis tier beschikbaar)
1. Maak een account op [supabase.com](https://supabase.com)
2. Maak een nieuw project
3. Kopieer de PostgreSQL connection string
4. Voeg toe als `DATABASE_URL` in Vercel

### Option 2: Railway (Gratis tier beschikbaar)
1. Maak een account op [railway.app](https://railway.app)
2. Maak een nieuwe PostgreSQL database
3. Kopieer de connection string
4. Voeg toe als `DATABASE_URL` in Vercel

### Option 3: Neon (Gratis tier beschikbaar)
1. Maak een account op [neon.tech](https://neon.tech)
2. Maak een nieuw project
3. Kopieer de connection string
4. Voeg toe als `DATABASE_URL` in Vercel

## 📝 Deployment Checklist

- [ ] Database provider gekozen en aangemaakt
- [ ] `prisma/schema.prisma` aangepast naar `postgresql`
- [ ] `DATABASE_URL` toegevoegd in Vercel Environment Variables
- [ ] `RESEND_API_KEY` toegevoegd in Vercel Environment Variables
- [ ] Code gepushed naar GitHub
- [ ] Vercel deployment gestart
- [ ] Database migraties uitgevoerd
- [ ] Logo geüpload naar `/public/logo.png` in repository

## 🔍 Troubleshooting

### Build Error: "Unexpected any"
Dit is al opgelost in de code. Push de laatste wijzigingen naar GitHub.

### Error: "Can't reach database server"
Controleer of `DATABASE_URL` correct is ingesteld in Vercel Environment Variables.

### Error: "Prisma Client not generated"
Dit wordt automatisch opgelost door het `postinstall` script in `package.json`.

### Email niet verzonden
Controleer of `RESEND_API_KEY` correct is ingesteld in Vercel Environment Variables.

## 🎯 Na Deployment

1. Test het afsprakensysteem
2. Controleer of e-mails worden verzonden
3. Upload uw logo naar de repository
4. Test het personeelsdashboard

## 💡 Tips

- Gebruik Vercel's preview deployments om te testen voordat je live gaat
- Monitor de database grootte (gratis tiers hebben limieten)
- Maak regelmatig backups van de database
- Houd uw `RESEND_API_KEY` geheim!

## 📧 Email Setup

Voor productie e-mails moet u uw domein verifiëren in Resend:

1. Ga naar [resend.com](https://resend.com) dashboard
2. Voeg uw domein toe
3. Configureer DNS records (SPF, DKIM, DMARC)
4. Update het "from" e-mailadres in `src/app/api/appointments/route.ts`

Van:
```typescript
from: 'Barbershop Middelburg <noreply@barbershopmiddelburg.nl>',
```

Naar uw geverifieerde domein:
```typescript
from: 'Barbershop Middelburg <noreply@uwdomein.nl>',
```

## ✅ Klaar!

Na deze stappen zou uw website live moeten staan op Vercel! 🎉
