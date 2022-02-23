import {
	Box, Divider,
	List, ListItem,
	ListItemText,
	Popover,
} from '@material-ui/core';
import * as dayjs from 'dayjs';
import {computed, makeObservable, observable} from 'mobx';
import * as React from 'react';

import { RefObject } from 'react';
import styled from 'styled-components';
import {observer} from "mobx-react-lite";
import DayjsUtils from "@date-io/dayjs";

export class NotificationListStore {
	@observable
	public isOpen: boolean;
	@observable
	public anchorElement: RefObject<HTMLButtonElement>;
	@observable
	private notifications: NotificationItem[] = [];

	constructor() {
		makeObservable(this);
		this.isOpen = false;
		this.anchorElement = React.createRef<HTMLButtonElement>();

		this.addNotification('Вам назначена новая задача', new DayjsUtils().date());
		// this.addNotification('Необходимо проверить новую заявку', new DayjsUtils().date().add(8, 'hour'));
		// this.addNotification('Необходимо проверить новую заявку', new DayjsUtils().date().add(1, 'hour'));
		// this.addNotification('Изменен статус задачи', new DayjsUtils().date().add(3, 'hour'));
		// this.addNotification('Вам назначена новая задача', new DayjsUtils().date());
		// this.addNotification('Необходимо проверить новую заявку', new DayjsUtils().date().add(8, 'hour'));
		// this.addNotification('Необходимо проверить новую заявку', new DayjsUtils().date().add(1, 'hour'));
		// this.addNotification('Изменен статус задачи', new DayjsUtils().date().add(3, 'hour'));
		// this.addNotification('Вам назначена новая задача', new DayjsUtils().date());
		// this.addNotification('Необходимо проверить новую заявку', new DayjsUtils().date().add(8, 'hour'));
		// this.addNotification('Необходимо проверить новую заявку', new DayjsUtils().date().add(1, 'hour'));
		// this.addNotification('Изменен статус задачи', new DayjsUtils().date().add(3, 'hour'));
	}

	public addNotification(message: string, date: dayjs.Dayjs) {
		this.notifications.push(({
			message: message,
			date: date,
			isRead: false
		}));
	}

	@computed
	public get unreadNotifications() {
		return this.notifications.filter(c => !c.isRead);
	}

	@computed
	public get haveNotReadNotifications() {
		return this.notifications.filter(c => !c.isRead).length !== 0;
	}

	public toggle() {
		this.isOpen = !this.isOpen;
	}
}

type NotificationItem = {
	message: string;
	date: dayjs.Dayjs;
	isRead: boolean;
};

type NotificationListProps = {
	store: NotificationListStore;
};

export const NotificationList = observer(({ store }: NotificationListProps) => {
	return <Popover
		id={'notification-list-panel'}
	open={store.isOpen}
	anchorEl={store.anchorElement.current}
	onClose={() => store.toggle()}
	anchorOrigin={{
		vertical: 'bottom',
			horizontal: 'right',
	}}
	transformOrigin={{
		vertical: 'top',
			horizontal: 'right',
	}}>
	<ListNotifications aria-label="mailbox folders">
		{store.unreadNotifications.length === 0 && <Box p={1}>
				<ListItemText>
					Оповещений нет
				</ListItemText>
		</Box>}
	{store.unreadNotifications.map((item, idx) => <>
		{!item.isRead &&
	<ListItemNew key={idx} onClick={() => item.isRead = true} dense button>
	<ListItemText primary={item.message} secondary={item.date.format('MM.DD.YYYY hh:mm')} />
	</ListItemNew>}
		{item.isRead &&
		<ListItem key={idx} dense button>
		<ListItemText primary={item.message} secondary={item.date.format('MM.DD.YYYY hh:mm')} />
		</ListItem>}
		<Divider />
		</>
		)}
	</ListNotifications>
	</Popover>;
});

const ListNotifications = styled(List)`
	max-height: 350px;
`;

const ListItemNew = styled(ListItem)`
	color: #ff8d3a;
`;
