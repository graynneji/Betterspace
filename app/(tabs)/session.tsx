// import TherapistDashboard from '@/components/TherapistDash-v2';
import MessageStatusIcon from '@/components/MessageStatus';
import TherapistBioModal from '@/components/TherapistBioModal';
import WelcomeTip from '@/components/WelcomeTipModal';
import { useCheckAuth } from '@/context/AuthContext';
import { useCrudCreate, useGetById } from '@/hooks/useCrud';
import { useMessage } from '@/hooks/useMessage';
import { capitalizeFirstLetter, formatDate, formatTime, isToday } from '@/utils';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import React, { Dispatch, SetStateAction, useEffect, useLayoutEffect, useRef, useState, } from 'react';
import {
  Alert,
  FlatList,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";

interface ChatScreenProps {
  navigation: {
    navigate: (screen: string, params?: any) => void;
    goBack: () => void;
  },
  therapist: {
    name: string,
    therapist_id: string,
    authority: string,
    license: string,
    specialization: string,
    summary: string
  },
  senderId: string,
  setIsTherapist: Dispatch<SetStateAction<boolean>>
}

interface Patient {
  [key: string]: any;
}

export interface UserResult {
  user_id: string;
  name: string;
  therapist_id?: string;
  therapist?: any;
  patients?: Patient[];
  [key: string]: any;
}

export interface UserQueryData {
  data?: UserResult[];
  [key: string]: any;
}

type Message = {
  id: string;
  created_at: string;
  message: string;
  sender_id: string
  reciever_id: string
  status?: 'sending' | 'sent' | 'delivered' | 'read' | 'failed';
};

type sendMessage = {
  message: string;
  sender_id: string;
  reciever_id: string;
}

const ChatScreen = ({ navigation, therapist, senderId }: ChatScreenProps) => {
  const [messageText, setMessageText] = useState('');
  const [showWelcomeTip, setShowWelcomeTip] = useState(true);
  const [showTherapistBio, setShowTherapistBio] = useState(false);
  const [isNewUser] = useState(false);
  const { session } = useCheckAuth()
  const { id, patientId, patientName } = useLocalSearchParams<{ id?: string; patientId?: string, patientName?: string }>()
  const createMessageMutation = useCrudCreate<sendMessage>("messages")
  const router = useRouter()
  const listRef = useRef<FlatList<any>>(null);
  const receiverId = therapist ? therapist?.therapist_id : patientId || ""
  const options = {
    or: `and(sender_id.eq.${senderId},reciever_id.eq.${receiverId}),and(sender_id.eq.${receiverId},reciever_id.eq.${senderId})`,

  }
  const { messages, fetchOlder, hasMore } = useMessage(
    {
      table: "messages",
      filters: {},
      column: '*',
      options,
      pageSize: 30,
      senderId: senderId,
      receiverId,
    },
  )
  useFocusEffect(
    React.useCallback(() => {
      if (!session?.user) return;

      const isTherapist = session.user.user_metadata?.designation === "therapist";

      if (isTherapist && !patientId) {
        router.replace("/therapist-dashboard");
      }
    }, [session, patientId])
  );
  const [optimisticMessages, setOptimisticMessages] = useState<Message[]>([]);

  // Combine real messages with optimistic ones
  const allMessages = React.useMemo(() => {
    const realMessageIds = new Set(messages?.map(m => m.id) || []);

    const validOptimisticMessages = optimisticMessages.filter(
      om => !realMessageIds.has(om.id) && om.id.startsWith('temp-')
    );

    // Add default status to real messages
    const messagesWithStatus = (messages || []).map(msg => ({
      ...msg,
      status: msg.status || 'delivered' as const
    }));

    return [...messagesWithStatus, ...validOptimisticMessages];
  }, [messages, optimisticMessages]);
  // const groupMessagesByDate = () => {
  //   const groups: Record<string, Message[]> = {};
  //   messages?.forEach((msg) => {
  //     const date = msg.created_at
  //       ? formatDate(msg.created_at)
  //       : "Unknown Date";
  //     if (!groups[date]) {
  //       groups[date] = [];
  //     }
  //     groups[date].push(msg);
  //   });
  //   return groups;
  // };
  const groupMessagesByDate = () => {
    const groups: Record<string, Message[]> = {};
    allMessages?.forEach((msg) => { // Change from messages to allMessages
      const date = msg.created_at
        ? formatDate(msg.created_at)
        : "Unknown Date";
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(msg);
    });
    return groups;
  };
  const messageGroups = groupMessagesByDate();
  const flatData = React.useMemo(() => {
    const items: Array<{ type: "header"; date: string } | (Message & { type: "message"; date: string })> = [];
    Object.entries(messageGroups).forEach(([date, msgs]) => {
      items.push({ type: "header", date });
      msgs.forEach((msg) => items.push({ ...msg, type: "message", date }));
    });
    return items;
  }, [messageGroups]);
  useLayoutEffect(() => {
    if (flatData.length > 0) {
      listRef.current?.scrollToEnd({ animated: true });
    }
  }, [flatData]);

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
    if (messageText.trim()) {
      const tempId = `temp-${Date.now()}`;
      const optimisticMessage: Message = {
        id: tempId,
        message: messageText,
        sender_id: senderId,
        reciever_id: receiverId,
        created_at: new Date().toISOString(),
        status: 'sending'
      };

      setOptimisticMessages(prev => [...prev, optimisticMessage]);

      const messageToSend = messageText;
      setMessageText('');

      createMessageMutation.mutateAsync({
        message: messageToSend,
        sender_id: senderId,
        reciever_id: receiverId,
      })
        .then((response) => {
          // Remove optimistic message immediately
          setOptimisticMessages(prev =>
            prev.filter(msg => msg.id !== tempId)
          );
        })
        .catch((error) => {
          setOptimisticMessages(prev =>
            prev.map(msg =>
              msg.id === tempId
                ? { ...msg, status: 'failed' as const }
                : msg
            )
          );
        });
      setTimeout(() => {
        setOptimisticMessages(prev =>
          prev.filter(msg => msg.id !== tempId)
        );
      }, 5000);
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


  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" />
      {/* <StatusBar barStyle="dark-content" backgroundColor="#fff" /> */}

      {/* Header */}
      <View style={styles.header}>
        {
          !therapist && (<TouchableOpacity onPress={() => router.replace("therapist-dashboard")}>
            <Ionicons name="chevron-back-outline" size={24} color="#333" />
          </TouchableOpacity>)
        }


        <TouchableOpacity
          style={styles.therapistInfo}
          onPress={() => setShowTherapistBio(true)}
        >
          <Image
            source={{ uri: therapistInfo.image }}
            style={styles.headerAvatar}
          />
          <View>
            <Text style={styles.headerName}>{therapist?.name ? capitalizeFirstLetter(therapist.name) || 'Annoymous' : capitalizeFirstLetter(patientName)}</Text>
            {/* <Text style={{ fontSize: 12 }}>Session Provider</Text> */}
            <View style={styles.onlineStatus}>
              {/* <View style={styles.onlineDot} /> */}
              <Text style={styles.onlineText}>{therapist?.name ? "Session Provider" : "Session Client"}</Text>
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
      {/* <FlatList
        ref={listRef}
        data={flatData.reverse()}
        keyExtractor={(item, index) =>
          item.type === "header" ? `header-${item.date}-${index}` : `${item.id}`
        }
        renderItem={({ item }) => {
          if (item.type === "header") {
            return (
              <Text style={styles.date}>
                {isToday(item.date) ? "Today" : item.date}
              </Text>
            );
          }

          const isSender = item.sender_id === senderId;
          return (

            <View
              key={item.id}
              style={[
                styles.messageContainer,
                isSender ? styles.senderMessage : styles.receiverMessage,
              ]}
            >
                <View
                  style={[
                    styles.messageBubble,
                    isSender ? styles.senderBubble : styles.receiverBubble,
                  ]}
                >
                  <Text
                    style={[
                      styles.messageText,
                      isSender ? styles.senderText : styles.receiverText,
                    ]}
                  >
                    {item.message}
                  </Text>
                  <Text
                  style={[
                    styles.timestamp,
                    isSender ? styles.senderTimestamp : styles.receiverTimestamp,
                  ]}
                >
                  {formatTime(item.created_at)}
                </Text>
                   
              </View>
            </View>
          );
        }}
        inverted
        style={styles.messagesContainer}
        contentContainerStyle={{ paddingTop: 10, paddingBottom: 10 }}
        keyboardShouldPersistTaps="handled"
        onContentSizeChange={() => {
          listRef.current?.scrollToEnd({ animated: true });
        }}

      /> */}
      <FlatList
        ref={listRef}
        data={flatData.reverse()}
        keyExtractor={(item, index) =>
          item.type === "header" ? `header-${item.date}-${index}` : `${item.id}`
        }
        renderItem={({ item }) => {
          if (item.type === "header") {
            return (
              <View style={{ flexDirection: 'column' }}>
                <Text style={styles.date}>
                  {isToday(item.date) ? "Today" : item.date}
                </Text>
              </View>
            );
          }

          const isSender = item.sender_id === senderId;
          return (
            <View style={{ flexDirection: 'column' }}>
              <View
                key={item.id}
                style={[
                  styles.messageContainer,
                  isSender ? styles.senderMessage : styles.receiverMessage,
                ]}
              >
                <View
                  style={[
                    styles.messageBubble,
                    isSender ? styles.senderBubble : styles.receiverBubble,
                  ]}
                >
                  <Text
                    style={[
                      styles.messageText,
                      isSender ? styles.senderText : styles.receiverText,
                    ]}
                  >
                    {item.message}
                  </Text>
                  <Text
                    style={[
                      styles.timestamp,
                      isSender ? styles.senderTimestamp : styles.receiverTimestamp,
                    ]}
                  >
                    {formatTime(item.created_at)}
                  </Text>


                </View>
                {isSender && <MessageStatusIcon status={item.status} />}
              </View>
            </View>
          );
        }}
        inverted
        style={styles.messagesContainer}
        contentContainerStyle={{ paddingTop: 10, paddingBottom: 10 }}
        keyboardShouldPersistTaps="handled"
        onContentSizeChange={() => {
          listRef.current?.scrollToEnd({ animated: true });
        }}

      />

      {/* Input */}
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? 'padding' : 'height'}
        >
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textInput}
              value={messageText}
              onChangeText={setMessageText}
              placeholder="Type your message..."
              multiline
              maxLength={500}
              placeholderTextColor="#9ca3af"
            />
            {/* <TouchableOpacity style={styles.sendButton} > */}
            <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
              <Ionicons name="send" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>

      <WelcomeTip showWelcomeTip={showWelcomeTip} isNewUser={isNewUser} setShowWelcomeTip={setShowWelcomeTip} />
      {showTherapistBio && therapist && (
        <TherapistBioModal
          showTherapistBio={showTherapistBio}
          setShowTherapistBio={setShowTherapistBio}
          therapist={therapist}
        />
      )}
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
      <StatusBar barStyle="light-content" />

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

interface Session {
  user: {
    id: string;
    [key: string]: any;
  } | null;
  [key: string]: any;
}

// Navigation Component (for demo purposes)
const Session = () => {
  const [currentScreen, setCurrentScreen] = useState('chat');
  const [routeParams, setRouteParams] = useState({});
  const [isTherapist, setIsTherapist] = useState(false)
  const navigation = {
    navigate: (screen: string, params: any = {}) => {
      setCurrentScreen(screen.toLowerCase().replace('screen', ''));
      setRouteParams(params);
    },
    goBack: () => setCurrentScreen('chat'),
  };

  const { session } = useCheckAuth()
  const senderId = session?.user?.id!

  const { data, isLoading, error } = useGetById("user", { user_id: senderId }, "therapist(name, therapist_id, authority, license, specialization, summary)", !!senderId, {})

  const therapist = data?.result[0]?.therapist;

  if (currentScreen === 'call') {
    return <CallScreen route={{ params: routeParams }} navigation={navigation} />;
  }

  return <ChatScreen navigation={navigation} therapist={therapist} senderId={senderId} setIsTherapist={setIsTherapist} />

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
    backgroundColor: '#f9fafb',
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
  date: {
    textAlign: "center",
    marginVertical: 30
  },
  messageContainer: {
    flexDirection: 'row',
    marginVertical: 4,
  },
  senderMessage: {
    justifyContent: 'flex-end',
  },
  receiverMessage: {
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
  senderBubble: {
    backgroundColor: '#4CAF50',
    borderBottomRightRadius: 4,
  },
  receiverBubble: {
    backgroundColor: '#fff',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
  },
  senderText: {
    color: '#fff',
  },
  receiverText: {
    color: '#333',
  },
  timestamp: {
    fontSize: 12,
    marginTop: 4,
  },
  senderTimestamp: {
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'right',
  },
  receiverTimestamp: {
    color: '#999',
  },

  // Input Styles
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 12,

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
    backgroundColor: '#fff'
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

export default Session;