import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { DEFAULT_TONE_DURATION, DEFAULT_STARTING_LEVEL } from '../constants/AudioConstants';

// Define the shape of our settings
interface Settings {
  darkMode: boolean;
  highContrastMode: boolean;
  fontSize: 'small' | 'medium' | 'large';
  language: string;
  volume: number;
  toneDuration: number;
  startingLevel: number;
  useKeyboardShortcuts: boolean;
  showFrequencyLabels: boolean;
  showIntensityLabels: boolean;
  autoSaveResults: boolean;
  calibrationMode: boolean;
  notificationSounds: boolean;
}

// Default settings
const defaultSettings: Settings = {
  darkMode: false,
  highContrastMode: false,
  fontSize: 'medium',
  language: 'en',
  volume: 80,
  toneDuration: DEFAULT_TONE_DURATION,
  startingLevel: DEFAULT_STARTING_LEVEL,
  useKeyboardShortcuts: true,
  showFrequencyLabels: true,
  showIntensityLabels: true,
  autoSaveResults: true,
  calibrationMode: false,
  notificationSounds: true,
};

// Define the context shape
interface SettingsContextType {
  settings: Settings;
  updateSetting: <K extends keyof Settings>(key: K, value: Settings[K]) => void;
  resetSettings: () => void;
}

// Create the context
const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

// Helper functions for localStorage
const saveToLocalStorage = (settings: Settings) => {
  try {
    localStorage.setItem('audiometryTrainerSettings', JSON.stringify(settings));
  } catch (error) {
    console.error('Error saving settings to localStorage:', error);
  }
};

const loadFromLocalStorage = (): Settings => {
  try {
    const savedSettings = localStorage.getItem('audiometryTrainerSettings');
    if (savedSettings) {
      return { ...defaultSettings, ...JSON.parse(savedSettings) };
    }
  } catch (error) {
    console.error('Error loading settings from localStorage:', error);
  }
  return defaultSettings;
};

// Provider component
interface SettingsProviderProps {
  children: ReactNode;
}

export const SettingsProvider: React.FC<SettingsProviderProps> = ({ children }) => {
  const [settings, setSettings] = useState<Settings>(defaultSettings);

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = loadFromLocalStorage();
    setSettings(savedSettings);
  }, []);

  // Save settings to localStorage whenever they change
  useEffect(() => {
    saveToLocalStorage(settings);
  }, [settings]);

  // Update a single setting
  const updateSetting = <K extends keyof Settings>(key: K, value: Settings[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  // Reset all settings to defaults
  const resetSettings = () => {
    setSettings(defaultSettings);
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSetting, resetSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

// Custom hook for using the settings context
export const useSettings = (): SettingsContextType => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

export default SettingsContext; 