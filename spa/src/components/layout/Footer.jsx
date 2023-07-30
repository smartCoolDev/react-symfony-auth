// @flow

import React from 'react';
import { Link } from 'react-router-dom';


export default function Footer(): React$Node {
  return (
    <footer className="mt-4 mr-4">
      <ul className="list-inline">
        <div className="float-sm-right">
          <li className="list-inline-item"> review</li>
        </div>
      </ul>
    </footer>
  );
}
