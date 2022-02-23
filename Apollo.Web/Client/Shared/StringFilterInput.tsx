import { InputAdornment, OutlinedInput } from '@material-ui/core';
import { Search } from '@material-ui/icons';
import { StringFilter } from '@Shared/StringFilter';
import * as React from 'react';
import {observer} from "mobx-react-lite";

type StringFilterProps = {
	filter: StringFilter;
};

export const StringFilterInput = observer((props: StringFilterProps) => {
	return <OutlinedInput
		value={props.filter.value}
		placeholder='Быстрый поиск'
		onChange={e => props.filter.update(e.target.value)}
		endAdornment={<StringFilterAdornment />}
		labelWidth={0}
		style={{ width: '100%' }} />;
});

const StringFilterAdornment = () => <InputAdornment position='end'>
	<Search />
</InputAdornment>;
