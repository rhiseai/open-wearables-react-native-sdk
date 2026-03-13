import OpenWearablesHealthSDK from "open-wearables";
import { HealthDataProvider } from "open-wearables";
import { useEffect, useState } from "react";
import { Alert } from "react-native";
import { Group } from "./Group";
import { OptionSelector, SelectorOption } from "./OptionSelector";

interface ProvidersGroupProps {
  savedProvider: string | null;
  onProviderChange?: () => void;
}

export function ProvidersGroup({
  savedProvider,
  onProviderChange,
}: ProvidersGroupProps) {
  const [providers, setProviders] = useState<HealthDataProvider[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    setProviders(OpenWearablesHealthSDK.getAvailableProviders());
  }, []);

  useEffect(() => {
    setSelectedId(savedProvider);
  }, [savedProvider]);

  const handleSelect = (id: string) => {
    setSelectedId(id);
    const changed = OpenWearablesHealthSDK.setProvider(id);
    if (changed) {
      onProviderChange?.();
    } else {
      Alert.alert("Set provider error, check log");
    }
  };

  if (providers.length === 0) return null;

  const options: SelectorOption[] = providers.map((p) => ({
    id: p.id,
    title: p.displayName,
    disabled: !p.isAvailable,
  }));

  return (
    <Group name="Providers">
      <OptionSelector
        options={options}
        selectedId={selectedId}
        onSelect={handleSelect}
      />
    </Group>
  );
}
