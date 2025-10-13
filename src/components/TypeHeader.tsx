/**
 * TypeHeader Component
 * 
 * Displays the user's Swipe Type with visual indicators and coordinates
 * 
 * Version: 1.0
 * Date: January 10, 2025
 * Status: MVP Implementation
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TypeHeaderProps } from '../types/profile';
import { Colors, Typography, Spacing } from '../theme';

export default function TypeHeader({ 
  typeNumber, 
  typeName, 
  directness, 
  tangibility 
}: TypeHeaderProps) {
  const getCoordinateColor = (level: 'Low' | 'Mid' | 'High') => {
    switch (level) {
      case 'Low': return '#FF6B6B';
      case 'Mid': return '#FFD93D';
      case 'High': return '#6BCF7F';
      default: return '#999';
    }
  };

  const getCoordinateLabel = (level: 'Low' | 'Mid' | 'High') => {
    switch (level) {
      case 'Low': return 'Low';
      case 'Mid': return 'Mid';
      case 'High': return 'High';
      default: return 'Unknown';
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.typeInfo}>
          <Text style={styles.typeNumber}>Type {typeNumber}</Text>
          <Text style={styles.typeName}>{typeName}</Text>
        </View>
        
        <View style={styles.coordinates}>
          <View style={styles.coordinate}>
            <Text style={styles.coordinateLabel}>Directness</Text>
            <View style={[styles.coordinateBadge, { backgroundColor: getCoordinateColor(directness) }]}>
              <Text style={styles.coordinateValue}>{getCoordinateLabel(directness)}</Text>
            </View>
          </View>
          
          <View style={styles.coordinate}>
            <Text style={styles.coordinateLabel}>Tangibility</Text>
            <View style={[styles.coordinateBadge, { backgroundColor: getCoordinateColor(tangibility) }]}>
              <Text style={styles.coordinateValue}>{getCoordinateLabel(tangibility)}</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background,
    padding: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  typeInfo: {
    flex: 1,
  },
  typeNumber: {
    fontSize: Typography.caption.fontSize,
    color: Colors.secondaryText,
    fontWeight: '500',
    marginBottom: Spacing.xs,
  },
  typeName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
  },
  coordinates: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  coordinate: {
    alignItems: 'center',
  },
  coordinateLabel: {
    fontSize: 12,
    color: Colors.secondaryText,
    marginBottom: Spacing.xs,
    fontWeight: '500',
  },
  coordinateBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: 16,
    minWidth: 50,
    alignItems: 'center',
  },
  coordinateValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});
