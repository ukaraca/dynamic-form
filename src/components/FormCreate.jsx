import React from 'react';
import {
  Form,
  Input,
  InputNumber,
  Select,
  Row,
  Col,
  Checkbox,
  Radio,
  DatePicker
} from 'antd';

import locale from 'antd/lib/date-picker/locale/tr_TR';

const TextArea = Input.TextArea;
const FormItem = Form.Item;
const CheckboxGroup = Checkbox.Group;
const RadioGroup = Radio.Group;
const Option = Select.Option;

function FormCreate({ item, form }) {
  const getFormItem = (item, props) => {
    const { type } = item;
    if (type === `input`) {
      return <Input {...props} />
    } else if (type === `inputNumber`) {
      return <InputNumber {...props} />
    } else if (type === `checkbox`) {
      return <Checkbox {...props} />
    } else if (type === 'textArea') {
      return <TextArea {...props} />
    } else if (type === 'datePicker') {
      return <DatePicker locale={locale} {...props} />
    } else if (type === `checkboxGroup`) {
      return (
        <CheckboxGroup
          {...props}
          style={{ width: `100%`, lineHeight: `32px`, position: `relative`, top: 5 }}>
          <Row>
            {
              item.options.map((e, i) => (
                <Col
                  key={i}
                  title={e.label}
                  span={24 / item.optionRowShow}
                  style={{ whiteSpace: `nowrap`, textOverflow: `ellipsis`, overflow: `hidden` }}
                >
                  <Checkbox value={e.value}>
                    {e.label}
                  </Checkbox>
                </Col>
              ))
            }
          </Row>
        </CheckboxGroup>
      )
    } else if (type === `radio`) {
      return (
        <RadioGroup
          {...props}
          style={{ width: `100%`, lineHeight: `32px`, position: `relative`, top: 5 }}>
          <Row>
            {
              item.options.map((e, i) => (
                <Col
                  key={i}
                  title={e.label}
                  span={24 / item.optionRowShow}
                  style={{ whiteSpace: `nowrap`, textOverflow: `ellipsis`, overflow: `hidden` }}
                >
                  <Radio value={e.value}>
                    {e.label}
                  </Radio>
                </Col>
              ))
            }
          </Row>
        </RadioGroup>
      )
    } else if (type === `select`) {
      return (
        <Select
          defaultActiveFirstOption
          style={{ width: 120 }}
          {...props}
        >
          {
            item.options.map((e, i) => (
              <Option
                key={i}
                value={e.value}>
                {e.label}
              </Option>
            ))
          }
        </Select>
      )
    }
  }

  const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 16 },
  };

  const labelStyle = {
    display: `inline-block`,
  }

  return (
    <FormItem
      {...formItemLayout}
      colon={true}
      label={
        <span dangerouslySetInnerHTML={{ __html: item.label }} style={labelStyle} />
      }
    >
      {
        <Row gutter={5}>
          <Col span={20}>
            {
              form.getFieldDecorator(item.fieldName || 'invalidField', {
                rules: [
                  {
                    required: item.required,
                    message: item.requiredMessage
                  },
                ]
              })(getFormItem(item, {}))
            }
          </Col>
        </Row>
      }
    </FormItem>
  )
}

export default FormCreate;