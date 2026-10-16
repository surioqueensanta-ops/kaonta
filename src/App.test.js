import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

beforeEach(() => { window.scrollTo = jest.fn(); });

test('cart derives the total from quantities and delivery service', () => {
  render(<App />);
  fireEvent.click(screen.getByRole('button', { name: 'Add Chicken Adobo to order' }));
  fireEvent.click(screen.getByRole('button', { name: 'Cart, 1 items' }));
  expect(screen.getByText('₱199.00')).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Increase Chicken Adobo' }));
  expect(screen.getByText('₱348.00')).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Pickup', exact: true }));
  expect(screen.queryByText('₱348.00')).not.toBeInTheDocument();
  expect(screen.getAllByText('₱298.00').length).toBeGreaterThan(0);
});

test('sign up cannot create an administrator and rejects mismatched passwords', () => {
  render(<App />);
  fireEvent.click(screen.getByRole('button', { name: /Log in/ }));
  fireEvent.click(screen.getByRole('button', { name: 'Sign up' }));
  fireEvent.change(screen.getByLabelText('Full name'), { target: { value: 'Student' } });
  fireEvent.change(screen.getByLabelText('Contact number'), { target: { value: '09123456789' } });
  fireEvent.change(screen.getByLabelText('Email address'), { target: { value: 'student@example.com' } });
  fireEvent.change(screen.getByLabelText('Password', { exact: true }), { target: { value: 'Sample123!' } });
  fireEvent.change(screen.getByLabelText('Confirm password'), { target: { value: 'Mismatch123!' } });
  fireEvent.submit(screen.getByRole('button', { name: 'Create demo account →' }).closest('form'));
  expect(screen.getByRole('status')).toHaveTextContent('Your passwords do not match.');
  fireEvent.change(screen.getByLabelText('Confirm password'), { target: { value: 'Sample123!' } });
  fireEvent.submit(screen.getByRole('button', { name: 'Create demo account →' }).closest('form'));
  expect(screen.getByRole('heading', { name: 'Good things on the way.' })).toBeInTheDocument();
  expect(screen.queryByRole('button', { name: 'Admin', exact: true })).not.toBeInTheDocument();
});
