import * as SecureStore from 'expo-secure-store';

async function getToken() {
    return await SecureStore.getItemAsync('authToken');
}

export { getToken };