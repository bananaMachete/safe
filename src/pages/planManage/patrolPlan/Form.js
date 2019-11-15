/* eslint-disable */
import {Component} from "react";
import {Form, Select, Input, Button, DatePicker, message, Radio, Icon, TreeSelect, Tree, Divider, Transfer } from 'antd';
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


/**
 * @author stephen
 * @description 处理树形项目数据
 * @param array
 * @returns {*}
 */
function combinationData(array){
  array.map((item) => {
    item.key = item.id;
    item.title = item.name;
    item.value = item.id;
    if(item.children){
      combinationData(item.children);
    }
  });
  return array;
}

/**
 * @author stephen
 * @description 处理树形项目数据
 * @param array
 * @returns {*}
 */
function combinationClassData(array){
  const mockData = [];
  array.map((item) => {
    if(item.children){
      mockData.push({
        key: item.id,
        value: item.id,
        title: item.className,
        children: combinationClassData(item.children)
      })
    }else {
      mockData.push({
        key: item.id,
        value: item.id,
        title: item.className,
      })
    }
  });
  return mockData;
}
/**
 * @description stephen
 * @param n
 * @returns {string}
 */
function pad2(n) {
  return n < 10 ? '0' + n : n
}

/**
 * @author Stephen
 * @description 定义TableTransfer
 * @param leftColumns
 * @param rightColumns
 * @param restProps
 * @returns {*}
 * @constructor
 */
const { TreeNode } = Tree;

// Customize Table Transfer
const isChecked = (selectedKeys, eventKey) => {
  return selectedKeys.indexOf(eventKey) !== -1;
};

const generateTree = (treeNodes = [], checkedKeys = []) => {
  return treeNodes.map(({ children, ...props }) => (
    <TreeNode {...props} disabled={checkedKeys.includes(props.key)} key={props.key}>
      {generateTree(children, checkedKeys)}
    </TreeNode>
  ));
};

