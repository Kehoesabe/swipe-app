/**
 * Component Showcase - Swipe Type Assessment App
 * Test component to showcase all themed components
 */

import React, { useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { Button, Card, Typography, Input, Picker } from './index';

export function ComponentShowcase() {
  const { theme, isDark, toggleTheme } = useTheme();
  const [inputValue, setInputValue] = useState('');
  const [pickerValue, setPickerValue] = useState('');
  
  const pickerOptions = [
    { label: 'Solid Rock', value: 'solidRock' },
    { label: 'Warm Heart', value: 'warmHeart' },
    { label: 'Deep Connector', value: 'deepConnector' },
    { label: 'Free Spirit', value: 'freeSpirit' },
  ];

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Theme Toggle */}
      <View style={styles.section}>
        <Button
          title={`${isDark ? '🌙' : '☀️'} Toggle Theme`}
          onPress={toggleTheme}
          variant="outline"
          size="sm"
        />
      </View>

      {/* Typography Showcase */}
      <Card variant="elevated" padding="lg" style={styles.section}>
        <Typography variant="h3" color="primary" style={styles.sectionTitle}>
          Typography
        </Typography>
        
        <Typography variant="h1" color="primary">Heading 1</Typography>
        <Typography variant="h2" color="primary">Heading 2</Typography>
        <Typography variant="h3" color="primary">Heading 3</Typography>
        <Typography variant="body1" color="primary">Body text - Lorem ipsum dolor sit amet</Typography>
        <Typography variant="body2" color="secondary">Secondary body text</Typography>
        <Typography variant="caption" color="tertiary">Caption text</Typography>
        <Typography variant="button" color="primary">Button text</Typography>
      </Card>

      {/* Button Showcase */}
      <Card variant="elevated" padding="lg" style={styles.section}>
        <Typography variant="h3" color="primary" style={styles.sectionTitle}>
          Buttons
        </Typography>
        
        <View style={styles.buttonRow}>
          <Button title="Primary" variant="primary" size="sm" onPress={() => {}} />
          <Button title="Secondary" variant="secondary" size="sm" onPress={() => {}} />
        </View>
        
        <View style={styles.buttonRow}>
          <Button title="Outline" variant="outline" size="md" onPress={() => {}} />
          <Button title="Ghost" variant="ghost" size="md" onPress={() => {}} />
        </View>
        
        <View style={styles.buttonRow}>
          <Button title="Danger" variant="danger" size="lg" onPress={() => {}} />
          <Button title="Disabled" variant="primary" size="lg" disabled onPress={() => {}} />
        </View>
        
        <Button 
          title="Loading Button" 
          variant="primary" 
          size="xl" 
          loading 
          fullWidth 
          onPress={() => {}} 
        />
      </Card>

      {/* Input Showcase */}
      <Card variant="elevated" padding="lg" style={styles.section}>
        <Typography variant="h3" color="primary" style={styles.sectionTitle}>
          Inputs
        </Typography>
        
        <Input
          label="Default Input"
          placeholder="Enter text here"
          value={inputValue}
          onChangeText={setInputValue}
          helperText="This is helper text"
        />
        
        <Input
          label="Error Input"
          placeholder="This has an error"
          value=""
          onChangeText={() => {}}
          errorText="This field is required"
          state="error"
        />
        
        <Input
          label="Success Input"
          placeholder="This is successful"
          value="Valid input"
          onChangeText={() => {}}
          state="success"
        />
        
        <Input
          label="Disabled Input"
          placeholder="This is disabled"
          value=""
          onChangeText={() => {}}
          disabled
        />
      </Card>

      {/* Picker Showcase */}
      <Card variant="elevated" padding="lg" style={styles.section}>
        <Typography variant="h3" color="primary" style={styles.sectionTitle}>
          Pickers
        </Typography>
        
        <Picker
          label="Swipe Type Picker"
          placeholder="Select your swipe type"
          options={pickerOptions}
          selectedValue={pickerValue}
          onValueChange={setPickerValue}
          helperText="Choose your relationship style"
        />
        
        <Picker
          label="Error Picker"
          placeholder="This has an error"
          options={pickerOptions}
          selectedValue=""
          onValueChange={() => {}}
          errorText="Please select an option"
        />
      </Card>

      {/* Card Variants */}
      <Card variant="default" padding="md" style={styles.section}>
        <Typography variant="h4" color="primary">Default Card</Typography>
        <Typography variant="body2" color="secondary">
          This is a default card with medium padding.
        </Typography>
      </Card>
      
      <Card variant="outlined" padding="lg" style={styles.section}>
        <Typography variant="h4" color="primary">Outlined Card</Typography>
        <Typography variant="body2" color="secondary">
          This is an outlined card with large padding.
        </Typography>
      </Card>
      
      <Card variant="filled" padding="sm" style={styles.section}>
        <Typography variant="h4" color="primary">Filled Card</Typography>
        <Typography variant="body2" color="secondary">
          This is a filled card with small padding.
        </Typography>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
});
