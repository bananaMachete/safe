/* eslint-disable */
import {Component} from "react";
import {
  Form, Select, Input, Button,message,Divider ,TreeSelect,Table,Transfer,Tag
} from 'antd';
import { connect } from 'dva';
import Link from "umi/link";
import React from "react";
import difference from 'lodash/difference';

const FormItem = Form.Item;
const Option = Select.Option;
const { TextArea } = Input;

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
    item.title = item.className;
    item.value = item.id;
    item.key = item.id;
    if(item.children){
      combinationClassData(item.children);
    }
  });
  return array;
}
/**
 * @description 重组transfer数据
 * @param array
 * @returns {Array}
 */
function transferData(array) {
  const mockData = [];
  array.map((item) => {
    mockData.push({
      key: item.id,
      classCode: item.targetCode,
      className: item.targetName,
      tag: item.runCycleName,
    });
  });
  return mockData;
}

/**
 * @description 定义TableTransfer
 * @param leftColumns
 * @param rightColumns
 * @param restProps
 * @returns {*}
 * @constructor
 */
const TableTransfer = ({ leftColumns, rightColumns, ...restProps }) => (
  <Transfer {...restProps} showSelectAll={false}>
    {({
        direction,
        filteredItems,
        onItemSelectAll,
        onItemSelect,
        selectedKeys: listSelectedKeys,
        disabled: listDisabled,
      }) => {
      const columns = direction === 'left' ? leftColumns : rightColumns;

      const rowSelection = {
        getCheckboxProps: item => ({ disabled: listDisabled || item.disabled }),
        onSelectAll(selected, selectedRows) {
          const treeSelectedKeys = selectedRows
            .filter(item => !item.disabled)
            .map(({ key }) => key);
          const diffKeys = selected
            ? difference(treeSelectedKeys, listSelectedKeys)
            : difference(listSelectedKeys, treeSelectedKeys);
          onItemSelectAll(diffKeys, selected);
        },
        onSelect({ key }, selected) {
          onItemSelect(key, selected);
        },
        selectedRowKeys: listSelectedKeys,
      };

      return (
        <Table
          rowSelection={rowSelection}
          columns={columns}
          dataSource={filteredItems}
          size="small"
          style={{ pointerEvents: listDisabled ? 'none' : null }}
          onRow={({ key, disabled: itemDisabled }) => ({
            onClick: () => {
              if (itemDisabled || listDisabled) return;
              onItemSelect(key, !listSelectedKeys.includes(key));
            },
          })}
        />
      );
    }}
  </Transfer>
);


const leftTableColumns = [
  {
    dataIndex: 'classCode',
    title: '编码',
  },
  {
    dataIndex: 'tag',
    title: '周期',
    render: tag => <Tag>{tag}</Tag>,
  },
  {
    dataIndex: 'className',
    title: '名称',
  },
];
const rightTableColumns = [
  {
    dataIndex: 'classCode',
    title: '编码',
  },
  {
    dataIndex: 'tag',
    title: '周期',
    render: tag => <Tag>{tag}</Tag>,
  },
  {
    dataIndex: 'className',
    title: '名称',
  },
];

