# Barbershop Middelburg Website

Een moderne, professionele website voor Barbershop Middelburg met volledig functioneel afsprakensysteem en personeelsdashboard.

## Features

### Klantenzijde (/)
- 🎨 Vintage dark theme met rood/navy kleurenschema
- 📅 Volledig werkend afsprakensysteem
  - Interactieve kalender
  - Tijd slot selectie
  - Service keuze (6 verschillende diensten)
  - Contactformulier
  - **E-mail bevestigingen** 📧
- 📱 Volledig responsive design
- 🏆 Services overzicht met prijzen
- 📊 Over ons met statistieken
- 📍 Contact informatie

### Personeelsdashboard (/personeel)
- 📊 KPI Dashboard (totaal, week, maand, geannuleerd)
- 🔍 Zoekfunctionaliteit
- 📅 Interactieve kalender
- 👁️ Dag/week weergave
- 🔄 Drag & drop voor afspraken verplaatsen
- ✅ Appointment management
- 🗄️ **Database integratie**

## Tech Stack

- **Framework**: Next.js 15 met TypeScript
- **Package Manager**: Bun
- **Styling**: Tailwind CSS + shadcn/ui
- **Database**: Prisma ORM + SQLite
- **E-mail**: Resend
- **Icons**: Lucide React

## Setup Instructies

### 1. Dependencies installeren

\`\`\`bash
bun install
\`\`\`

### 2. Database setup

De database wordt automatisch aangemaakt bij de eerste keer draaien. Als je de database wilt resetten:

\`\`\`bash
# Reset database
rm prisma/dev.db

# Run migrations
bunx prisma migrate dev
\`\`\`

### 3. E-mail configuratie (BELANGRIJK)

Om e-mail bevestigingen te kunnen versturen, heb je een Resend API key nodig:

1. Ga naar [resend.com](https://resend.com) en maak een gratis account
2. Maak een API key aan in het dashboard
3. Update de `.env` file:

\`\`\`env
DATABASE_URL="file:./prisma/dev.db"
RESEND_API_KEY=re_jouw_api_key_hier
\`\`\`

**Let op**: Zonder een geldige Resend API key worden afspraken nog steeds opgeslagen in de database, maar worden er geen e-mails verzonden.

### 4. Development server starten

\`\`\`bash
bun run dev
\`\`\`

De website is nu beschikbaar op [http://localhost:3000](http://localhost:3000)

## API Endpoints

### Afspraken

#### POST /api/appointments
Maak een nieuwe afspraak aan.

**Body:**
\`\`\`json
{
  "date": "2025-11-22",
  "timeSlot": "09:00",
  "service": "haircut",
  "customerName": "Jan Bakker",
  "customerEmail": "jan@example.com",
  "customerPhone": "06 12345678",
  "notes": "Optionele notities"
}
\`\`\`

**Response:**
- 201: Afspraak aangemaakt + e-mail verstuurd
- 400: Validatie error
- 409: Tijdslot al geboekt
- 500: Server error

#### GET /api/appointments
Haal alle afspraken op (voor personeelsdashboard).

**Query Parameters:**
- \`date\`: Filter op specifieke datum (optioneel)
- \`status\`: Filter op status (default: "scheduled")

#### PATCH /api/appointments/[id]
Update een afspraak (bijv. verplaatsen naar andere datum/tijd).

**Body:**
\`\`\`json
{
  "date": "2025-11-23",
  "timeSlot": "10:00"
}
\`\`\`

#### DELETE /api/appointments/[id]
Annuleer een afspraak (soft delete - status wordt "cancelled").

## Database Schema

\`\`\`prisma
model Appointment {
  id            String   @id @default(cuid())
  date          String   // ISO date string
  timeSlot      String   // e.g., "09:00"
  service       String   // e.g., "haircut", "beard", etc.
  customerName  String
  customerEmail String
  customerPhone String
  notes         String?
  status        String   @default("scheduled") // scheduled, cancelled, completed
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}
\`\`\`

## Prisma Commands

\`\`\`bash
# View database in browser
bunx prisma studio

# Reset database
bunx prisma migrate reset

# Generate Prisma Client
bunx prisma generate
\`\`\`

## Services

De volgende diensten zijn beschikbaar:

| ID | Naam | Prijs | Duur |
|----|------|-------|------|
| haircut | Haircut | €25 - €35 | 30 min |
| beard | Baard Trim | €20 - €30 | 20 min |
| shave | Scheerbeurt | €30 - €40 | 45 min |
| combo | Combo Deal | €40 - €55 | 60 min |
| kids | Kids Haircut | €15 - €20 | 25 min |
| vip | VIP Treatment | €65 - €85 | 90 min |

## E-mail Templates

De e-mail bevestigingen bevatten:
- ✅ Afspraak details (datum, tijd, service)
- 📍 Locatie informatie
- 📞 Contact gegevens
- 🎨 Branded design met Barbershop Middelburg styling

## Deployment

Voor productie deployment:

1. Update `DATABASE_URL` naar een productie database (PostgreSQL aanbevolen)
2. Update Resend API key met productie credentials
3. Update "from" email adres in \`/api/appointments/route.ts\` naar je geverifieerde domein
4. Deploy naar Vercel/Netlify

## Troubleshooting

### E-mails worden niet verzonden
- Controleer of \`RESEND_API_KEY\` correct is ingesteld in \`.env\`
- Controleer de console voor error messages
- Voor productie: verifieer je domein in Resend dashboard

### Database errors
- Run \`bunx prisma migrate reset\` om database te resetten
- Controleer of \`DATABASE_URL\` correct is in \`.env\`

### Hydration warnings
- Dit is een bekend Next.js issue met complexe SVG's en datum handling
- De warnings hebben geen invloed op functionaliteit

## Licentie

© 2025 Barbershop Middelburg. Alle rechten voorbehouden.
