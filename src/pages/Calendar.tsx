import React, { useState, useMemo } from 'react';
import { useTasks } from '../hooks/useTasks';
import { useInteractions } from '../hooks/useInteractions';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock } from 'lucide-react';

const Calendar: React.FC = () => {
  const { tasks } = useTasks();
  const { interactions } = useInteractions();
  const [currentDate, setCurrentDate] = useState(new Date());

  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  const today = new Date();

  const calendarEvents = useMemo(() => {
    const events: { [key: string]: Array<{ type: 'task' | 'interaction'; title: string; time?: string }> } = {};

    // Add tasks
    tasks.forEach(task => {
      const taskDate = new Date(task.due_date);
      if (taskDate.getMonth() === currentMonth && taskDate.getFullYear() === currentYear) {
        const dateKey = taskDate.getDate().toString();
        if (!events[dateKey]) events[dateKey] = [];
        events[dateKey].push({
          type: 'task',
          title: task.title,
          time: taskDate.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
        });
      }
    });

    // Add interactions
    interactions.forEach(interaction => {
      const interactionDate = new Date(interaction.date);
      if (interactionDate.getMonth() === currentMonth && interactionDate.getFullYear() === currentYear) {
        const dateKey = interactionDate.getDate().toString();
        if (!events[dateKey]) events[dateKey] = [];
        events[dateKey].push({
          type: 'interaction',
          title: `${interaction.type}: ${interaction.description.substring(0, 30)}...`,
          time: interactionDate.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
        });
      }
    });

    return events;
  }, [tasks, interactions, currentMonth, currentYear]);

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const renderCalendarDays = () => {
    const days = [];
    const totalCells = Math.ceil((daysInMonth + firstDayOfMonth) / 7) * 7;

    for (let i = 0; i < totalCells; i++) {
      const dayNumber = i - firstDayOfMonth + 1;
      const isCurrentMonth = dayNumber > 0 && dayNumber <= daysInMonth;
      const isToday = isCurrentMonth && 
                     dayNumber === today.getDate() && 
                     currentMonth === today.getMonth() && 
                     currentYear === today.getFullYear();
      
      const dayEvents = isCurrentMonth ? calendarEvents[dayNumber.toString()] || [] : [];

      days.push(
        <div
          key={i}
          className={`calendar-day ${isToday ? 'today' : ''} ${!isCurrentMonth ? 'other-month' : ''}`}
        >
          <div className="font-medium mb-1">
            {isCurrentMonth ? dayNumber : ''}
          </div>
          {isCurrentMonth && dayEvents.length > 0 && (
            <div className="space-y-1">
              {dayEvents.slice(0, 2).map((event, index) => (
                <div
                  key={index}
                  className={`text-xs p-1 rounded truncate ${
                    event.type === 'task' 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'bg-green-100 text-green-800'
                  }`}
                  title={event.title}
                >
                  {event.title}
                </div>
              ))}
              {dayEvents.length > 2 && (
                <div className="text-xs text-slate-500">
                  +{dayEvents.length - 2} más
                </div>
              )}
            </div>
          )}
        </div>
      );
    }

    return days;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Calendario</h1>
          <p className="text-slate-600 mt-1">
            Vista de tareas e interacciones programadas
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => navigateMonth('prev')}
            className="p-2 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h2 className="text-lg font-semibold text-slate-900 min-w-[200px] text-center">
            {monthNames[currentMonth]} {currentYear}
          </h2>
          <button
            onClick={() => navigateMonth('next')}
            className="p-2 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center space-x-6 text-sm">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
          <span className="text-slate-600">Tareas</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
          <span className="text-slate-600">Interacciones</span>
        </div>
      </div>

      {/* Calendar */}
      <div className="card">
        <div className="card-body p-0">
          {/* Days of week header */}
          <div className="grid grid-cols-7 border-b border-slate-200">
            {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(day => (
              <div key={day} className="p-4 text-center text-sm font-semibold text-slate-600 bg-slate-50">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7">
            {renderCalendarDays()}
          </div>
        </div>
      </div>

      {/* Today's Events */}
      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-semibold text-slate-900 flex items-center">
            <CalendarIcon className="w-5 h-5 mr-2" />
            Eventos de Hoy
          </h3>
        </div>
        <div className="card-body">
          {(() => {
            const todayEvents = calendarEvents[today.getDate().toString()] || [];
            const todayTasks = tasks.filter(task => {
              const taskDate = new Date(task.due_date);
              return taskDate.toDateString() === today.toDateString();
            });
            const todayInteractions = interactions.filter(interaction => {
              const interactionDate = new Date(interaction.date);
              return interactionDate.toDateString() === today.toDateString();
            });

            if (todayTasks.length === 0 && todayInteractions.length === 0) {
              return (
                <div className="empty-state py-8">
                  <Clock className="empty-state-icon" />
                  <h4 className="empty-state-title">No hay eventos hoy</h4>
                  <p className="empty-state-description">
                    Disfruta de tu día libre de compromisos
                  </p>
                </div>
              );
            }

            return (
              <div className="space-y-4">
                {todayTasks.length > 0 && (
                  <div>
                    <h4 className="font-medium text-slate-900 mb-2">Tareas</h4>
                    <div className="space-y-2">
                      {todayTasks.map(task => (
                        <div key={task.id} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                          <div>
                            <p className="font-medium text-blue-900">{task.title}</p>
                            <p className="text-sm text-blue-700">
                              {new Date(task.due_date).toLocaleTimeString('es-ES', { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                              })}
                            </p>
                          </div>
                          <span className={`status-badge priority-${task.priority}`}>
                            {task.priority}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {todayInteractions.length > 0 && (
                  <div>
                    <h4 className="font-medium text-slate-900 mb-2">Interacciones</h4>
                    <div className="space-y-2">
                      {todayInteractions.map(interaction => (
                        <div key={interaction.id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                          <div>
                            <p className="font-medium text-green-900 capitalize">{interaction.type}</p>
                            <p className="text-sm text-green-700">{interaction.description}</p>
                            <p className="text-xs text-green-600">
                              {new Date(interaction.date).toLocaleTimeString('es-ES', { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                              })}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })()}
        </div>
      </div>
    </div>
  );
};

export default Calendar;