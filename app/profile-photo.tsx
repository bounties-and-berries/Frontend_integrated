import { Image } from 'expo-image';
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
  Alert
} from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'expo-router';
import { updateProfileImageBase64 } from '@/utils/api';
import * as ImagePicker from 'expo-image-picker';
import TopMenuBar from '@/components/TopMenuBar';
import AnimatedCard from '@/components/AnimatedCard';
import { Camera, Image as ImageIcon, Upload, Trash2 } from 'lucide-react-native';

export default function ProfilePhotoScreen() {
  const { theme } = useTheme();
  const { user, refreshUser } = useAuth();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [error, setError] = useState('');

  const handlePickImage = async (source: 'camera' | 'gallery') => {
    try {
      let result;
      if (source === 'camera') {
        const permission = await ImagePicker.requestCameraPermissionsAsync();
        if (!permission.granted) {
          Alert.alert('Permission Denied', 'Camera permission is required.');
          return;
        }
        result = await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.5,
          base64: true,
        });
      } else {
        const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permission.granted) {
          Alert.alert('Permission Denied', 'Gallery permission is required.');
          return;
        }
        result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.5,
          base64: true,
        });
      }

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        setSelectedImage(asset.uri);
        
        if (asset.base64) {
          setSelectedFile(`data:${asset.mimeType || 'image/jpeg'};base64,${asset.base64}`);
        } else if (Platform.OS === 'web') {
          // Web requires converting Blob to base64 DataURL
          const response = await fetch(asset.uri);
          const blob = await response.blob();
          const reader = new FileReader();
          reader.readAsDataURL(blob);
          reader.onloadend = () => {
             setSelectedFile(reader.result as string);
          };
        } else {
          // Native uses expo-file-system as absolute failsafe for large images
          const FileSystem = await import('expo-file-system');
          const base64Str = await FileSystem.readAsStringAsync(asset.uri, {
            encoding: FileSystem.EncodingType.Base64,
          });
          setSelectedFile(`data:${asset.mimeType || 'image/jpeg'};base64,${base64Str}`);
        }
      }
    } catch (err: any) {
      const msg = typeof err === 'string' ? err : (err?.message || JSON.stringify(err));
      setError(msg);
      console.error('Picker error:', err);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Please select an image first.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      await updateProfileImageBase64(selectedFile);
      
      // Refresh user data so the new image shows everywhere
      await refreshUser();
      
      if (Platform.OS === 'web') {
        window.alert('Profile photo updated successfully!');
        router.back();
      } else {
        Alert.alert('Success', 'Profile photo updated successfully!', [
          { text: 'OK', onPress: () => router.back() }
        ]);
      }
    } catch (e: any) {
      const msg = typeof e === 'string' ? e : (e?.message || JSON.stringify(e));
      setError(msg);
      console.error('Upload error:', e);
    } finally {
      setLoading(false);
    }
  };

  // Safe fallback if user object doesn't have an image
  const profileImageSource = selectedImage 
    ? { uri: selectedImage } 
    : (user as any)?.profileImage 
      ? { uri: (user as any).profileImage } 
      : require('@/assets/images/default-avatar.png');

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <TopMenuBar
        title="Profile Photo"
        subtitle="Update your avatar"
        showBackButton
        onBackPress={() => router.back()}
      />

      <AnimatedCard style={styles.card}>
        <View style={styles.avatarContainer}>
          <Image
            source={profileImageSource}
            style={[styles.avatar, { borderColor: theme.colors.primary }]}
          />
          <TouchableOpacity 
            style={[styles.editBadge, { backgroundColor: theme.colors.primary }]}
            onPress={() => handlePickImage('gallery')}
          >
            <Camera size={16} color="#FFF" />
          </TouchableOpacity>
        </View>

        {error ? (
          <View style={[styles.errorBox, { backgroundColor: theme.colors.error + '15', borderColor: theme.colors.error }]}>
            <Text style={[styles.errorText, { color: theme.colors.error }]}>{error}</Text>
          </View>
        ) : null}

        <View style={styles.actionRow}>
          <TouchableOpacity 
            style={[styles.actionBtn, { backgroundColor: theme.colors.secondary + '15' }]}
            onPress={() => handlePickImage('camera')}
          >
            <Camera size={20} color={theme.colors.secondary} />
            <Text style={[styles.actionBtnText, { color: theme.colors.secondary }]}>Take Photo</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.actionBtn, { backgroundColor: theme.colors.primary + '15' }]}
            onPress={() => handlePickImage('gallery')}
          >
            <ImageIcon size={20} color={theme.colors.primary} />
            <Text style={[styles.actionBtnText, { color: theme.colors.primary }]}>Choose Gallery</Text>
          </TouchableOpacity>
        </View>

        {selectedFile && (
          <TouchableOpacity
            style={[styles.submitBtn, { backgroundColor: theme.colors.primary, opacity: loading ? 0.7 : 1 }]}
            onPress={handleUpload}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#FFF" />
            ) : (
              <>
                <Upload size={18} color="#FFF" style={{ marginRight: 8 }} />
                <Text style={styles.submitBtnText}>Upload Photo</Text>
              </>
            )}
          </TouchableOpacity>
        )}
      </AnimatedCard>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  card: { marginHorizontal: 20, marginTop: 20, padding: 24, alignItems: 'center' },
  avatarContainer: {
    position: 'relative',
    marginBottom: 24,
  },
  avatar: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 4,
    backgroundColor: '#f0f0f0',
  },
  editBadge: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFF',
  },
  errorBox: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 16,
    width: '100%',
    alignItems: 'center',
  },
  errorText: { fontSize: 13, fontFamily: 'Inter-Medium', textAlign: 'center' },
  actionRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
    marginBottom: 24,
  },
  actionBtn: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  actionBtnText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
  },
  submitBtn: {
    width: '100%',
    height: 48,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitBtnText: {
    color: '#FFF',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
});
