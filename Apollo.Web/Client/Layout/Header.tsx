import {
	AppBar,
	Box,
	Breadcrumbs,
	Button,
	Hidden,
	IconButton,
	Menu,
	MenuItem,
	Toolbar,
	Typography
} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import {friendlyForm} from '@Shared/PersonName';
import {observer} from 'mobx-react-lite';
import * as React from 'react';
import styled from 'styled-components';
import {AppTheme, CommonStore} from './CommonStore';
import {RouteTable} from './RouteTable';
import NotificationsIcon from '@material-ui/icons/Notifications';
import NotificationsNoneIcon from '@material-ui/icons/NotificationsNone';
import Brightness4Icon from '@material-ui/icons/Brightness4';
import Brightness7Icon from '@material-ui/icons/Brightness7';
import {NotificationList} from "./NotificationListStore";

type Props = {
	store: CommonStore;
	routeTable: RouteTable;
	children?: React.ReactNode;
};

export const Header = observer((props: Props) => {
	const [menu, setMenu] = React.useState(null);

	const handleClick = (event: any) => {
		setMenu(event.currentTarget);
	};

	const handleClose = () => {
		setMenu(null);
	};
	
	const getGroup = () => {
		const groups = props.routeTable.routes.routeGroups.filter(c => c.visible).filter(c => c.links.filter(l => l.to.getUrl() === props.routeTable.currentRoute.to.getUrl()).length !== 0)
		
		if (groups.length === 0) {
			return null;
		}
		
		return ({
			title: groups[0].title,
			to: groups[0].links.find(c => c.to.getUrl() === props.routeTable.currentRoute.to.getUrl()) || null
		});
	};
	
	const group = getGroup();

	const user = props.store.user;
	const breadcrumbsGroupColor = CommonStore.instance.theme.current === AppTheme.Light ? '#c7c7c7' : 'rgb(100 100 100)'
	const breadcrumbsToColor = CommonStore.instance.theme.current === AppTheme.Light ? 'rgb(255 255 255)' : 'rgb(48 48 48)'
	return <StyledAppBar position='static'>
		<StyledToolBar>
			<Hidden smUp>
				<IconButton
					color='inherit'
					edge='start'
					onClick={() => props.routeTable.sidebarOpen = true}>
					<MenuIcon />
				</IconButton>
			</Hidden>
			<Breadcrumbs aria-label="breadcrumb" style={{
				color: breadcrumbsToColor
			}}>
				<Typography color="textPrimary" style={{color: breadcrumbsGroupColor}}>{group?.title}</Typography>
				<Typography color="textPrimary" style={{color: breadcrumbsToColor}}>{group?.to?.title}</Typography>
			</Breadcrumbs>
			<Box>
				<IconButton
					ref={CommonStore.instance.notificationsStore.anchorElement}
					color='inherit'
					aria-describedby={'notification-list-panel'}
					onClick={() => CommonStore.instance.notificationsStore.toggle()}>
					{CommonStore.instance.notificationsStore.haveNotReadNotifications && <NotificationsIcon/>}
					{!CommonStore.instance.notificationsStore.haveNotReadNotifications && <NotificationsNoneIcon/>}
				</IconButton>
				<IconButton
					color='inherit'
					onClick={() => CommonStore.instance.theme.setTheme(CommonStore.instance.theme.current === AppTheme.Dark
						? AppTheme.Light
						: AppTheme.Dark)}>
					{CommonStore.instance.theme.current === AppTheme.Dark && <Brightness7Icon/>}
					{CommonStore.instance.theme.current === AppTheme.Light && <Brightness4Icon/>}
				</IconButton>
				{user && <Button color='inherit' onClick={handleClick}>
					{friendlyForm(user.name)}
				</Button>}
			</Box>
			<Menu
				anchorEl={menu}
				keepMounted
				open={Boolean(menu)}
				onClose={handleClose}>
				<MenuItem onClick={() => window.location.href = '/account/logout'} style={{ minWidth: 120 }}>Выйти</MenuItem>
			</Menu>
			<NotificationList store={CommonStore.instance.notificationsStore} />
		</StyledToolBar>
	</StyledAppBar>;
});

const StyledAppBar = styled(AppBar)`
	${props => props.theme.breakpoints.up('sm')} {
		width: calc(100% - ${props => props.theme.sidebarWidth});
		margin-left: ${props => props.theme.sidebarWidth};
	}
` as typeof AppBar;

const StyledToolBar = styled(Toolbar)`
	display: flex;
	flex-flow: row;
	justify-content: space-between;
`;