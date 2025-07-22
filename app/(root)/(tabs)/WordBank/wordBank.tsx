import { useState, useEffect } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    TextInput,
    StyleSheet,
    FlatList,
    Image,
    Dimensions,
    Modal,
    Alert
} from 'react-native';
import { FontAwesome5, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';

const categories = [
    { id: '1', name: 'Greetings', icon: 'handshake', color: '#7f6edb' },
    { id: '2', name: 'Being Polite', icon: 'heart', color: '#ff6b6b' },
    { id: '3', name: 'How Are You', icon: 'user-md', color: '#4ecdc4' },
    { id: '4', name: 'Food & Dining', icon: 'utensils', color: '#f9a73e' },
    { id: '5', name: 'Travel', icon: 'plane', color: '#6a8dff' },
    { id: '6', name: 'Mastering the Language', icon: 'graduation-cap', color: '#9c64ff' },
];

const WordBank = () => {
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [words, setWords] = useState([]);
    const [newWord, setNewWord] = useState('');
    const [newTranslation, setNewTranslation] = useState('');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const { width } = Dimensions.get('window');

    // Fetch words from backend (example)
    useEffect(() => {
        // Replace with actual API call
        const fetchWords = async () => {
            try {
                // Mock data for demonstration
                const mockWords = [
                    { id: '1', category: '1', word: 'Hello', translation: 'Hola', note: 'Formal greeting' },
                    { id: '2', category: '1', word: 'Good morning', translation: 'Buenos días', note: '' },
                    { id: '3', category: '3', word: 'How are you?', translation: '¿Cómo estás?', note: 'Informal' },
                ];
                setWords(mockWords);
            } catch (error) {
                Alert.alert('Error', 'Failed to fetch words');
            }
        };

        fetchWords();
    }, []);

    const filteredWords = words.filter(word => {
        const matchesCategory = !selectedCategory || word.category === selectedCategory.id;
        const matchesSearch = word.word.toLowerCase().includes(searchQuery.toLowerCase()) ||
            word.translation.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const handleAddWord = async () => {
        if (!newWord.trim() || !newTranslation.trim() || !selectedCategory) {
            Alert.alert('Error', 'Please fill all fields');
            return;
        }

        try {
            // Mock response
            const newWordItem = {
                id: Date.now().toString(),
                category: selectedCategory.id,
                word: newWord,
                translation: newTranslation,
                note: ''
            };

            setWords([...words, newWordItem]);
            setNewWord('');
            setNewTranslation('');
            setIsModalVisible(false);
        } catch (error) {
            Alert.alert('Error', 'Failed to save word');
        }
    };

    const handleDeleteWord = async (id) => {
        try {
            setWords(words.filter(word => word.id !== id));
        } catch (error) {
            Alert.alert('Error', 'Failed to delete word');
        }
    };

    return (
        <View style={styles.container}>
            {/* Search Bar */}
            <View style={styles.searchContainer}>
                <Ionicons name="search" size={20} color="#777" style={styles.searchIcon} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search words or phrases..."
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    placeholderTextColor="#999"
                />
            </View>

            {/* Categories */}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.categoriesContainer}
            >
                {categories.map(category => (
                    <TouchableOpacity
                        key={category.id}
                        style={[
                            styles.categoryCard,
                            selectedCategory?.id === category.id && styles.selectedCategory,
                            { backgroundColor: category.color }
                        ]}
                        onPress={() => setSelectedCategory(selectedCategory?.id === category.id ? null : category)}
                    >
                        <FontAwesome5 name={category.icon} size={20} color="#fff" />
                        <Text style={styles.categoryText}>{category.name}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            {/* Word List */}
            <FlatList
                data={filteredWords}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.wordListContainer}
                renderItem={({ item }) => (
                    <View style={styles.wordCard}>
                        <View style={styles.wordContent}>
                            <Text style={styles.wordText}>{item.word}</Text>
                            <Text style={styles.translationText}>{item.translation}</Text>
                            {item.note ? <Text style={styles.noteText}>Note: {item.note}</Text> : null}
                        </View>
                        <TouchableOpacity
                            style={styles.deleteButton}
                            onPress={() => handleDeleteWord(item.id)}
                        >
                            <MaterialIcons name="delete-outline" size={22} color="#ff6b6b" />
                        </TouchableOpacity>
                    </View>
                )}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Image
                            source={require('../../../../assets/images/homeIcon.png')}
                            style={styles.emptyImage}
                        />
                        <Text style={styles.emptyText}>No words saved yet</Text>
                        <Text style={styles.emptySubText}>Tap the + button to add words</Text>
                    </View>
                }
            />

            {/* Floating Add Button */}
            <TouchableOpacity
                style={styles.addButton}
                onPress={() => setIsModalVisible(true)}
            >
                <Ionicons name="add" size={28} color="#fff" />
            </TouchableOpacity>

            {/* Add Word Modal */}
            <Modal
                visible={isModalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setIsModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>Add New Word</Text>

                        <Text style={styles.inputLabel}>Category</Text>
                        <View style={styles.categorySelector}>
                            {selectedCategory ? (
                                <TouchableOpacity
                                    style={[styles.selectedCategoryPreview, { backgroundColor: selectedCategory.color }]}
                                    onPress={() => setSelectedCategory(null)}
                                >
                                    <FontAwesome5 name={selectedCategory.icon} size={16} color="#fff" />
                                    <Text style={styles.selectedCategoryText}>{selectedCategory.name}</Text>
                                    <Ionicons name="close" size={16} color="#fff" style={{ marginLeft: 8 }} />
                                </TouchableOpacity>
                            ) : (
                                <ScrollView
                                    horizontal
                                    showsHorizontalScrollIndicator={false}
                                    contentContainerStyle={styles.modalCategoriesContainer}
                                >
                                    {categories.map(category => (
                                        <TouchableOpacity
                                            key={category.id}
                                            style={[styles.modalCategoryCard, { backgroundColor: category.color }]}
                                            onPress={() => setSelectedCategory(category)}
                                        >
                                            <FontAwesome5 name={category.icon} size={16} color="#fff" />
                                            <Text style={styles.modalCategoryText}>{category.name}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </ScrollView>
                            )}
                        </View>

                        <Text style={styles.inputLabel}>Word/Phrase</Text>
                        <TextInput
                            style={styles.modalInput}
                            placeholder="Enter word or phrase"
                            value={newWord}
                            onChangeText={setNewWord}
                        />

                        <Text style={styles.inputLabel}>Translation</Text>
                        <TextInput
                            style={styles.modalInput}
                            placeholder="Enter translation"
                            value={newTranslation}
                            onChangeText={setNewTranslation}
                        />

                        <View style={styles.modalButtonContainer}>
                            <TouchableOpacity
                                style={styles.cancelButton}
                                onPress={() => setIsModalVisible(false)}
                            >
                                <Text style={styles.cancelButtonText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.addButtonModal}
                                onPress={handleAddWord}
                            >
                                <Text style={styles.addButtonText}>Add Word</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 10,
        marginHorizontal: 16,
        marginVertical: 12,
        paddingHorizontal: 12,
        elevation: 2,
    },
    searchIcon: {
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        height: 45,
        color: '#333',
    },
    categoriesContainer: {
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    categoryCard: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 20,
        marginRight: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    selectedCategory: {
        borderWidth: 2,
        borderColor: '#fff',
    },
    categoryText: {
        color: '#fff',
        marginLeft: 8,
        fontWeight: '600',
        fontSize: 14,
    },
    wordListContainer: {
        padding: 16,
        paddingBottom: 80,
    },
    wordCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 1,
    },
    wordContent: {
        flex: 1,
    },
    wordText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 4,
    },
    translationText: {
        fontSize: 14,
        color: '#666',
        marginBottom: 4,
    },
    noteText: {
        fontSize: 12,
        color: '#888',
        fontStyle: 'italic',
    },
    deleteButton: {
        padding: 8,
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 40,
    },
    emptyImage: {
        width: 150,
        height: 150,
        marginBottom: 16,
        opacity: 0.6,
    },
    emptyText: {
        fontSize: 18,
        color: '#666',
        fontWeight: '500',
        marginBottom: 4,
    },
    emptySubText: {
        fontSize: 14,
        color: '#999',
    },
    // Floating Add Button styles
    addButton: {
        position: 'absolute',
        bottom: 30,
        right: 30,
        backgroundColor: '#7f6edb',
        width: 60,
        height: 60,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    modalContainer: {
        backgroundColor: '#fff',
        borderRadius: 16,
        width: '100%',
        padding: 24,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 20,
        textAlign: 'center',
    },
    inputLabel: {
        fontSize: 14,
        color: '#666',
        marginBottom: 8,
        fontWeight: '500',
    },
    categorySelector: {
        marginBottom: 16,
    },
    modalCategoriesContainer: {
        paddingBottom: 8,
    },
    modalCategoryCard: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 16,
        marginRight: 8,
    },
    modalCategoryText: {
        color: '#fff',
        marginLeft: 6,
        fontSize: 12,
        fontWeight: '500',
    },
    selectedCategoryPreview: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderRadius: 16,
        justifyContent: 'center',
    },
    selectedCategoryText: {
        color: '#fff',
        marginLeft: 6,
        fontSize: 14,
        fontWeight: '500',
    },
    modalInput: {
        backgroundColor: '#f5f5f5',
        borderRadius: 10,
        padding: 14,
        marginBottom: 16,
        fontSize: 15,
    },
    modalButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 8,
    },
    cancelButton: {
        flex: 1,
        backgroundColor: '#f0f0f0',
        borderRadius: 10,
        padding: 14,
        alignItems: 'center',
        marginRight: 8,
    },
    cancelButtonText: {
        color: '#666',
        fontWeight: '600',
    },
    addButtonModal: {
        flex: 1,
        backgroundColor: '#7f6edb',
        borderRadius: 10,
        padding: 14,
        alignItems: 'center',
    },
    addButtonText: {
        color: '#fff',
        fontWeight: '600',
    },
});

export default WordBank;