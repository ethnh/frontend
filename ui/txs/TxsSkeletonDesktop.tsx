import { Skeleton, Flex } from '@chakra-ui/react';
import React from 'react';

import SkeletonTable from 'ui/shared/SkeletonTable';

const TxsInternalsSkeletonDesktop = ({ isPending }: {isPending?: boolean}) => {
  return (
    <>
      { !isPending && <Skeleton h={ 6 } w="100%" mb={ 12 }/> }
      <Flex columnGap={ 3 } h={ 8 } mb={ 6 }>
        <Skeleton w="78px"/>
        <Skeleton w="360px"/>
      </Flex>
      <SkeletonTable columns={ [ '20%', '20%', '20%', '20%', '20%' ] }/>
    </>
  );
};

export default TxsInternalsSkeletonDesktop;
