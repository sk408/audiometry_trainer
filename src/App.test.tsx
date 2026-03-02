import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import App from './App';

test('renders App without crashing', async () => {
  render(<App />);
  await waitFor(() => {
    const logoElement = screen.getByAltText(/Audiometry Trainer Logo/i);
    expect(logoElement).toBeInTheDocument();
  });
});
