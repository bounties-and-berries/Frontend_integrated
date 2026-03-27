import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import ReactErrorBoundary from 'react-native-error-boundary';
import { AlertCircle, RefreshCw } from 'lucide-react-native';

const ErrorFallback = (props: { error: Error, resetError: () => void }) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <AlertCircle size={48} color="#F44336" />
        </View>
        <Text style={styles.title}>Oops! Something went wrong.</Text>
        <Text style={styles.subtitle}>
          We've encountered an unexpected error. Our team has been notified.
        </Text>
        
        {/* Only show technical details in development */}
        {__DEV__ && (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{props.error.toString()}</Text>
          </View>
        )}

        <TouchableOpacity style={styles.button} onPress={props.resetError}>
          <RefreshCw size={20} color="#FFFFFF" style={styles.buttonIcon} />
          <Text style={styles.buttonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default function ErrorBoundary({ children }: { children: React.ReactNode }) {
  const handleError = (error: Error, stackTrace: string) => {
    // Here we would typically log the error to Sentry or another error tracking service
    console.error('Global Error Boundary caught an error:', error, stackTrace);
  };

  return (
    <ReactErrorBoundary 
      FallbackComponent={ErrorFallback}
      onError={handleError}
    >
      {children}
    </ReactErrorBoundary>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  iconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#FFEBEE',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    color: '#333333',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#666666',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  errorBox: {
    backgroundColor: '#F5F5F5',
    padding: 16,
    borderRadius: 12,
    width: '100%',
    marginBottom: 32,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  errorText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#D32F2F',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2196F3',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
    shadowColor: '#2196F3',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
});
