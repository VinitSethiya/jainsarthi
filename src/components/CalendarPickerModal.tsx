import { useEffect, useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/theme';

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const WEEK_DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

export function CalendarPickerModal({
  visible,
  currentValue,
  onClose,
  onSelectDate,
}: {
  visible: boolean;
  currentValue: string;
  onClose: () => void;
  onSelectDate: (formattedDate: string) => void;
}) {
  // Parse initial date from DD / MM / YYYY or YYYY-MM-DD
  const parseInitial = () => {
    if (currentValue) {
      const parts = currentValue.split(/[\/\s-]+/).filter(Boolean);
      if (parts.length === 3) {
        if (parts[0].length === 4) {
          // YYYY-MM-DD
          return { y: parseInt(parts[0], 10), m: parseInt(parts[1], 10) - 1, d: parseInt(parts[2], 10) };
        } else {
          // DD / MM / YYYY
          return { y: parseInt(parts[2], 10), m: parseInt(parts[1], 10) - 1, d: parseInt(parts[0], 10) };
        }
      }
    }
    return { y: 2000, m: 0, d: 15 };
  };

  const initial = parseInitial();
  const [viewYear, setViewYear] = useState<number>(initial.y);
  const [viewMonth, setViewMonth] = useState<number>(initial.m);
  const [selectedDay, setSelectedDay] = useState<number>(initial.d);
  const [showYearGrid, setShowYearGrid] = useState<boolean>(false);

  useEffect(() => {
    if (visible) {
      const init = parseInitial();
      setViewYear(init.y);
      setViewMonth(init.m);
      setSelectedDay(init.d);
      setShowYearGrid(false);
    }
  }, [visible, currentValue]);

  // Compute days in current month
  const totalDays = new Date(viewYear, viewMonth + 1, 0).getDate();
  const startDayOfWeek = new Date(viewYear, viewMonth, 1).getDay();

  const prevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  };

  const nextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  const handleConfirm = (dayToConfirm?: number) => {
    const d = dayToConfirm ?? selectedDay;
    const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
    const formatted = `${pad(d)} / ${pad(viewMonth + 1)} / ${viewYear}`;
    onSelectDate(formatted);
    onClose();
  };

  // Generate years list (1930 to 2026)
  const currentYear = new Date().getFullYear();
  const yearsList: number[] = [];
  for (let yr = currentYear; yr >= 1930; yr--) {
    yearsList.push(yr);
  }

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
            <Text style={styles.headerEyebrow}>JAIN SARTHI CALENDAR</Text>
            
            <View style={styles.navRow}>
              <Pressable
                onPress={prevMonth}
                hitSlop={8}
                style={({ pressed }) => [styles.navBtn, pressed && styles.btnPressed]}
              >
                <Text style={styles.navArrow}>‹</Text>
              </Pressable>

              <Pressable
                onPress={() => setShowYearGrid(!showYearGrid)}
                style={({ pressed }) => [styles.monthYearSelector, pressed && styles.btnPressed]}
              >
                <Text style={styles.monthYearText}>
                  {MONTH_NAMES[viewMonth]} {viewYear}
                </Text>
                <Text style={styles.dropdownIcon}>{showYearGrid ? '▲' : '▼'}</Text>
              </Pressable>

              <Pressable
                onPress={nextMonth}
                hitSlop={8}
                style={({ pressed }) => [styles.navBtn, pressed && styles.btnPressed]}
              >
                <Text style={styles.navArrow}>›</Text>
              </Pressable>
            </View>
          </View>

          {showYearGrid ? (
            /* Quick Year Selector Grid */
            <View style={styles.yearGridContainer}>
              <Text style={styles.yearGridHint}>Tap a year to jump:</Text>
              <ScrollView style={styles.yearScrollView} contentContainerStyle={styles.yearGridContent}>
                {yearsList.map((yr) => {
                  const isCurrent = yr === viewYear;
                  return (
                    <Pressable
                      key={yr}
                      onPress={() => {
                        setViewYear(yr);
                        setShowYearGrid(false);
                      }}
                      style={({ pressed }) => [
                        styles.yearChip,
                        isCurrent && styles.yearChipSelected,
                        pressed && styles.btnPressed,
                      ]}
                    >
                      <Text style={[styles.yearChipText, isCurrent && styles.yearChipTextSelected]}>
                        {yr}
                      </Text>
                    </Pressable>
                  );
                })}
              </ScrollView>
            </View>
          ) : (
            /* Month Days Grid */
            <View style={styles.calendarBody}>
              {/* Day names row */}
              <View style={styles.weekDaysRow}>
                {WEEK_DAYS.map((wd, idx) => (
                  <View key={idx} style={styles.dayCol}>
                    <Text style={styles.weekDayText}>{wd}</Text>
                  </View>
                ))}
              </View>

              {/* Days numbers */}
              <View style={styles.daysGrid}>
                {/* Empty cells before month start */}
                {Array.from({ length: startDayOfWeek }).map((_, i) => (
                  <View key={`empty-${i}`} style={styles.dayCol} />
                ))}

                {/* Days of month */}
                {Array.from({ length: totalDays }).map((_, i) => {
                  const dayNum = i + 1;
                  const isSelected = dayNum === selectedDay;
                  return (
                    <Pressable
                      key={dayNum}
                      onPress={() => {
                        setSelectedDay(dayNum);
                        handleConfirm(dayNum);
                      }}
                      style={({ pressed }) => [styles.dayCol, pressed && styles.btnPressed]}
                    >
                      <View style={[styles.dayCircle, isSelected && styles.dayCircleSelected]}>
                        <Text style={[styles.dayText, isSelected && styles.dayTextSelected]}>
                          {dayNum}
                        </Text>
                      </View>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          )}

          {/* Footer Actions */}
          <View style={styles.footer}>
            <Pressable
              onPress={onClose}
              style={({ pressed }) => [styles.cancelBtn, pressed && styles.btnPressed]}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </Pressable>

            <Pressable
              onPress={() => handleConfirm()}
              style={({ pressed }) => [styles.confirmBtn, pressed && styles.btnPressed]}
            >
              <Text style={styles.confirmText}>Select Date</Text>
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
    maxWidth: 350,
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
    marginBottom: 12,
  },
  headerEyebrow: {
    fontSize: 9,
    fontWeight: '700',
    color: colors.gold,
    letterSpacing: 1,
    textAlign: 'center',
    marginBottom: 8,
  },
  navRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  navBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.surfaceLow,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E8D5C4',
  },
  navArrow: {
    fontSize: 22,
    color: colors.maroon,
    fontWeight: '700',
    lineHeight: 24,
  },
  monthYearSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: '#E8D5C4',
  },
  monthYearText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.maroon,
  },
  dropdownIcon: {
    fontSize: 9,
    color: colors.maroon,
  },
  calendarBody: {
    marginTop: 4,
  },
  weekDaysRow: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  dayCol: {
    width: `${100 / 7}%`,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
  },
  weekDayText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.gold,
    letterSpacing: 0.5,
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayCircleSelected: {
    backgroundColor: colors.maroon,
    shadowColor: colors.maroonDark,
    shadowOpacity: 0.25,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  dayText: {
    fontSize: 13,
    color: colors.ink,
    fontWeight: '500',
  },
  dayTextSelected: {
    color: colors.white,
    fontWeight: '700',
  },
  yearGridContainer: {
    height: 240,
  },
  yearGridHint: {
    fontSize: 11,
    color: colors.muted,
    marginBottom: 6,
    textAlign: 'center',
  },
  yearScrollView: {
    flex: 1,
  },
  yearGridContent: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    justifyContent: 'center',
    paddingVertical: 4,
  },
  yearChip: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: '#E8D5C4',
    marginBottom: 4,
  },
  yearChipSelected: {
    backgroundColor: colors.maroon,
    borderColor: colors.maroon,
  },
  yearChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.ink,
  },
  yearChipTextSelected: {
    color: colors.white,
    fontWeight: '700',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 14,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1D7BF',
    gap: 10,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: colors.surfaceLow,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelText: {
    fontSize: 13,
    color: colors.muted,
    fontWeight: '600',
  },
  confirmBtn: {
    flex: 1.5,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: colors.maroon,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.maroonDark,
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  confirmText: {
    fontSize: 13,
    color: colors.white,
    fontWeight: '700',
  },
  btnPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.97 }],
  },
});
