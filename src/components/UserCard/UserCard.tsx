import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Typography } from '@/constants';
import { UserCardProps } from '@/types/userCard';

export const UserCard: React.FC<UserCardProps> = ({
  user,
  onPress,
  variant = 'default',
  showEmail = true,
  disabled = false,
  testID = 'user-card',
}) => {
  const handlePress = () => {
    if (!disabled && onPress) {
      onPress();
    }
  };

  const renderAvatar = () => {
    if (user.avatar) {
      return (
        <Image
          source={{ uri: user.avatar }}
          style={styles.avatar}
          accessibilityLabel={`${user.name}'s profile picture`}
        />
      );
    }

    return (
      <View style={styles.avatarPlaceholder} accessibilityLabel="Default profile picture">
        <Ionicons name="person" size={24} color={Colors.textSecondary} />
      </View>
    );
  };

  const renderContent = () => {
    switch (variant) {
      case 'compact':
        return (
          <View style={styles.compactContent}>
            {renderAvatar()}
            <View style={styles.compactTextContainer}>
              <Text style={[styles.name, styles.compactName]} numberOfLines={1}>
                {user.name}
              </Text>
              {showEmail && (
                <Text style={[styles.email, styles.compactEmail]} numberOfLines={1}>
                  {user.email}
                </Text>
              )}
            </View>
          </View>
        );

      case 'detailed':
        return (
          <View style={styles.detailedContent}>
            {renderAvatar()}
            <View style={styles.detailedTextContainer}>
              <Text style={[styles.name, styles.detailedName]} numberOfLines={1}>
                {user.name}
              </Text>
              {showEmail && (
                <Text style={[styles.email, styles.detailedEmail]} numberOfLines={1}>
                  {user.email}
                </Text>
              )}
              <Text style={styles.userId} numberOfLines={1}>
                ID: {user.id}
              </Text>
            </View>
            <Ionicons 
              name="chevron-forward" 
              size={20} 
              color={Colors.textSecondary} 
              accessibilityLabel="View user details"
            />
          </View>
        );

      default:
        return (
          <View style={styles.defaultContent}>
            {renderAvatar()}
            <View style={styles.defaultTextContainer}>
              <Text style={[styles.name, styles.defaultName]} numberOfLines={1}>
                {user.name}
              </Text>
              {showEmail && (
                <Text style={[styles.email, styles.defaultEmail]} numberOfLines={1}>
                  {user.email}
                </Text>
              )}
            </View>
            {onPress && (
              <Ionicons 
                name="chevron-forward" 
                size={20} 
                color={Colors.textSecondary}
                accessibilityLabel="View user details"
              />
            )}
          </View>
        );
    }
  };

  const containerStyle = [
    styles.container,
    styles[`${variant}Container`],
    disabled && styles.disabled,
  ];

  if (onPress && !disabled) {
    return (
      <TouchableOpacity
        style={containerStyle}
        onPress={handlePress}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel={`View ${user.name}'s profile`}
        accessibilityHint="Double tap to view user details"
        testID={testID}
      >
        {renderContent()}
      </TouchableOpacity>
    );
  }

  return (
    <View
      style={containerStyle}
      accessibilityLabel={`User card for ${user.name}`}
      testID={testID}
    >
      {renderContent()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  defaultContainer: {
    padding: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
  },
  compactContainer: {
    padding: Spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailedContainer: {
    padding: Spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
  },
  disabled: {
    opacity: 0.5,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.backgroundSecondary,
  },
  avatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  defaultContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  compactContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  detailedContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  defaultTextContainer: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  compactTextContainer: {
    flex: 1,
    marginLeft: Spacing.sm,
  },
  detailedTextContainer: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  name: {
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text,
  },
  defaultName: {
    fontSize: Typography.fontSize.md,
  },
  compactName: {
    fontSize: Typography.fontSize.sm,
  },
  detailedName: {
    fontSize: Typography.fontSize.lg,
  },
  email: {
    color: Colors.textSecondary,
    marginTop: 2,
  },
  defaultEmail: {
    fontSize: Typography.fontSize.sm,
  },
  compactEmail: {
    fontSize: Typography.fontSize.xs,
  },
  detailedEmail: {
    fontSize: Typography.fontSize.md,
  },
  userId: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textTertiary,
    marginTop: 2,
  },
});






