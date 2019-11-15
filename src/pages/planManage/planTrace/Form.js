/* eslint-disable */
import {Component} from "react";
import {
  Form, Select, Input, Button, DatePicker, message, Radio, Upload, Icon, TreeSelect, Table, Modal, Divider,
} from 'antd';
import { connect } from 'dva';
import Link from "umi/link";
import React from "react";
import moment from 'moment';

const { RangePicker } = DatePicker;
const Search = Input.Search;
const FormItem = Form.Item;
const { TextArea } = Input;
const RadioGroup = Radio.Group;
const Option = Select.Option;


// treeData处理数据
function combinationData(array){
  array.map((item) => {
    item.title = item.name;
    item.value = item.id;
    item.key = item.id;
    if(item.children){
      combinationData(item.children);
    }
  });
  return array;
}

class PlanForm extends Component{
  state = {
    isAdd:this.props.location.state.isAdd,
    data:this.props.location.state.data,
    companyId:'',
    companyName:'',
    visible: false,
    userList:[],
  };

  columns = [
    {
      title: '设备编号',
      dataIndex: 'equipmentCode',
    },
    {
      title: '设备名称',
      dataIndex: 'equipmentName',
    },
    {
      title: '责任人',
      dataIndex: 'equipmentPersonLiableName',
    },
    {
      title: '备注',
      dataIndex: 'remark',
    }
  ];




  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        if (this.state.isAdd === 1) {
            const filedValues = {
              ...values,
              'companyId':this.state.companyId,
              'companyName':this.state.companyName,
            };
            this.props.dispatch({
              type: 'patrolPlan/saveInspectionPlan',
              payload: filedValues,
            }).then(() => {
              if (this.props.initState.code === 0) {
                message.success('新增成功！', 1, () => this.props.history.push('/planManage/patrolPlan'));
              } else {
                message.error('新增失败！');
              }
            });
        } else {
            const filedValues = {
              ...values,
              'id':this.state.data.id,
              'companyId':this.state.companyId,
              'companyName':this.state.companyName,
            };
            this.props.dispatch({
              type: 'patrolPlan/updateInspectionPlan',
              payload: filedValues,
            }).then(() => {
              if (this.props.initState.code === 0) {
                message.success('修改成功！', 1, () => this.props.history.push('/planManage/patrolPlan'));
              } else {
                message.error('修改失败！');
              }
            });
        }
      }
    });
  };

  componentDidMount() {
    // 查询单位列表
    this.props.dispatch({
      type: 'depManage/getCurrentCompany',
      payload: {},
      }).then(() => {
        this.setState({
          companyId:this.props.currentCompany.id,
          companyName:this.props.currentCompany.name
        })
    })
    //查部门
    this.props.dispatch({
      type: 'depManage/getCurrentCompany',
    }).then(() => {
      this.props.dispatch({
        type: 'equipmentLedger/getOrganization',
        payload:{
          id:this.props.currentCompany.id
        }
      }).then(() => {
        const treeDate = this.props.orgList;
        this.setState({
          orgList:combinationData(treeDate),
        })
      })
    })
    //查设备列表
    this.props.dispatch({
      type: 'equipmentLedger/querySmsEquipmentBaseInfoList',
      payload: {
        pageNum:0,
      },
    }).then(() => {

    });
  }

  //部门选择方法,改变人员选择
  onSelect = (value) => {
    //调用查询方法
    this.props.dispatch({
      type:'userManage/getUserListByOrg',
      payload:{
        id:value
      }
    }).then(() => {
      this.setState({
        userList:this.props.userList
      })
    })
  }

  handleInspectionItem(){
    this.setState({
      visible: true,
    });
  }

  handleEquipmentSearch(){

  }

  handleCancel = () => {
    this.setState({
      visible: false,
    });
  }

  render() {
    const { data,userList }  = this.state;
    const {orgList, initEquipmentList } = this.props;
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 10 },
    };
    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        console.log("当前选中项ID：" + selectedRowKeys);
      },
      getCheckboxProps: record => ({
        disabled: record.name === 'Disabled User', // Column configuration not to be checked
        name: record.name,
      }),
    };

    return (
      <div>
        <Form onSubmit={this.handleSubmit}>
          <FormItem
            {...formItemLayout}
            label="计划编号"
            hasFeedback
          >
            {getFieldDecorator('planCode', {
              rules: [{
                required: true,
              }],
              initialValue:data === undefined ? "":data.planCode
            })(
              <Input placeholder="请输入计划编号" />
            )}
          </FormItem>

          <FormItem
            {...formItemLayout}
            label="计划名称"
            hasFeedback
          >
            {getFieldDecorator('planName', {
              rules: [{
                required: true,
              }],
              initialValue:data === undefined ? "":data.planName
            })(
              <Input placeholder="请输入计划名称" />
            )}
          </FormItem>

          <FormItem
            {...formItemLayout}
            label="计划状态"
          >
            {getFieldDecorator('planStatus', {
              rules: [
                { required: true,
                  message: '请选择计划状态'
                },
              ],
              initialValue:data === undefined ? 0:Number(data.planStatus)
            })(
              <RadioGroup onChange={this.onChange}>
                <Radio value={0}>待审核</Radio>
                <Radio value={1}>已审核</Radio>
              </RadioGroup>
            )}
          </FormItem>

          <FormItem
            {...formItemLayout}
            label="计划日期"
          >
            {getFieldDecorator('projectFinishDate', {
              rules: [{ type: 'object', required: true, message: '计划日期不能为空！' }],
              initialValue:data === undefined ?null:moment(data.projectFinishDate)
            })(
              <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" />
            )}
          </FormItem>

          <FormItem
            {...formItemLayout}
            label="计划执行部门"
            hasFeedback
          >
            {getFieldDecorator('liableOrganizationId', {
              rules: [
                { required: true,
                  message: '请选择计划执行部门'
                },
              ],
              initialValue:data === undefined ? "":data.liableOrganizationId
            })(
              <TreeSelect
                //value={this.state.value}
                allowClear={true}
                dropdownStyle={{ maxHeight: 500, overflow: 'auto' }}
                treeData={this.state.orgList}
                placeholder="请选择计划执行部门"
                onChange={this.onOrganzationChange}
                onSelect={this.onSelect}
              />
            )}
          </FormItem>

          <FormItem
            {...formItemLayout}
            label="计划执行人"
            hasFeedback
          >
            {getFieldDecorator('securityPersonLiableId', {
              rules: [{
                required: true,
                message: '请选择计划执行人',
              }],
              initialValue:data === undefined ? "":data.securityPersonLiableId
            })(
              <Select placeholder="请选择计划执行人" onChange={this.onChangeName}>
                {
                  userList.map(item => {
                    return (<Option key={item.id} value={item.id}>{item.name}</Option>)
                  })
                }
              </Select>
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="备注"
            hasFeedback
          >
            {getFieldDecorator('remark', {
              rules: [{
                message: '请输入备注',
              }],
              initialValue:data === undefined ? "":data.remark
            })(
              <TextArea rows={4} />
            )}
          </FormItem>
          <Button type="primary" onClick={this.handleInspectionItem.bind(this)}>添加巡检设备</Button>
          <FormItem>
            <Table
              style={{marginTop:20}}
              columns={this.columns}
              dataSource={initEquipmentList.content}
              rowKey="id"
              pagination={{  // 分页
                defaultCurrent: 1,
                pageSize:10,
                total: 0,
                onChange:this.changeSize,
              }}
            />
          </FormItem>

          <FormItem
            wrapperCol={{ span: 12, offset: 6 }}
          >
            <Button type="primary" htmlType="submit">提交</Button>
            <Button style={{ marginLeft: 20 }}><Link to='/planManage/patrolPlan'>取消</Link></Button>
          </FormItem>
        </Form>
        <Modal
          title="添加巡检设备"
          visible={this.state.visible}
          onOk={this.submitUserGroup}
          onCancel={this.handleCancel}
          destroyOnClose={true}
          width={1000}
          bodyStyle={{minHeight:200,overflow:'auto'}}
        >
          <Search
            placeholder="输入设备分类搜索"
            enterButton="搜索"
            size="default"
            style={{ width: 400,marginLeft:40 }}
            onSearch={this.handleEquipmentSearch.bind(this)}
            />
          <Table
            style={{marginTop:20}}
            columns={this.columns}
            dataSource={initEquipmentList.content}
            rowSelection={rowSelection}
            rowKey="id"
            pagination={{  // 分页
              defaultCurrent: 1,
              pageSize:10,
              total: 0,
              onChange:this.changeSize,
            }}
          />
        </Modal>

      </div>
    )
  }
}
const AddForm = Form.create()(PlanForm);


function mapStateToProps(state) {
  return {
    initState: state.patrolPlan.initState,
    initEquipmentList: state.equipmentLedger.initEquipmentList,
    //部门列表
    orgList:state.equipmentLedger.orgList,
    //当前公司
    currentCompany:state.depManage.currentCompany,
    //用户列表
    userList:state.userManage.userList,
  };
}

export default connect(mapStateToProps)(AddForm);
