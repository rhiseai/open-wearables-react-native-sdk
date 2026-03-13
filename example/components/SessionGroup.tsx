import OpenWearablesHealthSDK from "open-wearables";
import { useEffect, useState } from "react";
import { Alert } from "react-native";
import { Button, Colors } from "./Button";
import { Group } from "./Group";
import { Input } from "./Input";

interface SessionGroupProperties {
  credentials: Record<string, any>;
  onSignOut?: () => void;
}

export function SessionGroup({
  credentials,
  onSignOut,
}: SessionGroupProperties) {
  const [hostInput, setHostInput] = useState("");
  const [invitationCode, setInvitationCode] = useState("");
  const [connecting, setConnecting] = useState(false);

  const isConnected = Boolean(OpenWearablesHealthSDK.isSessionValid());

  useEffect(() => {
    const restoreHost = async () => {
      const host = credentials.host;
      if (host) {
        OpenWearablesHealthSDK.configure(host);
      } else {
        await signOut();
      }
    };

    restoreHost();
  }, []);

  useEffect(() => {
    if (credentials.host) {
      setHostInput(credentials.host);
    }
  }, [credentials]);

  const signOut = async () => {
    try {
      await OpenWearablesHealthSDK.signOut();
      onSignOut?.();
    } catch (e: any) {
      Alert.alert("Sign out error", e?.message ?? String(e));
    }
  };

  const connect = async () => {
    setConnecting(true);
    try {
      OpenWearablesHealthSDK.configure(hostInput);

      const response = await fetch(
        `${hostInput}/api/v1/invitation-code/redeem`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code: invitationCode }),
        }
      );

      if (!response.ok) {
        const res = await response.json();
        Alert.alert("Connect failed", res.detail || `HTTP ${response.status}`);
        return;
      }

      const data = await response.json();
      const userId = data.user_id as string | null;
      const accessToken = data.access_token as string | null;
      const refreshToken = data.refresh_token as string | null;
      if (userId == null || accessToken == null || refreshToken == null)
        throw new Error("Invalid response from server");

      const bearerToken = accessToken.startsWith("Bearer ")
        ? accessToken
        : `Bearer ${accessToken}`;

      await OpenWearablesHealthSDK.signIn(
        userId,
        bearerToken,
        refreshToken,
        null
      );
    } catch (e: any) {
      Alert.alert("Connect error", e?.message ?? String(e));
    } finally {
      setConnecting(false);
    }
  };

  return (
    <Group name={`Session — ${isConnected ? "Connected" : "Not connected"}`}>
      {isConnected ? (
        <Button title="Sign Out" color={Colors.destructive} onPress={signOut} />
      ) : (
        <>
          <Input
            onChangeText={setHostInput}
            value={hostInput}
            placeholder="Host URL"
            autoCorrect={false}
            autoCapitalize="none"
            editable={!isConnected}
          />
          <Input
            onChangeText={setInvitationCode}
            value={invitationCode}
            placeholder="Invitation Code"
            autoCorrect={false}
            autoCapitalize="none"
          />
          <Button
            title={connecting ? "Connecting…" : "Connect"}
            color={Colors.primary}
            disabled={connecting || invitationCode.length === 0}
            onPress={connect}
          />
        </>
      )}
    </Group>
  );
}
