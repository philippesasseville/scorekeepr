import { injectGlobal } from 'styled-components';

import 'bootswatch/css/bootstrap.css';
import 'font-awesome/css/font-awesome.css';

/* eslint no-unused-expressions: 0 */
injectGlobal`
  html {
      position: relative;
      min-height: 100%;
  }

  body {
      /* Margin bottom by footer height */
      margin-bottom: 60px;
  }

  .footer {
      position: absolute;
      bottom: 0;
      width: 100%;
      /* Set the fixed height of the footer here */
      height: 60px;
      background-color: #df691a;
      padding-top: 3px;

      a {
        color: #fff;
        margin: 10px;
      }

      p {
        margin-top: 12px;
      }
  }
`;
