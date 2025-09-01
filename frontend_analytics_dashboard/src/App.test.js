import { render, screen } from '@testing-library/react';
import App from './App';

test('renders dashboard header', () => {
  render(<App />);
  const title = screen.getByText(/Analytics/i);
  expect(title).toBeInTheDocument();
});
