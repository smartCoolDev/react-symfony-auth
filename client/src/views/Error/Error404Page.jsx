// @flow

import React from 'react';

import Error from '../../components/common/Error';

export default function Error404Page(): React$Node {
  return (
    <div className="text-center m-5">
      <Error message="Page not found." />
    </div>
  );
}
