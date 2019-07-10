import React, { useEffect } from 'react';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";

am4core.useTheme(am4themes_animated);

function Charts({ pieData }) {
  useEffect(() => {
    let chart = am4core.create("chart", am4charts.PieChart);
    chart.paddingRight = 20;

    chart.data = pieData;

    let pieSeries = chart.series.push(new am4charts.PieSeries());
    pieSeries.dataFields.value = "value";
    pieSeries.dataFields.category = "name";

    return () => {
      if (chart) {
        chart.dispose();
      }
    }
  }, [pieData])

  return (
    <div id="chart" style={{ width: "100%", height: "100%" }}></div>
  );

}

export default Charts;