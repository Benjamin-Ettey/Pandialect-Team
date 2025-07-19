import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  Dimensions,
  SafeAreaView
} from 'react-native';
import { Ionicons, MaterialCommunityIcons, FontAwesome } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

const LeaderboardScreen = () => {
  const [currentUser] = useState({
    id: 'user-123',
    name: 'You',
    avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
  });

  const [activeTab, setActiveTab] = useState('weekly');
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchLeaderboardData = async (timeframe) => {
    try {
      setRefreshing(true);
      const mockData = {
        weekly: generateMockData('weekly', currentUser),
        monthly: generateMockData('monthly', currentUser),
        lifetime: generateMockData('lifetime', currentUser)
      };
      await new Promise(resolve => setTimeout(resolve, 800));
      setLeaderboardData(mockData[timeframe]);
    } catch (error) {
      console.error('Failed to fetch leaderboard:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchLeaderboardData(activeTab);
  }, [activeTab]);

  const onRefresh = () => {
    fetchLeaderboardData(activeTab);
  };

  const renderItem = ({ item, index }) => {
    const isCurrentUser = item.id === currentUser.id;
    return (
      <LeaderboardItem
        item={item}
        index={index}
        isCurrentUser={isCurrentUser}
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
              onPress={() => setActiveTab(tab)}
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
                <Image source={{ uri: topUsers[1].avatar }} style={styles.podiumAvatar} />
                <Text style={styles.podiumName} numberOfLines={1}>{topUsers[1].name}</Text>
                <View style={styles.podiumXp}>
                  <MaterialCommunityIcons name="star-four-points" size={14} color="#FFF" />
                  <Text style={styles.podiumXpText}>{topUsers[1].xp.toLocaleString()}</Text>
                </View>
              </View>
            )}

            {/* 1st place */}
            {topUsers[0] && (
              <View style={[styles.podiumItem, styles.firstPlace]}>
                <View style={styles.crownContainer}>
                  <Ionicons name="crown" size={24} color="#FFD700" />
                </View>
                <Image source={{ uri: topUsers[0].avatar }} style={styles.podiumAvatar} />
                <Text style={styles.podiumName} numberOfLines={1}>{topUsers[0].name}</Text>
                <View style={styles.podiumXp}>
                  <MaterialCommunityIcons name="star-four-points" size={14} color="#FFF" />
                  <Text style={styles.podiumXpText}>{topUsers[0].xp.toLocaleString()}</Text>
                </View>
              </View>
            )}

            {/* 3rd place */}
            {topUsers[2] && (
              <View style={[styles.podiumItem, styles.thirdPlace]}>
                <View style={styles.podiumRank}><Text>3</Text></View>
                <Image source={{ uri: topUsers[2].avatar }} style={styles.podiumAvatar} />
                <Text style={styles.podiumName} numberOfLines={1}>{topUsers[2].name}</Text>
                <View style={styles.podiumXp}>
                  <MaterialCommunityIcons name="star-four-points" size={14} color="#FFF" />
                  <Text style={styles.podiumXpText}>{topUsers[2].xp.toLocaleString()}</Text>
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
            keyExtractor={(item) => item.id}
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

const LeaderboardItem = ({ item, index, isCurrentUser }) => {
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
          source={{ uri: item.avatar }}
          style={[styles.avatar, isCurrentUser && styles.currentUserAvatar]}
        />
      </View>

      {/* User Info */}
      <View style={styles.userInfo}>
        <Text style={[styles.userName, isCurrentUser && styles.currentUserName]}>
          {item.name} {isCurrentUser && '(You)'}
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
        <Text style={styles.xpText}>{item.xp.toLocaleString()}</Text>
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

const getRankColor = (rank) => {
  switch (rank) {
    case 1: return '#FFD700'; // Gold
    case 2: return '#C0C0C0'; // Silver
    case 3: return '#CD7F32'; // Bronze
    default: return '#7F5AED'; // Purple
  }
};

const generateMockData = (timeframe, currentUser) => {
  const baseData = [
    { id: '1', name: 'Alex Johnson', avatar: 'https://randomuser.me/api/portraits/men/32.jpg' },
    { id: '2', name: 'Maria Garcia', avatar: 'https://randomuser.me/api/portraits/women/44.jpg' },
    { id: '3', name: 'James Smith', avatar: 'https://randomuser.me/api/portraits/men/22.jpg' },
    { id: '4', name: 'Sarah Williams', avatar: 'https://randomuser.me/api/portraits/women/33.jpg' },
    { id: '5', name: 'John Brown', avatar: 'https://randomuser.me/api/portraits/men/55.jpg' },
    { id: '6', name: 'Emma Wilson', avatar: 'https://randomuser.me/api/portraits/women/65.jpg' },
    { id: '7', name: 'Michael Davis', avatar: 'https://randomuser.me/api/portraits/men/75.jpg' },
  ];

  if (!baseData.some(user => user.id === currentUser.id)) {
    baseData.push(currentUser);
  }

  const usersWithData = baseData.map((user) => {
    const isCurrentUser = user.id === currentUser.id;
    let xp, streak;

    switch (timeframe) {
      case 'weekly':
        xp = Math.floor(Math.random() * 3000) + 1000;
        streak = Math.floor(Math.random() * 14) + 1;
        break;
      case 'monthly':
        xp = Math.floor(Math.random() * 10000) + 5000;
        streak = Math.floor(Math.random() * 30) + 1;
        break;
      case 'lifetime':
        xp = Math.floor(Math.random() * 50000) + 10000;
        streak = Math.floor(Math.random() * 365) + 1;
        break;
    }

    if (isCurrentUser) {
      xp = Math.floor(xp * 0.7);
      streak = Math.floor(streak * 0.8);
    }

    return { ...user, xp, streak };
  });

  return usersWithData
    .sort((a, b) => b.xp - a.xp)
    .map((user, index) => ({ ...user, rank: index + 1 }));
};

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