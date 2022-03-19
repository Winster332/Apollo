import {
	AppBar,
	Box,
	Breadcrumbs,
	Button,
	Grid,
	Hidden,
	IconButton,
	Popover,
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
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import SettingsIcon from '@material-ui/icons/Settings';

type Props = {
	store: CommonStore;
	routeTable: RouteTable;
	children?: React.ReactNode;
};

export const Header = observer((props: Props) => {
	// const [menu, setMenu] = React.useState(null);
	const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);

	const open = Boolean(anchorEl);
	const id = open ? 'simple-popover' : undefined;

	const handleClick = (event: any) => {
		// setMenu(event.currentTarget);
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		// setMenu(null);
		setAnchorEl(null);
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
	const iconStyle = ({ width: '18px', height: '18px' })
	const btnStyle = ({
		color: CommonStore.instance.theme.current === AppTheme.Dark ? 'rgb(102, 178, 255)' : '#fff',
		borderColor: CommonStore.instance.theme.current === AppTheme.Dark ? 'rgb(19, 47, 76)' : '#fff'
	})
	
	return <StyledAppBar id='app-header' position='static'>
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
				<HeaderIconButton
					style={btnStyle}
					ref={CommonStore.instance.notificationsStore.anchorElement}
					color='inherit'
					variant='outlined'
					aria-describedby={'notification-list-panel'}
					onClick={() => CommonStore.instance.notificationsStore.toggle()}>
					{CommonStore.instance.notificationsStore.haveNotReadNotifications && <NotificationsIcon style={iconStyle}/>}
					{!CommonStore.instance.notificationsStore.haveNotReadNotifications && <NotificationsNoneIcon style={iconStyle}/>}
				</HeaderIconButton>
				<HeaderIconButton
					style={btnStyle}
					color='inherit'
					onClick={() => CommonStore.instance.theme.setTheme(CommonStore.instance.theme.current === AppTheme.Dark
						? AppTheme.Light
						: AppTheme.Dark)}>
					{CommonStore.instance.theme.current === AppTheme.Dark && <Brightness7Icon style={iconStyle}/>}
					{CommonStore.instance.theme.current === AppTheme.Light && <Brightness4Icon style={iconStyle}/>}
				</HeaderIconButton>
				{user && <Button aria-describedby='menu-trigger' color='inherit' onClick={handleClick}>
					{friendlyForm(user.name)}
				</Button>}
			</Box>
			<Popover
				id={id}
				open={open}
				anchorEl={anchorEl}
				onClose={handleClose}
				anchorOrigin={{
					vertical: 'bottom',
					horizontal: 'center',
				}}
				transformOrigin={{
					vertical: 'top',
					horizontal: 'center',
				}}
			>
				<Grid container xs={12}>
					<Grid item xs={12}>
						<Button fullWidth onClick={() => window.location.href = '/account/logout'} disabled>
							<SettingsIcon/>
							<span>Настройки</span>
						</Button>
					</Grid>
					<Grid item xs={12}>
						<Button fullWidth onClick={() => window.location.href = '/account/logout'}>
							<ExitToAppIcon/>
							<span>Выйти</span>
						</Button>
					</Grid>
				</Grid>
			</Popover>
			{/*<Menu*/}
			{/*	anchorEl={menu}*/}
			{/*	keepMounted*/}
			{/*	id='menu-trigger'*/}
			{/*	open={Boolean(menu)}*/}
			{/*	anchorOrigin={{*/}
			{/*		vertical: 'bottom',*/}
			{/*		horizontal: 'right',*/}
			{/*	}}*/}
			{/*	transformOrigin={{*/}
			{/*		vertical: 'top',*/}
			{/*		horizontal: 'right',*/}
			{/*	}}*/}
			{/*	onClose={handleClose}>*/}
			{/*	<MenuItem onClick={() => window.location.href = '/account/logout'} style={{ minWidth: 120 }}>Выйти</MenuItem>*/}
			{/*</Menu>*/}
			<NotificationList store={CommonStore.instance.notificationsStore} />
		</StyledToolBar>
	</StyledAppBar>;
});

const HeaderIconButton = styled(Button)`
	padding: 8px;
	border: 1px solid rgb(19, 47, 76);
    border-radius: 10px;
    color: rgb(102, 178, 255);
    font-size: 1.5rem;
    background-color: transparent;
    height: 34px;
    width: 34px;
    min-width: 0px;
    margin: 0;
    margin-left: 10.4px;
    transition-property: all;
    transition-duration: 150ms;
    
    &:hover {
    	background: #66666612;
    }
`

const StyledAppBar = styled(AppBar)`
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    flex-shrink: 0;
    position: fixed;
    z-index: 1100;
    top: 0px;
    left: auto;
    right: 0px;
    padding: 5px 0px 5px 8px;
    transition: width 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
    box-shadow: none;
    backdrop-filter: blur(20px);
    border-style: solid;
    border-color: rgba(194, 224, 255, 0.08);
    border-width: 0px 0px thin;
	
	${props => props.theme.breakpoints.up('sm')} {
		width: calc(100% - ${props => props.theme.sidebarWidth});
		margin-left: ${props => props.theme.sidebarWidth};
	}
` as typeof AppBar;

const StyledToolBar = styled(Toolbar)`
	display: flex;
	flex-flow: row;
	justify-content: space-between;
	min-height: 48px;
`;