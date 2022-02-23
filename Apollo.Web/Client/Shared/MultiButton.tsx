import AddIcon from '@material-ui/icons/Add';
import CancelIcon from '@material-ui/icons/Cancel';
import PrintIcon from '@material-ui/icons/Print';
import SaveIcon from '@material-ui/icons/Save';
import { SpeedDial, SpeedDialAction, SpeedDialIcon } from '@material-ui/lab';
import {computed, makeObservable, observable} from 'mobx';
import * as React from 'react';
import { RefObject } from 'react';
import styled from 'styled-components';
import {observer} from "mobx-react-lite";

type MultiButtonAction = {
	caption: string;
	action: () => void;
	icon: React.ReactNode;
	isShow: () => boolean;
	isDisabled: boolean;
	ref: RefObject<HTMLButtonElement>;
};

export class MultiButtonStore {
	@observable
	private isOpenButtons: boolean;
	public actions: MultiButtonAction[] = [];
	public actionOnClick?: () => void;

	constructor() {
		makeObservable(this)
		this.isOpenButtons = false;
	}

	public toggleOpen = (isOpen: boolean) => {
		this.isOpenButtons = isOpen;
	};

	@computed
	public get isOpen() {
		return this.isOpenButtons;
	}

	onClick(onClick: () => void) {
		this.actionOnClick = onClick;
		return this;
	}

	public useCancel(caption: string, onClick: () => void, isShow: () => boolean) {
		this.actions.push(({
			caption: caption,
			action: onClick,
			icon: <CancelIcon/>,
			ref: React.createRef(),
			isShow: isShow,
			isDisabled: false
		}));
		return this;
	}

	public useAdd(caption: string, onClick: () => void, isDisabled?: boolean) {
		this.actions.push(({
			caption: caption,
			action: onClick,
			icon: <AddIcon/>,
			ref: React.createRef(),
			isShow: () => true,
			isDisabled: isDisabled || false
		}));
		return this;
	}

	public useSave(caption: string, onClick: () => void, isDisabled?: boolean) {
		this.actions.push(({
			caption: caption,
			action: onClick,
			icon: <SaveIcon/>,
			ref: React.createRef(),
			isShow: () => true,
			isDisabled: isDisabled || false
		}));
		return this;
	}

	public usePrint(caption: string, onClick: () => void, isDisabled?: boolean) {
		this.actions.push(({
			caption: caption,
			action: onClick,
			icon: <PrintIcon/>,
			ref: React.createRef(),
			isShow: () => true,
			isDisabled: isDisabled || false
		}));
		return this;
	}
}

type MultiButtonProps = {
	store: MultiButtonStore;
	tooltipOpen?: boolean;
	alwaysOpen?: boolean;
	openIcon?: React.ReactNode;
	icon?: React.ReactNode;
	onClick?: () => void;
	disabled?: boolean;
};

export const MultiButton = observer(({
										 onClick,
										 alwaysOpen,
										 icon,
										 tooltipOpen,
										 openIcon,
										 disabled,
										 store
									 }: MultiButtonProps) => {
	const refMainButton = React.createRef<HTMLButtonElement>();

	return <FixedFab
		key='fixed-fab-multi-button'
		ref={refMainButton}
		ariaLabel="SpeedDial openIcon example"
		FabProps={{
			disabled: disabled
		}}
		color='secondary'
		icon={icon ? icon : <SpeedDialIcon openIcon={openIcon} />}
		onClick={(e) => {
			const mouseEvent = e.nativeEvent as MouseEvent;
			const actionElements = store.actions.map(c => c.ref.current);
			const isContainsByTop = mouseEvent.composedPath().filter(c => actionElements.filter(a => a === c).length > 0).length === 0;

			if (isContainsByTop && store.actionOnClick) {
				store.actionOnClick();
			}

			if (onClick) {
				onClick();
			}
		}}
		onClose={() => store.toggleOpen(alwaysOpen || false)}
		onOpen={() => store.toggleOpen(alwaysOpen || true)}
		open={alwaysOpen || store.isOpen}>
		{store.actions
			.filter(action => action.isShow())
			.map((action) => {
				return <SpeedDialAction
					FabProps={{
						disabled: action.isDisabled
					}}
					key={action.caption}
					icon={action.icon}
					tooltipOpen={tooltipOpen}
					tooltipTitle={action.caption}
					onClick={action.action}
					ref={action.ref}
				/>;
			})}
	</FixedFab>;
});

const FixedFab = styled(SpeedDial)`
	position: fixed;
	right: 15px;
	bottom: 15px;
`;
