/**
 * Validation utilities for form data and API inputs
 */

import { UserData } from "@/pages/TestEntryForm";
import { TestResult } from "@/data/testResultsTypes";

/**
 * Validation errors result type
 */
export interface ValidationResult {
  valid: boolean;
  errors: Record<string, string>;
}

/**
 * Validate user entry form data
 * @param data Form data to validate
 * @returns Validation result with errors if any
 */
export function validateUserData(data: UserData): ValidationResult {
  const errors: Record<string, string> = {};
  
  // Required fields
  if (!data.name?.trim()) {
    errors.name = "Nama harus diisi";
  }
  
  if (!data.age || data.age <= 0) {
    errors.age = "Usia harus diisi dengan angka yang valid";
  } else if (data.age < 5 || data.age > 100) {
    errors.age = "Usia harus antara 5-100 tahun";
  }
  
  if (!data.gender?.trim()) {
    errors.gender = "Jenis kelamin harus dipilih";
  }
  
  if (!data.studentClass?.trim()) {
    errors.studentClass = "Kelas/profesi harus diisi";
  }
  
  return {
    valid: Object.keys(errors).length === 0,
    errors
  };
}

/**
 * Validate test result data before saving
 * @param data Test result data to validate
 * @returns Validation result with errors if any
 */
export function validateTestResult(data: TestResult): ValidationResult {
  const errors: Record<string, string> = {};
  
  // Required fields
  if (!data.name?.trim()) {
    errors.name = "Nama harus diisi";
  }
  
  if (!data.results) {
    errors.results = "Data hasil tes tidak valid";
  } else {
    // Check if all intelligence types have scores
    const requiredTypes = [
      'linguistic', 'logical', 'musical', 'bodily',
      'spatial', 'interpersonal', 'intrapersonal', 'naturalistic'
    ];
    
    const missingTypes = requiredTypes.filter(
      type => typeof data.results[type as keyof typeof data.results] !== 'number'
    );
    
    if (missingTypes.length > 0) {
      errors.results = `Tipe kecerdasan berikut tidak memiliki nilai: ${missingTypes.join(', ')}`;
    }
  }
  
  if (!data.dominantType) {
    errors.dominantType = "Tipe kecerdasan dominan tidak ditemukan";
  }
  
  return {
    valid: Object.keys(errors).length === 0,
    errors
  };
}

/**
 * Format error message from validation result
 * @param validationResult Validation result to format
 * @returns Formatted error message string
 */
export function formatValidationErrors(validationResult: ValidationResult): string {
  if (validationResult.valid) {
    return '';
  }
  
  return Object.entries(validationResult.errors)
    .map(([field, error]) => `${field}: ${error}`)
    .join('\n');
}
