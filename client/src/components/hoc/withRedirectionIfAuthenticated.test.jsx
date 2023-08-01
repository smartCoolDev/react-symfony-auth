import React from 'react';
import { render } from '@testing-library/react';

import withRedirectionIfAuthenticated from './withRedirectionIfAuthenticated';

describe('withRedirectionIfAuthenticated', () => {
  const MockComponent = () => <div data-testid="mock-component">Mock Component</div>;
  const ConnectedComponent = withRedirectionIfAuthenticated(MockComponent);

  it('does not redirect if user is not authenticated', () => {
    const user = { identity: { id: null } };
    const { getByTestId } = render(<ConnectedComponent user={user} />);
    expect(getByTestId('mock-component')).toBeInTheDocument();
  });
});
