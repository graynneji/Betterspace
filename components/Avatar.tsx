// import React from "react";
// import { StyleSheet, Text, View } from "react-native";
// interface AvatarProps {
//     annoymous?: boolean;
//     author: string;
//     picture?: string;
// }

// const Avatar: React.FC<AvatarProps> = ({ annoymous, author }) => {
//     console.log("picture ")
//     return (
//         <View style={styles.avatar}>
//             {/* {picture ? (
//                 <Image
//                     source={{ uri: picture }}
//                     style={styles.authorAvatar}
//                 />
//             ) : ( */}
//             <Text style={styles.avatarText}>
//                 {!annoymous ? author?.charAt(0).toUpperCase() : "A"}
//             </Text>
//             {/* )} */}
//         </View>
//     )
// }
// const styles = StyleSheet.create({

//     avatar: {
//         width: 40,
//         height: 40,
//         borderRadius: 20,
//         backgroundColor: '#3b82f6',
//         alignItems: 'center',
//         justifyContent: 'center',
//         marginRight: 12,
//     },
//     avatarText: {
//         color: 'white',
//         fontWeight: '600',
//         fontSize: 16,
//     },
//     authorAvatar: {
//         width: 40,
//         height: 40,
//         borderRadius: 20,
//         marginRight: 12,
//     },
// })
// export default Avatar