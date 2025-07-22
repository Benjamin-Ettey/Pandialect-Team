import AsyncStorage from "@react-native-async-storage/async-storage";

let accessToken = AsyncStorage.getItem("accessToken")
let userId = AsyncStorage.getItem("userId")
let refreshToken = AsyncStorage.getItem("refreshToken")

const getAccessToken = () => {
    return accessToken
}

const getUserId = () => {
    return userId
}

const getRefreshToken = () => {
    return refreshToken
}
