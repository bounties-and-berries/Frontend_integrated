import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Alert,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { Upload, File, X, CheckCircle, AlertCircle } from 'lucide-react-native';

interface DocumentPickerProps {
  onFileSelected: (file: any) => void;
  acceptedTypes?: string[];
  maxSizeBytes?: number;
  style?: any;
  placeholder?: string;
  disabled?: boolean;
}

interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

export default function DocumentPicker({
  onFileSelected,
  acceptedTypes = ['pdf', 'docx', 'png', 'jpg', 'jpeg'],
  maxSizeBytes = 10 * 1024 * 1024, // 10MB default
  style,
  placeholder = 'Select Document',
  disabled = false,
}: DocumentPickerProps) {
  const { theme } = useTheme();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress>({ loaded: 0, total: 0, percentage: 0 });
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const getMimeType = (extension: string): string => {
    const mimeTypes: { [key: string]: string } = {
      pdf: 'application/pdf',
      docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      doc: 'application/msword',
      png: 'image/png',
      jpg: 'image/jpeg',
      jpeg: 'image/jpeg',
    };
    return mimeTypes[extension.toLowerCase()] || '*/*';
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const validateFile = (file: any): boolean => {
    const fileName = file.name || file.fileName || '';
    const fileExtension = fileName.split('.').pop()?.toLowerCase() || '';
    const fileSize = file.size || file.fileSize || 0;

    // Check file type
    if (!acceptedTypes.includes(fileExtension)) {
      setErrorMessage(`File type .${fileExtension} is not supported. Supported types: ${acceptedTypes.join(', ')}`);
      setUploadStatus('error');
      return false;
    }

    // Check file size
    if (fileSize > maxSizeBytes) {
      setErrorMessage(`File size (${formatFileSize(fileSize)}) exceeds maximum allowed size (${formatFileSize(maxSizeBytes)})`);
      setUploadStatus('error');
      return false;
    }

    return true;
  };

  const simulateUpload = async (file: any): Promise<void> => {
    return new Promise((resolve, reject) => {
      const totalSize = file.size || file.fileSize || 1024 * 1024; // Default 1MB if size unknown
      let uploaded = 0;
      const chunkSize = totalSize / 100; // Upload in 100 chunks

      const uploadInterval = setInterval(() => {
        uploaded += chunkSize;
        const percentage = Math.min(Math.round((uploaded / totalSize) * 100), 100);
        
        setUploadProgress({
          loaded: uploaded,
          total: totalSize,
          percentage,
        });

        if (uploaded >= totalSize) {
          clearInterval(uploadInterval);
          setUploadStatus('success');
          setIsUploading(false);
          resolve();
        }
      }, 50); // Update every 50ms for smooth progress

      // Simulate potential upload failure (5% chance)
      const shouldFail = Math.random() < 0.05;
      if (shouldFail) {
        setTimeout(() => {
          clearInterval(uploadInterval);
          setUploadStatus('error');
          setErrorMessage('Upload failed. Please try again.');
          setIsUploading(false);
          reject(new Error('Upload failed'));
        }, 2000);
      }
    });
  };

  const handleWebFileSelect = (event: any) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!validateFile(file)) return;

    setSelectedFile(file);
    setUploadStatus('uploading');
    setIsUploading(true);
    setErrorMessage('');

    simulateUpload(file)
      .then(() => {
        onFileSelected(file);
      })
      .catch(() => {
        // Error already handled in simulateUpload
      });
  };

  const handleMobileFileSelect = () => {
    Alert.alert(
      'Select Document',
      'Choose how you want to select your document',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Camera', 
          onPress: () => selectFromCamera() 
        },
        { 
          text: 'Gallery', 
          onPress: () => selectFromGallery() 
        },
        { 
          text: 'Files', 
          onPress: () => selectFromFiles() 
        },
      ]
    );
  };

  const selectFromCamera = () => {
    // Simulate camera selection
    const mockFile = {
      name: `photo_${Date.now()}.jpg`,
      size: 2 * 1024 * 1024, // 2MB
      type: 'image/jpeg',
      uri: 'file://mock/path/photo.jpg',
    };

    if (!validateFile(mockFile)) return;

    setSelectedFile(mockFile);
    setUploadStatus('uploading');
    setIsUploading(true);
    setErrorMessage('');

    simulateUpload(mockFile)
      .then(() => {
        onFileSelected(mockFile);
      })
      .catch(() => {
        // Error already handled
      });
  };

  const selectFromGallery = () => {
    // Simulate gallery selection
    const mockFile = {
      name: `image_${Date.now()}.png`,
      size: 1.5 * 1024 * 1024, // 1.5MB
      type: 'image/png',
      uri: 'file://mock/path/image.png',
    };

    if (!validateFile(mockFile)) return;

    setSelectedFile(mockFile);
    setUploadStatus('uploading');
    setIsUploading(true);
    setErrorMessage('');

    simulateUpload(mockFile)
      .then(() => {
        onFileSelected(mockFile);
      })
      .catch(() => {
        // Error already handled
      });
  };

  const selectFromFiles = () => {
    // Simulate file picker selection
    const fileTypes = ['pdf', 'docx'];
    const randomType = fileTypes[Math.floor(Math.random() * fileTypes.length)];
    const mockFile = {
      name: `document_${Date.now()}.${randomType}`,
      size: 5 * 1024 * 1024, // 5MB
      type: getMimeType(randomType),
      uri: `file://mock/path/document.${randomType}`,
    };

    if (!validateFile(mockFile)) return;

    setSelectedFile(mockFile);
    setUploadStatus('uploading');
    setIsUploading(true);
    setErrorMessage('');

    simulateUpload(mockFile)
      .then(() => {
        onFileSelected(mockFile);
      })
      .catch(() => {
        // Error already handled
      });
  };

  const clearSelection = () => {
    setSelectedFile(null);
    setUploadStatus('idle');
    setIsUploading(false);
    setUploadProgress({ loaded: 0, total: 0, percentage: 0 });
    setErrorMessage('');
  };

  const getStatusIcon = () => {
    switch (uploadStatus) {
      case 'uploading':
        return <ActivityIndicator size={20} color={theme.colors.primary} />;
      case 'success':
        return <CheckCircle size={20} color={theme.colors.success} />;
      case 'error':
        return <AlertCircle size={20} color={theme.colors.error} />;
      default:
        return <Upload size={20} color={theme.colors.textSecondary} />;
    }
  };

  const getStatusColor = () => {
    switch (uploadStatus) {
      case 'uploading':
        return theme.colors.primary;
      case 'success':
        return theme.colors.success;
      case 'error':
        return theme.colors.error;
      default:
        return theme.colors.border;
    }
  };

  if (Platform.OS === 'web') {
    return (
      <View style={[styles.container, style]}>
        <input
          type="file"
          accept={acceptedTypes.map(type => `.${type}`).join(',')}
          onChange={handleWebFileSelect}
          disabled={disabled || isUploading}
          style={{ display: 'none' }}
          id="file-input"
        />
        <TouchableOpacity
          style={[
            styles.button,
            {
              backgroundColor: theme.colors.surface,
              borderColor: getStatusColor(),
              opacity: disabled ? 0.5 : 1,
            },
          ]}
          onPress={() => document.getElementById('file-input')?.click()}
          disabled={disabled || isUploading}
          activeOpacity={0.7}
        >
          <View style={styles.buttonContent}>
            {getStatusIcon()}
            <View style={styles.textContent}>
              <Text style={[styles.buttonText, { color: theme.colors.text }]}>
                {selectedFile ? selectedFile.name : placeholder}
              </Text>
              {selectedFile && uploadStatus !== 'uploading' && (
                <Text style={[styles.fileSize, { color: theme.colors.textSecondary }]}>
                  {formatFileSize(selectedFile.size)}
                </Text>
              )}
            </View>
            {selectedFile && uploadStatus !== 'uploading' && (
              <TouchableOpacity onPress={clearSelection} style={styles.clearButton}>
                <X size={16} color={theme.colors.textSecondary} />
              </TouchableOpacity>
            )}
          </View>
        </TouchableOpacity>

        {/* Progress Bar */}
        {uploadStatus === 'uploading' && (
          <View style={styles.progressContainer}>
            <View style={[styles.progressBar, { backgroundColor: theme.colors.surface }]}>
              <View
                style={[
                  styles.progressFill,
                  {
                    backgroundColor: theme.colors.primary,
                    width: `${uploadProgress.percentage}%`,
                  },
                ]}
              />
            </View>
            <Text style={[styles.progressText, { color: theme.colors.textSecondary }]}>
              {uploadProgress.percentage}% • {formatFileSize(uploadProgress.loaded)} / {formatFileSize(uploadProgress.total)}
            </Text>
          </View>
        )}

        {/* Error Message */}
        {uploadStatus === 'error' && (
          <View style={styles.errorContainer}>
            <Text style={[styles.errorText, { color: theme.colors.error }]}>
              {errorMessage}
            </Text>
          </View>
        )}

        {/* Success Message */}
        {uploadStatus === 'success' && (
          <View style={styles.successContainer}>
            <Text style={[styles.successText, { color: theme.colors.success }]}>
              File uploaded successfully!
            </Text>
          </View>
        )}
      </View>
    );
  }

  // Mobile UI
  return (
    <View style={[styles.container, style]}>
      <TouchableOpacity
        style={[
          styles.button,
          {
            backgroundColor: theme.colors.surface,
            borderColor: getStatusColor(),
            opacity: disabled ? 0.5 : 1,
          },
        ]}
        onPress={handleMobileFileSelect}
        disabled={disabled || isUploading}
        activeOpacity={0.7}
      >
        <View style={styles.buttonContent}>
          {getStatusIcon()}
          <View style={styles.textContent}>
            <Text style={[styles.buttonText, { color: theme.colors.text }]}>
              {selectedFile ? selectedFile.name : placeholder}
            </Text>
            {selectedFile && uploadStatus !== 'uploading' && (
              <Text style={[styles.fileSize, { color: theme.colors.textSecondary }]}>
                {formatFileSize(selectedFile.size)}
              </Text>
            )}
          </View>
          {selectedFile && uploadStatus !== 'uploading' && (
            <TouchableOpacity onPress={clearSelection} style={styles.clearButton}>
              <X size={16} color={theme.colors.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
      </TouchableOpacity>

      {/* Progress Bar */}
      {uploadStatus === 'uploading' && (
        <View style={styles.progressContainer}>
          <View style={[styles.progressBar, { backgroundColor: theme.colors.surface }]}>
            <View
              style={[
                styles.progressFill,
                {
                  backgroundColor: theme.colors.primary,
                  width: `${uploadProgress.percentage}%`,
                },
              ]}
            />
          </View>
          <Text style={[styles.progressText, { color: theme.colors.textSecondary }]}>
            {uploadProgress.percentage}% • {formatFileSize(uploadProgress.loaded)} / {formatFileSize(uploadProgress.total)}
          </Text>
        </View>
      )}

      {/* Error Message */}
      {uploadStatus === 'error' && (
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: theme.colors.error }]}>
            {errorMessage}
          </Text>
        </View>
      )}

      {/* Success Message */}
      {uploadStatus === 'success' && (
        <View style={styles.successContainer}>
          <Text style={[styles.successText, { color: theme.colors.success }]}>
            File uploaded successfully!
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  button: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    minHeight: 52,
    borderStyle: 'dashed',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  textContent: {
    flex: 1,
  },
  buttonText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  fileSize: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    marginTop: 2,
  },
  clearButton: {
    padding: 4,
    borderRadius: 12,
  },
  progressContainer: {
    marginTop: 12,
    gap: 8,
  },
  progressBar: {
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
  },
  errorContainer: {
    marginTop: 8,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#FEF2F2',
  },
  errorText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
  },
  successContainer: {
    marginTop: 8,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#F0FDF4',
  },
  successText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
  },
});