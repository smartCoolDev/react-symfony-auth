import React from 'react';
import { render, fireEvent, waitForElement } from '@testing-library/react';
import UserDetailsPage from './UserDetailsPage';

describe('UserDetailsPage', () => {
  const mockViewOne = jest.fn();
  const mockUpdateDetails = jest.fn();
  const props = {
    match: { params: { id: 1 } },
    user: {
      details: {
        updatedAt: new Date(),
        message: null,
        attributes: {
          id: 1,
          name: 'John Doe',
          email: 'johndoe@example.com',
          status: 1,
          houseNumber: '100',
          streetAddress: 'Street Name',
          city: 'London',
          postcode: 'SW1A 2AA',
          createdAt: new Date()
        }
      }
    },
    userMethods: { viewOne: mockViewOne, updateDetails: mockUpdateDetails }
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders loading spinner when data is not loaded', () => {
    const { getByTestId } = render(<UserDetailsPage {...props} user={{ details: {} }} />);
    expect(getByTestId('loading-spinner')).toBeInTheDocument();
  });

  test('renders error message when there is an error', () => {
    const { getByText } = render(<UserDetailsPage {...props} user={{ details: { message: 'Error message' } }} />);
    expect(getByText('Error message')).toBeInTheDocument();
  });

  test('renders form with pre-filled values when data is loaded', async () => {
    const { getByLabelText } = render(<UserDetailsPage {...props} />);
    const nameInput = await waitForElement(() => getByLabelText('Name'));
    const emailInput = getByLabelText('Email address');
    const houseNumberInput = getByLabelText('House Number');
    const streetAddressInput = getByLabelText('Street address');
    const cityInput = getByLabelText('City');
    const postcodeInput = getByLabelText('Postcode');

    expect(nameInput).toHaveValue(props.user.details.attributes.name);
    expect(emailInput).toHaveValue(props.user.details.attributes.email);
    expect(houseNumberInput).toHaveValue(props.user.details.attributes.houseNumber);
    expect(streetAddressInput).toHaveValue(props.user.details.attributes.streetAddress);
    expect(cityInput).toHaveValue(props.user.details.attributes.city);
    expect(postcodeInput).toHaveValue(props.user.details.attributes.postcode);
  });

  test('updates form values when inputs are changed', async () => {
    const { getByLabelText } = render(<UserDetailsPage {...props} />);
    const nameInput = await waitForElement(() => getByLabelText('Name'));

    fireEvent.change(nameInput, { target: { value: 'Jane Doe' } });
    expect(nameInput).toHaveValue('Jane Doe');
  });

  test('shows validation errors when form is submitted with invalid inputs', async () => {
    const { getByText, getByLabelText } = render(<UserDetailsPage {...props} />);
    const nameInput = await waitForElement(() => getByLabelText('Name'));
    const emailInput = getByLabelText('Email address');
    const saveButton = getByText('Save');

    fireEvent.change(nameInput, { target: { value: '' } });
    fireEvent.change(emailInput, { target: { value: 'invalid_email' } });
    fireEvent.click(saveButton);

    expect(getByText('Please enter a value.')).toBeInTheDocument();
    expect(getByText('Incorrect email address.')).toBeInTheDocument();
  });

  test('calls updateDetails method with correct arguments when form is submitted with valid inputs', async () => {
    const { getByText, getByLabelText } = render(<UserDetailsPage {...props} />);
    const nameInput = await waitForElement(() => getByLabelText('Name'));
    const emailInput = getByLabelText('Email address');
    const saveButton = getByText('Save');

    fireEvent.change(nameInput, { target: { value: 'Jane Doe' } });
    fireEvent.change(emailInput, { target: { value: 'janedoe@example.com' } });
    fireEvent.click(saveButton);

    expect(mockUpdateDetails).toHaveBeenCalledWith(1, {
      name: 'Jane Doe',
      email: 'janedoe@example.com',
      houseNumber: '100',
      streetAddress: 'Street Name',
      city: 'London',
      postcode: 'SW1A 2AA'
    });
  });
});
