import {observer} from "mobx-react-lite";
import * as React from "react";
import {HttpSenderTab} from "./HttpSenderTab";

export const HttpTab = observer((props: ({
	current: HttpSenderTab;
	target: HttpSenderTab;
	onChange: (tab: HttpSenderTab) => void;
	children?: React.ReactElement | React.ReactElement[] | string | number
})) => {
	const subStyle = props.current === props.target ? ({
			borderBottom: '1px solid #e79822',
			color: '#ccc',
		})
		: undefined;
	return <div style={{
		padding: '7px 6px',
		color: '#5b6876',
		cursor: 'pointer'
	}} onClick={() => props.onChange(props.target)}>
		<div style={subStyle}>{props.children}</div>
	</div>
});