class ClassificationForm extends Component{
  state = {
    isAdd:this.props.location.state.isAdd,
    data:this.props.location.state.data,
    userList:[],
    initClassList:[],
    companyName:this.props.location.state.data === undefined ? '':this.props.location.state.data.companyName,
    parentProject:"",
    itemIds:'',
    //提交的
    inspection:[],
    //已绑定的
    initCheckItem:[],
    //所有的
    inspectionList:[],
    //显示在右侧框数据的 key 集合
    targetKeys: [],
  };
  columns = [
    {
      title: '指标编号',
      dataIndex: 'targetCode',
    },
    {
      title: '指标名称',
      dataIndex: 'targetName',
    },
    {
      title: '检查周期',
      dataIndex: 'runCycleName',
    },
    {
      title: '所属单位',
      dataIndex: 'companyName',
    },
    {
      title: '备注',
      dataIndex: 'remark',
    },
  ];
  onChange = nextTargetKeys => {
    this.setState({ targetKeys: nextTargetKeys });

  };

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        if (this.state.isAdd === 1){
          //新增
          const filedValues = {
            ...values,
            'companyName':this.state.companyName,
            'checkItemIds':this.state.targetKeys.join(","),//检查项的IDS
          };
          this.props.dispatch({
            type: 'classification/saveSmsClassInfo',
            payload: filedValues,
          }).then(() => {
            if (this.props.initState.code === 0) {
              message.success('新增成功！',1,() => this.props.history.push('/deviceManagement/classification'));
            } else {
              message.error('新增失败！');
            }
          });
        }else if(this.state.isAdd === 0){
          //修改
          const filedValues = {
            ...values,
            'id':this.state.data.id,
            'companyName':this.state.companyName,
            'checkItemIds':this.state.targetKeys.join(","),//检查项的IDS

          };
          this.props.dispatch({
            type: 'classification/updateSmsClassInfo',
            payload: filedValues,
          }).then(() => {
            if (this.props.initState.code === 0) {
              message.success('修改成功！',1,() => this.props.history.push('/deviceManagement/classification'));
            } else {
              message.error('修改失败！');
            }
          });
        }else if(this.state.isAdd === 2){
          //绑定
          const bindData = {
            'id':this.state.data.id,
            'checkItemIds':this.state.targetKeys.join(","),//检查项的IDS
          };
          this.props.dispatch({
            type: 'classification/bindInspectionTarget',
            payload: bindData,
          }).then(() => {
            if (this.props.initState.code === 0) {
              message.success('绑定成功！',1,() => this.props.history.push('/deviceManagement/classification'));
            } else {
              message.error('绑定失败！');
            }
          });
        }
      }
    });
  };

  componentDidMount() {
    this.props.dispatch({
      type: 'news/queryTypeList',
    });

    // 查询单位列表
    this.props.dispatch({
      type: 'depManage/queryCompanyListArray',
      payload: {
        name:'',
        pageNum:0
      },
    });
    //查分类信息
    this.props.dispatch({
      type: 'classification/querySmsClassList',
      payload:{
        className:'',
      }
    }).then(() => {
      const treeDate = this.props.initClassList;
      this.setState({
        initClassList:combinationClassData(treeDate),
      })
    });
    //非新增时查已绑定的项目initCheckItem。
    if(this.state.isAdd != 1){
      const equipmentClassId = this.state.data.id;
      this.props.dispatch({
        type: 'classification/queryBindTargets',
        payload: {
          equipmentClassId:equipmentClassId,
        },
      }).then(() => {
        //给右侧显示
        this.setState({
            targetKeys:transferData(this.props.initCheckItem)
        })
        let listKeys=[];
        for (let i=0;i<this.state.targetKeys.length;i++){
          listKeys.push(this.state.targetKeys[i].key)
        }
        this.setState({
          targetKeys:listKeys
        })
      });
    };
    //调用查询全部检查项的方法(根据公司ID)
    this.props.dispatch({
      type:'checkItem/queryInspectionTarget',
      payload:{
        planName:'',
        pageNum:'',
        equipmentClassId:'',
        targetCode:'',
        targetName:'',
      }
    }).then(() => {
      this.setState({
        inspectionList:transferData(this.props.inspectionTarget.content),
      })
    })
  };
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
      securityPersonLiableName:tag.props.children
    })
  }

  handleCancel = () => {
    this.setState({
      visible: false,
    });
  }
  //选择项目
  onProjectChange = (data,label) => {
    this.setState({
      parentProject:label[0]
    })
  }
  handleUnitChange = (value,option) => {
    this.setState({
      companyName:option.props.children
    });
    this.props.dispatch({
      type: 'depManage/getOrganizationsById',
      payload: {
        id:value
      },
    }).then(() => {
      const treeDate = this.props.initCompanyOrganizationsList;
      this.setState({
        treeData:combinationData(treeDate),
      })
    })
  }
  render() {
    const { data,targetKeys,inspectionList,initCheckItem}  = this.state;
    const { companyListArray } = this.props;
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 10 },
    };
    console.log(inspectionList)
    return (
      <div>
        <Form onSubmit={this.handleSubmit}>
          <FormItem
            {...formItemLayout}
            label="类型编号"
            hasFeedback
          >
            {getFieldDecorator('classCode', {
              rules: [{
                required: true,
                message: '请输入类型编号',
              }],
              initialValue:data === undefined ? "":data.classCode
            })(
              <Input placeholder="请输入类型编号" />
            )}
          </FormItem>

          <FormItem
            {...formItemLayout}
            label="类型名称"
            hasFeedback
          >
            {getFieldDecorator('className', {
              rules: [{
                required: true,
                message: '请输入类型名称',
              }],
              initialValue:data === undefined ? "":data.className
            })(
              <Input placeholder="请输入类型名称" />
            )}
          </FormItem>

          <FormItem
            {...formItemLayout}
            label="上级分类"
            hasFeedback
          >
            {getFieldDecorator('parentClass', {
              rules: [
                { required: false,
                  message: '请选择上级分类'
                },
              ],
              initialValue:data === undefined ? "":data.parentClass
            })(
              <TreeSelect
                //value={this.state.value}
                allowClear={true}
                dropdownStyle={{ maxHeight: 500, overflow: 'auto' }}
                treeData={this.state.initClassList}
                placeholder="请选择上级分类"
                onChange={this.onProjectChange}
                onSelect={this.onSelect}
              />
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
          <Divider>添加检查项</Divider>
          <FormItem>
            <TableTransfer
              dataSource={inspectionList}
              targetKeys= {targetKeys}
              showSearch={true}
              onChange={this.onChange}
              se
              filterOption={(inputValue, option) =>
                option.description.indexOf(inputValue) > -1
              }
              leftColumns={leftTableColumns}
              rightColumns={rightTableColumns}
            />
          </FormItem>
          <FormItem
            wrapperCol={{ span: 12, offset: 6 }}
          >
            <Button type="primary" htmlType="submit">提交</Button>
            <Button style={{ marginLeft: 20 }}><Link to='/deviceManagement/classification'>取消</Link></Button>
          </FormItem>
        </Form>
      </div>
    )
  }
}
const AddForm = Form.create()(ClassificationForm);


function mapStateToProps(state) {
  return {
    initState: state.classification.initState,
    //部门列表
    orgList:state.equipmentLedger.orgList,
    //当前公司
    currentCompany:state.depManage.currentCompany,
    //用户列表
    userList:state.userManage.userList,
    //设备分类
    initClassList:state.classification.initClassList,
    //公司列表
    companyListArray:state.depManage.companyListArray,
    //公司部门
    initCompanyOrganizationsList:state.depManage.initCompanyOrganizationsList,
    //全部检查项列表
    inspectionTarget: state.checkItem.inspectionTarget,
    //绑定的检查项列表
    initCheckItem:state.classification.initCheckItem,

  };
}

export default connect(mapStateToProps)(AddForm);
