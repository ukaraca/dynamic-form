import React, { useEffect } from 'react';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";

am4core.useTheme(am4themes_animated);

function Charts({ chartData }) {
  useEffect(() => {
    let chart = am4core.create("chart", am4charts.XYChart3D);
    chart.paddingRight = 20;
    const data = chartData.map(item => ({ ...item, color: chart.colors.next() }))

    chart.data = data;

    console.log(data)
    // Create axes
    const categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "name";
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.minGridDistance = 20;

    const valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.data.value = "value";
    const series = chart.series.push(new am4charts.ColumnSeries3D);
    series.dataFields.valueY = "value";
    series.dataFields.categoryX = "name";
    series.name = "Ürünler";
    series.columns.template.propertyFields.fill = "color";
    series.columns.template.tooltipText = "{categoryX}: [bold]{valueY}[/] Adet";
    series.columns.template.column3D.stroke = am4core.color("#fff");
    series.columns.template.column3D.strokeOpacity = 0.2;

    return () => {
      if (chart) {
        chart.dispose();
      }
    }
  }, [chartData])

  return (
    <div id="chart" style={{ width: "100%", height: "100%" }}></div>
  );

}

export default Charts;