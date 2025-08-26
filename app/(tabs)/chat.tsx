import TherapistDashboard from '@/components/TherapistDashboard';
import { useCheckAuth } from '@/context/AuthContext';
import { useCrud } from '@/hooks/useCrud';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from 'react-native';

// const { width, height } = Dimensions.get('window');

// Chat Screen Component
interface ChatScreenProps {
  navigation: {
    navigate: (screen: string, params?: any) => void;
    goBack: () => void;
  };
}

interface Patient {
  // Add relevant patient fields here
  [key: string]: any;
}

interface UserResult {
  user_id: string;
  name: string;
  therapist_id?: string;
  therapist?: any;
  patients?: Patient[];
  [key: string]: any;
}

interface UserQueryData {
  result?: UserResult[];
  [key: string]: any;
}

const ChatScreen = ({ navigation }: ChatScreenProps) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm Dr. Sarah. Welcome to BetterSpace. How are you feeling today?",
      sender: 'therapist',
      timestamp: '2:30 PM',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [showWelcomeTip, setShowWelcomeTip] = useState(true);
  const [showTherapistBio, setShowTherapistBio] = useState(false);
  const [isNewUser] = useState(true);
  const scrollViewRef = useRef<ScrollView>(null);


  const therapistInfo = {
    name: 'Dr. Sarah Johnson',
    specialty: 'Clinical Psychologist',
    experience: '8 years',
    education: 'PhD in Clinical Psychology, Stanford University',
    specializations: ['Anxiety', 'Depression', 'Trauma', 'Relationships'],
    bio: 'Dr. Sarah is a licensed clinical psychologist with extensive experience in cognitive behavioral therapy and mindfulness-based interventions.',
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face',
    rating: 4.9,
    sessions: 1247,
  };

  const sendMessage = () => {
    if (inputText.trim()) {
      const newMessage = {
        id: messages.length + 1,
        text: inputText,
        sender: 'user',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages([...messages, newMessage]);
      setInputText('');

      // Simulate therapist response
      setTimeout(() => {
        const therapistResponse = {
          id: messages.length + 2,
          text: "Thank you for sharing that with me. Can you tell me more about what's been on your mind?",
          sender: 'therapist',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages(prev => [...prev, therapistResponse]);
      }, 2000);
    }
  };

  const startAudioCall = () => {
    Alert.alert(
      'Start Audio Call',
      'Would you like to start an audio call with Dr. Sarah?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Call', onPress: () => navigation.navigate('CallScreen') },
      ]
    );
  };

  const startVideoCall = () => {
    Alert.alert(
      'Start Video Call',
      'Would you like to start a video call with Dr. Sarah?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Call', onPress: () => navigation.navigate('CallScreen', { isVideo: true }) },
      ]
    );
  };

  const WelcomeTip = () => (
    <Modal
      visible={showWelcomeTip && isNewUser}
      transparent={true}
      animationType="fade"
    >
      <View style={styles.modalOverlay}>
        <View style={styles.welcomeTipContainer}>
          <View style={styles.tipHeader}>
            <Ionicons name="bulb-outline" size={24} color="#4CAF50" />
            <Text style={styles.tipTitle}>Welcome to BetterSpace!</Text>
          </View>
          <Text style={styles.tipText}>
            • Feel free to share what&apos;s on your mind{'\n'}
            • Use audio/video calls when you need real-time support{'\n'}
            • Click on Dr. Sarah&apos;s name to view her profile{'\n'}
            • Your conversations are private and secure
          </Text>
          <TouchableOpacity
            style={styles.tipButton}
            onPress={() => setShowWelcomeTip(false)}
          >
            <Text style={styles.tipButtonText}>Got it!</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  const TherapistBioModal = () => (
    <Modal
      visible={showTherapistBio}
      transparent={true}
      animationType="slide"
    >
      <View style={styles.bioModalOverlay}>
        <View style={styles.bioContainer}>
          <View style={styles.bioHeader}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowTherapistBio(false)}
            >
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          <View style={styles.bioContent}>
            <Image
              source={{ uri: therapistInfo.image }}
              style={styles.therapistImage}
            />
            <Text style={styles.therapistName}>{therapistInfo.name}</Text>
            <Text style={styles.therapistSpecialty}>{therapistInfo.specialty}</Text>

            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{therapistInfo.rating}</Text>
                <Text style={styles.statLabel}>Rating</Text>
                <Ionicons name="star" size={16} color="#FFD700" />
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{therapistInfo.sessions}</Text>
                <Text style={styles.statLabel}>Sessions</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{therapistInfo.experience}</Text>
                <Text style={styles.statLabel}>Experience</Text>
              </View>
            </View>

            <Text style={styles.bioSectionTitle}>Education</Text>
            <Text style={styles.bioText}>{therapistInfo.education}</Text>

            <Text style={styles.bioSectionTitle}>Specializations</Text>
            <View style={styles.specializationsContainer}>
              {therapistInfo.specializations.map((spec, index) => (
                <View key={index} style={styles.specializationTag}>
                  <Text style={styles.specializationText}>{spec}</Text>
                </View>
              ))}
            </View>

            <Text style={styles.bioSectionTitle}>About</Text>
            <Text style={styles.bioText}>{therapistInfo.bio}</Text>
          </View>
        </View>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.therapistInfo}
          onPress={() => setShowTherapistBio(true)}
        >
          <Image
            source={{ uri: therapistInfo.image }}
            style={styles.headerAvatar}
          />
          <View>
            <Text style={styles.headerName}>{therapistInfo.name}</Text>
            <View style={styles.onlineStatus}>
              <View style={styles.onlineDot} />
              <Text style={styles.onlineText}>Online</Text>
            </View>
          </View>
        </TouchableOpacity>

        <View style={styles.callButtons}>
          <TouchableOpacity style={styles.callButton} onPress={startAudioCall}>
            <Ionicons name="call" size={20} color="#4CAF50" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.callButton} onPress={startVideoCall}>
            <Ionicons name="videocam" size={20} color="#4CAF50" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Messages */}
      <ScrollView
        ref={scrollViewRef}
        style={styles.messagesContainer}
        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd()}
      >
        {messages.map((message) => (
          <View
            key={message.id}
            style={[
              styles.messageContainer,
              message.sender === 'user' ? styles.userMessage : styles.therapistMessage,
            ]}
          >
            {message.sender === 'therapist' && (
              <Image
                source={{ uri: therapistInfo.image }}
                style={styles.messageAvatar}
              />
            )}
            <View
              style={[
                styles.messageBubble,
                message.sender === 'user' ? styles.userBubble : styles.therapistBubble,
              ]}
            >
              <Text
                style={[
                  styles.messageText,
                  message.sender === 'user' ? styles.userText : styles.therapistText,
                ]}
              >
                {message.text}
              </Text>
              <Text
                style={[
                  styles.timestamp,
                  message.sender === 'user' ? styles.userTimestamp : styles.therapistTimestamp,
                ]}
              >
                {message.timestamp}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Input */}
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? 'padding' : 'height'}
        >
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textInput}
              value={inputText}
              onChangeText={setInputText}
              placeholder="Type your message..."
              multiline
              maxLength={500}
              placeholderTextColor="#9ca3af"
            />
            <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
              <Ionicons name="send" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>

      <WelcomeTip />
      <TherapistBioModal />
    </SafeAreaView>
  );
};

