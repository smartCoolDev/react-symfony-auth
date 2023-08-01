import React from 'react';
import { shallow } from 'enzyme';
import { push } from 'react-router-redux';
import withRedirectionIfAuthenticated from './withRedirectionIfAuthenticated';

describe('withRedirectionIfAuthenticated', () => {
  const MockComponent = () => <div>Mock Component</div>;
  const MockComponentWithHOC = withRedirectionIfAuthenticated(MockComponent);

  it('should render the wrapped component', () => {
    const wrapper = shallow(<MockComponentWithHOC user={{ identity: { id: null } }} />);
    expect(wrapper.find(MockComponent)).toHaveLength(1);
  });

  it('should redirect to login if user is authenticated', () => {
    const mockDispatch = jest.fn();
    jest.spyOn(React, 'useContext').mockReturnValue(mockDispatch);

    shallow(<MockComponentWithHOC user={{ identity: { id: 1 } }} />);
    expect(mockDispatch).toHaveBeenCalledWith(push('/login'));
  });

  it('should map state to props correctly', () => {
    const mockState = { user: { identity: { id: null } } };
    const mapStateToProps = (state) => ({ user: state.user });
    const ConnectedWithRedirectionIfAuthenticated = connect(mapStateToProps)(WithRedirectionIfAuthenticated);
    const wrapper = shallow(<ConnectedWithRedirectionIfAuthenticated />);
    expect(wrapper.props().user).toEqual(mockState.user);
  });
});
