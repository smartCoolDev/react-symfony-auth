import React from 'react';
import { shallow } from 'enzyme';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import appActionCreators from '../../actions/appActionCreators';

import withError404 from './withError404';

describe('withError404', () => {
  const MockComponent = () => <div>Mock Component</div>;
  const MockComponentWithHOC = withError404(MockComponent);

  it('should render the wrapped component', () => {
    const wrapper = shallow(<MockComponentWithHOC />);
    expect(wrapper.find(MockComponent)).toHaveLength(1);
  });

  it('should update the error code on mount', () => {
    const mockUpdateErrorCode = jest.fn();
    const mockAppActionCreators = { updateErrorCode: mockUpdateErrorCode };
    jest.spyOn(appActionCreators, 'default').mockReturnValue(mockAppActionCreators);

    shallow(<MockComponentWithHOC />);
    expect(mockUpdateErrorCode).toHaveBeenCalledWith(404);
  });

  it('should map dispatch to props correctly', () => {
    const mockDispatch = jest.fn();
    jest.spyOn(React, 'useContext').mockReturnValue(mockDispatch);

    const mapDispatchToProps = (dispatch) => ({ appMethods: bindActionCreators(appActionCreators, dispatch) });
    const ConnectedWithError404 = connect(null, mapDispatchToProps)(WithError404);
    shallow(<ConnectedWithError404 />);

    expect(mockDispatch).toHaveBeenCalledWith(appActionCreators.updateErrorCode(404));
  });
});