// Call Screen Component
interface CallScreenProps {
  route: { params?: { isVideo?: boolean } };
  navigation: {
    goBack: () => void;
    navigate: (screen: string, params?: any) => void;
  };
}

const CallScreen = ({ route, navigation }: CallScreenProps) => {
  const { isVideo = false } = route?.params || {};
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [isVideoEnabled, setIsVideoEnabled] = useState(isVideo);

  useEffect(() => {
    const interval = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const endCall = () => {
    Alert.alert(
      'End Call',
      'Are you sure you want to end this call?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'End Call', style: 'destructive', onPress: () => navigation.goBack() },
      ]
    );
  };

  const therapistInfo = {
    name: 'Dr. Sarah Johnson',
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200&h=200&fit=crop&crop=face',
  };

  return (
    <SafeAreaView style={[styles.container, styles.callContainer]}>
      <StatusBar barStyle="light-content" backgroundColor="#1a1a1a" />

      {isVideoEnabled ? (
        <View style={styles.videoContainer}>
          {/* Main video view */}
          <View style={styles.mainVideoView}>
            <Image
              source={{ uri: therapistInfo.image }}
              style={styles.videoPlaceholder}
            />
            <Text style={styles.videoName}>{therapistInfo.name}</Text>
          </View>

          {/* Small self view */}
          <View style={styles.selfVideoView}>
            <View style={styles.selfVideoPlaceholder}>
              <Ionicons name="person" size={30} color="#fff" />
            </View>
          </View>
        </View>
      ) : (
        <View style={styles.audioCallContainer}>
          <Image
            source={{ uri: therapistInfo.image }}
            style={styles.callAvatar}
          />
          <Text style={styles.callName}>{therapistInfo.name}</Text>
          <Text style={styles.callStatus}>Connected</Text>
          <Text style={styles.callDuration}>{formatDuration(callDuration)}</Text>
        </View>
      )}

      {/* Call Controls */}
      <View style={styles.callControls}>
        <TouchableOpacity
          style={[styles.controlButton, isMuted && styles.activeControl]}
          onPress={() => setIsMuted(!isMuted)}
        >
          <Ionicons
            name={isMuted ? 'mic-off' : 'mic'}
            size={24}
            color={isMuted ? '#fff' : '#666'}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.controlButton, isSpeakerOn && styles.activeControl]}
          onPress={() => setIsSpeakerOn(!isSpeakerOn)}
        >
          <MaterialIcons
            name={isSpeakerOn ? 'volume-up' : 'volume-down'}
            size={24}
            color={isSpeakerOn ? '#fff' : '#666'}
          />
        </TouchableOpacity>

        {isVideo && (
          <TouchableOpacity
            style={[styles.controlButton, !isVideoEnabled && styles.activeControl]}
            onPress={() => setIsVideoEnabled(!isVideoEnabled)}
          >
            <Ionicons
              name={isVideoEnabled ? 'videocam' : 'videocam-off'}
              size={24}
              color={isVideoEnabled ? '#666' : '#fff'}
            />
          </TouchableOpacity>
        )}

        <TouchableOpacity style={styles.endCallButton} onPress={endCall}>
          <Ionicons name="call" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

// Navigation Component (for demo purposes)
const Chat = () => {
  const [currentScreen, setCurrentScreen] = useState('chat');
  const [routeParams, setRouteParams] = useState({});

  const navigation = {
    navigate: (screen: string, params: any = {}) => {
      setCurrentScreen(screen.toLowerCase().replace('screen', ''));
      setRouteParams(params);
    },
    goBack: () => setCurrentScreen('chat'),
  };

  const { session } = useCheckAuth()
  const senderId = session?.user?.id
  const { getUserById } = useCrud()
  // const router = useRouter()




  const { data: user, isLoading, error } = useQuery<UserQueryData>({
    queryKey: ["user", senderId],

    queryFn: ({ queryKey }) => {
      const [_key, id] = queryKey
      return getUserById("user", { user_id: id }, undefined, "user_id, name, therapist_id, therapist(name, therapist_id, authority, license, specialization, summary), patients(*)")
    },
    enabled: !!senderId // only fetch if senderId exists
  });

  const therapist = user?.result?.[0]?.therapist


  if (!therapist) {
    return <TherapistDashboard />;
  }

  if (currentScreen === 'call') {
    return <CallScreen route={{ params: routeParams }} navigation={navigation} />;
  }

  return <ChatScreen navigation={navigation} />

};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },

  // Header Styles
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    backgroundColor: '#fff',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  therapistInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 16,
  },
  headerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  headerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  onlineStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  onlineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4CAF50',
    marginRight: 4,
  },
  onlineText: {
    fontSize: 12,
    color: '#4CAF50',
  },
  callButtons: {
    flexDirection: 'row',
  },
  callButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },

  // Messages Styles
  messagesContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  messageContainer: {
    flexDirection: 'row',
    marginVertical: 4,
  },
  userMessage: {
    justifyContent: 'flex-end',
  },
  therapistMessage: {
    justifyContent: 'flex-start',
  },
  messageAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },
  messageBubble: {
    maxWidth: '75%',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  userBubble: {
    backgroundColor: '#4CAF50',
    borderBottomRightRadius: 4,
  },
  therapistBubble: {
    backgroundColor: '#fff',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
  },
  userText: {
    color: '#fff',
  },
  therapistText: {
    color: '#333',
  },
  timestamp: {
    fontSize: 12,
    marginTop: 4,
  },
  userTimestamp: {
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'right',
  },
  therapistTimestamp: {
    color: '#999',
  },

  // Input Styles
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    backgroundColor: '#fff',
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    maxHeight: 100,
    fontSize: 16,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  welcomeTipContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    width: '100%',
    maxWidth: 320,
  },
  tipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  tipTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginLeft: 8,
  },
  tipText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 20,
  },
  tipButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  tipButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },

  // Bio Modal Styles
  bioModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  bioContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '85%',
  },
  bioHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bioContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  therapistImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignSelf: 'center',
    marginBottom: 16,
  },
  therapistName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    textAlign: 'center',
    marginBottom: 4,
  },
  therapistSpecialty: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 32,
    paddingVertical: 20,
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  bioSectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    marginTop: 20,
  },
  bioText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  specializationsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  specializationTag: {
    backgroundColor: '#e8f5e8',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
  },
  specializationText: {
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: '500',
  },

  // Call Screen Styles
  callContainer: {
    backgroundColor: '#1a1a1a',
  },
  audioCallContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  callAvatar: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 24,
  },
  callName: {
    fontSize: 24,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 8,
  },
  callStatus: {
    fontSize: 16,
    color: '#4CAF50',
    marginBottom: 16,
  },
  callDuration: {
    fontSize: 18,
    color: '#ccc',
  },
  videoContainer: {
    flex: 1,
  },
  mainVideoView: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoPlaceholder: {
    width: 200,
    height: 200,
    borderRadius: 100,
  },
  videoName: {
    fontSize: 20,
    color: '#fff',
    marginTop: 20,
  },
  selfVideoView: {
    position: 'absolute',
    top: 60,
    right: 20,
    width: 120,
    height: 160,
    backgroundColor: '#333',
    borderRadius: 12,
    overflow: 'hidden',
  },
  selfVideoPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#444',
  },
  callControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  controlButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 12,
  },
  activeControl: {
    backgroundColor: '#666',
  },
  endCallButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#f44336',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 12,
  },
});

export default Chat;