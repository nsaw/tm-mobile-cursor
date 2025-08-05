import React, { useState, useEffect } from 'react';
import { View, TextInput, FlatList, Text, Switch, TouchableOpacity } from 'react-native';
import { AutoRoleView } from '../../shell/wrappers/AutoRoleView';
import { useBins, Bin } from '../../hooks/useBins';
import { useTheme } from '../../theme/ThemeProvider';

const AllBinsScreen: React.FC = () => {
  const { bins, fetchBins, togglePrivacy, inviteCollaborator } = useBins();
  const [filter, setFilter] = useState('');
  const theme = useTheme();

  useEffect(() => {
    fetchBins();
  }, [fetchBins]);

  const renderItem = ({ item }: { item: Bin }) => (
    <View style={theme.styles.binItem}>
      <Text style={theme.styles.binTitle}>{item.name}</Text>
      <Text style={theme.styles.binOwner}>Description: {item.description}</Text>

      <View style={theme.styles.binPrivacyRow}>
        <Text style={theme.styles.binPrivacyLabel}>Private</Text>
        <Switch
          value={item.isPrivate}
          onValueChange={() => togglePrivacy(item.id)}
          accessibilityLabel="Toggle bin privacy"
        />
      </View>

      <TouchableOpacity
        onPress={() => inviteCollaborator(item.id, '')}
        style={theme.styles.inviteButton}
        accessibilityRole="button"
        accessibilityLabel="Invite collaborators"
      >
        <Text style={theme.styles.inviteLabel}>Invite</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <AutoRoleView layoutRole="container-main" style={theme.styles.screenContainer}>
      <TextInput
        placeholder="Search Bins..."
        value={filter}
        onChangeText={setFilter}
        style={theme.styles.input}
        accessibilityLabel="Search bins by name or owner"
      />

      <FlatList
        data={bins}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        accessibilityLabel="List of all bins"
      />
    </AutoRoleView>
  );
};

export default AllBinsScreen; 
