import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App';

describe('App', () => {
  it('renders without crashing', () => {
    render(<App />);
    // The splash screen should show the logo
    const logo = screen.getByAltText('Audiometry Trainer Logo');
    expect(logo).toBeInTheDocument();
  });
});
