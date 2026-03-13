import OpenWearablesHealthSDK from "open-wearables";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Button, Colors } from "./Button";
import { Group } from "./Group";

export function SyncGroup() {
  const [lastSyncedAt, setLastSyncedAt] = useState<Date | null>(null);

  const isSyncActive = Boolean(OpenWearablesHealthSDK.isSyncActive());

  const toggleBackgroundSync = async () => {
    if (isSyncActive) {
      await OpenWearablesHealthSDK.stopBackgroundSync();
    } else {
      await OpenWearablesHealthSDK.startBackgroundSync(null);
    }
  };

  const handleSyncNow = async () => {
    await OpenWearablesHealthSDK.syncNow();
    setLastSyncedAt(new Date());
  };

  return (
    <Group name="Sync">
      <View style={styles.row}>
        <Text style={styles.label}>Background Sync</Text>
        <Button
          title={isSyncActive ? "Stop" : "Start"}
          color={isSyncActive ? Colors.destructive : Colors.positive}
          onPress={toggleBackgroundSync}
        />
      </View>
      <Button
        title="Manual Sync"
        disabled={isSyncActive}
        onPress={handleSyncNow}
      />
      {lastSyncedAt != null && (
        <Text style={styles.lastSync}>
          Last sync:{" "}
          {lastSyncedAt.toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}{" "}
          at {lastSyncedAt.toLocaleTimeString()}
        </Text>
      )}
    </Group>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  label: {
    fontSize: 16,
    color: "#FFFFFF",
  },
  lastSync: {
    fontSize: 12,
    color: "#8E8E93",
    textAlign: "right",
  },
});
