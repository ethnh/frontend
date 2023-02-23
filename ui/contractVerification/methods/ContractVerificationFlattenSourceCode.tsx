import React from 'react';

import ContractVerificationMethod from '../ContractVerificationMethod';
import ContractVerificationFieldAutodetectArgs from '../fields/ContractVerificationFieldAutodetectArgs';
import ContractVerificationFieldCode from '../fields/ContractVerificationFieldCode';
import ContractVerificationFieldCompiler from '../fields/ContractVerificationFieldCompiler';
import ContractVerificationFieldEvmVersion from '../fields/ContractVerificationFieldEvmVersion';
import ContractVerificationFieldIsYul from '../fields/ContractVerificationFieldIsYul';
import ContractVerificationFieldLibraries from '../fields/ContractVerificationFieldLibraries';
import ContractVerificationFieldName from '../fields/ContractVerificationFieldName';
import ContractVerificationFieldOptimization from '../fields/ContractVerificationFieldOptimization';

const ContractVerificationFlattenSourceCode = () => {
  return (
    <ContractVerificationMethod title="Contract verification via Solidity (flattened source code)">
      <ContractVerificationFieldName/>
      <ContractVerificationFieldIsYul/>
      <ContractVerificationFieldCompiler/>
      <ContractVerificationFieldEvmVersion/>
      <ContractVerificationFieldOptimization/>
      <ContractVerificationFieldCode/>
      <ContractVerificationFieldAutodetectArgs/>
      <ContractVerificationFieldLibraries/>
    </ContractVerificationMethod>
  );
};

export default React.memo(ContractVerificationFlattenSourceCode);
