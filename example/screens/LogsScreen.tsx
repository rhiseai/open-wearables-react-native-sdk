import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LogEntry } from "../hooks/useLogs";

interface LogsScreenProps {
  logs: LogEntry[];
  onClearLogs: () => void;
  onBack: () => void;
}

export function LogsScreen({ logs, onClearLogs, onBack }: LogsScreenProps) {
  const [search, setSearch] = useState("");
  const insets = useSafeAreaInsets();

  const filtered = search.trim()
    ? logs.filter((e) => e.message.toLowerCase().includes(search.toLowerCase()))
    : logs;

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      {/* Navbar */}
      <View style={styles.navbar}>
        <Pressable onPress={onBack} style={styles.navButton} hitSlop={8}>
          <Ionicons name="chevron-down" size={24} color="#007AFF" />
        </Pressable>
        <Text style={styles.navTitle}>Sync Logs</Text>
        <Pressable onPress={onClearLogs} style={styles.navButton} hitSlop={8}>
          <Ionicons name="trash-outline" size={22} color="#FF3B30" />
        </Pressable>
      </View>

      {/* Search bar */}
      <View style={styles.searchContainer}>
        <Ionicons
          name="search"
          size={16}
          color="#8E8E93"
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Search logs…"
          placeholderTextColor="#8E8E93"
          value={search}
          onChangeText={setSearch}
          autoCorrect={false}
          autoCapitalize="none"
          clearButtonMode="while-editing"
        />
      </View>

      {/* Log list */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Text style={styles.empty}>
            {search.trim() ? "No matching logs." : "No logs yet."}
          </Text>
        }
        renderItem={({ item }) => (
          <View
            style={[styles.entry, item.type === "error" && styles.entryError]}
          >
            <Text style={styles.timestamp}>
              {item.timestamp.toLocaleTimeString()}
            </Text>
            <Text
              style={[
                styles.message,
                item.type === "error" && styles.messageError,
              ]}
            >
              {item.message}
            </Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  navbar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1C1C1E",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#38383A",
    paddingHorizontal: 8,
    paddingVertical: 12,
  },
  navButton: {
    width: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  navTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 17,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1C1C1E",
    margin: 12,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  searchIcon: {
    marginRight: 6,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: "#FFFFFF",
  },
  list: {
    paddingHorizontal: 12,
    paddingBottom: 20,
    gap: 6,
  },
  empty: {
    color: "#636366",
    fontStyle: "italic",
    textAlign: "center",
    paddingVertical: 40,
  },
  entry: {
    backgroundColor: "#1C1C1E",
    borderRadius: 8,
    padding: 10,
    gap: 2,
  },
  entryError: {
    backgroundColor: "#2D0000",
    borderLeftWidth: 3,
    borderLeftColor: "#FF453A",
  },
  timestamp: {
    fontSize: 11,
    color: "#636366",
  },
  message: {
    fontSize: 13,
    color: "#EBEBF5",
  },
  messageError: {
    color: "#FF6B6B",
  },
});
