import React from 'react';
import { IntlProvider, FormattedMessage } from 'react-intl';
import { shallow } from 'enzyme';

import { HomePage } from '../index';
import messages from '../messages';

describe('<HomePage />', () => {
  it('should render the page message', () => {
    const intlProvider = new IntlProvider({ locale: 'en' }, {});
    const { intl } = intlProvider.getChildContext();

    const renderedComponent = shallow(
      <HomePage intl={intl} />
    );

    expect(renderedComponent.contains(
      <FormattedMessage {...messages.header} />
    )).toEqual(true);
  });
});
