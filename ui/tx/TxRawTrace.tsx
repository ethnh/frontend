import { Flex, Textarea } from '@chakra-ui/react';
import React from 'react';

import CopyToClipboard from 'ui/shared/CopyToClipboard';

const data = [
  {
    action: {
      callType: 'delegatecall',
      from: '0x296033cb983747b68911244ec1a3f01d7708851b',
      gas: '0x1AB35C9',
      // eslint-disable-next-line max-len
      input: '0x6a76120200000000000000000000000099759357a9923bb164a7ae8b85703a6882cb84ea0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000014000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002c0000000000000000000000000000000000000000000000000000000000000014466d2a64d000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000c00000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000013ef0000000000000000000000000000000000000000000000000000000000001bfb000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000186b900000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000041000000000000000000000000f4e5b62da2eee3b5811dae1fae480f7623bd4cd000000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000',
      to: '0x3e5c63644e683549055b9be8653de26e0b4cd36e',
      value: '0x0',
    },
    result: {
      blockHash: '0x43dd926aa138a58d3f4740dae387bcff3c7bc525db2d0a449f323f8b8f92a229',
      blockNumber: '0xa4f285',
      from: '0xea8a7ef30f894bce23b42314613458d13f9d43ea',
      gas: '0x30d40',
      gasPrice: '0x2e90edd000',
      hash: '0x72ee43a3784cc6749f64fad1ecf0bbd51a54dd6892ae0573f211566809e0d511',
      input: '0x',
      nonce: '0x1e7',
      to: '0xbd064928cdd4fd67fb99917c880e6560978d7ca1',
      transactionIndex: '0x0',
      value: '0xde0b6b3a7640000',
      v: '0x25',
      r: '0x7e833413ead52b8c538001b12ab5a85bac88db0b34b61251bb0fc81573ca093f',
      s: '0x49634f1e439e3760265888434a2f9782928362412030db1429458ddc9dcee995',
    },
  },
  {
    action: {
      callType: 'delegatecall',
      from: '0x296033cb983747b68911244ec1a3f01d7708851b',
      gas: '0x1AB35C9',
      // eslint-disable-next-line max-len
      input: '0x6a76120200000000000000000000000099759357a9923bb164a7ae8b85703a6882cb84ea0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000014000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002c0000000000000000000000000000000000000000000000000000000000000014466d2a64d000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000c00000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000013ef0000000000000000000000000000000000000000000000000000000000001bfb000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000186b900000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000041000000000000000000000000f4e5b62da2eee3b5811dae1fae480f7623bd4cd000000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000',
      to: '0x3e5c63644e683549055b9be8653de26e0b4cd36e',
      value: '0x0',
    },
    result: {
      blockHash: '0x43dd926aa138a58d3f4740dae387bcff3c7bc525db2d0a449f323f8b8f92a229',
      blockNumber: '0xa4f285',
      from: '0xea8a7ef30f894bce23b42314613458d13f9d43ea',
      gas: '0x30d40',
      gasPrice: '0x2e90edd000',
      hash: '0x72ee43a3784cc6749f64fad1ecf0bbd51a54dd6892ae0573f211566809e0d511',
      input: '0x',
      nonce: '0x1e7',
      to: '0xbd064928cdd4fd67fb99917c880e6560978d7ca1',
      transactionIndex: '0x0',
      value: '0xde0b6b3a7640000',
      v: '0x25',
      r: '0x7e833413ead52b8c538001b12ab5a85bac88db0b34b61251bb0fc81573ca093f',
      s: '0x49634f1e439e3760265888434a2f9782928362412030db1429458ddc9dcee995',
    },
  },
];

const TxRawTrace = () => {
  const text = JSON.stringify(data, undefined, 4);
  return (
    <>
      <Flex justifyContent="end" mb={ 2 }>
        <CopyToClipboard text={ text }/>
      </Flex>
      <Textarea
        variant="filledInactive"
        height="570px"
        p={ 4 }
        value={ text }
      />
    </>
  );
};

export default TxRawTrace;
