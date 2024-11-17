import { useState } from "react";
import { TouchableOpacity, View, StyleSheet, Text } from "react-native";

interface ChipProps {
  label: string;
  value: string;
  selected: boolean;
  onPress: (value: string) => void;
}

const Chip: React.FC<ChipProps> = ({ label, value, selected, onPress }) => {
  return (
    <TouchableOpacity style={[styles.chip, selected && styles.selectedChip]} onPress={() => onPress(value)}>
      <Text style={[styles.chipText, selected && styles.selectedChipText]}>{label}</Text>
    </TouchableOpacity>
  );
};

const CustomChip: React.FC = () => {
  const [selectedChip, setSelectedChip] = useState<string | null>(null);
  
  const handleChipPress = (value: string) => {
    setSelectedChip(value);
  };

  return (
    <View style={styles.container}>
      <Chip label="Upper" value="upper" selected={selectedChip === 'upper'} onPress={handleChipPress} />
      <Chip label="Lower" value="lower" selected={selectedChip === 'lower'} onPress={handleChipPress} />
      <Chip label="Rec" value="rec" selected={selectedChip === 'rec'} onPress={handleChipPress} />
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