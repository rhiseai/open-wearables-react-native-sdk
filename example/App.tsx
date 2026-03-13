import { Ionicons } from "@expo/vector-icons";
import { useEvent } from "expo";
import OpenWearablesHealthSDK, { HealthDataType } from "open-wearables";
import { useEffect, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Button, Colors } from "./components/Button";
import { ProvidersGroup } from "./components/ProvidersGroup";
import { SyncGroup } from "./components/SyncGroup";
import { SessionGroup } from "./components/SessionGroup";
import { useLogs } from "./hooks/useLogs";
import { LogsScreen } from "./screens/LogsScreen";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export default function App() {
  const onAuthErrorPayload = useEvent(OpenWearablesHealthSDK, "onAuthError");
  const [credentials, setCredentials] = useState<Record<string, any>>([]);
  const [showLogs, setShowLogs] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const { logs, clearLogs } = useLogs();

  const isConnected = Boolean(OpenWearablesHealthSDK.isSessionValid());

  useEffect(() => {
    refreshStoredCredentials();
  }, []);

  const requestAuthorization = async () => {
    const granted = await OpenWearablesHealthSDK.requestAuthorization(
      Object.values(HealthDataType)
    );
    setIsAuthorized(granted);
  };

  const refreshStoredCredentials = () => {
    const credentials = OpenWearablesHealthSDK.getStoredCredentials();
    console.log("[OpenWearables] - Credentials: ", credentials);
    setCredentials(credentials);
  };

  useEffect(() => {
    if (!onAuthErrorPayload) return;
    Alert.alert(onAuthErrorPayload.message);
  }, [onAuthErrorPayload]);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <Modal
          visible={showLogs}
          animationType="slide"
          onRequestClose={() => setShowLogs(false)}
        >
          <LogsScreen
            logs={logs}
            onClearLogs={clearLogs}
            onBack={() => setShowLogs(false)}
          />
        </Modal>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={{ flex: 1 }}
        >
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Open Wearables</Text>
            <Pressable onPress={() => setShowLogs(true)} hitSlop={8}>
              <View style={styles.logsButton}>
                <Ionicons name="list" size={20} color="#007AFF" />
                {logs.length > 0 && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>
                      {logs.length > 99 ? "99+" : logs.length}
                    </Text>
                  </View>
                )}
              </View>
            </Pressable>
          </View>
          <ScrollView
            contentContainerStyle={styles.contentContainer}
            style={styles.scroll}
            keyboardShouldPersistTaps="always"
          >
            <SessionGroup
              credentials={credentials}
              onSignOut={() => setIsAuthorized(null)}
            />
            {isConnected && (
              <>
                <ProvidersGroup
                  savedProvider={credentials.provider}
                  onProviderChange={() => setIsAuthorized(null)}
                />
                {isAuthorized === true ? (
                  <SyncGroup />
                ) : (
                  <>
                    <Button
                      title="Authorize Health"
                      color={Colors.positive}
                      onPress={requestAuthorization}
                    />
                    {isAuthorized === false && (
                      <View style={styles.accessDenied}>
                        <Text style={styles.accessDeniedText}>
                          Access denied. Please grant health permissions to
                          enable sync.
                        </Text>
                      </View>
                    )}
                  </>
                )}
              </>
            )}
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: "#000000",
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  logsButton: {
    position: "relative",
  },
  badge: {
    position: "absolute",
    top: -6,
    right: -8,
    backgroundColor: "#FF453A",
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 3,
  },
  badgeText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "700",
  },
  scroll: {
    flex: 1,
  },
  contentContainer: {
    gap: 16,
    padding: 20,
    paddingTop: 4,
  },
  accessDenied: {
    backgroundColor: "#2D0000",
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: "#FF453A",
    padding: 14,
  },
  accessDeniedText: {
    color: "#FF6B6B",
    fontSize: 14,
  },
});
