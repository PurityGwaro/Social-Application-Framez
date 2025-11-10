import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { useAuth } from '../contexts/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import { useNavigation } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { MainTabParamList } from '../types';

const showNotification = {
  error: (message: string) => {
    Toast.show({
      type: 'error',
      text1: 'Error',
      text2: message,
      visibilityTime: 4000,
    });
  },
  success: (message: string) => {
    Toast.show({
      type: 'success',
      text1: 'Success',
      text2: message,
      visibilityTime: 3000,
    });
  },
  info: (message: string) => {
    Toast.show({
      type: 'info',
      text1: 'Info',
      text2: message,
      visibilityTime: 3000,
    });
  },
};

export default function CreatePostScreen() {
  const [content, setContent] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const createPost = useMutation(api.posts.createPost);
  const generateUploadUrl = useMutation(api.posts.generateUploadUrl);
  const navigation = useNavigation<BottomTabNavigationProp<MainTabParamList>>();

  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== 'granted') {
        showNotification.info('Please grant camera roll permissions to add images');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: false,
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        console.log('Image selected:', result.assets[0].uri);
        setImageUri(result.assets[0].uri);
        showNotification.success('Image selected!');
      }
    } catch (error: any) {
      console.error('Image picker error:', error);
      showNotification.error('Failed to pick image: ' + error.message);
    }
  };

  const handlePost = async () => {
    if (!content.trim()) {
      showNotification.error('Please add some text to your post');
      return;
    }

    if (!user) {
      showNotification.error('You must be logged in to post');
      return;
    }

    if (!user._id) {
      console.error('User object missing _id:', user);
      showNotification.error('Invalid user session. Please log out and log in again.');
      return;
    }

    console.log('CreatePost - User ID:', user._id);

    setIsLoading(true);
    try {
      let imageStorageId = undefined;

      if (imageUri) {
        console.log('Uploading image...');
        const uploadUrl = await generateUploadUrl();
        console.log('Upload URL obtained:', uploadUrl);

        const response = await fetch(imageUri);
        if (!response.ok) {
          throw new Error('Failed to fetch image');
        }
        const blob = await response.blob();
        console.log('Image blob created, size:', blob.size, 'type:', blob.type);

        const uploadResponse = await fetch(uploadUrl, {
          method: 'POST',
          headers: { 'Content-Type': blob.type },
          body: blob,
        });

        if (!uploadResponse.ok) {
          throw new Error('Failed to upload image to storage');
        }

        const uploadResult = await uploadResponse.json();
        console.log('Upload result:', uploadResult);
        imageStorageId = uploadResult.storageId;
        console.log('Image uploaded successfully, storageId:', imageStorageId);
      }

      const postData = {
        userId: user._id,
        content: content.trim(),
        imageStorageId,
      };

      console.log('Creating post with data:', postData);
      await createPost(postData);

      showNotification.success('Post created successfully!');
      setContent('');
      setImageUri(null);

      setTimeout(() => {
        navigation.navigate('Home');
      }, 500);
    } catch (error: any) {
      console.error('Post creation error:', error);
      const errorMessage = error?.message || error?.toString() || '';

      let friendlyError = 'Failed to create post. Please try again.';
      if (errorMessage.includes('Network')) {
        friendlyError = 'Network error. Please check your connection.';
      } else if (errorMessage.includes('storage')) {
        friendlyError = 'Failed to upload image. Please try again.';
      } else if (errorMessage.includes('Invalid user session')) {
        friendlyError = 'Please log out and log in again.';
      }

      showNotification.error(friendlyError);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <Text style={styles.title}>Create New Post</Text>
      </View>

      <View style={styles.form}>
        <TextInput
          style={styles.textInput}
          placeholder="What's on your mind?"
          value={content}
          onChangeText={setContent}
          multiline
          numberOfLines={6}
          textAlignVertical="top"
          editable={!isLoading}
        />

        {imageUri && (
          <View style={styles.imagePreviewContainer}>
            <Image source={{ uri: imageUri }} style={styles.imagePreview} />
            <TouchableOpacity
              style={styles.removeImageButton}
              onPress={() => setImageUri(null)}
              disabled={isLoading}
            >
              <Ionicons name="close-circle" size={30} color="#E1306C" />
            </TouchableOpacity>
          </View>
        )}

        <TouchableOpacity
          style={styles.imagePickerButton}
          onPress={pickImage}
          disabled={isLoading}
        >
          <Ionicons name="image-outline" size={24} color="#E1306C" />
          <Text style={styles.imagePickerText}>
            {imageUri ? 'Change Image' : 'Add Image'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.postButton, isLoading && styles.buttonDisabled]}
          onPress={handlePost}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.postButtonText}>Share Post</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    padding: 20,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#262626',
  },
  form: {
    flex: 1,
  },
  textInput: {
    backgroundColor: '#FAFAFA',
    borderWidth: 1,
    borderColor: '#DBDBDB',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    minHeight: 150,
    marginBottom: 20,
  },
  imagePreviewContainer: {
    position: 'relative',
    marginBottom: 20,
  },
  imagePreview: {
    width: '100%',
    height: 300,
    borderRadius: 10,
    backgroundColor: '#f0f0f0',
  },
  removeImageButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#fff',
    borderRadius: 15,
  },
  imagePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderWidth: 1,
    borderColor: '#DBDBDB',
    borderRadius: 10,
    marginBottom: 20,
  },
  imagePickerText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#E1306C',
    fontWeight: '600',
  },
  postButton: {
    backgroundColor: '#E1306C',
    borderRadius: 10,
    padding: 18,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  postButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
