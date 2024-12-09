import { useState } from "react";
import { TouchableOpacity, View, StyleSheet, Text } from "react-native";

interface ChipProps {
  label: string;
  value: number;
  selected: boolean;
  onPress: (value: number) => void;
}

const Chip: React.FC<ChipProps> = ({ label, value, selected, onPress }) => {
  return (
    <TouchableOpacity 
      style={[styles.chip, selected && styles.selectedChip]} 
      onPress={() => onPress(value)}
    >
      <Text style={[styles.chipText, selected && styles.selectedChipText]}>{label}</Text>
    </TouchableOpacity>
  );
};

interface CustomChipProps {
  onTypeSelect: (type: number) => void;
  selectedType?: number | null; 
}

const CustomChip: React.FC<CustomChipProps> = ({ onTypeSelect }) => {
  const [selectedChip, setSelectedChip] = useState<number | null>(null);
  console.log(selectedChip);
  const handleChipPress = (value: number) => {
    setSelectedChip(value);
    onTypeSelect(value);
  };

  return (
    <View style={styles.container}>
      <Chip label="Upper" value={1} selected={selectedChip === 1} onPress={handleChipPress} />
      <Chip label="Lower" value={2} selected={selectedChip === 2} onPress={handleChipPress} />
      <Chip label="Rec" value={3} selected={selectedChip === 3} onPress={handleChipPress} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  chip: {
    backgroundColor: '#D9D9D9',
    borderRadius: 20,
    padding: 10,
    margin: 5,
    width: '25%',
    // height: 65,
    alignItems: 'center',
  },
  chipText: {
    fontSize: 15,
    // fontWeight: 'bold',
    color: '#1D2526',
  },
  selectedChip: {
    backgroundColor: '#2493BF',
  },
  selectedChipText: {
    color: '#fff',
  }
});

export default CustomChip;
