import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface DashboardScreenProps {
  navigation: any;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({ navigation }) => {
  console.log('[DashboardScreen] 🚀 Rendering dashboard');

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Thoughtmarks Dashboard</Text>
        <Text style={styles.subtitle}>Full-featured app is working!</Text>
      </View>
      
      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionGrid}>
            <TouchableOpacity style={styles.actionCard} accessibilityRole="button" accessible={true} accessibilityLabel="Button">
              <Ionicons name="add-circle" size={24} color="#007AFF" />
              <Text style={styles.actionText}>New Thoughtmark</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionCard} accessibilityRole="button" accessible={true} accessibilityLabel="Button">
              <Ionicons name="mic" size={24} color="#007AFF" />
              <Text style={styles.actionText}>Voice Record</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionCard} accessibilityRole="button" accessible={true} accessibilityLabel="Button">
              <Ionicons name="search" size={24} color="#007AFF" />
              <Text style={styles.actionText}>Search</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionCard} accessibilityRole="button" accessible={true} accessibilityLabel="Button">
              <Ionicons name="settings" size={24} color="#007AFF" />
              <Text style={styles.actionText}>Settings</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <View style={styles.activityCard}>
            <Text style={styles.activityText}>✅ App navigation working</Text>
            <Text style={styles.activityText}>✅ Dashboard rendering</Text>
            <Text style={styles.activityText}>✅ Full-featured interface loaded</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '500',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 15,
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    width: '48%',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionText: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '500',
    color: '#000000',
    textAlign: 'center',
  },
  activityCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  activityText: {
    fontSize: 16,
    color: '#000000',
    marginBottom: 8,
  },
});
