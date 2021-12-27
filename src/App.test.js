import { render, screen } from '@testing-library/react';
import App from './App';

test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/see/i);
  expect(linkElement).toBeInTheDocument();
});

test('randomizing works', () => {
  render(<App />);
  const linkElement = screen.getByText(/see/i);
  expect(linkElement).toBeInTheDocument();
});
