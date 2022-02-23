import { Line, ResponsiveLine, Serie } from '@blumenkraft/nivo-line';
import * as React from 'react';

export const MyResponsiveLine: React.FC<{data: Serie[], showBottom?: boolean}> =
	({ data, showBottom }) => (
		<ResponsiveLine
			data={data}
			margin={{ top: 50, right: 110, bottom: 50, left: 100 }}
			xScale={{ type: 'point' }}
			yScale={{ type: 'linear', min: 'auto', max: 'auto', stacked: false, reverse: false }}
			yFormat={value =>
				`${Number(value).toLocaleString('ru-RU', {
					minimumFractionDigits: 2,
				})}`
			}
			enableSlices='x'
			sliceTooltip={({ slice }) => <div style={{
				background: 'white',
				padding: '9px 12px',
				border: '1px solid #ccc',
			}}>
				<div>{slice.points[0].data.xFormatted} - <strong>{Number(slice.points[0].data.y).toFixed()}</strong></div>
			</div>
			}
			curve='monotoneX'
			axisTop={null}
			axisRight={null}
			axisBottom={showBottom ? {
				orient: 'bottom',
				tickSize: 5,
				tickPadding: 5,
				tickRotation: 0,
				legend: null,
				legendOffset: 36,
				legendPosition: 'middle',
				format: (value) => `${value}`
			} : null}
			axisLeft={{
				orient: 'left',
				tickSize: 5,
				tickPadding: 5,
				tickRotation: 0,
				legend: null,
				legendOffset: -50,
				legendPosition: 'middle',
				format: value =>
					`${Number(value).toLocaleString('ru-RU', {
						minimumFractionDigits: 0,
						maximumFractionDigits: 0
					})}`
			}}
			colors={{ datum: 'color' }}
			pointSize={10}
			pointColor={{ theme: 'background' }}
			pointBorderWidth={2}
			pointBorderColor={{ from: 'serieColor' }}
			pointLabel='y'
			pointLabelYOffset={-12}
			enableArea={true}
			useMesh={true}
			legends={[
				{
					anchor: 'right',
					direction: 'column',
					justify: false,
					translateX: 100,
					translateY: 0,
					itemsSpacing: 0,
					itemDirection: 'left-to-right',
					itemWidth: 80,
					itemHeight: 20,
					itemOpacity: 0.75,
					symbolSize: 12,
					symbolShape: 'circle',
					symbolBorderColor: 'rgba(0, 0, 0, .5)',
					effects: [
						{
							on: 'hover',
							style: {
								itemBackground: 'rgba(0, 0, 0, .03)',
								itemOpacity: 1
							}
						}
					]
				}
			]}/>
	);

export const MyStaticLine: React.FC<{data: Serie[], width: number, height: number}> =
	({ data, height, width }) => (
		<Line
			width={width}
			height={height}
			data={data}
			margin={{ top: 5, right: 0, bottom: 5, left: 0 }}
			xScale={{ type: 'point' }}
			yScale={{ type: 'linear', min: 'auto', max: 'auto', stacked: false, reverse: false }}
			curve='monotoneX'
			axisTop={null}
			axisRight={null}
			axisBottom={null}
			axisLeft={null}
			/* colors={{ scheme: 'nivo' }} */
			colors={{ datum: 'color' }}
			pointSize={10}
			pointColor={{ theme: 'background' }}
			pointBorderWidth={2}
			pointBorderColor={{ from: 'serieColor' }}
			pointLabel='y'
			pointLabelYOffset={-12}
			enableArea={true}
			useMesh={true}
			isInteractive={false}
			animate={false}
			enablePoints={false}
			enableGridX={false}
			enableGridY={false}/>
	);
