import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Modal,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useTheme } from '@/contexts/ThemeContext';
import { Calendar, Clock } from 'lucide-react-native';

interface NativeDatePickerProps {
  value?: Date;
  onChange: (date: Date) => void;
  mode?: 'date' | 'time' | 'datetime';
  placeholder?: string;
  minimumDate?: Date;
  maximumDate?: Date;
  style?: any;
}

export default function NativeDatePicker({
  value,
  onChange,
  mode = 'date',
  placeholder = 'Select date',
  minimumDate,
  maximumDate,
  style,
}: NativeDatePickerProps) {
  const { theme } = useTheme();
  const [showPicker, setShowPicker] = useState(false);

  const formatDate = (date: Date) => {
    if (mode === 'time') {
      return date.toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      });
    }
    if (mode === 'datetime') {
      return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      })}`;
    }
    return date.toLocaleDateString();
  };

  const handleChange = (event: any, selectedDate?: Date) => {
    // For Android, hide the picker after selection
    if (Platform.OS === 'android') {
      setShowPicker(false);
    }
    
    if (selectedDate) {
      onChange(selectedDate);
    }
  };

  const handleCancel = () => {
    setShowPicker(false);
  };

  if (Platform.OS === 'web') {
    const inputType = mode === 'time' ? 'time' : mode === 'datetime' ? 'datetime-local' : 'date';
    const inputValue = value ? (
      mode === 'time' 
        ? value.toTimeString().slice(0, 5)
        : mode === 'datetime'
        ? value.toISOString().slice(0, 16)
        : value.toISOString().slice(0, 10)
    ) : '';

    return (
      <input
        type={inputType}
        value={inputValue}
        onChange={(e) => {
          const newDate = new Date(e.target.value);
          if (!isNaN(newDate.getTime())) {
            onChange(newDate);
          }
        }}
        min={minimumDate?.toISOString().slice(0, inputType === 'time' ? 5 : inputType === 'datetime-local' ? 16 : 10)}
        max={maximumDate?.toISOString().slice(0, inputType === 'time' ? 5 : inputType === 'datetime-local' ? 16 : 10)}
        style={{
          ...styles.webInput,
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.border,
          color: theme.colors.text,
          ...style,
        }}
        placeholder={placeholder}
      />
    );
  }

  return (
    <>
      <TouchableOpacity
        style={[
          styles.button,
          {
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.border,
          },
          style,
        ]}
        onPress={() => setShowPicker(true)}
        activeOpacity={0.7}
      >
        <View style={styles.buttonContent}>
          {mode === 'time' ? (
            <Clock size={20} color={theme.colors.textSecondary} />
          ) : (
            <Calendar size={20} color={theme.colors.textSecondary} />
          )}
          <Text
            style={[
              styles.buttonText,
              {
                color: value ? theme.colors.text : theme.colors.textSecondary,
              },
            ]}
          >
            {value ? formatDate(value) : placeholder}
          </Text>
        </View>
      </TouchableOpacity>

      {showPicker && (
        <Modal
          visible={showPicker}
          transparent
          animationType="fade"
          onRequestClose={handleCancel}
        >
          <View style={styles.modalOverlay}>
            <View style={[styles.modalContent, { backgroundColor: theme.colors.background }]}> 
              <View style={[styles.modalHeader, { borderBottomColor: theme.colors.border }]}> 
                <TouchableOpacity onPress={handleCancel}>
                  <Text style={[styles.modalButton, { color: theme.colors.textSecondary }]}> 
                    Cancel 
                  </Text> 
                </TouchableOpacity> 
                <Text style={[styles.modalTitle, { color: theme.colors.text }]}> 
                  {mode === 'time' ? 'Select Time' : 'Select Date'} 
                </Text> 
                <View style={{ width: 40 }} /> 
              </View> 
              <View style={styles.pickerContainer}>
                <DateTimePicker
                  value={value || new Date()}
                  mode={mode === 'time' ? 'time' : 'date'}
                  display={Platform.OS === 'ios' ? 'inline' : 'default'}
                  onChange={handleChange}
                  minimumDate={minimumDate}
                  maximumDate={maximumDate}
                  textColor={theme.colors.text}
                  style={styles.dateTimePicker}
                />
              </View>
            </View>
          </View>
        </Modal>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  webInput: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    minHeight: 52,
    width: '100%',
  },
  button: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    minHeight: 52,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  buttonText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    maxWidth: 400,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
  },
  modalButton: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    minWidth: 60,
    textAlign: 'center',
  },
  pickerContainer: {
    padding: 20,
    alignItems: 'center',
  },
  dateTimePicker: {
    width: '100%',
    alignSelf: 'center',
  },
});