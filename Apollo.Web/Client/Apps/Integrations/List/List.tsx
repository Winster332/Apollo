import {observer} from "mobx-react-lite";
import {IIntegrationView, IntegrationState} from "@Shared/Contracts";
import * as React from "react";
import {
	Accordion,
	AccordionDetails,
	AccordionSummary,
	Box,
	Grid,
	TablePagination,
	Tooltip,
	Typography
} from "@material-ui/core";
import {Pagination} from "./Store";
import styled, {keyframes} from "styled-components";
import {Collections} from "@Shared/Collections";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import {
	Timeline,
	TimelineConnector,
	TimelineContent,
	TimelineDot,
	TimelineItem,
	TimelineOppositeContent,
	TimelineSeparator
} from "@material-ui/lab";
import {computed, makeObservable, observable} from 'mobx';
import {CommonStore} from "@Layout";
import {AppTheme} from "../../../Layout/CommonStore";

class IntegrationListStore {
	constructor(integrationViews: IIntegrationView[]) {
		makeObservable(this);
		
		this.integrationViews = integrationViews;
	}
	
	@observable
	public integrationViews: IIntegrationView[];
	
	@computed
	public get sortedIntegrations() {
		return Collections
			.chain(this.integrationViews)
			.map(c => {
				const stages = Collections
					.chain(c.stages)
					.sortBy(c => c.orderNumber)
					.map(x => {
						const isSelected = this.selectedStages.find(d => d.integrationId === c.id && d.stageId === x.id) !== undefined;
						return ({
							...x,
							isSelected: isSelected
						})
					})
					.value();
				const currentStage = stages.find(x => x.isSelected) || null;
				return ({
					...c,
					stages: stages,
					selectedStage: currentStage
				})
			})
			.value()
	}
	
	@computed
	public get integrationStateWithName() {
		return [
			({ name: 'Выполняется', value: IntegrationState.Started }),
			({ name: 'Завершено', value: IntegrationState.Finished }),
			({ name: 'Завершено с ошибкой', value: IntegrationState.Failed }),
		];
	}
	
	public selectStage = (integrationId: string, stageId: string) => {
		this.selectedStages = this.selectedStages.filter(c => c.integrationId != integrationId).concat(({
			integrationId: integrationId,
			stageId: stageId
		}))
	};
	
	@observable
	private selectedStages: ({
		integrationId: string;
		stageId: string
	})[] = [];
}

