// pages/_document.js

import { ColorModeScript } from '@chakra-ui/react';
import NextDocument, { Html, Head, Main, NextScript } from 'next/document';

export default class Document extends NextDocument {
  render() {
    return (
      <Html lang='en'>
        <Head>
          {process.env.VERCEL_ENV === 'production' ? (
            <script
              async
              defer
              data-website-id='fb58a977-885c-4dc9-a5d8-425e4de59f84'
              src='https://umami.henryfellerhoff.com/umami.js'
            ></script>
          ) : (
            <></>
          )}
        </Head>
        <body>
          {/* 👇 Here's the script */}
          <ColorModeScript />
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
