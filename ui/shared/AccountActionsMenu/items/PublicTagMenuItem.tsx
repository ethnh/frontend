import { MenuItem, chakra } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';

import IconSvg from 'ui/shared/IconSvg';

interface Props {
  className?: string;
  hash: string;
  onBeforeClick: () => boolean;
}

const PublicTagMenuItem = ({ className, hash, onBeforeClick }: Props) => {
  const router = useRouter();

  const handleClick = React.useCallback(() => {
    if (!onBeforeClick()) {
      return;
    }

    router.push({ pathname: '/account/public-tags-request', query: { address: hash } });
  }, [ hash, onBeforeClick, router ]);

  return (
    <MenuItem className={ className }onClick={ handleClick }>
      <IconSvg name="publictags" boxSize={ 6 } mr={ 2 }/>
      <span>Add public tag</span>
    </MenuItem>
  );
};

export default React.memo(chakra(PublicTagMenuItem));
