import { Button, Link as MaterialLink } from '@material-ui/core';
import { observer } from 'mobx-react-lite';
import * as React from 'react';
import { ILocationDescriptor } from './LocationDescriptor';
import { Router } from './Router';


type LinkOwnProps = {
	to: ILocationDescriptor;
};

type OmitLinkProps<T> = T extends React.JSXElementConstructor<unknown>
	? Omit<
		React.ComponentProps<T>,
		keyof LinkOwnProps | 'onClick' | 'href'>
	: never;

type LinkProps = OmitLinkProps<typeof MaterialLink> & LinkOwnProps;

export const Link: React.SFC<LinkProps> = observer(props =>
	<MaterialLink
		href={props.to.getUrl(false)}
		onClick={(event: React.MouseEvent<HTMLAnchorElement>) => {
			if (!event.ctrlKey) {
				event.preventDefault();
				Router().go(props.to);
			}
		}}
		{...props} />);

type ButtonLinkProps = OmitLinkProps<typeof Button> & LinkOwnProps
	& {
		component?: React.ElementType; //Дичь
	};

export const ButtonLink: React.SFC<ButtonLinkProps> = observer(props =>
	<Button
		href={props.to.getUrl(false)}
		onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
			if (!event.ctrlKey) {
				event.preventDefault();
				Router().go(props.to);
			}
		}}
		{...props} />);