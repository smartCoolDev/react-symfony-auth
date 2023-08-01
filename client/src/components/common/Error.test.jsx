import React from 'react';
import { shallow } from 'enzyme';
import Error from './path/to/your/component';

describe('Error', () => {
  it('should render with default props if none are passed', () => {
    const wrapper = shallow(<Error />);
    expect(wrapper.find('h1').text()).toEqual('Error');
    expect(wrapper.find('p').text()).toEqual('Unexpected error occurred.');
  });

  it('should render with custom props if they are passed', () => {
    const wrapper = shallow(<Error heading="Custom Heading" message="Custom Message" />);
    expect(wrapper.find('h1').text()).toEqual('Custom Heading');
    expect(wrapper.find('p').text()).toEqual('Custom Message');
  });
});
