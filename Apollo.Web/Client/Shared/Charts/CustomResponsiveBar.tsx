import { BarDatum, ResponsiveBar } from '@blumenkraft/nivo-bar';
import * as React from 'react';

export const CustomResponsiveBar: React.FC<{
	data: BarDatum[];
	indexBy: string;
	keys: string[];
}> =
	({ data, indexBy, keys }) => (
		<ResponsiveBar
			isInteractive
			tooltip={({ value, indexValue }) => (
				<span>{indexValue} - <strong>{value}</strong></span>
			)}
			data={data}
			keys={keys}
			indexBy={indexBy}
			margin={{
				top: 50.5,
				right: 50,
				bottom: 50,
				left: 50,
			}}
			padding={0.35}
			colors={['hsl(0,79%,72%)', 'hsl(153,67%,57%)']}
			borderColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
			// axisBottom={null}
			axisBottom={{
				orient: 'bottom',
				tickSize: 5,
				tickPadding: 5,
				tickRotation: 0,
				legend: null,
				legendOffset: 36,
				legendPosition: 'middle'
			}}
			axisLeft={{
				tickSize: 5,
				tickPadding: 5,
				tickRotation: 0,
				legend: 'Объем',
				legendPosition: 'middle',
				legendOffset: -45
			}}
			enableGridX={true}
			enableGridY={true}
			labelSkipWidth={5}
			labelSkipHeight={26}
			labelTextColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
			animate={true}
			motionStiffness={90}
			motionDamping={15} />
	);
