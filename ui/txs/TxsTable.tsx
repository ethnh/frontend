import { Link, Table, Thead, Tbody, Tr, Th, TableContainer, useBreakpointValue, Icon } from '@chakra-ui/react';
import React from 'react';

import rightArrowIcon from 'icons/arrows/right.svg';

import TxsTableItem from './TxsTableItem';

const CURRENCY = 'xDAI';

export type Sort = 'val-desc' | 'val-asc' | 'fee-desc' | 'fee-asc' | undefined;

type Props = {
// eslint-disable-next-line @typescript-eslint/no-explicit-any
  txs: any;
  sort: (field: 'val' | 'fee') => () => void;
  sorting: Sort;
}

const TxsTable = ({ txs, sort, sorting }: Props) => {
  const isLargeScreen = useBreakpointValue({ base: false, xl: true });

  return (
    <TableContainer width="100%" mt={ 6 }>
      <Table variant="simple" minWidth="810px" size="xs">
        <Thead>
          <Tr>
            <Th width="54px"></Th>
            <Th width="20%">Type</Th>
            <Th width="18%">Txn hash</Th>
            <Th width="15%">Method</Th>
            <Th width="11%">Block</Th>
            <Th width={ isLargeScreen ? '128px' : '58px' }>From</Th>
            <Th width={ isLargeScreen ? '36px' : '0' }></Th>
            <Th width={ isLargeScreen ? '128px' : '58px' }>To</Th>
            <Th width="18%" isNumeric>
              <Link onClick={ sort('val') } display="flex" justifyContent="end">
                { sorting === 'val-asc' && <Icon boxSize={ 5 } as={ rightArrowIcon } transform="rotate(-90deg)"/> }
                { sorting === 'val-desc' && <Icon boxSize={ 5 } as={ rightArrowIcon } transform="rotate(90deg)"/> }
                { `Value ${ CURRENCY }` }
              </Link>
            </Th>
            <Th width="18%" isNumeric pr={ 5 }>
              <Link onClick={ sort('fee') } display="flex" justifyContent="end">
                { sorting === 'fee-asc' && <Icon boxSize={ 5 } as={ rightArrowIcon } transform="rotate(-90deg)"/> }
                { sorting === 'fee-desc' && <Icon boxSize={ 5 } as={ rightArrowIcon } transform="rotate(90deg)"/> }
                { `Fee ${ CURRENCY }` }
              </Link>
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          { /* eslint-disable-next-line @typescript-eslint/no-explicit-any */ }
          { txs.map((item: any) => (
            <TxsTableItem
              key={ item.hash }
              tx={ item }
            />
          )) }
        </Tbody>
      </Table>
    </TableContainer>
  );
};

export default TxsTable;
