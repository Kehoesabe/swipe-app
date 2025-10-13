/**
 * Admin Purchases Screen
 * 
 * Displays list of purchases with filtering and search capabilities.
 * 
 * Version: 1.0
 * Date: January 10, 2025
 * Status: MVP Implementation
 */

import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  StyleSheet, 
  ActivityIndicator,
  TextInput,
  Alert,
  RefreshControl
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/types';
import { getAdminPurchases, AdminPurchase } from '../../api/admin';
import { Colors, Typography, Spacing } from '../../theme';

type PurchasesScreenNavigationProp = StackNavigationProp<RootStackParamList, 'AdminPurchases'>;

interface StatusBadgeProps {
  status: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'succeeded': return Colors.success;
      case 'pending': return Colors.warning;
      case 'failed': return Colors.error;
      case 'cancelled': return Colors.secondaryText;
      case 'refunded': return Colors.secondaryText;
      default: return Colors.secondaryText;
    }
  };

  return (
    <View style={[styles.badge, { backgroundColor: getStatusColor(status) }]}>
      <Text style={styles.badgeText}>{status.toUpperCase()}</Text>
    </View>
  );
};

interface PurchaseRowProps {
  purchase: AdminPurchase;
  onPress: () => void;
}

const PurchaseRow: React.FC<PurchaseRowProps> = ({ purchase, onPress }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatAmount = (amount: number) => {
    return `$${(amount / 100).toFixed(2)}`;
  };

  return (
    <TouchableOpacity style={styles.purchaseRow} onPress={onPress}>
      <View style={styles.purchaseInfo}>
        <Text style={styles.customerEmail}>
          {purchase.customer_email || 'No email'}
        </Text>
        <Text style={styles.purchaseMeta}>
          Type {purchase.metadata?.type_number || 'Unknown'} • {formatDate(purchase.created_at)}
        </Text>
        {purchase.customer_name && (
          <Text style={styles.customerName}>{purchase.customer_name}</Text>
        )}
      </View>
      <View style={styles.purchaseStatus}>
        <Text style={styles.amount}>{formatAmount(purchase.amount)}</Text>
        <StatusBadge status={purchase.status} />
      </View>
    </TouchableOpacity>
  );
};

