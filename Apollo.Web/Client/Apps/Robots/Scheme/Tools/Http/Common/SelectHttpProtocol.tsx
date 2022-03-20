import {observer} from "mobx-react-lite";
import {HttpRequestMethod} from "@Shared/Contracts";
import {MenuItem, Select} from "@material-ui/core";
import * as React from "react";
import styled from "styled-components";

export const SelectHttpProtocol = observer((props: ({
	current: HttpRequestMethod;
	options: ({ name: string, value: HttpRequestMethod })[],
	onChange: (tab: HttpRequestMethod) => void;
})) => {
	return <SelectProtocol
		labelId="demo-simple-select-label"
		id="demo-simple-select"
		value={props.current}
		onChange={(e, v: any) => {
			if (e !== undefined) {
				props.onChange(v.props.value as HttpRequestMethod)
			}
		}}
	>
		{props.options.map((o, idx) => <MenuItem key={idx} value={o.value}>{o.name}</MenuItem>)}
	</SelectProtocol>
});

const SelectProtocol = styled(Select)`
	padding: 0px 7px;
	&::after {
		border-bottom: none;
		
		&.hover {
			border-bottom: none;
		}
	}
	&::before {
		border-bottom: none;
		
		&.hover {
			border-bottom: none;
		}
	}
`
