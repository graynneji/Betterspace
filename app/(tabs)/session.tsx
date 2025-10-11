// import TherapistDashboard from '@/components/TherapistDash-v2';
import MessageStatusIcon from '@/components/MessageStatus';
import TherapistBioModal from '@/components/TherapistBioModal';
import WelcomeTip from '@/components/WelcomeTipModal';
import { Colors } from '@/constants/Colors';
import { useCheckAuth } from '@/context/AuthContext';
import { useCrudCreate, useGetById } from '@/hooks/useCrud';
import { useMessage } from '@/hooks/useMessage';
import { capitalizeFirstLetter, formatDate, formatDateTime, formatTime, isToday } from '@/utils';
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
  // StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  useColorScheme,
  View
} from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";

interface ScheduleBubbleProps {
  appointment: Record<string, any> // or a specific type like Appointment if you have one
  isSender: boolean;
}

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
    profile_picture: string;
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

export type sendMessage = {
  message: string;
  sender_id: string;
  reciever_id: string;
  appointment_id: number;
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
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const styles = createStyles(colors);
  const receiverId = therapist ? therapist?.therapist_id : patientId || ""
  const options = {
    or: `and(sender_id.eq.${senderId},reciever_id.eq.${receiverId}),and(sender_id.eq.${receiverId},reciever_id.eq.${senderId})`,

  }
  const { messages, fetchOlder, hasMore } = useMessage(
    {
      table: "messages",
      filters: {},
      column: '*, appointment(*)',
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



  // Schedule Bubble Component
  const ScheduleBubble = ({ appointment, isSender }: ScheduleBubbleProps) => (
    <View style={[
      styles.scheduleBubble,
      isSender ? styles.senderSchedule : styles.receiverSchedule
    ]}>
      <View style={styles.scheduleHeader}>
        {/* <Text style={styles.scheduleIcon}>📅</Text> */}
        <Ionicons name="calendar-outline" size={16} color="red" />
        <Text style={styles.scheduleTitle}>Appointment</Text>
      </View>

      <View style={styles.scheduleDetails}>
        {/* <View style={styles.scheduleRow}>
          <Text style={styles.scheduleLabel}>Date</Text>
          <Text style={styles.scheduleValue}>{appointment.date}</Text>
        </View> */}

        <View style={styles.scheduleRow}>
          <Text style={styles.scheduleLabel}>Time</Text>
          <Text style={styles.scheduleValue}>{formatDateTime(appointment.time)}</Text>
        </View>

        {appointment.title && (
          <View style={styles.scheduleRow}>
            <Text style={styles.scheduleLabel}>Title</Text>
            <Text style={styles.scheduleValue}>{appointment.title}</Text>
          </View>
        )}

        {appointment.description && (
          <View style={styles.scheduleRow}>
            <Text style={styles.scheduleLabel}>Description</Text>
            <Text style={styles.scheduleValue}>{appointment.description}</Text>
          </View>
        )}
      </View>

      {/* <TouchableOpacity style={[
        styles.scheduleButton,
        isSender ? styles.senderButton : styles.receiverButton
      ]}>
        <Text style={styles.scheduleButtonText}>
          {isSender ? 'View Details' : 'Accept'}
        </Text>
      </TouchableOpacity> */}
    </View>
  );


  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        {
          !therapist && (<TouchableOpacity onPress={() => router.replace("therapist-dashboard")}>
            <Ionicons name="chevron-back-outline" size={24} color={colors.text} />
          </TouchableOpacity>)
        }
        <TouchableOpacity
          style={styles.therapistInfo}
          onPress={() => setShowTherapistBio(true)}
        >
          {therapist?.profile_picture ? <Image
            source={{ uri: therapist?.profile_picture || 'https://via.placeholder.com/40' }}
            style={styles.headerAvatar}
          /> : <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {therapist?.name?.charAt(0).toUpperCase() || "A"}
            </Text>
          </View>}
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
            <Ionicons name="call" size={20} color={colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.callButton} onPress={startVideoCall}>
            <Ionicons name="videocam" size={20} color={colors.primary} />
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
          const isAppointment = item?.appointment?.id
          return (
            // <View style={{ flexDirection: 'column' }}>
            //   <View
            //     key={item.id}
            //     style={[
            //       styles.messageContainer,
            //       isSender ? styles.senderMessage : styles.receiverMessage,
            //     ]}
            //   >
            //     <View
            //       style={[
            //         styles.messageBubble,
            //         isSender ? styles.senderBubble : styles.receiverBubble,
            //       ]}
            //     >
            //       <Text
            //         style={[
            //           styles.messageText,
            //           isSender ? styles.senderText : styles.receiverText,
            //         ]}
            //       >
            //         {item.message}
            //       </Text>
            //       <Text
            //         style={[
            //           styles.timestamp,
            //           isSender ? styles.senderTimestamp : styles.receiverTimestamp,
            //         ]}
            //       >
            //         {formatTime(item.created_at)}
            //       </Text>


            //     </View>
            //     {isSender && <MessageStatusIcon status={item.status} />}
            //   </View>
            // </View>

            <View style={{ flexDirection: 'column' }}>
              <View
                key={item.id}
                style={[
                  styles.messageContainer,
                  isSender ? styles.senderMessage : styles.receiverMessage,
                ]}
              >
                {isAppointment ? (
                  // Render Schedule Bubble
                  <View style={{ alignItems: isSender ? 'flex-end' : 'flex-start', flex: 1 }}>
                    <ScheduleBubble
                      appointment={item.appointment}
                      isSender={isSender}
                    />
                    <Text
                      style={[
                        styles.timestamp,
                        isSender ? styles.senderTimestamp : styles.receiverTimestamp,
                        { marginTop: 4, marginRight: isSender ? 8 : 0, marginLeft: isSender ? 0 : 8 }
                      ]}
                    >
                      {formatTime(item.created_at)}
                    </Text>
                    {isSender && <MessageStatusIcon status={item.status} />}
                  </View>
                ) : (
                  // Render Regular Message Bubble
                  <>
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
                  </>
                )}
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
              placeholderTextColor={colors.placeholder}
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
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const styles = createStyles(colors);

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
      {/* <StatusBar barStyle="light-content" /> */}

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
  const staleTime = 1000 * 60 * 60 * 24
  const gcTime = 1000 * 60 * 60 * 24
  const refetchOnWindowFocus = false
  const refetchOnReconnect = false
  const refetchOnMount = false

  const { data, isLoading, error } = useGetById(
    "user",
    { user_id: senderId },
    "therapist(name, therapist_id, authority, license, specialization, summary)",
    !!senderId,
    {},
    staleTime,
    gcTime,
    refetchOnWindowFocus,
    refetchOnReconnect,
    refetchOnMount
  )

  const therapist = data?.result[0]?.therapist;

  if (currentScreen === 'call') {
    return <CallScreen route={{ params: routeParams }} navigation={navigation} />;
  }

  return <ChatScreen navigation={navigation} therapist={therapist} senderId={senderId} setIsTherapist={setIsTherapist} />

};

const createStyles = (colors: typeof Colors.light) => StyleSheet.create({
  scheduleBubble: {
    maxWidth: '85%',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1.5,
    backgroundColor: '#FFFFFF',
  },
  senderSchedule: {
    backgroundColor: '#E3F2FD',
    borderColor: '#2196F3',
  },
  receiverSchedule: {
    backgroundColor: '#F5F5F5',
    borderColor: '#BDBDBD',
  },
  scheduleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    gap: 5,
    borderBottomColor: '#E0E0E0',
  },
  scheduleIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  scheduleTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: 'red',
  },
  scheduleDetails: {
    marginBottom: 12,
  },
  scheduleRow: {
    marginBottom: 8,
  },
  scheduleLabel: {
    fontSize: 11,
    color: '#757575',
    marginBottom: 2,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  scheduleValue: {
    fontSize: 14,
    color: '#212121',
    fontWeight: '500',
  },
  scheduleButton: {
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  senderButton: {
    backgroundColor: '#2196F3',
  },
  receiverButton: {
    backgroundColor: '#4CAF50',
  },
  scheduleButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  ////////////////////////////////////////////////////////
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  // Header Styles
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.background,
  },
  therapistInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 16,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#3b82f6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12
  },
  avatarText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
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
    color: colors.text,
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
    backgroundColor: colors.primary,
    marginRight: 4,
  },
  onlineText: {
    fontSize: 12,
    color: colors.primary,
  },
  callButtons: {
    flexDirection: 'row',
  },
  callButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.headerBackground,
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
    marginVertical: 30,
    color: colors.text
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
    backgroundColor: colors.senderBubble,
    borderBottomRightRadius: 4,
  },
  receiverBubble: {
    backgroundColor: colors.receiverBubble,
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
  },
  senderText: {
    color: colors.senderText,
  },
  receiverText: {
    color: colors.receiverText,
  },
  timestamp: {
    fontSize: 12,
    marginTop: 4,
  },
  senderTimestamp: {
    color: colors.timestamp,
    textAlign: 'right',
  },
  receiverTimestamp: {
    color: colors.timestampReceiver,
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
    borderColor: colors.inputBorder,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    maxHeight: 100,
    fontSize: 16,
    color: colors.inputText,
    backgroundColor: colors.inputBackground
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },


  ////////////////////////TODO///////////////////////////////
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