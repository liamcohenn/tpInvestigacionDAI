import * as Calendar from 'expo-calendar';
import { requestCalendarPermissionsAsync } from 'expo-calendar';

class CalendarService {
  constructor() {
    this.defaultCalendarId = null;
  }

  // Solicitar permisos para acceder al calendario
  async requestPermissions() {
    try {
      const { status } = await requestCalendarPermissionsAsync();
      if (status !== 'granted') {
        throw new Error('Permisos de calendario no concedidos');
      }
      return true;
    } catch (error) {
      console.error('Error al solicitar permisos:', error);
      throw error;
    }
  }

  // Obtener el calendario por defecto
  async getDefaultCalendar() {
    try {
      const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
      const defaultCalendar = calendars.find(cal => cal.isPrimary) || calendars[0];
      this.defaultCalendarId = defaultCalendar?.id;
      return defaultCalendar;
    } catch (error) {
      console.error('Error al obtener calendario por defecto:', error);
      throw error;
    }
  }

  // Obtener todos los eventos
  async getEvents(startDate, endDate) {
    try {
      if (!this.defaultCalendarId) {
        await this.getDefaultCalendar();
      }

      const events = await Calendar.getEventsAsync(
        [this.defaultCalendarId],
        startDate,
        endDate
      );
      return events;
    } catch (error) {
      console.error('Error al obtener eventos:', error);
      throw error;
    }
  }

  // Crear un nuevo evento
  async createEvent(eventData) {
    try {
      if (!this.defaultCalendarId) {
        await this.getDefaultCalendar();
      }

      const eventId = await Calendar.createEventAsync(
        this.defaultCalendarId,
        eventData
      );
      return eventId;
    } catch (error) {
      console.error('Error al crear evento:', error);
      throw error;
    }
  }

  // Actualizar un evento existente
  async updateEvent(eventId, eventData) {
    try {
      await Calendar.updateEventAsync(eventId, eventData);
      return true;
    } catch (error) {
      console.error('Error al actualizar evento:', error);
      throw error;
    }
  }

  // Eliminar un evento
  async deleteEvent(eventId) {
    try {
      await Calendar.deleteEventAsync(eventId);
      return true;
    } catch (error) {
      console.error('Error al eliminar evento:', error);
      throw error;
    }
  }

  // Obtener eventos de un día específico
  async getEventsForDay(date) {
    try {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      const events = await this.getEvents(startOfDay, endOfDay);
      return events;
    } catch (error) {
      console.error('Error al obtener eventos del día:', error);
      throw error;
    }
  }

  // Formatear fecha para el calendario
  formatDateForCalendar(date) {
    return date.toISOString();
  }

  // Crear objeto de evento con formato estándar
  createEventObject(title, startDate, endDate, notes = '', location = '') {
    return {
      title,
      startDate: this.formatDateForCalendar(startDate),
      endDate: this.formatDateForCalendar(endDate),
      notes,
      location,
      allDay: false,
      timeZone: 'local'
    };
  }
}

export default new CalendarService();
