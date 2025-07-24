import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useRouter } from 'expo-router';
import AnimatedCard from '@/components/AnimatedCard';
import TopMenuBar from '@/components/TopMenuBar';
import { Coins, Calculator, CreditCard, ArrowRight } from 'lucide-react-native';

const BERRY_TO_MONEY_RATE = 0.01; // 1 berry = ₹0.01

export default function RequestBerries() {
  const { theme } = useTheme();
  const router = useRouter();
  const [berriesRequired, setBerriesRequired] = useState('');
  const [purpose, setPurpose] = useState('');

  const calculateAmount = () => {
    const berries = parseInt(berriesRequired) || 0;
    return (berries * BERRY_TO_MONEY_RATE).toFixed(2);
  };

  const handleSubmit = () => {
    if (!berriesRequired || !purpose) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const amount = calculateAmount();
    
    Alert.alert(
      'Confirm Request',
      `You are requesting ${berriesRequired} berries for ₹${amount}. Proceed to payment?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Proceed to Payment', 
          onPress: () => {
            // Navigate to payment screen (mock)
            Alert.alert(
              'Payment Required',
              `Please pay ₹${amount} to complete your berry request. This will redirect to payment gateway.`,
              [
                { text: 'OK', onPress: () => router.back() }
              ]
            );
          }
        }
      ]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <TopMenuBar 
        title="Request Berries"
        subtitle="Purchase berries for your college system"
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Info Card */}
        <View style={styles.section}>
          <AnimatedCard style={styles.infoCard}>
            <View style={styles.infoContent}>
              <Coins size={32} color={theme.colors.primary} />
              <View style={styles.infoText}>
                <Text style={[styles.infoTitle, { color: theme.colors.text }]}>
                  Berry Purchase System
                </Text>
                <Text style={[styles.infoSubtitle, { color: theme.colors.textSecondary }]}>
                  Purchase berries to distribute as rewards to students
                </Text>
              </View>
            </View>
          </AnimatedCard>
        </View>

        {/* Rate Information */}
        <View style={styles.section}>
          <AnimatedCard style={styles.rateCard}>
            <View style={styles.rateContent}>
              <Calculator size={24} color={theme.colors.accent} />
              <View style={styles.rateInfo}>
                <Text style={[styles.rateTitle, { color: theme.colors.text }]}>
                  Exchange Rate
                </Text>
                <Text style={[styles.rateValue, { color: theme.colors.accent }]}>
                  1 Berry = ₹0.01 INR
                </Text>
              </View>
            </View>
          </AnimatedCard>
        </View>

        {/* Request Form */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Berry Request Details
          </Text>

          {/* Berries Required */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.colors.text }]}>
              Berries Required *
            </Text>
            <TextInput
              style={[styles.input, { 
                backgroundColor: theme.colors.card,
                borderColor: theme.colors.border,
                color: theme.colors.text 
              }]}
              placeholder="Enter number of berries needed"
              placeholderTextColor={theme.colors.textSecondary}
              keyboardType="numeric"
              value={berriesRequired}
              onChangeText={setBerriesRequired}
            />
          </View>

          {/* Auto-calculated Amount */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.colors.text }]}>
              Amount to Pay
            </Text>
            <View style={[styles.calculatedAmount, { 
              backgroundColor: theme.colors.primary + '10',
              borderColor: theme.colors.primary 
            }]}>
              <Text style={[styles.amountText, { color: theme.colors.primary }]}>
                ₹{calculateAmount()} INR
              </Text>
            </View>
          </View>

          {/* Purpose */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.colors.text }]}>
              Purpose *
            </Text>
            <TextInput
              style={[styles.textArea, { 
                backgroundColor: theme.colors.card,
                borderColor: theme.colors.border,
                color: theme.colors.text 
              }]}
              placeholder="Describe the purpose for these berries..."
              placeholderTextColor={theme.colors.textSecondary}
              multiline
              numberOfLines={4}
              value={purpose}
              onChangeText={setPurpose}
            />
          </View>
        </View>

        {/* Summary Card */}
        {berriesRequired && (
          <View style={styles.section}>
            <AnimatedCard style={styles.summaryCard}>
              <View style={styles.summaryContent}>
                <Text style={[styles.summaryTitle, { color: theme.colors.text }]}>
                  Request Summary
                </Text>
                
                <View style={styles.summaryRow}>
                  <Text style={[styles.summaryLabel, { color: theme.colors.textSecondary }]}>
                    Berries Requested:
                  </Text>
                  <Text style={[styles.summaryValue, { color: theme.colors.text }]}>
                    {berriesRequired}
                  </Text>
                </View>
                
                <View style={styles.summaryRow}>
                  <Text style={[styles.summaryLabel, { color: theme.colors.textSecondary }]}>
                    Exchange Rate:
                  </Text>
                  <Text style={[styles.summaryValue, { color: theme.colors.text }]}>
                    ₹0.01 per berry
                  </Text>
                </View>
                
                <View style={[styles.summaryRow, styles.totalRow]}>
                  <Text style={[styles.totalLabel, { color: theme.colors.text }]}>
                    Total Amount:
                  </Text>
                  <Text style={[styles.totalValue, { color: theme.colors.primary }]}>
                    ₹{calculateAmount()} INR
                  </Text>
                </View>
              </View>
            </AnimatedCard>
          </View>
        )}

        {/* Submit Button */}
        <View style={styles.section}>
          <TouchableOpacity
            style={[
              styles.submitButton, 
              { 
                backgroundColor: theme.colors.primary,
                opacity: (!berriesRequired || !purpose) ? 0.5 : 1
              }
            ]}
            onPress={handleSubmit}
            disabled={!berriesRequired || !purpose}
          >
            <CreditCard size={20} color="#FFFFFF" />
            <Text style={styles.submitButtonText}>
              Proceed to Payment
            </Text>
            <ArrowRight size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  infoCard: {
    marginBottom: 0,
  },
  infoContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  infoText: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
  },
  infoSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    marginTop: 4,
  },
  rateCard: {
    marginBottom: 0,
  },
  rateContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  rateInfo: {
    flex: 1,
  },
  rateTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  rateValue: {
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Poppins-SemiBold',
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 8,
  },
  input: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  textArea: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    textAlignVertical: 'top',
  },
  calculatedAmount: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 8,
    borderWidth: 2,
    alignItems: 'center',
  },
  amountText: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
  },
  summaryCard: {
    marginBottom: 0,
  },
  summaryContent: {
    gap: 12,
  },
  summaryTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    marginBottom: 8,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  summaryValue: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
  },
  totalRow: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    marginTop: 8,
  },
  totalLabel: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
  },
  totalValue: {
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 12,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
});