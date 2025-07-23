import { apiFetch } from '@/utils/authUtils';
import { BASE_API_URL } from '@/utils/consts';
import { FontAwesome, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

const { width, height } = Dimensions.get('window');

type LeaderboardUser = {
  userId: string;
  fullName: string;
  avatarUrl: string;
  xpPoints: number;
  streak: number;
  rank: number;
  currentUser: boolean;
};

const LeaderboardScreen = () => {
  const [activeTab, setActiveTab] = useState<'weekly' | 'monthly' | 'lifetime'>('weekly');
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    const getUserId = async () => {
      const userId = await AsyncStorage.getItem('userId');
      setCurrentUserId(userId);
    };
    getUserId();
  }, []);

  const fetchLeaderboardData = async (timeframe: string) => {
    try {
      setRefreshing(true);
      setLoading(true);

      const accessToken = await AsyncStorage.getItem('accessToken');
      if (!accessToken) return;

      const response = await apiFetch(
        `${BASE_API_URL}/api/leaderboard?timeframe=${timeframe}`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch leaderboard');
      }

      const data = await response.json();
      setLeaderboardData(data);
    } catch (error) {
      console.error('Failed to fetch leaderboard:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (currentUserId) {
      fetchLeaderboardData(activeTab);
    }
  }, [activeTab, currentUserId]);

  const onRefresh = () => {
    fetchLeaderboardData(activeTab);
  };

  const renderItem = ({ item, index }: { item: LeaderboardUser, index: number }) => {
    return (
      <LeaderboardItem
        item={item}
        index={index}
        isCurrentUser={item.currentUser}
      />
    );
  };

  // Get top 3 users for the podium
  const topUsers = leaderboardData.slice(0, 3);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Ionicons name="trophy" size={32} color="#FFD700" style={styles.trophyIcon} />
          <Text style={styles.title}>Leaderboard</Text>
        </View>

        {/* Tabs */}
        <View style={styles.tabs}>
          {['weekly', 'monthly', 'lifetime'].map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[
                styles.tabButton,
                activeTab === tab && styles.activeTab
              ]}
              onPress={() => setActiveTab(tab as any)}
            >
              <Text style={[
                styles.tabText,
                activeTab === tab && styles.activeTabText
              ]}>
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {/* Podium for top 3 */}
        {!loading && leaderboardData.length > 0 && (
          <View style={styles.podiumContainer}>
            {/* 2nd place */}
            {topUsers[1] && (
              <View style={[styles.podiumItem, styles.secondPlace]}>
                <View style={styles.podiumRank}>2</View>
                <Image
                  source={{ uri: topUsers[1].avatarUrl || 'https://randomuser.me/api/portraits/men/1.jpg' }}
                  style={styles.podiumAvatar}
                />
                <Text style={styles.podiumName} numberOfLines={1}>
                  {topUsers[1].fullName}
                </Text>
                <View style={styles.podiumXp}>
                  <MaterialCommunityIcons name="star-four-points" size={14} color="#FFF" />
                  <Text style={styles.podiumXpText}>{topUsers[1].xpPoints.toLocaleString()}</Text>
                </View>
              </View>
            )}

            {/* 1st place */}
            {topUsers[0] && (
              <View style={[styles.podiumItem, styles.firstPlace]}>
                <View style={styles.crownContainer}>
                  <MaterialCommunityIcons name="crown" size={24} color="#FFD700" />
                </View>
                <Image
                  source={{ uri: topUsers[0].avatarUrl || 'https://randomuser.me/api/portraits/men/1.jpg' }}
                  style={styles.podiumAvatar}
                />
                <Text style={styles.podiumName} numberOfLines={1}>
                  {topUsers[0].fullName}
                </Text>
                <View style={styles.podiumXp}>
                  <MaterialCommunityIcons name="star-four-points" size={14} color="#FFF" />
                  <Text style={styles.podiumXpText}>{topUsers[0].xpPoints.toLocaleString()}</Text>
                </View>
              </View>
            )}

            {/* 3rd place */}
            {topUsers[2] && (
              <View style={[styles.podiumItem, styles.thirdPlace]}>
                <View style={styles.podiumRank}>3</View>
                <Image
                  source={{ uri: topUsers[2].avatarUrl || 'https://randomuser.me/api/portraits/men/1.jpg' }}
                  style={styles.podiumAvatar}
                />
                <Text style={styles.podiumName} numberOfLines={1}>
                  {topUsers[2].fullName}
                </Text>
                <View style={styles.podiumXp}>
                  <MaterialCommunityIcons name="star-four-points" size={14} color="#FFF" />
                  <Text style={styles.podiumXpText}>{topUsers[2].xpPoints.toLocaleString()}</Text>
                </View>
              </View>
            )}
          </View>
        )}

        {/* Rest of the leaderboard */}
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#7F5AED" />
          </View>
        ) : (
          <FlatList
            data={leaderboardData.slice(3)} // Skip top 3 already shown in podium
            renderItem={renderItem}
            keyExtractor={(item) => item.userId}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={['#7F5AED']}
                tintColor="#7F5AED"
              />
            }
            ListHeaderComponent={<Text style={styles.leaderboardTitle}>Other Participants</Text>}
            ListFooterComponent={<LeaderboardFooter />}
            contentContainerStyle={styles.listContent}
            style={styles.flatList}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const LeaderboardItem = ({ item, isCurrentUser }: { item: LeaderboardUser, index: number, isCurrentUser: boolean }) => {
  return (
    <View style={[
      styles.itemContainer,
      isCurrentUser && styles.currentUserItem
    ]}>
      {/* Rank */}
      <View style={styles.rankContainer}>
        <Text style={[
          styles.rankText,
          isCurrentUser && styles.currentUserRank
        ]}>
          {item.rank}
        </Text>
      </View>

      {/* Avatar */}
      <View style={styles.avatarContainer}>
        <Image
          source={{ uri: item.avatarUrl || 'https://randomuser.me/api/portraits/men/1.jpg' }}
          style={[styles.avatar, isCurrentUser && styles.currentUserAvatar]}
        />
      </View>

      {/* User Info */}
      <View style={styles.userInfo}>
        <Text style={[styles.userName, isCurrentUser && styles.currentUserName]}>
          {item.fullName} {isCurrentUser && '(You)'}
        </Text>
        <View style={styles.stats}>
          <View style={styles.stat}>
            <FontAwesome name="bolt" size={12} color="#FF9800" />
            <Text style={styles.statText}>{item.streak} day streak</Text>
          </View>
        </View>
      </View>

      {/* XP */}
      <View style={styles.xpContainer}>
        <MaterialCommunityIcons name="star-four-points" size={16} color="#7F5AED" />
        <Text style={styles.xpText}>{item.xpPoints.toLocaleString()}</Text>
      </View>
    </View>
  );
};