const PurchasesScreen: React.FC = () => {
  const navigation = useNavigation<PurchasesScreenNavigationProp>();
  const [purchases, setPurchases] = useState<AdminPurchase[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [hasMore, setHasMore] = useState(false);
  const [nextCursor, setNextCursor] = useState<string | undefined>();

  const filters = [
    { key: 'all', label: 'All' },
    { key: 'succeeded', label: 'Succeeded' },
    { key: 'pending', label: 'Pending' },
    { key: 'failed', label: 'Failed' },
    { key: 'refunded', label: 'Refunded' },
  ];

  useEffect(() => {
    loadPurchases();
  }, [filter]);

  const loadPurchases = async (refresh = false) => {
    try {
      if (refresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const data = await getAdminPurchases({
        status: filter === 'all' ? undefined : filter,
        limit: 50,
        cursor: refresh ? undefined : nextCursor,
      });

      if (refresh) {
        setPurchases(data.purchases);
      } else {
        setPurchases(prev => [...prev, ...data.purchases]);
      }

      setHasMore(data.has_more);
      setNextCursor(data.next_cursor);
    } catch (error) {
      console.error('Error loading purchases:', error);
      Alert.alert('Error', 'Failed to load purchases. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setNextCursor(undefined);
    loadPurchases(true);
  };

  const handleLoadMore = () => {
    if (hasMore && !loading) {
      loadPurchases();
    }
  };

  const handlePurchasePress = (purchase: AdminPurchase) => {
    navigation.navigate('AdminPurchaseDetail', { purchaseId: purchase.id });
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      handleRefresh();
      return;
    }

    try {
      setLoading(true);
      // TODO: Implement search functionality
      console.log('Searching for:', searchQuery);
      Alert.alert('Search', 'Search functionality coming soon!');
    } catch (error) {
      console.error('Error searching:', error);
      Alert.alert('Error', 'Search failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderPurchase = ({ item }: { item: AdminPurchase }) => (
    <PurchaseRow
      purchase={item}
      onPress={() => handlePurchasePress(item)}
    />
  );

  const renderFilterButton = (filterOption: { key: string; label: string }) => (
    <TouchableOpacity
      key={filterOption.key}
      style={[
        styles.filterButton,
        filter === filterOption.key && styles.filterButtonActive
      ]}
      onPress={() => setFilter(filterOption.key)}
    >
      <Text style={[
        styles.filterButtonText,
        filter === filterOption.key && styles.filterButtonTextActive
      ]}>
        {filterOption.label}
      </Text>
    </TouchableOpacity>
  );

  if (loading && purchases.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Loading purchases...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Purchases</Text>
        <TouchableOpacity onPress={handleRefresh} style={styles.refreshButton}>
          <Text style={styles.refreshText}>Refresh</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by email, user ID, or payment ID..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
        />
        <TouchableOpacity onPress={handleSearch} style={styles.searchButton}>
          <Text style={styles.searchButtonText}>Search</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.filters}>
        {filters.map(renderFilterButton)}
      </View>

      <FlatList
        data={purchases}
        renderItem={renderPurchase}
        keyExtractor={item => item.id}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[Colors.primary]}
            tintColor={Colors.primary}
          />
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.1}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No purchases found</Text>
            <Text style={styles.emptySubtext}>
              Try adjusting your filters or search terms
            </Text>
          </View>
        }
        ListFooterComponent={
          loading && purchases.length > 0 ? (
            <View style={styles.loadingMore}>
              <ActivityIndicator size="small" color={Colors.primary} />
              <Text style={styles.loadingMoreText}>Loading more...</Text>
            </View>
          ) : null
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  loadingText: {
    marginTop: Spacing.md,
    fontSize: Typography.body.fontSize,
    color: Colors.text,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.lg,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  title: {
    fontSize: Typography.h1.fontSize,
    fontWeight: 'bold',
    color: Colors.text,
  },
  refreshButton: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.primary,
    borderRadius: 6,
  },
  refreshText: {
    color: Colors.white,
    fontSize: Typography.caption.fontSize,
    fontWeight: '500',
  },
  searchContainer: {
    flexDirection: 'row',
    padding: Spacing.lg,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 6,
    paddingHorizontal: Spacing.md,
    backgroundColor: Colors.background,
    fontSize: Typography.body.fontSize,
    color: Colors.text,
  },
  searchButton: {
    marginLeft: Spacing.md,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.primary,
    borderRadius: 6,
    justifyContent: 'center',
  },
  searchButtonText: {
    color: Colors.white,
    fontSize: Typography.caption.fontSize,
    fontWeight: '500',
  },
  filters: {
    flexDirection: 'row',
    padding: Spacing.lg,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  filterButton: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    marginRight: Spacing.sm,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.background,
  },
  filterButtonActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filterButtonText: {
    fontSize: Typography.caption.fontSize,
    color: Colors.text,
    fontWeight: '500',
  },
  filterButtonTextActive: {
    color: Colors.white,
  },
  purchaseRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    backgroundColor: Colors.background,
  },
  purchaseInfo: {
    flex: 1,
    marginRight: Spacing.md,
  },
  customerEmail: {
    fontSize: Typography.body.fontSize,
    fontWeight: '500',
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  customerName: {
    fontSize: Typography.caption.fontSize,
    color: Colors.secondaryText,
    marginTop: Spacing.xs,
  },
  purchaseMeta: {
    fontSize: Typography.caption.fontSize,
    color: Colors.secondaryText,
  },
  purchaseStatus: {
    alignItems: 'flex-end',
  },
  amount: {
    fontSize: Typography.h2.fontSize,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  badge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: 4,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: Colors.white,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  emptyText: {
    fontSize: Typography.h2.fontSize,
    fontWeight: '500',
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  emptySubtext: {
    fontSize: Typography.body.fontSize,
    color: Colors.secondaryText,
    textAlign: 'center',
  },
  loadingMore: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.lg,
  },
  loadingMoreText: {
    marginLeft: Spacing.sm,
    fontSize: Typography.caption.fontSize,
    color: Colors.secondaryText,
  },
});

export default PurchasesScreen;
