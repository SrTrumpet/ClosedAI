import * as SecureStore from 'expo-secure-store';

async function getToken() {
    return await SecureStore.getItemAsync('userToken');
}

export { getToken };