import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { getSwipeType, getDisplayName } from '../data/swipeTypeMapping';
import { ConnectionStyle, EnneagramType } from '../lib/types';
import { RootStackParamList } from '../navigation/types';

type DirectInputScreenNavigationProp = StackNavigationProp<RootStackParamList, 'DirectInput'>;

export default function DirectInputScreen() {
  const navigation = useNavigation<DirectInputScreenNavigationProp>();
  const [connectionStyle, setConnectionStyle] = useState<ConnectionStyle | ''>('');
  const [enneagramType, setEnneagramType] = useState<EnneagramType | ''>('');

  const handleSubmit = () => {
    if (!connectionStyle || !enneagramType) {
      Alert.alert('Please select both types');
      return;
    }

    const swipeType = getSwipeType(connectionStyle, enneagramType);
    
    const result = {
      sessionId: Date.now().toString(),
      swipeType,
      swipeTypeName: getDisplayName(swipeType),
      primaryConnection: connectionStyle,
      primaryEnneagram: enneagramType,
      detailedCombo: `${connectionStyle}_${enneagramType}`,
      method: 'direct_input' as const,
      calculatedAt: new Date(),
    };

    navigation.navigate('Results', { result });
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Get Your Swipe Type Instantly</Text>
      <Text style={styles.description}>
        Select your Connection Style and Enneagram Type below to discover your relationship personality.
      </Text>

      {/* Connection Style Picker */}
      <View style={styles.section}>
        <Text style={styles.label}>Your Connection Style</Text>
        <Picker
          selectedValue={connectionStyle}
          onValueChange={(value) => setConnectionStyle(value as ConnectionStyle)}
          style={styles.picker}
        >
          <Picker.Item label="Select your style..." value="" />
          <Picker.Item label="Verbal Affirmation - Words of appreciation" value="verbalAffirmation" />
          <Picker.Item label="Quality Presence - Undivided attention" value="qualityPresence" />
          <Picker.Item label="Physical Closeness - Touch and proximity" value="physicalCloseness" />
          <Picker.Item label="Supportive Actions - Practical help" value="supportiveActions" />
          <Picker.Item label="Thoughtful Gestures - Meaningful gifts" value="thoughtfulGestures" />
          <Picker.Item label="Shared Growth - Mutual development" value="sharedGrowth" />
        </Picker>
      </View>

      {/* Enneagram Type Picker */}
      <View style={styles.section}>
        <Text style={styles.label}>Your Enneagram Type</Text>
        <Picker
          selectedValue={enneagramType}
          onValueChange={(value) => setEnneagramType(value as EnneagramType)}
          style={styles.picker}
        >
          <Picker.Item label="Select your type..." value="" />
          <Picker.Item label="Type 1 - The Reformer" value="type1" />
          <Picker.Item label="Type 2 - The Helper" value="type2" />
          <Picker.Item label="Type 3 - The Achiever" value="type3" />
          <Picker.Item label="Type 4 - The Individualist" value="type4" />
          <Picker.Item label="Type 5 - The Investigator" value="type5" />
          <Picker.Item label="Type 6 - The Loyalist" value="type6" />
          <Picker.Item label="Type 7 - The Enthusiast" value="type7" />
          <Picker.Item label="Type 8 - The Challenger" value="type8" />
          <Picker.Item label="Type 9 - The Peacemaker" value="type9" />
        </Picker>
      </View>

      {/* Submit Button */}
      <TouchableOpacity
        style={[
          styles.button,
          (!connectionStyle || !enneagramType) && styles.buttonDisabled
        ]}
        onPress={handleSubmit}
        disabled={!connectionStyle || !enneagramType}
      >
        <Text style={styles.buttonText}>Get My Swipe Type</Text>
      </TouchableOpacity>

      {/* Footer */}
      <Text style={styles.footerText}>
        Not sure about your types? Take our 4-minute assessment instead.
      </Text>
      <TouchableOpacity onPress={() => navigation.navigate('Assessment')}>
        <Text style={styles.link}>Take the Assessment</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: '#666',
    marginBottom: 32,
  },
  section: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  picker: {
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    borderRadius: 12,
    marginVertical: 24,
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 16,
  },
  link: {
    fontSize: 16,
    color: '#007AFF',
    textAlign: 'center',
    marginTop: 8,
  },
});
