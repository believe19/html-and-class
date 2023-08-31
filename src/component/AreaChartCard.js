import { AreaChart, Card,  Title } from '@tremor/react'
import React, { useEffect, useState } from 'react'

function AreaChartCard({weatherDetails}) {
    const [chartData, setChartData] = useState([]);
    useEffect (() => {
        const hourly = weatherDetails?.hourly?.time?.map((time) => 
        new Date(time)
        .toLocaleString("en-us", {hour: "numeric", hour12: false })
        .slice(0, 24) 
        );

       setChartData(
        hourly?.map((hour, i) => ({
        Time: Number(hour),
        "Temperature (C)": weatherDetails?.hourly?.temperature_2m[i]
       }))
       );
    }, [weatherDetails]);
  return(
    <Card>
    <Title>Temperature v/s Time</Title>
    <AreaChart
    data={chartData}
    index='Time'
    categories={["Temperature (C)"]}
    color={["indigo"]}
    />
  </Card>
  );
}

export default AreaChartCard;