const LeaderboardFooter = () => (
  <View style={styles.footer}>
    <Ionicons name="trophy-outline" size={24} color="#7F5AED" />
    <Text style={styles.footerText}>Keep going! You're doing great!</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  content: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingBottom: 10,
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  trophyIcon: {
    marginRight: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    padding: 5,
  },
  tabButton: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#7F5AED',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
  },
  activeTabText: {
    color: '#FFFFFF',
  },
  podiumContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    height: 180,
    marginHorizontal: 20,
    marginVertical: 20,
  },
  podiumItem: {
    flex: 1,
    alignItems: 'center',
    paddingBottom: 15,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    marginHorizontal: 2,
  },
  firstPlace: {
    height: 180,
    backgroundColor: '#7F5AED',
    zIndex: 3,
    marginHorizontal: 0,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  secondPlace: {
    height: 150,
    backgroundColor: '#94A3B8',
    zIndex: 2,
  },
  thirdPlace: {
    height: 130,
    backgroundColor: '#CD7F32',
    zIndex: 1,
  },
  podiumRank: {
    position: 'absolute',
    top: 10,
    left: 3,
    backgroundColor: 'rgba(255,255,255,0.2)',
    width: 20,
    height: 20,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  crownContainer: {
    position: 'absolute',
    top: 10,
  },
  podiumAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 3,
    borderColor: '#FFF',
    marginBottom: 8,
    top: 10,
  },
  podiumName: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 14,
    maxWidth: '90%',
    textAlign: 'center',
    top: 8,
  },
  podiumXp: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    top: 10,
  },
  podiumXpText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  leaderboardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#64748B',
    marginLeft: 20,
    marginBottom: 10,
    marginTop: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingBottom: 20,
  },
  flatList: {
    flex: 1,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    marginHorizontal: 20,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  currentUserItem: {
    backgroundColor: '#F1EBFF',
    borderWidth: 1,
    borderColor: '#7F5AED',
    shadowColor: '#7F5AED',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  rankContainer: {
    width: 28,
    alignItems: 'center',
  },
  rankText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#64748B',
  },
  currentUserRank: {
    color: '#7F5AED',
  },
  avatarContainer: {
    marginHorizontal: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  currentUserAvatar: {
    borderWidth: 2,
    borderColor: '#7F5AED',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 4,
  },
  currentUserName: {
    color: '#7F5AED',
    fontWeight: '700',
  },
  stats: {
    flexDirection: 'row',
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  statText: {
    fontSize: 12,
    color: '#64748B',
    marginLeft: 4,
  },
  xpContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  xpText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#7F5AED',
    marginLeft: 4,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    marginTop: 10,
  },
  footerText: {
    fontSize: 14,
    color: '#64748B',
    marginLeft: 8,
  },
});

export default LeaderboardScreen;