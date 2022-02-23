import { PieDatum, ResponsivePie } from '@blumenkraft/nivo-pie';
import * as React from 'react';

export const MyResponsivePie: React.FC<{
	data: PieDatum[]; padding: number; startAngle: number;
	radialLabel: (d: PieDatum) => string;
	sliceLabel: (d: PieDatum) => string;
	tooltipFormat: (value: number) => string;
	colors?: string[];

}> =
	({ data, padding, colors, startAngle, radialLabel, sliceLabel, tooltipFormat }) => (
		<ResponsivePie
			data={data}
			startAngle={startAngle}
			endAngle={360}
			margin={{ top: padding/2, right: padding, bottom: padding/2, left: padding }}
			sortByValue={true}
			innerRadius={0.05}
			padAngle={4}
			colors={colors ? colors : { scheme: 'nivo' } }
			borderWidth={1}
			enableRadialLabels={true}
			radialLabel={radialLabel}
			radialLabelsSkipAngle={0}
			radialLabelsTextXOffset={5}
			radialLabelsTextColor={'#333333'}
			radialLabelsLinkOffset={0}
			radialLabelsLinkDiagonalLength={8}
			radialLabelsLinkHorizontalLength={9}
			radialLabelsLinkStrokeWidth={1}
			radialLabelsLinkColor={{ from: 'color' }}
			enableSlicesLabels={true}
			slicesLabelsSkipAngle={30}
			sliceLabel={sliceLabel}
			tooltipFormat={tooltipFormat}
			slicesLabelsTextColor='#333333'
			animate={true}
			motionStiffness={90}
			motionDamping={15}
			defs={[
				{
					id: 'dots',
					type: 'patternDots',
					background: 'inherit',
					color: 'rgba(55, 255, 255, 0.3)',
					size: 4,
					padding: 1,
					stagger: true
				},
				{
					id: 'lines',
					type: 'patternLines',
					background: 'inherit',
					color: 'rgba(255, 55, 255, 0.3)',
					rotation: -45,
					lineWidth: 6,
					spacing: 10
				}
			]}
			fill={[
				{
					match: {
						id: 'purchases'
					},
					id: 'dots'
				},
				{
					match: {
						id: 'construction'
					},
					id: 'lines'
				},
			]}/>
	);