const TreeTransfer = ({ dataSource, targetKeys, ...restProps }) => {
  const transferDataSource = [];
  function flatten(list = []) {
    list.forEach(item => {
      transferDataSource.push(item);
      flatten(item.children);
    });
  }
  flatten(dataSource);

  return (
    <Transfer
      {...restProps}
      targetKeys={targetKeys}
      dataSource={transferDataSource}
      className="tree-transfer"
      render={item => item.title}
      showSelectAll={false}
    >
      {({ direction, onItemSelect, selectedKeys }) => {
        if (direction === 'left') {
          const checkedKeys = [...selectedKeys, ...targetKeys];
          return (
            <Tree
              blockNode
              checkable
              checkStrictly
              defaultExpandAll
              checkedKeys={checkedKeys}
              onCheck={(
                _,
                {
                  node: {
                    props: { eventKey },
                  },
                },
              ) => {
                onItemSelect(eventKey, !isChecked(checkedKeys, eventKey));
              }}
              onSelect={(
                _,
                {
                  node: {
                    props: { eventKey },
                  },
                },
              ) => {
                onItemSelect(eventKey, !isChecked(checkedKeys, eventKey));
              }}
            >
              {generateTree(dataSource, targetKeys)}
            </Tree>
          );
        }
      }}
    </Transfer>
  );
};
class PlanForm extends Component{
  state = {
    isAdd:this.props.location.state.isAdd,
    data:this.props.location.state.data,
    companyId:'',
    companyName:'',
    currentCompany:{},
    visible: false,
    userList:[],
    personLiableName:'',
    organizationName:this.props.location.state.data === undefined ? '':this.props.location.state.data.organizationName,
    //设备IDS
    equipmentIds:'',
    //显示在右侧框数据的 key 集合
    targetKeys: [],
    //设备分类
    initClassList:[
      {
        key: '0-1',
        title: '0-1',
        children: [{ key: '0-1-0', title: '0-1-0' }, { key: '0-1-1', title: '0-1-1' }],
      }
    ],
    //已经选择的设备分类
    initEquipmentList:[]
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
      title:'位置',
      dataIndex:'installArea',
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
            'personLiableName':this.state.personLiableName,
            'organizationName':this.state.organizationName,//责任部门
            'beginDate':values['beginDate'].format('YYYY-MM-DD'),
            'endDate':values['endDate'].format('YYYY-MM-DD'),
            'equipmentIds':this.state.targetKeys.join(","),//设备IDS
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
            'personLiableName':this.state.personLiableName,
            'organizationName':this.state.organizationName,//责任部门
            'equipmentIds':this.state.targetKeys.join(","),//设备IDS
            'beginDate':values['beginDate'].format('YYYY-MM-DD'),
            'endDate':values['endDate'].format('YYYY-MM-DD'),
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
    //查询所有的检查系统
    this.props.dispatch({
      type: 'classification/querySmsClassList',
      payload: {
        className:'',
      },
    }).then(() => {
      this.setState({
        initClassList:combinationClassData(this.props.initClassList),
      })
    })

    // 查询单位列表
    this.props.dispatch({
      type: 'depManage/getCurrentCompany',
      payload: {},
    }).then(() => {
      this.setState({
        currentCompany:this.props.currentCompany,
      })
      //查部门
      this.props.dispatch({
        type: 'equipmentLedger/getOrganization',
        payload:{
          id:this.state.currentCompany.id
        }
      }).then(() => {
        const treeDate = this.props.orgList;
        this.setState({
          orgList:combinationData(treeDate),
        })
      })
    })

    //查已绑定的设备列表
    if (this.state.isAdd === 0){
      //编辑,查询已分类的
      this.props.dispatch({
        type: 'equipmentLedger/getEquipmentClassListByPlanId',
        payload: {
          planId:this.state.data.id,
        },
      }).then(()=>{
        const data = this.props.initEquipmentList;
        const list=[];
        for (let i=0;i<data.length;i++){
          list.push(data[i].equipmentClassId)
        }
        this.setState({
          targetKeys:list,
        })
      })
    }
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

  handleCancel = () => {
    this.setState({
      visible: false,
    });
  }
  /**
   *
   * @author Stephen
   * @description 生成随机数
   *
   */
  handleGenerateNo = () => {
    const d = new Date();
    const number = d.getFullYear().toString() + pad2(d.getMonth() + 1) + pad2(d.getDate()) + pad2(d.getHours()) + pad2(d.getMinutes()) ;
    const result = number + Math.floor(Math.random() * 900) + 100;
    return result;
  }
  onChange = targetKeys => {
    console.log('Target Keys:', targetKeys);
    this.setState({ targetKeys });
  };
  render() {
    const { data,userList,targetKeys }  = this.state;
    const { getFieldDecorator } = this.props.form;
    const planNo = this.handleGenerateNo();

    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 10 },
    };
    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        this.setState({
          equipmentIds:selectedRowKeys
        })
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
              initialValue:data === undefined ? planNo:data.planCode
            })(
              <Input placeholder="请输入计划编号" disabled={true} prefix={<Icon type="lock" />}/>
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
                message: '请输入计划名称'
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
            label="开始日期"
          >
            {getFieldDecorator('beginDate', {
              rules: [{ type: 'object', required: true, message: '开始日期不能为空！' }],
              initialValue:data === undefined ?null:moment(data.beginDate)
            })(
              <DatePicker showTime format="YYYY-MM-DD" />
            )}
          </FormItem>

          <FormItem
            {...formItemLayout}
            label="结束日期"
          >
            {getFieldDecorator('endDate', {
              rules: [{ type: 'object', required: true, message: '结束日期不能为空！' }],
              initialValue:data === undefined ?null:moment(data.endDate)
            })(
              <DatePicker showTime format="YYYY-MM-DD" />
            )}
          </FormItem>

          <FormItem
            {...formItemLayout}
            label="完成率"
            hasFeedback
          >
            {getFieldDecorator('planRatio', {
              rules: [{
                required: false,
              }],
              initialValue:data === undefined ? "":data.planRatio
            })(
              <Input placeholder="完成率" />
            )}
          </FormItem>

          <FormItem
            {...formItemLayout}
            label="执行部门"
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
            label="执行人"
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
          <Divider>检测内容</Divider>
          <FormItem>
            <TreeTransfer dataSource={this.state.initClassList} targetKeys={targetKeys} onChange={this.onChange} />
          </FormItem>
          <FormItem
            wrapperCol={{ span: 12, offset: 6 }}
          >
            <Button type="primary" htmlType="submit">提交</Button>
            <Button style={{ marginLeft: 20 }}><Link to='/planManage/patrolPlan'>取消</Link></Button>
          </FormItem>
        </Form>
      </div>
    )
  }
}
const AddForm = Form.create()(PlanForm);


function mapStateToProps(state) {
  return {
    initState: state.patrolPlan.initState,
    //设备分类列表
    initClassList:state.classification.initClassList,
    //部门列表
    orgList:state.equipmentLedger.orgList,
    //当前公司
    currentCompany:state.depManage.currentCompany,
    //用户列表
    userList:state.userManage.userList,
    //已经绑定的系统
    initEquipmentList:state.equipmentLedger.initEquipmentList,
  };
}

export default connect(mapStateToProps)(AddForm);
