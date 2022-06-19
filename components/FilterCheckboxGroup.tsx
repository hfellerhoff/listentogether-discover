import {
  CheckboxGroup,
  Checkbox,
  HStack,
  Grid,
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
} from '@chakra-ui/react';
import { useState } from 'react';

type Props = {
  options: {
    value: string;
    label: string;
  }[];
  defaultOptions?: string[];
  max: number;
  onUpdate: (v: string[]) => void;
};

const FilterCheckboxGroup = ({
  options,
  defaultOptions = [],
  max,
  onUpdate,
}: Props) => {
  const [count, setCount] = useState(0);

  return (
    <Box>
      {count > max && (
        <Alert status='error' mb={4} variant='left-accent'>
          <AlertIcon />
          <AlertTitle>Too many options selected</AlertTitle>
          <AlertDescription>
            Please pick a maximum of {max} options.
          </AlertDescription>
        </Alert>
      )}
      <CheckboxGroup
        colorScheme='green'
        onChange={(v) => {
          setCount(v.length);
          onUpdate(v);
        }}
        defaultValue={defaultOptions}
      >
        <Grid
          templateColumns={[
            'repeat(1, 1fr)',
            'repeat(2, 1fr)',
            'repeat(4, 1fr)',
            'repeat(5, 1fr)',
          ]}
          gap={2}
        >
          {options.map((option) => (
            <Checkbox
              value={option.value}
              key={`checkbox-${option.value}`}
              overflow='hidden'
              whiteSpace='nowrap'
              textOverflow='ellipsis'
            >
              {option.label}
            </Checkbox>
          ))}
        </Grid>
      </CheckboxGroup>
    </Box>
  );
};

export default FilterCheckboxGroup;
