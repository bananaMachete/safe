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
// treeData处理上级项目数据
function combinationClassData(array){
  array.map((item) => {
    item.title = item.planName;
    item.value = item.id;
    item.key = item.id;
    if(item.children){
      combinationClassData(item.children);
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
    personLiableName:'',
    organizationName:this.props.location.state.data === undefined ? '':this.props.location.state.data.organizationName,
    initSecurityPlan:[],
  };

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        if (this.state.isAdd === 1) {
          const filedValues = {
            ...values,
            'companyId':this.state.companyId,
            'companyName':this.state.companyName,
            'personLiableName':this.state.personLiableName,
            'organizationName':this.state.organizationName,//责任部门
            'beginDate':values['beginDate'].format('YYYY-MM-DD'),
            'endDate':values['endDate'].format('YYYY-MM-DD'),
          };
          console.log(filedValues);
          this.props.dispatch({
            type: 'securityPlan/saveSecurityPlan',
            payload: filedValues,
          }).then(() => {
            if (this.props.initState.code === 0) {
              message.success('新增成功！', 1, () => this.props.history.push('/planManage/securityPlan'));
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
            'personLiableName':this.state.personLiableName,
            'organizationName':this.state.organizationName,//责任部门
          };
          this.props.dispatch({
            type: 'securityPlan/updateSecurityPlan',
            payload: filedValues,
          }).then(() => {
            if (this.props.initState.code === 0) {
              message.success('修改成功！', 1, () => this.props.history.push('/planManage/securityPlan'));
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
      type: 'depManage/queryCompanyListArray',
      payload: {
        name:'',
        pageNum:0
      },
    });
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

    //查上级计划信息
    this.props.dispatch({
      type: 'securityPlan/querySecurityPlan',
      payload: {
        planName:'',
        pageNum:'',
        pageSize:'',
      },
    }).then(() => {
      const treeDate = this.props.initSecurityPlan.content;
      console.log(treeDate);
      this.setState({
        initSecurityPlan:combinationClassData(treeDate),
      })
    })
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
  onChangeName = (value,tag) =>{
    this.setState({
      personLiableName:tag.props.children
    })
  }
  //选择部门
  onOrganizationChange = (data,label) => {
    this.setState({
      organizationName:label[0]
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
    const { orgList,companyListArray} = this.props;
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 10 },
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
            label="上级项目"
            hasFeedback
          >
            {getFieldDecorator('parentPlan', {
              rules: [
                { required: true,
                  message: '请选择上级项目'
                },
              ],
              initialValue:data === undefined ? "":data.parentPlan
            })(
              <TreeSelect
                //value={this.state.value}
                allowClear={true}
                dropdownStyle={{ maxHeight: 500, overflow: 'auto' }}
                treeData={this.state.initSecurityPlan}
                placeholder="请选择上级菜单"
                onChange={this.onProjectChange}
                onSelect={this.onSelect}
              />
            )}
          </FormItem>

          <FormItem
            {...formItemLayout}
            label="审核状态"
          >
            {getFieldDecorator('examineStatus', {
              rules: [
                { required: true,
                  message: '审核状态'
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
                <Radio value={0}>启用</Radio>
                <Radio value={1}>未启用</Radio>
              </RadioGroup>
            )}
          </FormItem>

          <FormItem
            {...formItemLayout}
            label="计划开始日期"
          >
            {getFieldDecorator('beginDate', {
              rules: [{ type: 'object', required: true, message: '计划开始日期不能为空！' }],
              initialValue:data === undefined ?null:moment(data.beginDate)
            })(
              <DatePicker showTime format="YYYY-MM-DD" />
            )}
          </FormItem>

          <FormItem
            {...formItemLayout}
            label="计划结束日期"
          >
            {getFieldDecorator('endDate', {
              rules: [{ type: 'object', required: true, message: '计划结束日期不能为空！' }],
              initialValue:data === undefined ?null:moment(data.endDate)
            })(
              <DatePicker showTime format="YYYY-MM-DD" />
            )}
          </FormItem>

          <FormItem
            {...formItemLayout}
            label="计划完成率"
            hasFeedback
          >
            {getFieldDecorator('planRatio', {
              rules: [{
                required: false,
              }],
              initialValue:data === undefined ? "":data.planRatio
            })(
              <Input placeholder="计划完成率" />
            )}
          </FormItem>

          <FormItem
            {...formItemLayout}
            label="计划执行部门"
            hasFeedback
          >
            {getFieldDecorator('organizationId', {
              rules: [
                { required: true,
                  message: '请选择计划执行部门'
                },
              ],
              initialValue:data === undefined ? "":data.organizationId
            })(
              <TreeSelect
                //value={this.state.value}
                allowClear={true}
                dropdownStyle={{ maxHeight: 500, overflow: 'auto' }}
                treeData={this.state.orgList}
                placeholder="请选择计划执行部门"
                onChange={this.onOrganizationChange}
                onSelect={this.onSelect}
              />
            )}
          </FormItem>

          <FormItem
            {...formItemLayout}
            label="计划执行人"
            hasFeedback
          >
            {getFieldDecorator('personLiableId', {
              rules: [{
                required: true,
                message: '请选择计划执行人',
              }],
              initialValue:data === undefined ? "":data.personLiableId
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
            label="所属单位"
            hasFeedback
          >
            {getFieldDecorator('companyId', {
              rules: [
                { required: true,
                  message: '请选择所属单位'
                },
              ],
              initialValue:data === undefined ? "":data.companyId
            })(
              <Select
                placeholder="请选择单位"
                onChange={this.handleUnitChange}
              >
                {
                  companyListArray.map((item) => {
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

          <FormItem
            wrapperCol={{ span: 12, offset: 6 }}
          >
            <Button type="primary" htmlType="submit">提交</Button>
            <Button style={{ marginLeft: 20 }}><Link to='/planManage/securityTarget'>取消</Link></Button>
          </FormItem>
        </Form>

      </div>
    )
  }
}
const AddForm = Form.create()(PlanForm);


function mapStateToProps(state) {
  return {
    initState: state.securityPlan.initState,
    currentCompany: state.depManage.currentCompany,
    //公司列表
    companyListArray:state.depManage.companyListArray,
    //部门列表
    orgList:state.equipmentLedger.orgList,
    //当前公司
    currentCompany:state.depManage.currentCompany,
    //用户列表
    userList:state.userManage.userList,
    //父节点区域
    initSecurityPlan:state.securityPlan.initSecurityPlan,
  };
}

export default connect(mapStateToProps)(AddForm);
