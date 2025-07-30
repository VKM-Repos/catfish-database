import * as React from 'react'
import GaugeChartImport from 'react-gauge-chart'
import { GaugeChartProps } from 'react-gauge-chart' // Optional if props are exported

const GaugeChart = GaugeChartImport as unknown as React.FC<GaugeChartProps>

const GaugeChartWrapper: React.FC<GaugeChartProps> = (props) => {
  return <GaugeChart {...props} />
}

export default GaugeChartWrapper
