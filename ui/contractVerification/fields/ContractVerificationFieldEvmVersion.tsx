import { Link, Select } from '@chakra-ui/react';
import React from 'react';
import type { ControllerRenderProps, Control } from 'react-hook-form';
import { Controller } from 'react-hook-form';

import type { FormFields } from '../types';

import ContractVerificationFormRow from '../ContractVerificationFormRow';

const VERSIONS = [
  'default',
  'london',
  'berlin',
];

interface Props {
  control: Control<FormFields>;
}

const ContractVerificationFieldEvmVersion = ({ control }: Props) => {
  const renderControl = React.useCallback(({ field }: {field: ControllerRenderProps<FormFields, 'evm_version'>}) => {
    return (
      <Select
        { ...field }
        size={{ base: 'md', lg: 'lg' }}
        placeholder="EVM Version"
      >
        { VERSIONS.map((option) => <option key={ option } value={ option }>{ option }</option>) }
      </Select>
    );
  }, [ ]);

  return (
    <ContractVerificationFormRow>
      <Controller
        name="evm_version"
        control={ control }
        render={ renderControl }
        rules={{ required: true }}
      />
      <>
        <span>The EVM version the contract is written for. If the bytecode does not match the version, we try to verify using the latest EVM version. </span>
        <Link href="https://forum.poa.network/t/smart-contract-verification-evm-version-details/2318" target="_blank">EVM version details</Link>
      </>
    </ContractVerificationFormRow>
  );
};

export default React.memo(ContractVerificationFieldEvmVersion);
