import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  RefreshControl,
  ActivityIndicator
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import { Ionicons } from '@expo/vector-icons';
import EventItem from '../components/EventItem';
import EventForm from '../components/EventForm';
import CalendarService from '../services/CalendarLocal';

const CalendarScreen = () => {
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [showEventForm, setShowEventForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [permissionsGranted, setPermissionsGranted] = useState(false);

  useEffect(() => {
    initializeCalendar();
  }, []);

  const initializeCalendar = async () => {
    try {
      setLoading(true);
      await CalendarService.requestPermissions();
      await CalendarService.getDefaultCalendar();
      setPermissionsGranted(true);
      await loadEvents();
    } catch (error) {
      Alert.alert('Error', 'No se pudieron obtener los permisos del calendario');
      console.error('Error inicializando calendario:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadEvents = async () => {
    try {
      const startDate = new Date(selectedDate);
      startDate.setMonth(startDate.getMonth() - 1);
      
      const endDate = new Date(selectedDate);
      endDate.setMonth(endDate.getMonth() + 1);

      const allEvents = await CalendarService.getEvents(startDate, endDate);
      setEvents(allEvents);
    } catch (error) {
      Alert.alert('Error', 'No se pudieron cargar los eventos');
      console.error('Error cargando eventos:', error);
    }
  };

  const loadEventsForDay = async (date) => {
    try {
      const dayEvents = await CalendarService.getEventsForDay(new Date(date));
      return dayEvents;
    } catch (error) {
      console.error('Error cargando eventos del día:', error);
      return [];
    }
  };

  const onDayPress = async (day) => {
    setSelectedDate(day.dateString);
    await loadEvents();
  };

  const handleAddEvent = () => {
    setEditingEvent(null);
    setShowEventForm(true);
  };

  const handleEditEvent = (event) => {
    setEditingEvent(event);
    setShowEventForm(true);
  };

  const handleDeleteEvent = async (eventId) => {
    try {
      await CalendarService.deleteEvent(eventId);
      await loadEvents();
      Alert.alert('Éxito', 'Evento eliminado correctamente');
    } catch (error) {
      Alert.alert('Error', 'No se pudo eliminar el evento');
      console.error('Error eliminando evento:', error);
    }
  };

  const handleSubmitEvent = async (eventData) => {
    try {
      if (editingEvent) {
        await CalendarService.updateEvent(editingEvent.id, eventData);
        Alert.alert('Éxito', 'Evento actualizado correctamente');
      } else {
        await CalendarService.createEvent(eventData);
        Alert.alert('Éxito', 'Evento creado correctamente');
      }
      setShowEventForm(false);
      setEditingEvent(null);
      await loadEvents();
    } catch (error) {
      Alert.alert('Error', 'No se pudo guardar el evento');
      console.error('Error guardando evento:', error);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadEvents();
    setRefreshing(false);
  }, [selectedDate]);

  const getMarkedDates = () => {
    const marked = {};
    
    events.forEach(event => {
      // Crear fecha local para evitar problemas de zona horaria
      const eventDate = new Date(event.startDate);
      const localEventDate = new Date(eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate());
      const dateString = localEventDate.toISOString().split('T')[0];
      
      if (!marked[dateString]) {
        marked[dateString] = {
          marked: true,
          dotColor: '#007AFF',
          activeOpacity: 0.7,
        };
      }
    });

    if (selectedDate) {
      marked[selectedDate] = {
        ...marked[selectedDate],
        selected: true,
        selectedColor: '#007AFF',
      };
    }

    return marked;
  };

  const getEventsForSelectedDate = () => {
    return events.filter(event => {
      // Crear fecha local para evitar problemas de zona horaria
      const eventDate = new Date(event.startDate);
      const localEventDate = new Date(eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate());
      const localSelectedDate = new Date(selectedDate + 'T00:00:00');
      
      return localEventDate.getTime() === localSelectedDate.getTime();
    });
  };

  const formatSelectedDate = (dateString) => {
    // Crear fecha local para evitar problemas de zona horaria
    const date = new Date(dateString + 'T00:00:00');
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (!permissionsGranted) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Solicitando permisos...</Text>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Cargando eventos...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mi Calendario</Text>
        <TouchableOpacity style={styles.addButton} onPress={handleAddEvent}>
          <Ionicons name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <Calendar
        style={styles.calendar}
        onDayPress={onDayPress}
        markedDates={getMarkedDates()}
        theme={{
          backgroundColor: '#ffffff',
          calendarBackground: '#ffffff',
          textSectionTitleColor: '#b6c1cd',
          selectedDayBackgroundColor: '#007AFF',
          selectedDayTextColor: '#ffffff',
          todayTextColor: '#007AFF',
          dayTextColor: '#2d4150',
          textDisabledColor: '#d9e1e8',
          dotColor: '#007AFF',
          selectedDotColor: '#ffffff',
          arrowColor: '#007AFF',
          monthTextColor: '#2d4150',
          indicatorColor: '#007AFF',
          textDayFontWeight: '300',
          textMonthFontWeight: 'bold',
          textDayHeaderFontWeight: '300',
          textDayFontSize: 16,
          textMonthFontSize: 16,
          textDayHeaderFontSize: 13
        }}
      />

      <View style={styles.eventsSection}>
        <Text style={styles.sectionTitle}>
          {formatSelectedDate(selectedDate)}
        </Text>
        
        <FlatList
          data={getEventsForSelectedDate()}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <EventItem
              event={item}
              onEdit={handleEditEvent}
              onDelete={handleDeleteEvent}
            />
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="calendar-outline" size={48} color="#ccc" />
              <Text style={styles.emptyText}>No hay eventos para este día</Text>
            </View>
          }
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      </View>

      <EventForm
        visible={showEventForm}
        onClose={() => {
          setShowEventForm(false);
          setEditingEvent(null);
        }}
        onSubmit={handleSubmitEvent}
        event={editingEvent}
        selectedDate={selectedDate}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  addButton: {
    backgroundColor: '#007AFF',
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  calendar: {
    margin: 16,
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  eventsSection: {
    flex: 1,
    margin: 16,
    marginTop: 0,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
    textTransform: 'capitalize',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    marginTop: 16,
  },
});

export default CalendarScreen;
