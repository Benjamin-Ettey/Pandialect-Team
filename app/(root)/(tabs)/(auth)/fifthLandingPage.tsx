// import { View, Text, TouchableOpacity, Image } from 'react-native'
// import React from 'react'
// import { router } from 'expo-router'

// const fifthLandingPage = () => {
//   return (
//     <View
//     style={{
//       flex: 1,
//       justifyContent: 'center',
//       alignItems: 'center',
//       backgroundColor: '#fff'
//     }}
//     >
//       <View
//       style={{
//         width: 350,
//         height: 280,
//         backgroundColor: '#7f6edb',
//         justifyContent:'center',
//         alignItems: 'center',
//         borderBottomLeftRadius: 120,
//         borderBottomRightRadius: 120,
//         borderRadius: 150,
//         bottom: '10%'
//       }}
//       >
//         <Image
//               source={require('../../../../assets/images/pandaHappy.png')}
//               style={{width: '100%', height: '90%'}}
//               resizeMode="contain"
//               />
//       </View>

//       <Text
//       style={{
//         textAlign: 'center',
//         fontSize: 18,
//       }}
//       >Hi! <Text style={{ fontWeight: 'bold', color: '#7f6edb'}}>Pandyy</Text> is happy {"\n"}with your progress. 
//         <Text style={{ fontWeight: 'bold', color: '#7f6edb' }}> Keep it up.</Text></Text>

//         <TouchableOpacity
//         style={{
//           backgroundColor: '#7f6edb',
//           paddingVertical: 16,
//           paddingHorizontal: 40,
//           borderRadius: 60,
//           shadowColor: '#000',
//           shadowOffset: { width: 0, height: 6 },
//           shadowOpacity: 0.2,
//           shadowRadius: 8,
//           elevation: 8,
//           borderBottomLeftRadius: 60,
//           borderBottomRightRadius: 60,
//           top: '15%',
//           width: 200
//         }}

//         onPress={()=>router.push("/(root)/(tabs)/(auth)/sixthLandingPage")}
//         >
//           <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 15, textAlign: 'center' }}>Next</Text>
//         </TouchableOpacity>
//     </View>
//   )
// }

// export default fifthLandingPage