import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { useAuth } from '../contexts/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { Post } from '../types';
import Toast from 'react-native-toast-message';

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const userPosts = useQuery(
    api.posts.getUserPosts,
    user?._id ? { userId: user._id } : 'skip'
  );

  console.log('ProfileScreen - User:', user?._id);
  console.log('ProfileScreen - User posts count:', userPosts?.length);

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          await logout();
          Toast.show({
            type: 'info',
            text1: 'Logged Out',
            text2: 'See you soon!',
            visibilityTime: 3000,
          });
        },
      },
    ]);
  };

  const renderPost = ({ item }: { item: Post }) => (
    <View style={styles.postItem}>
      {item.imageUrl ? (
        <Image source={{ uri: item.imageUrl }} style={styles.postImage} />
      ) : (
        <View style={styles.postTextOnly}>
          <Text style={styles.postTextOnlyContent} numberOfLines={3}>
            {item.content}
          </Text>
        </View>
      )}
    </View>
  );

  if (!user) {
    console.log('ProfileScreen - No user found, showing loading...');
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#E1306C" />
        <Text style={{ marginTop: 10, color: '#666' }}>Loading profile...</Text>
      </View>
    );
  }

  const postsCount = userPosts?.length || 0;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.profileInfo}>
          <View style={styles.avatarLarge}>
            <Text style={styles.avatarLargeText}>
              {user.name.charAt(0).toUpperCase()}
            </Text>
          </View>
          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.email}>{user.email}</Text>
        </View>

        <View style={styles.stats}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{postsCount}</Text>
            <Text style={styles.statLabel}>Posts</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color="#E1306C" />
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.divider} />

      <View style={styles.postsSection}>
        <Text style={styles.postsTitle}>My Posts</Text>
        {userPosts === undefined ? (
          <ActivityIndicator size="large" color="#E1306C" style={styles.loader} />
        ) : postsCount === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="images-outline" size={60} color="#DBDBDB" />
            <Text style={styles.emptyText}>No posts yet</Text>
            <Text style={styles.emptySubtext}>Share your first moment!</Text>
          </View>
        ) : (
          <FlatList
            data={userPosts}
            renderItem={renderPost}
            keyExtractor={(item) => item._id}
            numColumns={3}
            contentContainerStyle={styles.postsGrid}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    padding: 20,
    alignItems: 'center',
  },
  profileInfo: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarLarge: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#E1306C',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  avatarLargeText: {
    color: '#fff',
    fontSize: 36,
    fontWeight: 'bold',
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#262626',
    marginBottom: 5,
  },
  email: {
    fontSize: 14,
    color: '#8e8e8e',
  },
  stats: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  statItem: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#262626',
  },
  statLabel: {
    fontSize: 14,
    color: '#8e8e8e',
    marginTop: 4,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderWidth: 1,
    borderColor: '#E1306C',
    borderRadius: 8,
  },
  logoutButtonText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#E1306C',
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
  },
  postsSection: {
    flex: 1,
    padding: 20,
  },
  postsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#262626',
    marginBottom: 15,
  },
  loader: {
    marginTop: 40,
  },
  postsGrid: {
    flexGrow: 1,
  },
  postItem: {
    flex: 1 / 3,
    aspectRatio: 1,
    padding: 2,
  },
  postImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#f0f0f0',
  },
  postTextOnly: {
    width: '100%',
    height: '100%',
    backgroundColor: '#FAFAFA',
    borderWidth: 1,
    borderColor: '#DBDBDB',
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  postTextOnlyContent: {
    fontSize: 10,
    color: '#262626',
    textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#262626',
    marginTop: 20,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#8e8e8e',
    marginTop: 8,
  },
});
