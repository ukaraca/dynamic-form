import React, { useEffect, useState } from 'react';
import { Table, Input, Button, Icon } from 'antd';
import Highlighter from 'react-highlight-words';

function DataTable({ chartData }) {
  const [column, setColumnData] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [searchText, setSearchText] = useState('');

  const getColumnSearchProps = dataIndex => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input
          placeholder={`${dataIndex} Ara`}
          value={selectedKeys[0]}
          onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm)}
          style={{ width: 188, marginBottom: 8, display: 'block' }}
        />
        <Button
          type="primary"
          onClick={() => handleSearch(selectedKeys, confirm)}
          icon="search"
          size="small"
          style={{ width: 90, marginRight: 8 }}
        >
          Ara
        </Button>
        <Button onClick={() => handleReset(clearFilters)} size="small" style={{ width: 90 }}>
          Temizle
        </Button>
      </div>
    ),
    filterIcon: filtered => (
      <Icon type="search" style={{ color: filtered ? '#1890ff' : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes(value.toLowerCase()),
    onFilterDropdownVisibleChange: visible => {
      // if (visible) {

      //   setTimeout(() => searchInput.select());
      // }
    },
    render: text => (
      <Highlighter
        highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
        searchWords={[searchText]}
        autoEscape
        textToHighlight={text.toString()}
      />
    ),
  });

  const handleSearch = (selectedKeys, confirm) => {
    console.log(selectedKeys, confirm)
    confirm();
    setSearchText(selectedKeys[0])
  };

  const handleReset = clearFilters => {
    clearFilters();
    setSearchText('')
  };

  useEffect(() => {
    const keys = Object.keys(chartData[0]);
    const dataColumn = [];
    keys.map((val, index) => {
      console.log(val)
      return dataColumn.push({
        title: val,
        dataIndex: val,
        key: index,
        // sortDirections: ['descend', 'ascend'],
        // sorter: (a, b) => a[val] - b[val],
        ...getColumnSearchProps(val),
      });
    })

    console.log(dataColumn)

    const tableData = chartData.map(item => ({ ...item, key: item.id }))
    setTableData(tableData)
    setColumnData(dataColumn);
  }, [chartData])

  return (
    <Table size="small" dataSource={tableData} columns={column} pagination={false} locale={{emptyText: 'Veri Bulunamadı!'}} />
  )
}

export default DataTable