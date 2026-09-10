import { useEffect, useState, useCallback } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useThemeStore } from '../../src/store/themeStore';
import { AppText } from '../../src/components/common/AppText';
import { AppCard } from '../../src/components/common/AppCard';
import { Avatar } from '../../src/components/common/Avatar';
import { UserListItem } from '../../src/components/common/UserListItem';
import { Skeleton } from '../../src/components/common/Skeleton';
import { AppButton } from '../../src/components/common/AppButton';
import { spacing, radius, shadows } from '../../src/constants/typography';
import { friendService } from '../../src/services';
import { Friend, FriendRequest } from '../../src/types/friend';
import { User } from '../../src/types/auth';
import { UserPlus, Search, Check, X, Users } from 'lucide-react-native';

type Tab = 'friends' | 'requests' | 'search';

export default function FriendsScreen() {
  const { theme } = useThemeStore();
  const [activeTab, setActiveTab] = useState<Tab>('friends');
  const [friends, setFriends] = useState<Friend[]>([]);
  const [requests, setRequests] = useState<FriendRequest[]>([]);
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadFriends = useCallback(async () => {
    setLoading(true);
    try {
      const [friendData, requestData] = await Promise.all([
        friendService.getFriends(),
        friendService.getFriendRequests(),
      ]);
      setFriends(friendData);
      setRequests(requestData);
    } catch {
      // empty state
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadFriends();
  }, [loadFriends]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadFriends();
    setRefreshing(false);
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.trim().length > 0) {
      try {
        const results = await friendService.searchUsers(query);
        setSearchResults(results);
      } catch {
        setSearchResults([]);
      }
    } else {
      setSearchResults([]);
    }
  };

  const handleAcceptRequest = async (requestId: string) => {
    try {
      await friendService.acceptFriendRequest(requestId);
      setRequests((prev) => prev.filter((r) => r.id !== requestId));
      const acceptedRequest = requests.find((r) => r.id === requestId);
      if (acceptedRequest) {
        setFriends((prev) => [...prev, {
          id: 'friend_' + Date.now(),
          userId: acceptedRequest.fromUser.id,
          user: acceptedRequest.fromUser,
          status: 'friend',
          since: new Date().toISOString(),
          mutualFriends: 0,
        }]);
      }
    } catch {
      // error
    }
  };

  const handleRejectRequest = async (requestId: string) => {
    try {
      await friendService.rejectFriendRequest(requestId);
      setRequests((prev) => prev.filter((r) => r.id !== requestId));
    } catch {
      // error
    }
  };

  const handleSendRequest = async (userId: string) => {
    try {
      await friendService.sendFriendRequest(userId);
    } catch {
      // error
    }
  };

  const tabsList: { id: Tab; label: string; count?: number }[] = [
    { id: 'friends', label: 'Friends', count: friends.length },
    { id: 'requests', label: 'Requests', count: requests.length },
    { id: 'search', label: 'Search' },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <AppText variant="headingL">Friends</AppText>
      </View>

      {/* Tab Switcher */}
      <View style={[styles.tabSwitcher, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
        {tabsList.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            onPress={() => setActiveTab(tab.id)}
            activeOpacity={0.7}
            style={[styles.tab, activeTab === tab.id && { backgroundColor: theme.colors.primary }]}
          >
            <AppText
              variant="label"
              style={{ color: activeTab === tab.id ? '#FFFFFF' : theme.colors.textSecondary }}
            >
              {tab.label}{tab.count !== undefined && tab.count > 0 ? ` (${tab.count})` : ''}
            </AppText>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.colors.primary} />}
      >
        {loading ? (
          <View style={{ gap: spacing.sm }}>
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} width="100%" height={80} radius={radius.lg} />
            ))}
          </View>
        ) : activeTab === 'friends' ? (
          friends.length === 0 ? (
            <View style={styles.emptyState}>
              <View style={[styles.emptyIcon, { backgroundColor: theme.colors.primaryLight }]}>
                <Users size={32} color={theme.colors.primary} />
              </View>
              <AppText variant="headingS" style={{ marginTop: spacing.lg }}>No friends yet</AppText>
              <AppText variant="bodySmall" style={{ color: theme.colors.textSecondary, textAlign: 'center', marginTop: spacing.xs }}>
                Search for learners and send friend requests to connect.
              </AppText>
              <AppButton
                title="Find Friends"
                onPress={() => setActiveTab('search')}
                variant="primary"
                size="md"
                style={{ marginTop: spacing.lg }}
              />
            </View>
          ) : (
            <View style={{ gap: spacing.sm }}>
              {friends.map((friend) => (
                <UserListItem
                  key={friend.id}
                  user={friend.user}
                  onPress={() => router.push(`/friend/${friend.user.id}`)}
                  subtitle={`${friend.mutualFriends} mutual friends`}
                />
              ))}
            </View>
          )
        ) : activeTab === 'requests' ? (
          requests.length === 0 ? (
            <View style={styles.emptyState}>
              <View style={[styles.emptyIcon, { backgroundColor: theme.colors.primaryLight }]}>
                <UserPlus size={32} color={theme.colors.primary} />
              </View>
              <AppText variant="headingS" style={{ marginTop: spacing.lg }}>No pending requests</AppText>
              <AppText variant="bodySmall" style={{ color: theme.colors.textSecondary, textAlign: 'center', marginTop: spacing.xs }}>
                Friend requests will appear here.
              </AppText>
            </View>
          ) : (
            <View style={{ gap: spacing.sm }}>
              {requests.map((req) => (
                <AppCard key={req.id} padding="md" style={styles.requestCard}>
                  <View style={styles.requestTop}>
                    <Avatar name={req.fromUser.displayName} size={48} showOnlineStatus isOnline={req.fromUser.isOnline} />
                    <View style={{ flex: 1 }}>
                      <AppText variant="headingS" style={{ fontSize: 16 }}>{req.fromUser.displayName}</AppText>
                      <AppText variant="caption" style={{ color: theme.colors.textMuted }}>@{req.fromUser.username}</AppText>
                    </View>
                  </View>
                  <View style={styles.requestActions}>
                    <AppButton
                      title="Accept"
                      onPress={() => handleAcceptRequest(req.id)}
                      variant="primary"
                      size="sm"
                      icon={<Check size={16} color="#FFFFFF" />}
                    />
                    <AppButton
                      title="Decline"
                      onPress={() => handleRejectRequest(req.id)}
                      variant="outline"
                      size="sm"
                      icon={<X size={16} color={theme.colors.primary} />}
                    />
                  </View>
                </AppCard>
              ))}
            </View>
          )
        ) : (
          <View>
            <View style={[styles.searchBar, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
              <Search size={18} color={theme.colors.textMuted} />
              <TextInput
                placeholder="Search by name or username..."
                value={searchQuery}
                onChangeText={handleSearch}
                placeholderTextColor={theme.colors.textMuted}
                style={{
                  flex: 1,
                  color: theme.colors.text,
                  fontFamily: 'Poppins-Regular',
                  fontSize: 15,
                  paddingVertical: 0,
                }}
              />
            </View>
            {searchResults.length > 0 ? (
              <View style={{ gap: spacing.sm, marginTop: spacing.lg }}>
                {searchResults.map((u) => (
                  <AppCard key={u.id} padding="md" style={styles.searchResultCard}>
                    <View style={styles.searchResultRow}>
                      <Avatar name={u.displayName} size={44} showOnlineStatus isOnline={u.isOnline} />
                      <View style={{ flex: 1 }}>
                        <AppText variant="headingS" style={{ fontSize: 16 }}>{u.displayName}</AppText>
                        <AppText variant="caption" style={{ color: theme.colors.textMuted }}>@{u.username}</AppText>
                      </View>
                      <AppButton
                        title="Add"
                        onPress={() => handleSendRequest(u.id)}
                        variant="primary"
                        size="sm"
                        icon={<UserPlus size={16} color="#FFFFFF" />}
                      />
                    </View>
                  </AppCard>
                ))}
              </View>
            ) : searchQuery.trim().length > 0 ? (
              <View style={styles.emptyState}>
                <AppText variant="bodySmall" style={{ color: theme.colors.textSecondary }}>No users found for "{searchQuery}"</AppText>
              </View>
            ) : (
              <View style={styles.emptyState}>
                <Search size={32} color={theme.colors.textMuted} />
                <AppText variant="bodySmall" style={{ color: theme.colors.textSecondary, marginTop: spacing.md }}>
                  Start typing to search for friends
                </AppText>
              </View>
            )}
          </View>
        )}

        <View style={{ height: spacing.xxl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: spacing.xxl, paddingBottom: spacing.md },
  tabSwitcher: { flexDirection: 'row', padding: 4, borderRadius: radius.lg, borderWidth: 1, gap: 2, marginHorizontal: spacing.xxl },
  tab: { flex: 1, paddingVertical: spacing.md, alignItems: 'center', borderRadius: radius.md },
  scrollContent: { paddingHorizontal: spacing.xxl, paddingTop: spacing.lg },
  emptyState: { alignItems: 'center', justifyContent: 'center', paddingVertical: spacing.xxxl },
  emptyIcon: { width: 72, height: 72, borderRadius: 36, alignItems: 'center', justifyContent: 'center' },
  requestCard: { gap: spacing.md },
  requestTop: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  requestActions: { flexDirection: 'row', gap: spacing.md },
  searchBar: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.lg, paddingVertical: spacing.md, borderRadius: radius.lg, borderWidth: 1, gap: spacing.md },
  searchResultCard: {},
  searchResultRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
});
