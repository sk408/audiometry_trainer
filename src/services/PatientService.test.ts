import patientService from './PatientService';

describe('PatientService', () => {
  describe('getPatientById', () => {
    it('should return a patient profile when a valid ID is provided', () => {
      // Act
      const patient = patientService.getPatientById('patient1');

      // Assert
      expect(patient).toBeDefined();
      expect(patient?.id).toBe('patient1');
      expect(patient?.name).toBe('Alex Johnson');
      expect(patient?.hearingLossType).toBe('normal');
    });

    it('should return undefined when an invalid ID is provided', () => {
      // Act
      const patient = patientService.getPatientById('non-existent-patient-id');

      // Assert
      expect(patient).toBeUndefined();
    });

    it('should return undefined when an empty string is provided', () => {
      // Act
      const patient = patientService.getPatientById('');

      // Assert
      expect(patient).toBeUndefined();
    });

    it('should return correct patient when testing other valid IDs', () => {
      // Act
      const patient = patientService.getPatientById('patient6');

      // Assert
      expect(patient).toBeDefined();
      expect(patient?.id).toBe('patient6');
      expect(patient?.name).toBe('Eliza Thompson');
      expect(patient?.hearingLossType).toBe('sensorineural');
    });
  });
});
