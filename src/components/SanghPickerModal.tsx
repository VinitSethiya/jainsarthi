import { useEffect, useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { colors } from '../theme/theme';

export interface SanghItem {
  id: string;
  name: string;
  city: string;
  state: string;
}

export const SANGH_LIST: SanghItem[] = [
  { id: '1', name: 'Shree Shankheshwar Parshwanath Sangh', city: 'Ahmedabad', state: 'Gujarat' },
  { id: '2', name: 'Shree Shatrunjay Tirth Sangh', city: 'Palitana', state: 'Gujarat' },
  { id: '3', name: 'Shree Babu Amichand Panalal Adishwarji Sangh', city: 'Walkeshwar', state: 'Mumbai' },
  { id: '4', name: 'Shree Chintamani Parshvanath Derasar', city: 'Surat', state: 'Gujarat' },
  { id: '5', name: 'Shree Mohanbari Parshwanath Tirth', city: 'Jaipur', state: 'Rajasthan' },
  { id: '6', name: 'Shree Godiji Parshwanath Jain Temple', city: 'Pune', state: 'Maharashtra' },
  { id: '7', name: 'Shree Mahavir Swami Jain Derasar', city: 'Bengaluru', state: 'Karnataka' },
  { id: '8', name: 'Shree Vasupujya Swami Jain Derasar', city: 'Kolkata', state: 'West Bengal' },
  { id: '9', name: 'Shree Nakoda Parshwanath Tirth', city: 'Balotra', state: 'Rajasthan' },
  { id: '10', name: 'Shree Samet Shikharji Sangh', city: 'Parasnath', state: 'Jharkhand' },
];

export function SanghPickerModal({
  visible,
  currentValue,
  onClose,
  onSelectSangh,
}: {
  visible: boolean;
  currentValue: string;
  onClose: () => void;
  onSelectSangh: (sanghFullName: string) => void;
}) {
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (visible) {
      setSearch('');
    }
  }, [visible]);

  const filtered = SANGH_LIST.filter((item) => {
    const q = search.toLowerCase();
    return (
      item.name.toLowerCase().includes(q) ||
      item.city.toLowerCase().includes(q) ||
      item.state.toLowerCase().includes(q)
    );
  });

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onClose} />

        <View style={styles.modalCard}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.headerEyebrow}>SANGH DIRECTORY</Text>
              <Text style={styles.title}>Select your Sangh</Text>
            </View>
            <Pressable
              onPress={onClose}
              hitSlop={8}
              style={({ pressed }) => [styles.closeBtn, pressed && styles.btnPressed]}
            >
              <Text style={styles.closeBtnText}>✕</Text>
            </Pressable>
          </View>

          {/* Search Input */}
          <View style={styles.searchBox}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              placeholder="Search Sangh or city..."
              placeholderTextColor="#897172"
              value={search}
              onChangeText={setSearch}
              style={styles.searchInput}
              clearButtonMode="while-editing"
            />
          </View>

          {/* Sangh List */}
          <ScrollView
            style={styles.list}
            contentContainerStyle={styles.listContent}
            keyboardShouldPersistTaps="handled"
          >
            {filtered.map((item) => {
              const fullName = `${item.name}, ${item.city}`;
              const isSelected = currentValue.includes(item.name);

              return (
                <Pressable
                  key={item.id}
                  onPress={() => {
                    onSelectSangh(fullName);
                    onClose();
                  }}
                  style={({ pressed }) => [
                    styles.itemCard,
                    isSelected && styles.itemCardSelected,
                    pressed && styles.btnPressed,
                  ]}
                >
                  <View style={[styles.itemIconBox, isSelected && styles.itemIconBoxSelected]}>
                    <Text style={styles.itemIconText}>🏛️</Text>
                  </View>

                  <View style={styles.itemTextCol}>
                    <Text style={[styles.itemName, isSelected && styles.itemNameSelected]}>
                      {item.name}
                    </Text>
                    <Text style={styles.itemCity}>
                      📍 {item.city}, {item.state}
                    </Text>
                  </View>

                  {isSelected && (
                    <View style={styles.checkBadge}>
                      <Text style={styles.checkText}>✓</Text>
                    </View>
                  )}
                </Pressable>
              );
            })}

            {filtered.length === 0 && (
              <View style={styles.emptyBox}>
                <Text style={styles.emptyText}>No Sangh found matching "{search}"</Text>
              </View>
            )}
          </ScrollView>

          {/* Footer */}
          <View style={styles.footer}>
            <Pressable
              onPress={onClose}
              style={({ pressed }) => [styles.cancelBtn, pressed && styles.btnPressed]}
            >
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(36, 25, 18, 0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalCard: {
    width: '100%',
    maxWidth: 390,
    maxHeight: '85%',
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 18,
    shadowColor: colors.ink,
    shadowOpacity: 0.25,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
    borderWidth: 1.5,
    borderColor: '#F1D7BF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  headerEyebrow: {
    fontSize: 9,
    fontWeight: '700',
    color: colors.gold,
    letterSpacing: 1,
    marginBottom: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.maroon,
    fontFamily: 'serif',
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.surfaceLow,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtnText: {
    fontSize: 14,
    color: colors.muted,
    fontWeight: '700',
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
    borderWidth: 1,
    borderColor: '#E8D5C4',
    marginBottom: 12,
    gap: 8,
  },
  searchIcon: {
    fontSize: 14,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: colors.ink,
  },
  list: {
    maxHeight: 320,
  },
  listContent: {
    gap: 8,
    paddingBottom: 4,
  },
  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E8D5C4',
    gap: 12,
  },
  itemCardSelected: {
    borderColor: colors.maroon,
    backgroundColor: colors.surfaceLow,
  },
  itemIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: colors.surfaceLow,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemIconBoxSelected: {
    backgroundColor: colors.goldLight,
  },
  itemIconText: {
    fontSize: 17,
  },
  itemTextCol: {
    flex: 1,
  },
  itemName: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.ink,
    lineHeight: 18,
  },
  itemNameSelected: {
    color: colors.maroon,
    fontWeight: '700',
  },
  itemCity: {
    fontSize: 11,
    color: colors.muted,
    marginTop: 2,
  },
  checkBadge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.maroon,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '800',
  },
  emptyBox: {
    paddingVertical: 24,
    alignItems: 'center',
  },
  emptyText: {
    color: colors.muted,
    fontSize: 13,
  },
  footer: {
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1D7BF',
  },
  cancelBtn: {
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: colors.surfaceLow,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelBtnText: {
    fontSize: 13,
    color: colors.muted,
    fontWeight: '600',
  },
  btnPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
});
