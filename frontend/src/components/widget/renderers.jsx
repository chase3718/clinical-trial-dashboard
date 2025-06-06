import React from 'react';
import {
	PieChart,
	Pie,
	Cell,
	Tooltip,
	Legend,
	ResponsiveContainer,
	BarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	LineChart,
	Line,
	AreaChart,
	Area,
	ScatterChart,
	Scatter,
	RadarChart,
	PolarGrid,
	PolarAngleAxis,
	PolarRadiusAxis,
	Radar,
	Brush,
} from 'recharts';

// Default colors
export const DEFAULT_COLORS = [
	'#8884d8',
	'#82ca9d',
	'#ffc658',
	'#ff8042',
	'#8dd1e1',
	'#a4de6c',
	'#d0ed57',
	'#fa8072',
	'#a28be2',
	'#60d394',
	'#ee6055',
];

// ===== Date Helpers =====
function isDateString(value) {
	if (typeof value !== 'string') return false;
	// Accepts YYYY-MM-DD, MM/DD/YYYY, or any ISO string (with or without time)
	// The easiest robust way is just to try new Date(value) and see if it's valid and string contains at least 8 digits (for YYYYMMDD)
	const date = new Date(value);
	return !isNaN(date) && /\d{4}-\d{2}-\d{2}/.test(value);
}

function formatDate(value) {
	if (!value) return '';
	const date = new Date(value);
	if (isNaN(date)) return value;
	const mm = String(date.getMonth() + 1).padStart(2, '0');
	const dd = String(date.getDate()).padStart(2, '0');
	const yyyy = date.getFullYear();
	return `${mm}/${dd}/${yyyy}`;
}

// PIE
export function PieRenderer({ pieData }) {
	return (
		<ResponsiveContainer width="100%" height="100%">
			<PieChart>
				<Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius="80%" label>
					{pieData.map((entry, index) => (
						<Cell key={`cell-${index}`} fill={DEFAULT_COLORS[index % DEFAULT_COLORS.length]} />
					))}
				</Pie>
				<Tooltip />
				<Legend
					payload={pieData.map((entry, index) => ({
						id: entry.name,
						type: 'square',
						value: `${entry.name} (${entry.value})`,
						color: DEFAULT_COLORS[index % DEFAULT_COLORS.length],
					}))}
				/>
			</PieChart>
		</ResponsiveContainer>
	);
}

// BAR
export function BarRenderer({ chartData, xKey, yKeys }) {
	if (!yKeys || yKeys.length === 0) return null;
	const firstValue = chartData?.[0]?.[xKey];
	const isDate = isDateString(firstValue);

	return (
		<ResponsiveContainer width="100%" height="100%">
			<BarChart data={chartData}>
				<CartesianGrid strokeDasharray="3 3" />
				<XAxis dataKey={xKey} tickFormatter={isDate ? formatDate : undefined} />
				<YAxis />
				<Tooltip labelFormatter={isDate ? formatDate : undefined} />
				<Legend />
				{yKeys.map((yKey, idx) => (
					<Bar
						key={yKey}
						dataKey={yKey}
						stackId="stack"
						fill={DEFAULT_COLORS[idx % DEFAULT_COLORS.length]}
						name={yKey}
					/>
				))}
				<Brush dataKey={xKey} height={20} stroke={DEFAULT_COLORS[0]} />
			</BarChart>
		</ResponsiveContainer>
	);
}

// LINE
export function LineRenderer({ chartData, xKey, yKey }) {
	const tooManyDots = chartData.length > 20;
	const firstValue = chartData?.[0]?.[xKey];
	const isDate = isDateString(firstValue);

	return (
		<ResponsiveContainer width="100%" height="100%">
			<LineChart data={chartData}>
				<CartesianGrid strokeDasharray="3 3" />
				<XAxis dataKey={xKey} tickFormatter={isDate ? formatDate : undefined} />
				<YAxis />
				<Tooltip labelFormatter={isDate ? formatDate : undefined} />
				<Legend />
				<Line
					type="monotone"
					dataKey={yKey || 'frequency'}
					stroke={DEFAULT_COLORS[1]}
					dot={tooManyDots ? false : true}
					activeDot={tooManyDots ? false : { r: 7 }}
				/>
				<Brush dataKey={xKey} height={20} stroke={DEFAULT_COLORS[1]} />
			</LineChart>
		</ResponsiveContainer>
	);
}

// AREA
export function AreaRenderer({ chartData, xKey, yKey }) {
	const tooManyDots = chartData.length > 20;
	const firstValue = chartData?.[0]?.[xKey];
	const isDate = isDateString(firstValue);

	return (
		<ResponsiveContainer width="100%" height="100%">
			<AreaChart data={chartData}>
				<CartesianGrid strokeDasharray="3 3" />
				<XAxis dataKey={xKey} tickFormatter={isDate ? formatDate : undefined} />
				<YAxis />
				<Tooltip labelFormatter={isDate ? formatDate : undefined} />
				<Legend />
				<Area
					type="monotone"
					dataKey={yKey || 'frequency'}
					stroke={DEFAULT_COLORS[2]}
					fill={DEFAULT_COLORS[2]}
					dot={tooManyDots ? false : true}
					activeDot={tooManyDots ? false : { r: 7 }}
				/>
				<Brush dataKey={xKey} height={20} stroke={DEFAULT_COLORS[2]} />
			</AreaChart>
		</ResponsiveContainer>
	);
}

// SCATTER
export function ScatterRenderer({ data, xKey, yKey }) {
	const hasX = xKey && typeof data?.[0]?.[xKey] === 'number';
	const hasY = yKey && typeof data?.[0]?.[yKey] === 'number';
	return (
		<ResponsiveContainer width="100%" height="100%">
			<ScatterChart>
				<CartesianGrid strokeDasharray="3 3" />
				<XAxis dataKey={hasX ? xKey : undefined} name={xKey} type="number" />
				<YAxis dataKey={hasY ? yKey : undefined} name={yKey} type="number" />
				<Tooltip cursor={{ strokeDasharray: '3 3' }} />
				<Scatter name={yKey || 'value'} data={hasX && hasY ? data : []} fill={DEFAULT_COLORS[3]} />
			</ScatterChart>
		</ResponsiveContainer>
	);
}

// RADAR
export function RadarRenderer({ radarData, xKey, yKey }) {
	return (
		<ResponsiveContainer width="100%" height="100%">
			<RadarChart data={radarData}>
				<PolarGrid />
				<PolarAngleAxis dataKey={xKey} />
				<PolarRadiusAxis />
				<Radar name={yKey} dataKey={yKey} stroke={DEFAULT_COLORS[4]} fill={DEFAULT_COLORS[4]} fillOpacity={0.5} />
				<Legend />
			</RadarChart>
		</ResponsiveContainer>
	);
}

export function TextRenderer({ header, body }) {
	return (
		<div className="w-full h-full flex flex-col items-center justify-center px-4 py-4 text-base-content">
			{header && (
				<div className="text-xl font-semibold mb-2 text-base-content/90 text-center leading-tight">{header}</div>
			)}
			{body && <div className="text-base text-base-content/70 whitespace-pre-line text-center">{body}</div>}
		</div>
	);
}
