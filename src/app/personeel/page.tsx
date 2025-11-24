'use client';

import { useState, useEffect } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Clock, User, Search, GripVertical, X, TrendingUp, CalendarDays, AlertCircle } from 'lucide-react';
import Link from 'next/link';

// Types
interface TimeSlot {
  startTime: string;
  endTime: string;
}

interface Appointment {
  id: string;
  date: string;
  timeSlot: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  service: string;
  notes?: string | null;
  status: 'scheduled' | 'cancelled' | 'completed';
}

export default function PersoneelDashboard() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [view, setView] = useState<'day' | 'week'>('day');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [draggedAppointment, setDraggedAppointment] = useState<string | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  // Time slots
  const timeSlots: TimeSlot[] = [
    { startTime: '09:00', endTime: '09:30' },
    { startTime: '09:30', endTime: '10:00' },
    { startTime: '10:00', endTime: '10:30' },
    { startTime: '10:30', endTime: '11:00' },
    { startTime: '11:00', endTime: '11:30' },
    { startTime: '11:30', endTime: '12:00' },
    { startTime: '13:00', endTime: '13:30' },
    { startTime: '13:30', endTime: '14:00' },
    { startTime: '14:00', endTime: '14:30' },
    { startTime: '14:30', endTime: '15:00' },
    { startTime: '15:00', endTime: '15:30' },
    { startTime: '15:30', endTime: '16:00' },
    { startTime: '16:00', endTime: '16:30' },
    { startTime: '16:30', endTime: '17:00' },
    { startTime: '17:00', endTime: '17:30' },
    { startTime: '17:30', endTime: '18:00' },
    { startTime: '18:00', endTime: '18:30' },
    { startTime: '18:30', endTime: '19:00' },
  ];

  // Fetch appointments from API
  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await fetch('/api/appointments');
      if (response.ok) {
        const data = await response.json();
        setAppointments(data);
      }
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  // Helper functions
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('nl-NL', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  };

  const getAppointmentsForDateAndSlot = (date: Date, timeSlot: string) => {
    const dateStr = date.toISOString().split('T')[0];
    return appointments.find(
      apt => apt.date === dateStr && apt.timeSlot === timeSlot && apt.status === 'scheduled'
    );
  };

  const cancelAppointment = async (appointmentId: string) => {
    try {
      const response = await fetch(`/api/appointments/${appointmentId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Update local state
        setAppointments(prev =>
          prev.map(apt =>
            apt.id === appointmentId ? { ...apt, status: 'cancelled' as const } : apt
          )
        );
      }
    } catch (error) {
      console.error('Error cancelling appointment:', error);
    }
  };

  const moveAppointment = async (appointmentId: string, newDate: Date, newTimeSlot: string) => {
    try {
      const response = await fetch(`/api/appointments/${appointmentId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          date: newDate.toISOString().split('T')[0],
          timeSlot: newTimeSlot,
        }),
      });

      if (response.ok) {
        // Update local state
        setAppointments(prev =>
          prev.map(apt =>
            apt.id === appointmentId
              ? { ...apt, date: newDate.toISOString().split('T')[0], timeSlot: newTimeSlot }
              : apt
          )
        );
      }
    } catch (error) {
      console.error('Error moving appointment:', error);
    }
  };

  // Statistics
  const totalScheduled = appointments.filter(apt => apt.status === 'scheduled').length;
  const thisWeek = appointments.filter(apt => {
    const aptDate = new Date(apt.date);
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 7);
    return apt.status === 'scheduled' && aptDate >= weekStart && aptDate < weekEnd;
  }).length;
  const thisMonth = appointments.filter(apt => {
    const aptDate = new Date(apt.date);
    return apt.status === 'scheduled' && aptDate.getMonth() === new Date().getMonth();
  }).length;
  const cancelled = appointments.filter(apt => apt.status === 'cancelled').length;

  // Filtered appointments based on search
  const filteredAppointments = appointments.filter(apt =>
    apt.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    apt.service.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (apt.notes?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false)
  );

  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent, appointmentId: string) => {
    setDraggedAppointment(appointmentId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, date: Date, timeSlot: string) => {
    e.preventDefault();
    if (draggedAppointment) {
      // Check if slot is available
      const existingAppointment = getAppointmentsForDateAndSlot(date, timeSlot);
      if (!existingAppointment) {
        moveAppointment(draggedAppointment, date, timeSlot);
      }
      setDraggedAppointment(null);
    }
  };

  // Calendar navigation
  const getWeekDays = (date: Date) => {
    const week = [];
    const start = new Date(date);
    start.setDate(start.getDate() - start.getDay() + 1); // Monday

    for (let i = 0; i < 7; i++) {
      const day = new Date(start);
      day.setDate(start.getDate() + i);
      week.push(day);
    }
    return week;
  };

  const weekDays = getWeekDays(selectedDate);

  return (
    <div className="min-h-screen bg-[#141414]">
      {/* Header */}
      <header className="bg-[#1a1a1a] border-b border-barber-red/20 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="text-barber-red hover:text-barber-red/80 transition-colors">
                ← Terug naar website
              </Link>
              <div className="h-6 w-px bg-gray-700" />
              <h1 className="text-2xl font-bold text-white">Personeelsdashboard</h1>
            </div>
            <div className="flex items-center gap-4">
              <select
                value={view}
                onChange={(e) => setView(e.target.value as 'day' | 'week')}
                className="px-4 py-2 bg-[#141414] border border-gray-700 text-white rounded focus:border-barber-red focus:outline-none"
              >
                <option value="day">Dag weergave</option>
                <option value="week">Week weergave</option>
              </select>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-br from-[#1a1a1a] to-[#141414] border border-gray-800 p-6 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400">Totaal Gepland</span>
              <CalendarDays className="w-5 h-5 text-gray-500" />
            </div>
            <div className="text-3xl font-bold text-white">{totalScheduled}</div>
          </div>
          <div className="bg-gradient-to-br from-green-900/20 to-[#141414] border border-green-800/30 p-6 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400">Deze Week</span>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <div className="text-3xl font-bold text-green-500">{thisWeek}</div>
          </div>
          <div className="bg-gradient-to-br from-blue-900/20 to-[#141414] border border-blue-800/30 p-6 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400">Deze Maand</span>
              <Calendar className="w-5 h-5 text-blue-500" />
            </div>
            <div className="text-3xl font-bold text-blue-500">{thisMonth}</div>
          </div>
          <div className="bg-gradient-to-br from-red-900/20 to-[#141414] border border-red-800/30 p-6 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400">Geannuleerd</span>
              <AlertCircle className="w-5 h-5 text-red-500" />
            </div>
            <div className="text-3xl font-bold text-red-500">{cancelled}</div>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Zoek op klant, service of notities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-[#1a1a1a] border border-gray-700 text-white rounded-lg focus:border-barber-red focus:outline-none"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Calendar */}
          <div className="md:col-span-1">
            <div className="bg-[#1a1a1a] border border-gray-800 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-white">Kalender</h2>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      const newDate = new Date(currentMonth);
                      newDate.setMonth(newDate.getMonth() - 1);
                      setCurrentMonth(newDate);
                    }}
                    className="p-2 hover:bg-barber-red/10 rounded transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5 text-barber-red" />
                  </button>
                  <button
                    onClick={() => {
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
              <div className="text-center text-white font-medium mb-4">
                {currentMonth.toLocaleDateString('nl-NL', { month: 'long', year: 'numeric' })}
              </div>

              {/* Simple calendar grid */}
              <div className="grid grid-cols-7 gap-2">
                {['Ma', 'Di', 'Wo', 'Do', 'Vr', 'Za', 'Zo'].map((day) => (
                  <div key={day} className="text-center text-gray-500 text-sm font-medium py-2">
                    {day}
                  </div>
                ))}

                {(() => {
                  const year = currentMonth.getFullYear();
                  const month = currentMonth.getMonth();
                  const firstDay = new Date(year, month, 1);
                  const lastDay = new Date(year, month + 1, 0);
                  const daysInMonth = lastDay.getDate();
                  const startingDayOfWeek = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;

                  const days = [];

                  for (let i = 0; i < startingDayOfWeek; i++) {
                    days.push(<div key={`empty-${i}`} className="aspect-square" />);
                  }

                  for (let day = 1; day <= daysInMonth; day++) {
                    const date = new Date(year, month, day);
                    const isSelected = selectedDate.toDateString() === date.toDateString();
                    const hasAppointments = filteredAppointments.some(
                      apt => apt.date === date.toISOString().split('T')[0] && apt.status === 'scheduled'
                    );

                    days.push(
                      <button
                        key={day}
                        onClick={() => setSelectedDate(date)}
                        className={`aspect-square rounded flex items-center justify-center text-sm font-medium transition-all relative
                          ${isSelected
                            ? 'bg-barber-red text-white'
                            : 'bg-[#141414] text-white hover:bg-barber-red/20'
                          }`}
                      >
                        {day}
                        {hasAppointments && (
                          <div className="absolute bottom-1 w-1 h-1 bg-green-500 rounded-full" />
                        )}
                      </button>
                    );
                  }

                  return days;
                })()}
              </div>
            </div>
          </div>

          {/* Agenda View */}
          <div className="md:col-span-2">
            <div className="bg-[#1a1a1a] border border-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-bold text-white mb-4">
                {view === 'day' ? formatDate(selectedDate) : `Week ${weekDays[0].toLocaleDateString('nl-NL', { day: 'numeric', month: 'short' })} - ${weekDays[6].toLocaleDateString('nl-NL', { day: 'numeric', month: 'short' })}`}
              </h2>

              {loading ? (
                <div className="text-center text-gray-400 py-12">
                  <div className="inline-block animate-pulse">Laden...</div>
                </div>
              ) : view === 'day' ? (
                /* Day View */
                <div className="space-y-2">
                  {timeSlots.map((slot) => {
                    const appointment = getAppointmentsForDateAndSlot(selectedDate, slot.startTime);

                    return (
                      <div
                        key={slot.startTime}
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, selectedDate, slot.startTime)}
                        className={`border rounded-lg p-4 transition-all ${
                          appointment
                            ? 'bg-green-900/20 border-green-700/50'
                            : 'bg-[#141414] border-gray-700 hover:border-barber-red/40'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Clock className="w-4 h-4 text-gray-400" />
                            <span className="text-white font-medium">
                              {slot.startTime} - {slot.endTime}
                            </span>
                          </div>

                          {appointment ? (
                            <div
                              draggable
                              onDragStart={(e) => handleDragStart(e, appointment.id)}
                              className="flex items-center gap-4 cursor-move"
                            >
                              <div className="flex items-center gap-2">
                                <User className="w-4 h-4 text-green-400" />
                                <span className="text-white font-medium">{appointment.customerName}</span>
                                <span className="px-2 py-1 bg-barber-red/20 text-barber-red text-xs rounded">
                                  {appointment.service}
                                </span>
                              </div>
                              <GripVertical className="w-5 h-5 text-gray-400" />
                              <button
                                onClick={() => cancelAppointment(appointment.id)}
                                className="p-1 hover:bg-red-500/20 rounded transition-colors"
                              >
                                <X className="w-4 h-4 text-red-400" />
                              </button>
                            </div>
                          ) : (
                            <span className="text-gray-400 text-sm">Beschikbaar voor afspraken</span>
                          )}
                        </div>
                        {appointment?.notes && (
                          <div className="mt-2 text-sm text-gray-400 ml-7">
                            {appointment.notes}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                /* Week View */
                <div className="overflow-x-auto">
                  <div className="min-w-[800px]">
                    <div className="grid grid-cols-8 gap-2 mb-2">
                      <div className="text-gray-400 text-sm font-medium">Tijd</div>
                      {weekDays.map((day) => (
                        <div key={day.toISOString()} className="text-center">
                          <div className="text-white font-medium">
                            {day.toLocaleDateString('nl-NL', { weekday: 'short' })}
                          </div>
                          <div className="text-gray-400 text-sm">
                            {day.getDate()}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-1">
                      {timeSlots.map((slot) => (
                        <div key={slot.startTime} className="grid grid-cols-8 gap-2">
                          <div className="flex items-center text-gray-400 text-sm">
                            {slot.startTime}
                          </div>
                          {weekDays.map((day) => {
                            const appointment = getAppointmentsForDateAndSlot(day, slot.startTime);

                            return (
                              <div
                                key={day.toISOString()}
                                onDragOver={handleDragOver}
                                onDrop={(e) => handleDrop(e, day, slot.startTime)}
                                className={`border rounded p-2 min-h-[60px] transition-all ${
                                  appointment
                                    ? 'bg-green-900/20 border-green-700/50'
                                    : 'bg-[#141414] border-gray-700 hover:border-barber-red/40'
                                }`}
                              >
                                {appointment && (
                                  <div
                                    draggable
                                    onDragStart={(e) => handleDragStart(e, appointment.id)}
                                    className="cursor-move h-full"
                                  >
                                    <div className="flex items-center justify-between mb-1">
                                      <span className="text-white text-xs font-medium truncate">
                                        {appointment.customerName}
                                      </span>
                                      <GripVertical className="w-3 h-3 text-gray-400 flex-shrink-0" />
                                    </div>
                                    <div className="text-barber-red text-xs truncate">
                                      {appointment.service}
                                    </div>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
