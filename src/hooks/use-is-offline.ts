import { useNetworkState } from 'expo-network';

// Só considera sem internet quando o sistema confirma; enquanto não sabe, segue como conectado.
export function useIsOffline() {
  const { isConnected, isInternetReachable } = useNetworkState();
  return isConnected === false || isInternetReachable === false;
}
