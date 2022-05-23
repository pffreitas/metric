import { Orientation } from '@visx/axis';
import { chain, filter } from 'lodash';
import moment from 'moment';
import {
  AnimatedAxis,
  AnimatedGrid,
  AnimatedLineSeries,
  AnimatedAreaStack,
  XYChart,
  Tooltip,
} from '@visx/xychart';
import { scaleLinear, scaleOrdinal, scaleThreshold, scaleQuantile } from '@visx/scale';
import {
  LegendOrdinal,
  LegendItem,
  LegendLabel,
} from '@visx/legend';
import { Card, CardContent, Typography } from '@mui/material';
import { Bug } from '../../models/bugs';


type EscapedBugsProps = {
  escapedBugs: Bug[]
}

export const EscapedBugsChart: React.FunctionComponent<EscapedBugsProps> = ({ escapedBugs }) => {

  // const nonCancelledBugs = chain(bugs)
  //   .filter(b => {
  //     return b.environment && (b.environment.includes("PROD") || b.environment.includes("UAT"))
  //   })
  //   .groupBy(b => b.created)
  //   .map((bug, created) => ({ date: created, count: bug.length }))
  //   .sortBy((bugs, key) => key)
  //   .reverse()
  //   .value();

  console.log({escapedBugs});


  const cancelledBugs = chain(escapedBugs)
    .groupBy(b => b.created)
    .map((bugs, key) => ({ date: key, count: filter(bugs, (b) => b.status === "Cancelled").length }))
    .sortBy((bugs, key) => key)
    .reverse()
    .value();

  const nonCancelledBugs = chain(escapedBugs)
    .groupBy(b => b.created)
    .map((bugs, key) => ({ date: key, count: filter(bugs, (b) => b.status !== "Cancelled").length }))
    .sortBy((bugs, key) => key)
    .reverse()
    .value();

  const accessors = {
    xAccessor: d => d.date,
    yAccessor: d => d.count,
  };

  const ordinalColorScale = scaleOrdinal({
    domain: ['Non Cancelled', 'Cancelled'],
    range: ['#EA5252', '#F3A1A1'],
  });


  return (
    <Card>
      <CardContent>
        <Typography variant="h6" component="div">Escaped Bugs</Typography>
        <XYChart height={300} xScale={{ type: 'band' }} yScale={{ type: 'linear' }}>
          <AnimatedAxis orientation="bottom" tickFormat={(d) => moment(d).format('DD/MM/yyyy')} />
          <AnimatedAxis label="Count" orientation={Orientation.left} />
          <AnimatedGrid columns={false} numTicks={4} />
          <AnimatedAreaStack>
            <AnimatedLineSeries fill='#EA5252' fillOpacity={0.6} dataKey="Non Cancelled" data={nonCancelledBugs} {...accessors} />
            <AnimatedLineSeries fill='#F3A1A1' fillOpacity={0.6} dataKey="Cancelled" data={cancelledBugs} {...accessors} />
          </AnimatedAreaStack>
          <Tooltip
            snapTooltipToDatumX
            snapTooltipToDatumY
            showVerticalCrosshair
            showSeriesGlyphs
            showDatumGlyph
            renderTooltip={({ tooltipData, colorScale }) => (
              <div>
                {
                  Object.keys(tooltipData?.datumByKey ?? {}).map(key => (
                    <div>
                      <div style={{ color: colorScale ? colorScale(key) : '#000' }}>
                        {key}
                      </div>
                      {accessors.xAccessor(tooltipData?.datumByKey[key].datum)}
                      {', '}
                      {accessors.yAccessor(tooltipData?.datumByKey[key].datum)}
                    </div>
                  ))
                }
              </div>
            )}
          />
        </XYChart>
        <LegendOrdinal scale={ordinalColorScale} labelFormat={(label) => `${label.toUpperCase()}`}>
          {(labels) => (
            <div style={{ display: 'flex', flexDirection: 'row' }}>
              {labels.map((label, i) => (
                <LegendItem
                  key={`legend-quantile-${i}`}
                  margin="0 5px">
                  <svg width={10} height={10}>
                    <rect fill={label.value} width={10} height={10} />
                  </svg>
                  <LegendLabel align="left" margin="0 0 0 4px">
                    {label.text}
                  </LegendLabel>
                </LegendItem>
              ))}
            </div>
          )}
        </LegendOrdinal>
      </CardContent>
    </Card>
  )
}