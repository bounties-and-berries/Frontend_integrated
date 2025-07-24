import React from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import QRCode from 'react-native-qrcode-svg';
import AnimatedCard from './AnimatedCard';
import { Share, Download } from 'lucide-react-native';

interface QRCodeGeneratorProps {
  data: string;
  title?: string;
  subtitle?: string;
  size?: number;
}

export default function QRCodeGenerator({ 
  data, 
  title = "QR Code", 
  subtitle,
  size = 200 
}: QRCodeGeneratorProps) {
  const { theme } = useTheme();

  const handleShare = () => {
    Alert.alert('Share QR Code', 'QR Code sharing functionality will be available soon.');
  };

  const handleDownload = () => {
    Alert.alert('Download QR Code', 'QR Code download functionality will be available soon.');
  };

  return (
    <AnimatedCard style={styles.container}>
      <View style={styles.content}>
        <Text style={[styles.title, { color: theme.colors.text }]}>
          {title}
        </Text>
        {subtitle && (
          <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
            {subtitle}
          </Text>
        )}
        
        <View style={[styles.qrContainer, { backgroundColor: '#FFFFFF' }]}>
          <QRCode
            value={data}
            size={size}
            color={theme.colors.text}
            backgroundColor="#FFFFFF"
          />
        </View>

        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: theme.colors.primary }]}
            onPress={handleShare}
          >
            <Share size={16} color="#FFFFFF" />
            <Text style={styles.actionButtonText}>Share</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: theme.colors.secondary }]}
            onPress={handleDownload}
          >
            <Download size={16} color="#FFFFFF" />
            <Text style={styles.actionButtonText}>Download</Text>
          </TouchableOpacity>
        </View>
      </View>
    </AnimatedCard>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    gap: 16,
  },
  title: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
  },
  qrContainer: {
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
  },
});