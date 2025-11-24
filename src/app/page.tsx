'use client';

import { Menu, X, Scissors, Clock, MapPin, Phone, Mail, Calendar, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Appointment booking state
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [currentMonth, setCurrentMonth] = useState<Date | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [bookingComplete, setBookingComplete] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize date on client side only to avoid hydration mismatch
  useEffect(() => {
    setCurrentMonth(new Date());
    setMounted(true);
  }, []);

  // Services data
  const services = [
    { id: 'haircut', name: 'Haircut', price: '€25 - €35', duration: '30 min' },
    { id: 'beard', name: 'Baard Trim', price: '€20 - €30', duration: '20 min' },
    { id: 'shave', name: 'Scheerbeurt', price: '€30 - €40', duration: '45 min' },
    { id: 'combo', name: 'Combo Deal', price: '€40 - €55', duration: '60 min' },
    { id: 'kids', name: 'Kids Haircut', price: '€15 - €20', duration: '25 min' },
    { id: 'vip', name: 'VIP Treatment', price: '€65 - €85', duration: '90 min' }
  ];

  // Available time slots
  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
    '16:00', '16:30', '17:00', '17:30', '18:00', '18:30'
  ];

  // Calendar functions
  const getDaysInMonth = (date: Date | null) => {
    if (!date) return { daysInMonth: 0, startingDayOfWeek: 0 };

    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek };
  };

  const isDateAvailable = (date: Date) => {
    const day = date.getDay();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Not available on Sundays (day 0) or past dates
    return day !== 0 && date >= today;
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('nl-NL', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  };

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate || !selectedTime || !selectedService || !formData.name || !formData.email || !formData.phone) {
      setError('Vul alle velden in');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          date: selectedDate.toISOString().split('T')[0],
          timeSlot: selectedTime,
          service: selectedService,
          customerName: formData.name,
          customerEmail: formData.email,
          customerPhone: formData.phone,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Er is een fout opgetreden');
      }

      setBookingComplete(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Er is een fout opgetreden');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetBooking = () => {
    setSelectedDate(null);
    setSelectedTime(null);
    setSelectedService(null);
    setFormData({ name: '', email: '', phone: '' });
    setBookingComplete(false);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-[#141414]">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#1a1a1a]/95 backdrop-blur-sm border-b border-barber-red/20">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <a href="#home" className="flex items-center gap-3">
              <img
                src="/logo.png"
                alt="Barbershop Middelburg"
                className="h-14 w-auto object-contain"
              />
            </a>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#home" className="text-gray-300 hover:text-barber-red transition-colors">Home</a>
              <a href="#diensten" className="text-gray-300 hover:text-barber-red transition-colors">Diensten</a>
              <a href="#afspraken" className="text-barber-red font-semibold hover:text-barber-red/80 transition-colors">Afspraak</a>
              <a href="#over" className="text-gray-300 hover:text-barber-red transition-colors">Over Ons</a>
              <a href="#contact" className="text-gray-300 hover:text-barber-red transition-colors">Contact</a>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-barber-red"
            >
              {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-4 pb-4 flex flex-col gap-4">
              <a href="#home" className="text-gray-300 hover:text-barber-red transition-colors" onClick={() => setMobileMenuOpen(false)}>Home</a>
              <a href="#diensten" className="text-gray-300 hover:text-barber-red transition-colors" onClick={() => setMobileMenuOpen(false)}>Diensten</a>
              <a href="#afspraken" className="text-barber-red font-semibold hover:text-barber-red/80 transition-colors" onClick={() => setMobileMenuOpen(false)}>Afspraak</a>
              <a href="#over" className="text-gray-300 hover:text-barber-red transition-colors" onClick={() => setMobileMenuOpen(false)}>Over Ons</a>
              <a href="#contact" className="text-gray-300 hover:text-barber-red transition-colors" onClick={() => setMobileMenuOpen(false)}>Contact</a>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="relative min-h-screen flex items-center pt-20 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 2px, #991B1B 2px, #991B1B 4px)`,
            backgroundSize: '100% 50px'
          }} />
        </div>

        <div className="max-w-7xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-12 items-center relative z-10">
          {/* Left Side - Logo Illustration */}
          <div className="relative flex justify-center">
            <div className="relative">
              {/* Decorative elements */}
              <div className="absolute -top-8 -left-8 w-32 h-32 border-2 border-barber-red/30 rounded-full" />
              <div className="absolute -bottom-8 -right-8 w-24 h-24 border-2 border-barber-navy/30" />

              {/* Large Logo */}
              <div className="relative w-96 h-96 flex items-center justify-center">
                <img
                  src="/logo.png"
                  alt="Barbershop Middelburg Logo"
                  className="w-full h-full drop-shadow-2xl object-contain"
                />
              </div>
            </div>
          </div>

          {/* Right Side - Content */}
          <div className="text-center md:text-left">
            <div className="inline-block mb-4">
              <div className="flex items-center gap-2 text-barber-red/80 text-sm tracking-widest mb-2">
                <div className="h-px w-12 bg-barber-red/50" />
                <span>SINDS 2005</span>
                <div className="h-px w-12 bg-barber-red/50" />
              </div>
            </div>

            <h1 className="text-6xl md:text-7xl font-bold text-white mb-2 tracking-tight">
              BARBERSHOP
            </h1>
            <h1 className="text-5xl md:text-6xl font-bold text-barber-red mb-4 tracking-tight">
              MIDDELBURG
            </h1>

            <div className="flex items-center justify-center md:justify-start gap-3 mb-6">
              <Scissors className="w-6 h-6 text-barber-red" />
              <h2 className="text-2xl md:text-3xl text-gray-300 font-light tracking-wider">
                The Gentleman's Cut
              </h2>
            </div>

            <p className="text-gray-400 text-lg mb-8 max-w-lg leading-relaxed">
              Welkom bij Barbershop Middelburg waar traditie en moderne stijl samenkomen.
              Ervaar de kunst van klassiek vakmanschap met een hedendaagse touch.
            </p>

            <a
              href="#diensten"
              className="inline-block px-8 py-4 border-2 border-barber-red text-barber-red hover:bg-barber-red hover:text-white transition-all duration-300 tracking-wider font-medium"
            >
              BEKIJK DIENSTEN
            </a>

            {/* Badge */}
            <div className="mt-12 inline-flex items-center gap-4 text-barber-red/60 text-sm">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full border-2 border-barber-red/40 flex items-center justify-center mb-2">
                  <span className="text-barber-red font-bold">20+</span>
                </div>
                <span className="text-xs">Jaar Ervaring</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="diensten" className="py-20 bg-[#1a1a1a] relative">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-barber-red/50 to-transparent" />

        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-block mb-4">
              <div className="flex items-center gap-2 text-barber-red/80 text-sm tracking-widest">
                <div className="h-px w-12 bg-barber-red/50" />
                <span>ONZE DIENSTEN</span>
                <div className="h-px w-12 bg-barber-red/50" />
              </div>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Premium Services</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Ontdek onze exclusieve diensten, uitgevoerd door ervaren barbiers
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Service 1 */}
            <div className="group bg-[#141414] border border-barber-red/20 p-8 hover:border-barber-red/60 transition-all duration-300 hover:shadow-lg hover:shadow-barber-red/10">
              <div className="w-16 h-16 border-2 border-barber-red/40 rounded-full flex items-center justify-center mb-6 group-hover:border-barber-red transition-colors">
                <Scissors className="w-8 h-8 text-barber-red" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Haircut</h3>
              <p className="text-gray-400 mb-4 leading-relaxed">
                Klassieke en moderne knipbeurten, gepersonaliseerd naar jouw stijl en gezichtsvorm.
              </p>
              <div className="text-barber-red font-bold text-xl">€25 - €35</div>
            </div>

            {/* Service 2 */}
            <div className="group bg-[#141414] border border-barber-red/20 p-8 hover:border-barber-red/60 transition-all duration-300 hover:shadow-lg hover:shadow-barber-red/10">
              <div className="w-16 h-16 border-2 border-barber-red/40 rounded-full flex items-center justify-center mb-6 group-hover:border-barber-red transition-colors">
                <svg className="w-8 h-8 text-barber-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Baard Trim</h3>
              <p className="text-gray-400 mb-4 leading-relaxed">
                Professionele baard styling en onderhoud met warme handdoek behandeling.
              </p>
              <div className="text-barber-red font-bold text-xl">€20 - €30</div>
            </div>

            {/* Service 3 */}
            <div className="group bg-[#141414] border border-barber-red/20 p-8 hover:border-barber-red/60 transition-all duration-300 hover:shadow-lg hover:shadow-barber-red/10">
              <div className="w-16 h-16 border-2 border-barber-red/40 rounded-full flex items-center justify-center mb-6 group-hover:border-barber-red transition-colors">
                <svg className="w-8 h-8 text-barber-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Scheerbeurt</h3>
              <p className="text-gray-400 mb-4 leading-relaxed">
                Traditionele scheerbeurt met warm scheerschuim en stalen scheermes.
              </p>
              <div className="text-barber-red font-bold text-xl">€30 - €40</div>
            </div>

            {/* Service 4 */}
            <div className="group bg-[#141414] border border-barber-red/20 p-8 hover:border-barber-red/60 transition-all duration-300 hover:shadow-lg hover:shadow-barber-red/10">
              <div className="w-16 h-16 border-2 border-barber-red/40 rounded-full flex items-center justify-center mb-6 group-hover:border-barber-red transition-colors">
                <svg className="w-8 h-8 text-barber-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Combo Deal</h3>
              <p className="text-gray-400 mb-4 leading-relaxed">
                Haircut en baard trim in één sessie voor de complete verzorging.
              </p>
              <div className="text-barber-red font-bold text-xl">€40 - €55</div>
            </div>

            {/* Service 5 */}
            <div className="group bg-[#141414] border border-barber-red/20 p-8 hover:border-barber-red/60 transition-all duration-300 hover:shadow-lg hover:shadow-barber-red/10">
              <div className="w-16 h-16 border-2 border-barber-red/40 rounded-full flex items-center justify-center mb-6 group-hover:border-barber-red transition-colors">
                <svg className="w-8 h-8 text-barber-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Kids Haircut</h3>
              <p className="text-gray-400 mb-4 leading-relaxed">
                Speciale knipbeurt voor kinderen tot 12 jaar in een relaxte sfeer.
              </p>
              <div className="text-barber-red font-bold text-xl">€15 - €20</div>
            </div>

            {/* Service 6 */}
            <div className="group bg-[#141414] border border-barber-red/20 p-8 hover:border-barber-red/60 transition-all duration-300 hover:shadow-lg hover:shadow-barber-red/10">
              <div className="w-16 h-16 border-2 border-barber-red/40 rounded-full flex items-center justify-center mb-6 group-hover:border-barber-red transition-colors">
                <svg className="w-8 h-8 text-barber-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">VIP Treatment</h3>
              <p className="text-gray-400 mb-4 leading-relaxed">
                Complete verzorging met massage, styling en premium producten.
              </p>
              <div className="text-barber-red font-bold text-xl">€65 - €85</div>
            </div>
          </div>
        </div>
      </section>

      {/* Appointment Booking Section */}
      <section id="afspraken" className="py-20 bg-[#141414] relative">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-barber-red/50 to-transparent" />

        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-block mb-4">
              <div className="flex items-center gap-2 text-barber-red/80 text-sm tracking-widest">
                <div className="h-px w-12 bg-barber-red/50" />
                <span>AFSPRAAK MAKEN</span>
                <div className="h-px w-12 bg-barber-red/50" />
              </div>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Boek Uw Afspraak</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Plan eenvoudig uw bezoek aan Barbershop Middelburg
            </p>
          </div>

          {!mounted ? (
            <div className="text-center text-gray-400 py-12">
              <div className="inline-block animate-pulse">Laden...</div>
            </div>
          ) : !bookingComplete ? (
            <div className="max-w-6xl mx-auto">
              <div className="grid md:grid-cols-2 gap-8">
                {/* Left Column - Calendar and Time Slots */}
                <div className="space-y-6">
                  {/* Calendar */}
                  <div className="bg-[#1a1a1a] border border-barber-red/20 p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-barber-red" />
                        Kies een Datum
                      </h3>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            if (!currentMonth) return;
                            const newDate = new Date(currentMonth);
                            newDate.setMonth(newDate.getMonth() - 1);
                            setCurrentMonth(newDate);
                          }}
                          className="p-2 hover:bg-barber-red/10 rounded transition-colors"
                        >
                          <ChevronLeft className="w-5 h-5 text-barber-red" />
                        </button>
                        <span className="text-white font-medium min-w-[150px] text-center">
                          {currentMonth?.toLocaleDateString('nl-NL', { month: 'long', year: 'numeric' }) || '...'}
                        </span>
                        <button
                          onClick={() => {
                            if (!currentMonth) return;
                            const newDate = new Date(currentMonth);
                            newDate.setMonth(newDate.getMonth() + 1);
                            setCurrentMonth(newDate);
                          }}
                          className="p-2 hover:bg-barber-red/10 rounded transition-colors"
                        >
                          <ChevronRight className="w-5 h-5 text-barber-red" />
                        </button>
                      </div>
                    </div>

                    {/* Calendar Grid */}
                    <div className="grid grid-cols-7 gap-2">
                      {['Zo', 'Ma', 'Di', 'Wo', 'Do', 'Vr', 'Za'].map((day) => (
                        <div key={day} className="text-center text-gray-500 text-sm font-medium py-2">
                          {day}
                        </div>
                      ))}

                      {(() => {
                        if (!currentMonth) return null;

                        const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentMonth);
                        const days = [];

                        // Empty cells before month starts
                        for (let i = 0; i < startingDayOfWeek; i++) {
                          days.push(<div key={`empty-${i}`} className="aspect-square" />);
                        }

                        // Days of the month
                        for (let day = 1; day <= daysInMonth; day++) {
                          const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
                          const available = isDateAvailable(date);
                          const isSelected = selectedDate?.toDateString() === date.toDateString();

                          days.push(
                            <button
                              key={day}
                              onClick={() => available && setSelectedDate(date)}
                              disabled={!available}
                              className={`aspect-square rounded flex items-center justify-center text-sm font-medium transition-all
                                ${isSelected
                                  ? 'bg-barber-red text-white'
                                  : available
                                    ? 'bg-[#141414] text-white hover:bg-barber-red/20 hover:border-barber-red/40 border border-transparent'
                                    : 'text-gray-600 cursor-not-allowed'
                                }`}
                            >
                              {day}
                            </button>
                          );
                        }

                        return days;
                      })()}
                    </div>

                    {selectedDate && (
                      <div className="mt-4 p-3 bg-barber-red/10 border border-barber-red/30 rounded">
                        <p className="text-barber-red text-sm font-medium">
                          Geselecteerd: {formatDate(selectedDate)}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Time Slots */}
                  {selectedDate && (
                    <div className="bg-[#1a1a1a] border border-barber-red/20 p-6">
                      <h3 className="text-xl font-bold text-white flex items-center gap-2 mb-4">
                        <Clock className="w-5 h-5 text-barber-red" />
                        Kies een Tijd
                      </h3>
                      <div className="grid grid-cols-3 gap-2">
                        {timeSlots.map((time) => (
                          <button
                            key={time}
                            onClick={() => setSelectedTime(time)}
                            className={`py-3 px-4 rounded text-sm font-medium transition-all
                              ${selectedTime === time
                                ? 'bg-barber-red text-white'
                                : 'bg-[#141414] text-gray-300 hover:bg-barber-red/20 hover:border-barber-red/40 border border-transparent'
                              }`}
                          >
                            {time}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Right Column - Service Selection and Form */}
                <div className="space-y-6">
                  {/* Service Selection */}
                  <div className="bg-[#1a1a1a] border border-barber-red/20 p-6">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2 mb-4">
                      <Scissors className="w-5 h-5 text-barber-red" />
                      Kies een Service
                    </h3>
                    <div className="space-y-2">
                      {services.map((service) => (
                        <button
                          key={service.id}
                          onClick={() => setSelectedService(service.id)}
                          className={`w-full p-4 rounded text-left transition-all
                            ${selectedService === service.id
                              ? 'bg-barber-red text-white border-barber-red'
                              : 'bg-[#141414] text-gray-300 hover:bg-barber-red/20 border-transparent'
                            } border-2`}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-bold">{service.name}</div>
                              <div className="text-sm opacity-80">{service.duration}</div>
                            </div>
                            <div className="font-bold">{service.price}</div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Contact Form */}
                  {selectedDate && selectedTime && selectedService && (
                    <div className="bg-[#1a1a1a] border border-barber-red/20 p-6">
                      <h3 className="text-xl font-bold text-white mb-4">Uw Gegevens</h3>
                      <form onSubmit={handleBooking} className="space-y-4">
                        <div>
                          <label className="block text-gray-400 text-sm mb-2">Naam *</label>
                          <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-4 py-3 bg-[#141414] border border-gray-700 text-white rounded focus:border-barber-red focus:outline-none"
                            placeholder="Uw naam"
                          />
                        </div>
                        <div>
                          <label className="block text-gray-400 text-sm mb-2">Email *</label>
                          <input
                            type="email"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full px-4 py-3 bg-[#141414] border border-gray-700 text-white rounded focus:border-barber-red focus:outline-none"
                            placeholder="uw@email.nl"
                          />
                        </div>
                        <div>
                          <label className="block text-gray-400 text-sm mb-2">Telefoon *</label>
                          <input
                            type="tel"
                            required
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            className="w-full px-4 py-3 bg-[#141414] border border-gray-700 text-white rounded focus:border-barber-red focus:outline-none"
                            placeholder="06 12345678"
                          />
                        </div>

                        {error && (
                          <div className="bg-red-500/10 border border-red-500/50 rounded p-3 text-red-400 text-sm">
                            {error}
                          </div>
                        )}

                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="w-full py-4 bg-barber-red text-white font-bold rounded hover:bg-barber-red/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isSubmitting ? 'BEZIG MET BOEKEN...' : 'BEVESTIG AFSPRAAK'}
                        </button>
                      </form>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            // Booking Confirmation
            <div className="max-w-2xl mx-auto bg-[#1a1a1a] border-2 border-barber-red p-8 rounded text-center">
              <div className="w-20 h-20 bg-barber-red rounded-full flex items-center justify-center mx-auto mb-6">
                <Check className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-white mb-4">Afspraak Bevestigd!</h3>
              <div className="space-y-3 text-gray-300 mb-8">
                <p className="text-lg">
                  <strong className="text-barber-red">Datum:</strong> {selectedDate && formatDate(selectedDate)}
                </p>
                <p className="text-lg">
                  <strong className="text-barber-red">Tijd:</strong> {selectedTime}
                </p>
                <p className="text-lg">
                  <strong className="text-barber-red">Service:</strong> {services.find(s => s.id === selectedService)?.name}
                </p>
                <p className="text-lg">
                  <strong className="text-barber-red">Naam:</strong> {formData.name}
                </p>
              </div>
              <p className="text-gray-400 mb-6">
                U ontvangt een bevestigingsmail op <strong className="text-white">{formData.email}</strong>
              </p>
              <button
                onClick={resetBooking}
                className="px-8 py-3 border-2 border-barber-red text-barber-red hover:bg-barber-red hover:text-white transition-all font-medium"
              >
                NIEUWE AFSPRAAK MAKEN
              </button>
            </div>
          )}
        </div>
      </section>

      {/* About Section */}
      <section id="over" className="py-20 bg-[#141414] relative">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-barber-red/50 to-transparent" />

        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block mb-4">
                <div className="flex items-center gap-2 text-barber-red/80 text-sm tracking-widest">
                  <div className="h-px w-12 bg-barber-red/50" />
                  <span>OVER ONS</span>
                  <div className="h-px w-12 bg-barber-red/50" />
                </div>
              </div>

              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Traditie & Vakmanschap
              </h2>

              <p className="text-gray-400 text-lg mb-6 leading-relaxed">
                Sinds 2005 is Barbershop Middelburg dé bestemming voor de moderne gentleman die kwaliteit en stijl waardeert.
                Onze barbershop combineert klassieke technieken met hedendaagse trends.
              </p>

              <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                Ons team van ervaren barbiers staat klaar om je te voorzien van een premium ervaring.
                Van een strakke fade tot een klassieke scheerbeurt, wij leveren altijd topkwaliteit.
              </p>

              <div className="grid grid-cols-2 gap-6">
                <div className="border-l-2 border-barber-red/50 pl-6">
                  <div className="text-3xl font-bold text-barber-red mb-2">20+</div>
                  <div className="text-gray-400">Jaar Ervaring</div>
                </div>
                <div className="border-l-2 border-barber-red/50 pl-6">
                  <div className="text-3xl font-bold text-barber-red mb-2">5000+</div>
                  <div className="text-gray-400">Tevreden Klanten</div>
                </div>
                <div className="border-l-2 border-barber-red/50 pl-6">
                  <div className="text-3xl font-bold text-barber-red mb-2">5</div>
                  <div className="text-gray-400">Expert Barbiers</div>
                </div>
                <div className="border-l-2 border-barber-red/50 pl-6">
                  <div className="text-3xl font-bold text-barber-red mb-2">100%</div>
                  <div className="text-gray-400">Tevredenheid</div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="relative h-[500px] bg-[#1a1a1a] border-2 border-barber-red/30 p-8 flex items-center justify-center">
                {/* Custom Barbershop Icons SVG */}
                <svg viewBox="0 0 400 400" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                  {/* Scissors */}
                  <g transform="translate(80, 80)">
                    <circle cx="20" cy="20" r="15" fill="none" stroke="#991B1B" strokeWidth="3"/>
                    <circle cx="60" cy="60" r="15" fill="none" stroke="#991B1B" strokeWidth="3"/>
                    <line x1="20" y1="20" x2="60" y2="60" stroke="#991B1B" strokeWidth="3"/>
                    <line x1="20" y1="20" x2="10" y2="70" stroke="#991B1B" strokeWidth="3"/>
                    <line x1="60" y1="60" x2="70" y2="10" stroke="#991B1B" strokeWidth="3"/>
                  </g>

                  {/* Comb */}
                  <g transform="translate(220, 80)">
                    <rect x="0" y="0" width="80" height="15" fill="none" stroke="#1e293b" strokeWidth="3"/>
                    <line x1="10" y1="15" x2="10" y2="35" stroke="#1e293b" strokeWidth="3"/>
                    <line x1="20" y1="15" x2="20" y2="35" stroke="#1e293b" strokeWidth="3"/>
                    <line x1="30" y1="15" x2="30" y2="35" stroke="#1e293b" strokeWidth="3"/>
                    <line x1="40" y1="15" x2="40" y2="35" stroke="#1e293b" strokeWidth="3"/>
                    <line x1="50" y1="15" x2="50" y2="35" stroke="#1e293b" strokeWidth="3"/>
                    <line x1="60" y1="15" x2="60" y2="35" stroke="#1e293b" strokeWidth="3"/>
                    <line x1="70" y1="15" x2="70" y2="35" stroke="#1e293b" strokeWidth="3"/>
                  </g>

                  {/* Razor */}
                  <g transform="translate(80, 220)">
                    <rect x="0" y="0" width="15" height="50" rx="7" fill="none" stroke="#991B1B" strokeWidth="3"/>
                    <path d="M 7.5 50 L 40 80" stroke="#991B1B" strokeWidth="3"/>
                    <path d="M 7.5 50 L 40 90" stroke="#991B1B" strokeWidth="3"/>
                    <path d="M 40 80 L 40 90" stroke="#991B1B" strokeWidth="3"/>
                  </g>

                  {/* Barber Pole */}
                  <g transform="translate(220, 220)">
                    <rect x="30" y="0" width="20" height="80" fill="none" stroke="#1e293b" strokeWidth="3"/>
                    <line x1="30" y1="10" x2="50" y2="20" stroke="#991B1B" strokeWidth="2"/>
                    <line x1="30" y1="30" x2="50" y2="40" stroke="#991B1B" strokeWidth="2"/>
                    <line x1="30" y1="50" x2="50" y2="60" stroke="#991B1B" strokeWidth="2"/>
                    <line x1="30" y1="70" x2="50" y2="80" stroke="#991B1B" strokeWidth="2"/>
                    <circle cx="40" cy="-5" r="8" fill="none" stroke="#1e293b" strokeWidth="3"/>
                    <circle cx="40" cy="85" r="8" fill="none" stroke="#1e293b" strokeWidth="3"/>
                  </g>
                </svg>
              </div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 border-2 border-barber-navy/30" />
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-[#1a1a1a] relative">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-barber-red/50 to-transparent" />

        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-block mb-4">
              <div className="flex items-center gap-2 text-barber-red/80 text-sm tracking-widest">
                <div className="h-px w-12 bg-barber-red/50" />
                <span>CONTACT</span>
                <div className="h-px w-12 bg-barber-red/50" />
              </div>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Bezoek Ons</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Loop binnen of maak een afspraak. Wij staan voor je klaar.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Location */}
            <div className="bg-[#141414] border border-barber-red/20 p-8 text-center hover:border-barber-red/60 transition-all duration-300">
              <div className="w-16 h-16 border-2 border-barber-red/40 rounded-full flex items-center justify-center mb-6 mx-auto">
                <MapPin className="w-8 h-8 text-barber-red" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Locatie</h3>
              <p className="text-gray-400">
                Vlasmarkt 34<br />
                4331 PG Middelburg<br />
                Nederland
              </p>
            </div>

            {/* Hours */}
            <div className="bg-[#141414] border border-barber-red/20 p-8 text-center hover:border-barber-red/60 transition-all duration-300">
              <div className="w-16 h-16 border-2 border-barber-red/40 rounded-full flex items-center justify-center mb-6 mx-auto">
                <Clock className="w-8 h-8 text-barber-red" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Openingstijden</h3>
              <div className="text-gray-400 text-left inline-block">
                <div className="flex justify-between gap-8 mb-1">
                  <span>Maandag:</span>
                  <span className="text-red-400">Gesloten</span>
                </div>
                <div className="flex justify-between gap-8 mb-1">
                  <span>Dinsdag:</span>
                  <span className="text-red-400">Gesloten</span>
                </div>
                <div className="flex justify-between gap-8 mb-1">
                  <span>Woensdag:</span>
                  <span className="text-white">12:00 - 20:00</span>
                </div>
                <div className="flex justify-between gap-8 mb-1">
                  <span>Donderdag:</span>
                  <span className="text-white">10:00 - 21:00</span>
                </div>
                <div className="flex justify-between gap-8 mb-1">
                  <span>Vrijdag:</span>
                  <span className="text-white">10:00 - 21:00</span>
                </div>
                <div className="flex justify-between gap-8 mb-1">
                  <span>Zaterdag:</span>
                  <span className="text-white">09:00 - 17:00</span>
                </div>
                <div className="flex justify-between gap-8">
                  <span>Zondag:</span>
                  <span className="text-red-400">Gesloten</span>
                </div>
              </div>
            </div>

            {/* Contact */}
            <div className="bg-[#141414] border border-barber-red/20 p-8 text-center hover:border-barber-red/60 transition-all duration-300">
              <div className="w-16 h-16 border-2 border-barber-red/40 rounded-full flex items-center justify-center mb-6 mx-auto">
                <Phone className="w-8 h-8 text-barber-red" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Contact</h3>
              <p className="text-gray-400">
                Tel: 06 44038086<br />
                Email: info@middelburgbarber.nl
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0a0a0a] border-t border-barber-red/20 py-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <a href="#home" className="flex items-center">
              <img
                src="/logo.png"
                alt="Barbershop Middelburg"
                className="h-12 w-auto object-contain"
              />
            </a>
            <p className="text-gray-500 text-sm">
              © 2025 Barbershop Middelburg. Alle rechten voorbehouden.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
