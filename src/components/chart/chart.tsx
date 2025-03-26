import type { Props as ApexChartProps } from 'react-apexcharts';

import { memo } from 'react';
import ApexChart from 'react-apexcharts';
import { chartWrapper } from './styles.css';

function Chart(props: Readonly<ApexChartProps>) {
	return (
		<div className={chartWrapper}>
			<ApexChart {...props} />
		</div>
	);
}

export default memo(Chart);
