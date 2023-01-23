import { InputGroup, VisuallyHiddenInput } from '@chakra-ui/react';
import type { ChangeEvent } from 'react';
import React from 'react';
import type { ControllerRenderProps, FieldValues, Path } from 'react-hook-form';

interface Props<V extends FieldValues, N extends Path<V>> {
  children: React.ReactNode;
  field: ControllerRenderProps<V, N>;
  accept?: string;
  multiple?: boolean;
}

const FileInput = <Values extends FieldValues, Names extends Path<Values>>({ children, accept, multiple, field }: Props<Values, Names>) => {
  const ref = React.useRef<HTMLInputElement>(null);

  const handleInputChange = React.useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const fileList = event.target.files;
    if (!fileList) {
      return;
    }

    const files = Array.from(fileList);
    field.onChange(files);
  }, [ field ]);

  const handleClick = React.useCallback(() => {
    ref.current?.click();
  }, []);

  return (
    <InputGroup onClick={ handleClick }>
      <VisuallyHiddenInput
        type="file"
        onChange={ handleInputChange }
        ref={ ref }
        accept={ accept }
        multiple={ multiple }
      />
      { children }
    </InputGroup>
  );
};

export default FileInput;
