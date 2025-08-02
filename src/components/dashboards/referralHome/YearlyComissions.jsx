import React from 'react';
import Chart from 'react-apexcharts';
import { useTheme } from '@mui/material/styles';

import DashboardWidgetCard from '../../shared/DashboardWidgetCard';

const YearlyComissions = () => {
  // chart color
  const theme = useTheme();
  const primary = theme.palette.primary.main;
  const primarylight = theme.palette.grey[100];

  // chart
  const optionscolumnchart = {
    chart: {
      type: 'bar',
      fontFamily: "'Plus Jakarta Sans', sans-serif;",
      foreColor: '#adb0bb',
      toolbar: {
        show: false,
      },
      height: 295,
    },
    colors: [
      primarylight,
      primarylight,
      primarylight,
      primarylight,
      primarylight,
      primarylight,
      primarylight,
      primarylight,
      primarylight,
      primarylight,
      primarylight,
      primary,
    ],
    plotOptions: {
      bar: {
        borderRadius: 4,
        columnWidth: '45%',
        distributed: true,
        endingShape: 'rounded',
      },
    },
    dataLabels: {
      enabled: false,
    },
    legend: {
      show: false,
    },
    grid: {
      yaxis: {
        lines: {
          show: false,
        },
      },
    },
    xaxis: {
      categories: [
        ['Ene'],
        ['Feb'],
        ['Mar'],
        ['Abr'],
        ['Mayo'],
        ['Jun'],
        ['Jul'],
        ['Ago'],
        ['Sept'],
        ['Oct'],
        ['Nov'],
        ['Dic'],
      ],
      axisBorder: {
        show: false,
      },
    },
    yaxis: {
      labels: {
        show: false,
      },
    },
    tooltip: {
      theme: theme.palette.mode === 'dark' ? 'dark' : 'light',
    },
  };
  const seriescolumnchart = [
    {
      name: '',
      data: [20, 15, 30, 25, 10, 15, 20, 40, 20, 10, 15, 45],
    },
  ];

  return (
    <DashboardWidgetCard
      title="Tus Ganancias"
      subtitle="Ingresos acumulados, mes a mes"
      dataLabel1="Junio"
      dataItem1="S/36,358"
      dataLabel2="Total"
      dataItem2="S/555,296"
      alternativeColor="#7C8FAC"
      alternativeJustifyContent="center"
    >
      <>
        <Chart options={optionscolumnchart} series={seriescolumnchart} type="bar" height="295px" />
      </>
    </DashboardWidgetCard>
  );
};

export default YearlyComissions;