export const IntegrationList = observer((props: ({
	integrations: IIntegrationView[];
	onEdit: (id: string) => void;
	pagination: Pagination;
})) => {
	const store = React.useState(() => new IntegrationListStore(props.integrations))[0];
	const pagination = props.pagination;
	
	const renderCircle = (idx: number, active: boolean, closed: boolean) => {
		const color = active
			? '#80e0ff'
			: closed
				? '#79e6b0'
				: '#ccc';
		
		if (active) {
			return <StageCircle key={idx} style={{background: color}}/>
		}

		return <ActiveStageCircle key={idx} style={{background: color}}/>
	};

	return <Box>
		<TablePagination
			rowsPerPageOptions={pagination.rowsPerPageOptions}
			component="div"
			count={pagination.totalRows}
			rowsPerPage={pagination.currentRowsPerPage}
			page={pagination.currentPage}
			onPageChange={(e, newPage) => {
				if (e) {
					pagination.changedPage(newPage);
				}
			}}
			onRowsPerPageChange={(e) => pagination.changedRowsPerPage(parseInt(e.target.value, 10))}
		/>

		{store.sortedIntegrations.map((row, idx) => 
		<Accordion key={idx}>
			<AccordionSummary expandIcon={<ExpandMoreIcon />}>
				<Grid container xs={12}>
					<Grid item xs={3}>
						<Box>
							<span>{store.integrationStateWithName.find(v => v.value === row.state)?.name || ''}</span>
							{row.stages.find(x => x.active) && <span style={{marginLeft: '5px', color: '#ccc'}}>({row.stages.find(x => x.active)?.name})</span>}
						</Box>
						<Box style={{display: 'flex', cursor: 'pointer', marginTop: '5px'}}>
							{Collections
								.chain(row.stages)
								.sortBy(c => c.orderNumber)
								.value()
								.map(s => {
									return ({
										closed: s.orderNumber <= (row.stages.find(s => s.active)?.orderNumber || -1),
										...s
									})
								})
								.map((s, idx) =>
									<Tooltip title={s.name}>
										{renderCircle(idx, s.active, s.closed)}
									</Tooltip>
								)}
							<Box style={{position: 'absolute', zIndex: 1, width: `${18*row.stages.length}px`, marginTop: '6px', height: '1px', background: 'rgb(231 209 209)'}}></Box>
						</Box>
					</Grid>
					<Grid item xs={3}>
						<Box>
							<Helper title='Дата начала'>
								<span>{row.startedDateTime.format('DD.MM.YYYY hh:mm:ss')}</span>
							</Helper>
						</Box>
						<Box>
							<Helper title='Дата завершения'>
								<span>{row.finishedDateTime?.format('DD.MM.YYYY hh:mm:ss') || 'ожидает'}</span>
							</Helper>
						</Box>
					</Grid>
					<Grid item xs={3}>
						<Helper title='Минут прошло'>
							<span>{(row.durationSeconds / 60).toFixed(0)}</span>
						</Helper>
						<span style={{padding: '0px 5px'}}>/</span>
						<Helper title='Элементов обновлено'>
							<span>{row.stages.map(c => c.report?.updatedIds.length || 0).reduce((a, b) => a + b, 0)}</span>
						</Helper>
					</Grid>
				</Grid>
			</AccordionSummary>
			<AccordionDetails style={{display: 'block', width: '100%'}}>
				<Box>
					<Grid container xs={12}>
						<Grid item xs={3}>
							<Timeline align="left" style={{margin: '0px'}}>
								{row.stages.map((s, idx) =>
									<Box onClick={() => store.selectStage(row.id, s.id)}>
										<TimeLineItemSelector key={idx}>
											<TimelineOppositeContent>
												<Typography variant="body2" color="textSecondary">
													{s.dateTimeStarted?.format('hh:mm')}
												</Typography>
												<Typography variant="body2" color="textSecondary">
													{s.dateTimeFinished?.format('hh:mm')}
												</Typography>
											</TimelineOppositeContent>
											<TimelineSeparator>
												<TimelineDot variant="outlined" style={{
													borderColor: s.active 
														? '#80e0ff' 
														: s.finished
															? (s.report?.isSuccess || false) 
																? '#79e6b0' 
																: '#e67979' 
															: s.orderNumber <= (row.currentStage?.orderNumber || 0) ? '#79e6b0' : '#ccc'
												}}/>
												{idx !== (row.stages.length-1) && <TimelineConnector />}
											</TimelineSeparator>
											<TimelineContent>
												{s.isSelected && <span style={{color: '#ccc'}}>{s.name}</span>}
												{!s.isSelected && <span>{s.name}</span>}
											</TimelineContent>
										</TimeLineItemSelector>
									</Box>)}
							</Timeline>
						</Grid>
						<Grid item xs={9} style={{
							borderLeft: CommonStore.instance.theme.current === AppTheme.Dark ? '2px solid #303030' : '2px solid rgb(237 233 233)',
							paddingLeft: '15px'
						}}>
							{row.selectedStage !== null && <Box>
								{row.selectedStage.report === null && <Box>
									<Typography variant='subtitle2'>Отчет по стадии не сформирован</Typography>
								</Box>}
								{(row.selectedStage.report || null) !== null && <Box>
									<Typography variant="subtitle1" color="textSecondary" style={{
										marginTop: '7px',
										borderBottom: '1px dashed',
										width: 'fit-content',
										marginBottom: '10px'
									}}>
										Логи: ({row.selectedStage.report!.updatedIds.length})
									</Typography>
									{row.selectedStage.report!.isSuccess && <Box style={{
										borderRadius: '5px',
										border: CommonStore.instance.theme.current === AppTheme.Light ? '1px solid #ede9e9' : '1px solid rgb(86 86 86)',
										padding: '5px',
										background: CommonStore.instance.theme.current === AppTheme.Light ? '#f7f7f7' : 'rgb(48 48 48)'
									}}>
										{row.selectedStage.report!.lines.map((l, lidx) =>
											<LogLine index={lidx+1} text={l}/>)}
									</Box>}
									{!row.selectedStage.report!.isSuccess && <Box>
										<Typography variant='body1'>{row.selectedStage!.report!.error}</Typography>
									</Box>}
								</Box>}
							</Box>}
						</Grid>
					</Grid>
				</Box>
			</AccordionDetails>
		</Accordion>)}
	</Box>
});

const Helper = styled(Tooltip)`
`

export const LogLine = observer((props: ({
	index: number;
	text: string;
})) => {
	return <LogLineFlex key={props.index}>
		<span style={{
			textAlign: 'end',
			paddingLeft: '20px',
			color: '#929292'
		}}>{props.index}</span>
		<span style={{paddingLeft: '5px'}}>{props.text}</span>
	</LogLineFlex>
});

const TimeLineItemSelector = styled(TimelineItem)`
    cursor: pointer;
    
    &:hover {
    	color: #80e0ff;
    }
`

const LogLineFlex = styled(Box)`
	display: block;
	width: 100%;
    border-bottom: 1px solid transparent;
    cursor: pointer;
    
    &:hover {
    	border-bottom: 1px solid #c4efff;
    }
`

const pulse = keyframes`
	0% {
    box-shadow: 0 0 0 0px rgba(0, 0, 0, 0.2);
  }
  100% {
    box-shadow: 0 0 0 10px rgba(0, 0, 0, 0);
  }
`

const ActiveStageCircle = styled(Box)`
	width: 14px;
    height: 14px;
    border-radius: 50%;
    background: #ccc;
    margin-right: 5px;
    border: 1px solid #fff;
    z-index: 2;
`

const StageCircle = styled(Box)`
	width: 14px;
    height: 14px;
    border-radius: 50%;
    background: #ccc;
    margin-right: 5px;
    border: 1px solid #fff;
    z-index: 2;
    animation: ${pulse} 2s infinite;
`