import {Badge, Collapse, Divider, Drawer, Hidden, List, ListItem, ListItemText} from '@material-ui/core';
import { ExpandLess, ExpandMore } from '@material-ui/icons';
import { Router } from '@Shared/Router';
import { observer } from 'mobx-react-lite';
import * as React from 'react';
import styled from 'styled-components';
import { RouteTable } from './RouteTable';
import {CommonStore} from "./CommonStore";
import {CounterNames} from "@Shared/Contracts";

export type Props = {
	routeTable: RouteTable;
	store: CommonStore;
};

export const Sidebar = observer(({ routeTable, store }: Props) =>
	<nav>
		<Hidden smUp implementation='css'>
			<StyledDrawer
				variant='temporary'
				anchor='left'
				open={routeTable.sidebarOpen}
				onClose={() => routeTable.sidebarOpen = false}
				ModalProps={{
					keepMounted: true
				}}>
				<SidebarContent routeTable={routeTable} store={store} />
			</StyledDrawer>
		</Hidden>
		<Hidden xsDown implementation='css'>
			<StyledDrawer
				variant='permanent'
				open>
				<SidebarContent routeTable={routeTable} store={store} />
			</StyledDrawer>
		</Hidden>
	</nav>);

const SidebarContent = observer((props: Props) => {
	const { routeTable } = props;

	const getCounter = (counterName: CounterNames) => {
		const counters = props.store.counters.filter(c => c.counterName === counterName);

		if (counters && counters.length > 0) {
			return counters[0].count;
		}

		return null;
	}
	
	return (
		<div>
			<Header>
				<img src='/logo.jpg' alt='Apollo'/>
			</Header>
			<Divider />
			<List>
				{routeTable.menuSchema
					.filter(group => group.visible)
					.map((group) => (
						<React.Fragment key={group.title}>
							<ListItem button onClick={() => routeTable.toggleGroup(group.title)} >
								<ListItemText primary={group.title} />
								{group.active ? null : (group.expanded ? <ExpandLess /> : <ExpandMore />)}
							</ListItem>
							<Collapse in={group.active || group.expanded} timeout='auto' unmountOnExit>
								<List component='div' disablePadding>
									{group.links
										.filter(l => l.show)
										.map(l => {
											const counter = getCounter(l.counterName);
											const maxSize = 1000;
											return ({
												link: l,
												counter: counter === null 
													? null 
													: counter >= (maxSize * 100) 
														? `${Math.ceil(counter / maxSize)}к` 
														: counter
											})
										})
										.map(r =>
											<NestedListItem button key={r.link.title} onClick={() => Router().go(r.link.to)}>
												<MenuItem active={r.link.active}>{r.link.title}</MenuItem>
												{
													r.link.counterName !== CounterNames.None &&
													<CounterIndicator
														badgeContent={r.counter} max={99999}
														color='primary' />
												}
											</NestedListItem>)}
								</List>
							</Collapse>
						</React.Fragment>
					))}
			</List>
		</div>
	);
});

const CounterIndicator = styled(Badge)`
	margin-right: 10px;
	margin-left: auto;

	.MuiBadge-colorPrimary {
		color: ${props => props.theme.palette.text.primary};
		background-color: transparent;
	}
` as typeof Badge;

const StyledDrawer = styled(Drawer)`
	width: ${props => props.theme.sidebarWidth};

	& .MuiPaper-root {
		width: ${props => props.theme.sidebarWidth};
	}
` as typeof Drawer;

const NestedListItem = styled(ListItem)`
	padding-left: ${props => props.theme.spacing(4)}px;
` as typeof ListItem;

const Header = styled.div`
	height: 63px;
	display: flex;
	align-items: center;
	justify-content: center;
	
	img {
		height: 60px;
	}
`;

const MenuItem = styled.span<{ active: boolean }>`
	color: ${props => props.active
		? props.theme.palette.secondary.main
		: props.theme.palette.primary.main};
	font-weight: ${props => props.active
		? props.theme.typography.fontWeightMedium
		: props.theme.typography.fontWeightRegular};
`;
