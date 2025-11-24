import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { date, timeSlot, service, customerName, customerEmail, customerPhone, notes } = body;

    // Validate required fields
    if (!date || !timeSlot || !service || !customerName || !customerEmail || !customerPhone) {
      return NextResponse.json(
        { error: 'Alle velden zijn verplicht' },
        { status: 400 }
      );
    }

    // Check if slot is already taken
    const existingAppointment = await prisma.appointment.findFirst({
      where: {
        date,
        timeSlot,
        status: 'scheduled'
      }
    });

    if (existingAppointment) {
      return NextResponse.json(
        { error: 'Deze tijdslot is al geboekt' },
        { status: 409 }
      );
    }

    // Create appointment
    const appointment = await prisma.appointment.create({
      data: {
        date,
        timeSlot,
        service,
        customerName,
        customerEmail,
        customerPhone,
        notes: notes || null,
        status: 'scheduled'
      }
    });

    // Send confirmation email
    try {
      await resend.emails.send({
        from: 'Barbershop Middelburg <noreply@barbershopmiddelburg.nl>',
        to: customerEmail,
        subject: 'Afspraak Bevestiging - Barbershop Middelburg',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #1a1a1a; color: #ffffff;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #991B1B; margin: 0;">BARBERSHOP</h1>
              <h2 style="color: #991B1B; margin: 0; font-weight: normal;">MIDDELBURG</h2>
            </div>

            <div style="background-color: #141414; border: 1px solid #991B1B; border-radius: 8px; padding: 30px;">
              <h2 style="color: #ffffff; margin-top: 0;">Afspraak Bevestigd!</h2>

              <p style="color: #d1d5db; line-height: 1.6;">
                Beste ${customerName},
              </p>

              <p style="color: #d1d5db; line-height: 1.6;">
                Bedankt voor uw afspraak bij Barbershop Middelburg. Uw afspraak is bevestigd met de volgende details:
              </p>

              <div style="background-color: #1a1a1a; border-left: 3px solid #991B1B; padding: 20px; margin: 20px 0;">
                <p style="margin: 10px 0; color: #ffffff;"><strong style="color: #991B1B;">Datum:</strong> ${new Date(date).toLocaleDateString('nl-NL', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                <p style="margin: 10px 0; color: #ffffff;"><strong style="color: #991B1B;">Tijd:</strong> ${timeSlot}</p>
                <p style="margin: 10px 0; color: #ffffff;"><strong style="color: #991B1B;">Service:</strong> ${getServiceName(service)}</p>
                ${notes ? `<p style="margin: 10px 0; color: #ffffff;"><strong style="color: #991B1B;">Notities:</strong> ${notes}</p>` : ''}
              </div>

              <div style="background-color: rgba(153, 27, 27, 0.1); border-radius: 8px; padding: 15px; margin: 20px 0;">
                <h3 style="color: #991B1B; margin-top: 0; font-size: 16px;">📍 Locatie</h3>
                <p style="color: #d1d5db; margin: 5px 0;">Vlasmarkt 34</p>
                <p style="color: #d1d5db; margin: 5px 0;">4331 PG Middelburg</p>
              </div>

              <p style="color: #d1d5db; line-height: 1.6; margin-top: 20px;">
                We kijken ernaar uit u te verwelkomen!
              </p>

              <p style="color: #d1d5db; line-height: 1.6;">
                Met vriendelijke groet,<br/>
                <strong style="color: #991B1B;">Het Barbershop Middelburg Team</strong>
              </p>
            </div>

            <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #333;">
              <p style="color: #6b7280; font-size: 14px;">
                Vlasmarkt 34, 4331 PG Middelburg<br/>
                Tel: 06 44038086 | Email: info@middelburgbarber.nl
              </p>
            </div>
          </div>
        `
      });
    } catch (emailError) {
      console.error('Failed to send email:', emailError);
      // Don't fail the request if email fails
    }

    return NextResponse.json(appointment, { status: 201 });
  } catch (error) {
    console.error('Error creating appointment:', error);
    return NextResponse.json(
      { error: 'Er is een fout opgetreden bij het maken van de afspraak' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');
    const status = searchParams.get('status') || 'scheduled';

    const where: { status: string; date?: string } = { status };
    if (date) {
      where.date = date;
    }

    const appointments = await prisma.appointment.findMany({
      where,
      orderBy: [
        { date: 'asc' },
        { timeSlot: 'asc' }
      ]
    });

    return NextResponse.json(appointments);
  } catch (error) {
    console.error('Error fetching appointments:', error);
    return NextResponse.json(
      { error: 'Er is een fout opgetreden bij het ophalen van afspraken' },
      { status: 500 }
    );
  }
}

function getServiceName(serviceId: string): string {
  const services: Record<string, string> = {
    haircut: 'Haircut',
    beard: 'Baard Trim',
    shave: 'Scheerbeurt',
    combo: 'Combo Deal',
    kids: 'Kids Haircut',
    vip: 'VIP Treatment'
  };
  return services[serviceId] || serviceId;
}
