import { Image } from 'expo-image';
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  Platform,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Dimensions,
  Modal,
  ActivityIndicator,
  FlatList
} from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import Button from '@/components/Button';
import TopMenuBar from '@/components/TopMenuBar';
import { Card } from '@/components/Card';
import { Award, CreditCard, Users, Calendar, ChevronRight, CheckCircle2, XCircle, Clock, ArrowRight, Wallet, History, Smartphone, Banknote } from 'lucide-react-native';
import { SPACING, TYPOGRAPHY, BORDER_RADIUS, COLORS } from '@/utils/designSystem';
import { purchaseBerries, getTransactions } from '@/utils/api';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import Animated, { FadeIn, FadeInDown, Layout } from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');
const isSmallScreen = width < 380;

const PurchaseBerries = () => {
  const { theme } = useTheme();
  const { user } = useAuth();
  const [quantity, setQuantity] = useState('');
  const [pricePerBerry] = useState(0.10); // ₹0.10 per berry
  const [loading, setLoading] = useState(false);
  const [fetchingTransactions, setFetchingTransactions] = useState(true);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [paymentModalVisible, setPaymentModalVisible] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'netbanking' | null>(null);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [errors, setErrors] = useState({
    quantity: '',
  });

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      setFetchingTransactions(true);
      const result = await getTransactions({ limit: 10 });
      if (result.success) {
        setTransactions(result.data?.transactions || result.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
    } finally {
      setFetchingTransactions(false);
    }
  };

  const totalCost = quantity ? (parseInt(quantity) * pricePerBerry).toFixed(2) : '0.00';

  const validateForm = () => {
    let valid = true;
    const newErrors = { quantity: '' };

    if (!quantity) {
      newErrors.quantity = 'Quantity is required';
      valid = false;
    } else if (parseInt(quantity) <= 0) {
      newErrors.quantity = 'Quantity must be greater than 0';
      valid = false;
    } else if (parseInt(quantity) > 1000000) {
      newErrors.quantity = 'Quantity cannot exceed 1,000,000 berries';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handlePurchasePress = () => {
    if (!validateForm()) return;
    setPaymentModalVisible(true);
  };

  const initiatePayment = async (method: 'upi' | 'card' | 'netbanking') => {
    setPaymentMethod(method);
    setProcessingPayment(true);

    // Simulate payment processing flow
    setTimeout(async () => {
      try {
        const paymentRef = `TXN-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        const result = await purchaseBerries(user?.id || '', parseInt(quantity), paymentRef);
        
        setProcessingPayment(false);
        setPaymentModalVisible(false);
        setPaymentMethod(null);
        
        Alert.alert(
          'Payment Successful',
          `Successfully purchased ${quantity} berries for ₹${totalCost}. Reference: ${paymentRef}`,
          [{ text: 'Great!', onPress: () => {
            setQuantity('');
            fetchHistory();
          }}]
        );
      } catch (error: any) {
        setProcessingPayment(false);
        Alert.alert('Payment Failed', error.message || 'Could not process payment. Please try again.');
      }
    }, 2000);
  };

  const handleQuantityChange = (text: string) => {
    if (text === '' || /^\d+$/.test(text)) {
      setQuantity(text);
      if (errors.quantity) {
        setErrors({ ...errors, quantity: '' });
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'success':
      case 'completed': return theme.colors.success || '#10B981';
      case 'pending': return '#F59E0B';
      case 'failed': return theme.colors.error || '#EF4444';
      default: return theme.colors.textSecondary;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'success':
      case 'completed': return <CheckCircle2 size={14} color="#10B981" />;
      case 'pending': return <Clock size={14} color="#F59E0B" />;
      case 'failed': return <XCircle size={14} color="#EF4444" />;
      default: return null;
    }
  };

  const renderTransactionItem = (item: any, index: number) => (
    <Animated.View 
      entering={FadeInDown.delay(index * 100).duration(400)}
      key={item.id || index}
      style={[styles.transactionItem, { backgroundColor: theme.colors.card }]}
    >
      <View style={[styles.transactionIcon, { backgroundColor: theme.colors.primary + '15' }]}>
        <Image 
          source={require('@/assets/images/berry.png')} 
          style={{ width: 24, height: 24 }} 
          resizeMode="contain" 
        />
      </View>
      <View style={styles.transactionInfo}>
        <Text style={[styles.transactionTitle, { color: theme.colors.text }]}>
          Purchased {item.quantity || item.amount} Berries
        </Text>
        <Text style={[styles.transactionDate, { color: theme.colors.textSecondary }]}>
          {new Date(item.created_at || item.createdAt || Date.now()).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
          })}
        </Text>
      </View>
      <View style={styles.transactionRight}>
        <Text style={[styles.transactionAmount, { color: theme.colors.text }]}>
          ₹{( (item.quantity || item.amount) * pricePerBerry).toFixed(2)}
        </Text>
        <View style={styles.statusBadge}>
          {getStatusIcon(item.status || 'success')}
          <Text style={[styles.statusText, { color: getStatusColor(item.status || 'success') }]}>
            {(item.status || 'Success').toUpperCase()}
          </Text>
        </View>
      </View>
    </Animated.View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <TopMenuBar
        title="Berry Wallet"
        subtitle="Manage institution berries"
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView
          style={styles.content}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.mainContent}>
            {/* Balance Overview */}
            <Animated.View entering={FadeIn.duration(600)}>
              <LinearGradient
                colors={['#4F46E5', '#818CF8']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.balanceCard}
              >
                <View style={styles.balanceHeader}>
                  <View style={styles.balanceIconBg}>
                    <Wallet size={24} color="#FFFFFF" />
                  </View>
                  <Text style={styles.balanceLabel}>Total System Berries</Text>
                </View>
                <View style={styles.balanceAmountContainer}>
                   <Image 
                    source={require('@/assets/images/berry.png')} 
                    style={{ width: 44, height: 44, marginRight: 12 }} 
                    resizeMode="contain" 
                  />
                  <Text style={styles.balanceAmount}>
                    {user?.role === 'admin' ? '∞' : '5,000'}
                  </Text>
                </View>
                <Text style={styles.balanceSubtext}>Available for student rewards</Text>
              </LinearGradient>
            </Animated.View>

            {/* Purchase Form Card */}
            <Card style={styles.formCard}>
              <View style={styles.formHeader}>
                <View style={[styles.iconContainer, { backgroundColor: theme.colors.primary + '15' }]}>
                  <Image source={require('@/assets/images/berry.png')} style={{ width: 28, height: 28 }} resizeMode="contain" />
                </View>
                <Text style={[styles.formTitle, { color: theme.colors.text }]}>
                  Purchase More Berries
                </Text>
              </View>

              <View style={styles.formGroup}>
                <Text style={[styles.formLabel, { color: theme.colors.textSecondary }]}>
                  Specify quantity to buy
                </Text>
                <View style={[styles.inputWrapper, {
                  borderColor: errors.quantity ? theme.colors.error : theme.colors.border,
                  backgroundColor: theme.colors.card
                }]}>
                  <Award size={20} color={theme.colors.primary} />
                  <TextInput
                    style={[styles.quantityInput, { color: theme.colors.text }]}
                    placeholder="e.g. 5000"
                    placeholderTextColor={theme.colors.textSecondary}
                    value={quantity}
                    onChangeText={handleQuantityChange}
                    keyboardType="numeric"
                  />
                </View>
                {errors.quantity ? (
                  <Text style={[styles.errorText, { color: theme.colors.error }]}>
                    {errors.quantity}
                  </Text>
                ) : null}
              </View>

              <View style={styles.pricingCard}>
                <View style={styles.priceRow}>
                  <Text style={[styles.priceLabel, { color: theme.colors.textSecondary }]}>
                    Unit Price
                  </Text>
                  <Text style={[styles.priceValue, { color: theme.colors.text }]}>
                    ₹{pricePerBerry.toFixed(2)}
                  </Text>
                </View>

                <View style={styles.divider} />

                <View style={styles.priceRow}>
                  <Text style={[styles.totalLabel, { color: theme.colors.text }]}>
                    Total Payment
                  </Text>
                  <Text style={[styles.totalValue, { color: theme.colors.primary }]}>
                    ₹{totalCost}
                  </Text>
                </View>
              </View>

              <Button
                onPress={handlePurchasePress}
                loading={loading}
                disabled={loading || !quantity}
                fullWidth
              >
                Proceed to Payment
              </Button>
            </Card>

            {/* Recent History Section */}
            <View style={styles.historySection}>
              <View style={styles.sectionHeader}>
                <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                  Recent Purchases
                </Text>
                <TouchableOpacity onPress={fetchHistory}>
                   <Clock size={18} color={theme.colors.primary} />
                </TouchableOpacity>
              </View>

              {fetchingTransactions ? (
                <View style={styles.loaderContainer}>
                  <ActivityIndicator color={theme.colors.primary} />
                </View>
              ) : transactions.length > 0 ? (
                <View style={styles.transactionsList}>
                  {transactions.slice(0, 5).map((item, index) => renderTransactionItem(item, index))}
                </View>
              ) : (
                <View style={[styles.emptyState, { backgroundColor: theme.colors.card }]}>
                  <History size={48} color={theme.colors.textSecondary + '40'} />
                  <Text style={[styles.emptyStateText, { color: theme.colors.textSecondary }]}>
                    No purchase history found
                  </Text>
                </View>
              )}
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Payment Gateway Modal */}
      <Modal
        visible={paymentModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => !processingPayment && setPaymentModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity 
            style={styles.modalCloseArea} 
            activeOpacity={1} 
            onPress={() => !processingPayment && setPaymentModalVisible(false)} 
          />
          <Animated.View 
            entering={FadeInDown.springify()} 
            style={[styles.modalContent, { backgroundColor: theme.colors.card }]}
          >
            <View style={styles.modalHeader}>
              <View style={styles.modalHandle} />
              <Text style={[styles.modalTitle, { color: theme.colors.text }]}>Select Payment Method</Text>
              <Text style={[styles.modalSubtitle, { color: theme.colors.textSecondary }]}>
                Total amount to pay: <Text style={{ color: theme.colors.primary, fontFamily: 'Poppins-Bold' }}>₹{totalCost}</Text>
              </Text>
            </View>

            {processingPayment ? (
              <View style={styles.processingContainer}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
                <Text style={[styles.processingText, { color: theme.colors.text }]}>
                  Processing payment through {paymentMethod?.toUpperCase()}...
                </Text>
                <Text style={[styles.processingSubtext, { color: theme.colors.textSecondary }]}>
                  Please do not close the app or press back
                </Text>
              </View>
            ) : (
              <View style={styles.paymentMethodsGrid}>
                <TouchableOpacity 
                  style={[styles.paymentMethodCard, { borderColor: theme.colors.border }]}
                  onPress={() => initiatePayment('upi')}
                >
                  <View style={[styles.paymentIconBg, { backgroundColor: '#9333EA20' }]}>
                    <Smartphone size={24} color="#9333EA" />
                  </View>
                  <Text style={[styles.paymentMethodName, { color: theme.colors.text }]}>UPI / Google Pay</Text>
                  <ChevronRight size={18} color={theme.colors.textSecondary} />
                </TouchableOpacity>

                <TouchableOpacity 
                  style={[styles.paymentMethodCard, { borderColor: theme.colors.border }]}
                  onPress={() => initiatePayment('card')}
                >
                  <View style={[styles.paymentIconBg, { backgroundColor: '#2563EB20' }]}>
                    <CreditCard size={24} color="#2563EB" />
                  </View>
                  <Text style={[styles.paymentMethodName, { color: theme.colors.text }]}>Credit / Debit Card</Text>
                  <ChevronRight size={18} color={theme.colors.textSecondary} />
                </TouchableOpacity>

                <TouchableOpacity 
                  style={[styles.paymentMethodCard, { borderColor: theme.colors.border }]}
                  onPress={() => initiatePayment('netbanking')}
                >
                  <View style={[styles.paymentIconBg, { backgroundColor: '#05966920' }]}>
                    <Banknote size={24} color="#059669" />
                  </View>
                  <Text style={[styles.paymentMethodName, { color: theme.colors.text }]}>Net Banking</Text>
                  <ChevronRight size={18} color={theme.colors.textSecondary} />
                </TouchableOpacity>
              </View>
            )}

            <Button
              variant="secondary"
              onPress={() => setPaymentModalVisible(false)}
              disabled={processingPayment}
              containerStyle={styles.cancelButton}
              fullWidth
            >
              Cancel
            </Button>
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  mainContent: {
    padding: SPACING.lg,
    gap: SPACING.xl,
  },
  balanceCard: {
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.xl,
    elevation: 8,
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
  },
  balanceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  balanceIconBg: {
    padding: 8,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  balanceLabel: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    fontFamily: 'Inter-Medium',
  },
  balanceAmountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  balanceAmount: {
    fontSize: 40,
    color: '#FFFFFF',
    fontFamily: 'Poppins-Bold',
  },
  balanceSubtext: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.6)',
    fontFamily: 'Inter-Regular',
  },
  formCard: {
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 15,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  formHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    marginBottom: SPACING.lg,
  },
  iconContainer: {
    padding: 10,
    borderRadius: 14,
  },
  formTitle: {
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
  },
  formGroup: {
    marginBottom: SPACING.lg,
  },
  formLabel: {
    fontSize: 13,
    fontFamily: 'Inter-SemiBold',
    marginBottom: SPACING.xs,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    height: 56,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1.5,
    gap: SPACING.sm,
  },
  quantityInput: {
    flex: 1,
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    height: '100%',
  },
  errorText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    marginTop: SPACING.xs,
  },
  pricingCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: SPACING.md,
  },
  priceLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  priceValue: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
  },
  totalLabel: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
  },
  totalValue: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
  },
  historySection: {
    gap: SPACING.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
  },
  transactionsList: {
    gap: SPACING.sm,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  transactionIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  transactionInfo: {
    flex: 1,
    marginLeft: SPACING.md,
  },
  transactionTitle: {
    fontSize: 15,
    fontFamily: 'Inter-Bold',
    marginBottom: 2,
  },
  transactionDate: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
  },
  transactionRight: {
    alignItems: 'flex-end',
    gap: 4,
  },
  transactionAmount: {
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(0,0,0,0.03)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 10,
    fontFamily: 'Inter-Bold',
  },
  emptyState: {
    padding: 40,
    borderRadius: BORDER_RADIUS.xl,
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: '#E2E8F0',
  },
  emptyStateText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  loaderContainer: {
    padding: 40,
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  modalCloseArea: {
    flex: 1,
  },
  modalContent: {
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: SPACING.xl,
    paddingBottom: Platform.OS === 'ios' ? 40 : SPACING.xl,
  },
  modalHandle: {
    width: 40,
    height: 5,
    backgroundColor: '#E2E8F0',
    borderRadius: 5,
    alignSelf: 'center',
    marginBottom: SPACING.lg,
  },
  modalHeader: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  modalTitle: {
    fontSize: 22,
    fontFamily: 'Poppins-Bold',
    marginBottom: 4,
  },
  modalSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  paymentMethodsGrid: {
    gap: SPACING.md,
    marginBottom: SPACING.xl,
  },
  paymentMethodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1.5,
    gap: SPACING.md,
  },
  paymentIconBg: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  paymentMethodName: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  processingContainer: {
    padding: 40,
    alignItems: 'center',
    gap: SPACING.md,
  },
  processingText: {
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    textAlign: 'center',
  },
  processingSubtext: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    textAlign: 'center',
  },
  cancelButton: {
    marginTop: 10,
  }
});

export default PurchaseBerries;