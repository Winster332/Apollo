import { observer } from 'mobx-react-lite';
import * as React from 'react';
import { IPersonName } from './Contracts';


export const PersonName = observer((props: { name: IPersonName, short?: boolean }) =>
	props.short && props.name.lastName && props.name.middleName
		? <span>{props.name.lastName} {props.name.firstName[0]}. {props.name.middleName[0]}.</span>
		: <span>{props.name.lastName} {props.name.firstName} {props.name.middleName}</span>
);

export const fullForm = (name: IPersonName) => `${name.firstName} ${name.middleName} ${name.lastName}`;

export const shortForm = (name: IPersonName) => name.lastName
	? `${name.firstName.substr(0, 1)}. ${name.middleName && name.middleName.substr(0, 1)}. ${name.lastName}`
	: name.firstName;

export const friendlyForm = (name: IPersonName) => name.lastName
	? `${name.firstName} ${name.lastName.substr(0, 1)}.`
	: name.firstName;