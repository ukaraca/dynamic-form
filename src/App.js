import React, { useState, useEffect } from 'react';
import FormCreate from './components/FormCreate';
import { Form, Divider, Button, Spin, message, Collapse, Icon } from 'antd';
import { withRouter } from 'react-router-dom';
import qs from 'query-string'
import Axios from 'axios';
import { PieCharts, LineCharts, DataTable } from './components/Charts'

const { Panel } = Collapse;
function App({ location, form }) {
  const { formId } = qs.parse(location.search);

  const [fetching, setFetching] = useState(true);
  const [data, setData] = useState({});
  const [endpoint, setEndpoint] = useState('');
  const [loading, setLoading] = useState(false);
  const [chartData, setChartData] = useState([]);
  const [chartType, setChartType] = useState('');
  const [selectUrl, setSelectUrl] = useState('');
  const [activeKey, setActiveKey] = useState('1')

  useEffect(() => {
    Axios.post('https://apigateway.tarbil.gov.tr/api/v1/dinamik-form/select', {}, {
      headers: {
        'Content-Type': 'application/json'
      },
      data: {
        id: formId
      }
    }).then(async res => {
      const parsed = JSON.parse(res.data[0].form_json);
      const parsedData = JSON.parse(parsed.data);
      parsed.data = parsedData;
      await getChart(res.data[0].selectUrl);

      setSelectUrl(res.data[0].selectUrl);
      setEndpoint(res.data[0].Url);
      setData(parsed);
      setChartType(parsed.formRender);
      setFetching(false);
      document.title = `ReActor Dinamik Form - ${res.data[0].name}`

    }).catch(err => {
      console.log(err);
      message.error('Bir Hata Oluştu!')
    })
  }, [])


  const handleSubmit = e => {
    e.preventDefault();
    form.validateFields((err, values) => {
      setLoading(true)
      if (!err) {
        Axios.post(`https://apigateway.tarbil.gov.tr${endpoint}`, {}, {
          data: values
        }).then(res => {
          console.log(res.data);
          setLoading(false);
          message.success('Başarıyla Kaydedildi.');
          setActiveKey('1')
          getChart(selectUrl);
        }).catch(err => {
          console.log(err);
          setLoading(false);
          message.error('Bir Hata Oluştu.');
        })
      } else {
        setLoading(false)
      }
    });
  };

  const getChart = (type) => {
    // if (type === 'piechart') {
    //   Axios.get('https://apigateway.tarbil.gov.tr/api/v1/dinamik-form/select-pie', {
    //     headers: {
    //       'Content-Type': 'application/json'
    //     }, data: {}
    //   })
    //     .then(res => {
    //       setChartData(res.data);
    //     })
    // }
    // else if (type === 'linechart') {
    //   Axios.get('https://apigateway.tarbil.gov.tr/api/v1/dinamik-form/select-line', {
    //     headers: {
    //       'Content-Type': 'application/json'
    //     }, data: {}
    //   })
    //     .then(res => {
    //       setChartData(res.data);
    //     })
    // }
    // else {
    //   Axios.get('https://apigateway.tarbil.gov.tr/api/v1/dinamik-form/select-line', {
    //     headers: {
    //       'Content-Type': 'application/json'
    //     }, data: {}
    //   })
    //     .then(res => {
    //       setChartData(res.data);
    //     })
    // }

    Axios.get(`https://apigateway.tarbil.gov.tr${type}`, {
      headers: {
        'Content-Type': 'application/json'
      }, data: {}
    })
      .then(res => {
        setChartData(res.data);
      })
  }

  const onAccordionChange = (e) => {
    setActiveKey(e)
  }

  return (
    <div style={{
      width: '50%',
      margin: 'auto',
      padding: '10px',
      border: '1px solid #d3d3d3',
      boxShadow: '-3px -1px 20px 2px #d3d3d3',
      borderRadius: '5px',
      minHeight: '250px',
      marginTop: '50px',
      display: fetching ? 'flex' : 'block',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      {
        !fetching ?
          <Form onSubmit={handleSubmit} >
            <h1 style={{ textAlign: 'center', marginTop: '24px', marginBottom: '24px' }} >{data.submitUrl}</h1>
            <h3 style={{ textAlign: 'center', marginTop: '24px', marginBottom: '24px' }} >{data.description}</h3>

            <div style={{ width: '100%', margin: 'auto' }}>
              <Collapse bordered={false} defaultActiveKey={['1']} accordion onChange={onAccordionChange} activeKey={activeKey}>
                <Panel style={{
                  background: `white`,
                  border: `none`,
                }}
                  showArrow={false}
                  header={
                    <div>
                      <Divider orientation="left">
                        <Icon
                          type={
                            chartType === 'piechart' ? 'pie-chart'
                              : chartType === 'linechart' ? 'line-chart'
                                : chartType === 'datatable' ? 'table'
                                  : chartType === 'radar' ? 'radar-chart' :
                                    'settings'} />
                        {` Veri Önizleme`}
                      </Divider>
                    </div>
                  } key="1">
                  {
                    chartType === 'piechart' && chartData.length ? <PieCharts chartData={chartData} />
                      :
                      chartType === 'linechart' && chartData.length ? <LineCharts chartData={chartData} />
                        :
                        chartType === 'datatable' && chartData.length ? <DataTable chartData={chartData} />
                          : null
                  }

                </Panel>
                <Panel
                  style={{
                    background: `white`,
                    border: `none`,
                  }}
                  showArrow={false}
                  header={
                    <div>
                      <Divider orientation="left">
                        <Icon type="form" />
                        {` Form Bilgileri`}
                      </Divider>
                    </div>
                  } key="2"
                >
                  {
                    data.data.map((e, i) => {
                      return (
                        <FormCreate
                          form={form}
                          key={i}
                          item={e}
                        />
                      )
                    }
                    )
                  }
                  <Form.Item style={{ display: 'flex', justifyContent: 'center' }} >
                    <Button loading={loading} htmlType="submit" type="primary">Kaydet</Button>
                  </Form.Item>
                </Panel>
              </Collapse>
            </div>
          </Form>
          :
          <div>
            <Spin tip="Yükleniyor..." />
          </div>
      }

    </div>
  );
}
App = Form.create({})(App);
export default withRouter(App);