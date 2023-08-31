import { Card, LineChart, Title } from '@tremor/react';
import React, { useEffect, useState } from 'react'

function LineChartCard({weatherDetails}) {
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
        Humidity: weatherDetails?.hourly?.relativehumidity_2m[i],
       }))
       );
    }, [weatherDetails]);
  return (
    <Card>
    <Title>Humidity v/s Time</Title>
    <LineChart
        data={chartData}
        index='Time'
        categories={["Humidity"]}
        color={["yellow"]}
    />
  </Card>
  )
}

export default LineChartCard;