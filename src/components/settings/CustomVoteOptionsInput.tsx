'use client';
import FormField from '@/components/common/FormField';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';

// TODO: Handle blur and enter key to submit the input value
const CustomVoteOptionsInput = () => {
  const [value, setValue] = useState('');

  const handleValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };

  return (
    <FormField>
      <Label htmlFor="customOptions">Custom Options</Label>
      <Input
        type="text"
        name="customOptions"
        value={value}
        onChange={handleValueChange}
      />
      <p className="text-muted-foreground text-sm">
        Enter custom options separated by commas. For example:
        &quot;1,2,3&quot;.
      </p>
    </FormField>
  );
};

export default CustomVoteOptionsInput;
