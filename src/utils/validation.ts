/**
 * Validates a full name:
 * - Must be at least 2 characters (trimmed)
 * - Maximum 70 characters
 * - Only letters (including Unicode for Hindi/Gujarati scripts), spaces, hyphens, and dots
 */
export function validateFullName(name: string): { isValid: boolean; error?: string } {
  const trimmed = name.trim();
  if (!trimmed) {
    return { isValid: false, error: 'Please enter your Full Name.' };
  }
  if (trimmed.length < 2) {
    return { isValid: false, error: 'Full Name must be at least 2 characters.' };
  }
  if (trimmed.length > 70) {
    return { isValid: false, error: 'Full Name cannot exceed 70 characters.' };
  }

  // Support Latin (English), Devanagari (Hindi \u0900-\u097F), and Gujarati (\u0A80-\u0AFF) letter scripts
  const nameRegex = /^[a-zA-Z\u0900-\u097F\u0A80-\u0AFF\s.'-]+$/;
  if (!nameRegex.test(trimmed)) {
    return { isValid: false, error: 'Full Name should only contain letters, spaces, and dots.' };
  }

  return { isValid: true };
}

/**
 * Validates Date of Birth string in DD / MM / YYYY format:
 * - Must parse into valid Day, Month, Year
 * - Day must be valid for the given month (e.g. 28/29 for Feb depending on leap year)
 * - Cannot be in the future
 * - Minimum age: 5 years
 * - Maximum age: 120 years
 */
export function validateDOB(dob: string): { isValid: boolean; error?: string; date?: Date } {
  const trimmed = dob.trim();
  if (!trimmed) {
    return { isValid: false, error: 'Please enter your Date of Birth.' };
  }

  const parts = trimmed.split(/[\/\s]+/).filter(Boolean);
  if (parts.length !== 3) {
    return { isValid: false, error: 'Please enter full date in DD / MM / YYYY format.' };
  }

  const day = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10);
  const year = parseInt(parts[2], 10);

  if (isNaN(day) || isNaN(month) || isNaN(year) || parts[2].length !== 4) {
    return { isValid: false, error: 'Please enter a valid 4-digit year (e.g. 1995).' };
  }

  if (month < 1 || month > 12) {
    return { isValid: false, error: 'Month must be between 01 and 12.' };
  }

  // Days in given month considering leap years
  const daysInMonth = new Date(year, month, 0).getDate();
  if (day < 1 || day > daysInMonth) {
    return {
      isValid: false,
      error: `Invalid day for month ${month}. Must be between 01 and ${daysInMonth}.`,
    };
  }

  const birthDate = new Date(year, month - 1, day);
  const today = new Date();

  if (birthDate > today) {
    return { isValid: false, error: 'Date of Birth cannot be in the future.' };
  }

  // Calculate age in years
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  if (age < 5) {
    return { isValid: false, error: 'Member must be at least 5 years of age.' };
  }
  if (age > 120) {
    return { isValid: false, error: 'Please enter a realistic year of birth.' };
  }

  return { isValid: true, date: birthDate };
}

/**
 * Validates Indian Mobile Number (10 digits, starts with 6, 7, 8, or 9)
 */
export function validatePhone(phone: string): { isValid: boolean; error?: string } {
  const digits = phone.replace(/\D/g, '');
  if (!digits) {
    return { isValid: false, error: 'Please enter your mobile number.' };
  }
  if (digits.length !== 10) {
    return { isValid: false, error: 'Mobile number must be exactly 10 digits.' };
  }
  if (!/^[6-9]/.test(digits)) {
    return { isValid: false, error: 'Mobile number must start with 6, 7, 8, or 9.' };
  }
  return { isValid: true };
}
