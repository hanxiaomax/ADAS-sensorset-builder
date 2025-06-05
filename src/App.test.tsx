import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Feedback button', () => {
  render(<App />);
  const feedbackButton = screen.getByText(/Feedback/i);
  expect(feedbackButton).toBeInTheDocument();
});
