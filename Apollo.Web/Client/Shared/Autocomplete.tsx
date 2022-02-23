import * as React from 'react';
import { AutocompleteImpl, AutocompleteImplProps } from './AutocompleteImpl';

export const HalfWidthAutocomplete = <T extends unknown>(props: AutocompleteImplProps<T>) => <AutocompleteImpl style={{ width: '40%', display: 'inline-block' }} {...props} />;
export const ThirtyPercentAutocomplete = <T extends unknown>(props: AutocompleteImplProps<T>) => <AutocompleteImpl style={{ width: '30%' }} {...props} />;

export const Autocomplete = AutocompleteImpl;

export type AutocompleteProps<T> = AutocompleteImplProps<T>;