/* eslint-disable */
import React,{ Component } from "react";
import { Table,Divider,Button,Input,Modal,message,Avatar,Select,Checkbox, Row,Form,TreeSelect } from 'antd';
import { connect } from 'dva';
import Link from 'umi/link';

const Search = Input.Search;
const confirm = Modal.confirm;
const Option = Select.Option;
const FormItem = Form.Item;
const { TextArea } = Input;

function mapStateToProps(state) {
  return {
    listLoading: state.loading.effects['depManage/getOrganizationsById'],
    initCompanyOrganizationsList: state.depManage.initCompanyOrganizationsList,
    initCompanyList: state.depManage.initCompanyList,
    currentCompany: state.depManage.currentCompany,
    initState: state.depManage.initState,
  };
}
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

//树形表格处理数据
function combinationTableData(array){
  array.map((item) => {
    if(item.children.length === 0){
      delete item.children;
    }else{
      combinationTableData(item.children);
    }
  });
  return array;
}

class List extends Component {
  state = {
    keyword:'',
    treeData:[],
    visible: false,
    value: undefined,
    companyId:'',
    tableData:[],
    data:{},
    id:'',
  }

  columns = [
    {
      title: '名称',
      dataIndex: 'name',
    },
    {
      title: '详情',
      dataIndex: 'details',
    },
    {
      title: '操作',
      width:210,
      render: (text, record) => (
        <span>
          <a onClick={this.handleDelete.bind(this,record)}>删除</a>
          <Divider type="vertical" />
          <a onClick={this.handleEditorInfo.bind(this,record)}>编辑</a>
        </span>
      ),
    }
  ];
  componentDidMount() {
    this.props.dispatch({
        type: 'depManage/getCurrentCompany',
        payload: {},
    }).then(() => {
      this.setState({
        companyId:this.props.currentCompany.id,
      })
      this.props.dispatch({
        type: 'depManage/getOrganizationsById',
        payload: {
          id:this.props.currentCompany.id
        },
      }).then(() => {
        const treeDate = this.props.initCompanyOrganizationsList;
        const baseData = [
          {
            title: '顶层菜单',
            value: 'top',
            key: 'top',
          }
        ]
        this.setState({
          treeData:baseData.concat(combinationData(treeDate)),
          tableData:combinationTableData(treeDate)
        })
      })
    })
  }

  handleDelete(data){
    const that = this;
    confirm({
      title: '确认删除该条数据',
      okText: '确认',
      okType: 'danger',
      cancelText: '取消',
      onOk(close) {
        that.props.dispatch({
          type: 'depManage/deleteOrganization',
          payload: data.id
        }).then(() => {
          if (that.props.initState.code === 0) {
            message.success('删除成功！');
            close();
            that.componentDidMount();
          } else {
            message.error(that.props.initState.msg);
            close();
          }
        })
      }
    })
  }
  handleEditorInfo(data){
    this.setState({
      visible: true,
      data:data,
      id:data.id
    });
  }
  handleCancel = () => {
    this.setState({
      visible: false,
    });
  }

  handleBtnClick = () => {
    this.setState({
      visible: true,
      data:{},
      id:''
    });
  }

  submitUserGroup = () => {
    this.props.form.validateFields((err, values) => {
      if(!err){
        if(values.parentOrganizationId === "top"){
          if(this.state.id){
            // 修改顶层组织机构
            delete values.parentOrganizationId;
            values.companyId = this.state.companyId;
            values.id = this.state.id;
            this.props.dispatch({
              type: 'depManage/updateOrganization',
              payload: values
            }).then(() => {
              if (this.props.initState.code === 0) {
                message.success('修改成功！');
                this.setState({
                  visible: false,
                });
                this.componentDidMount();
              } else {
                message.error('修改失败！请稍后再试或者联系管理员');
              }
            })
          }else{
            // 保存顶层组织机构
            delete values.parentOrganizationId;
            values.companyId = this.state.companyId;
            this.props.dispatch({
              type: 'depManage/saveOrganization',
              payload: values
            }).then(() => {
              if (this.props.initState.code === 0) {
                message.success('保存成功！');
                this.setState({
                  visible: false,
                });
                this.componentDidMount();
              } else {
                message.error('保存失败！请稍后再试或者联系管理员');
              }
            })
          }
        }else{
          if(this.state.id){
            // 修改组织结构
            values.companyId = this.state.companyId;
            values.id = this.state.id;
            this.props.dispatch({
              type: 'depManage/updateOrganization',
              payload: values
            }).then(() => {
              if (this.props.initState.code === 0) {
                message.success('修改成功！');
                this.setState({
                  visible: false,
                });
                this.componentDidMount();
              } else {
                message.error('修改失败！请稍后再试或者联系管理员');
              }
            })
          }else{
            // 保存组织结构
            values.companyId = this.state.companyId;
            this.props.dispatch({
              type: 'depManage/saveOrganization',
              payload: values
            }).then(() => {
              if (this.props.initState.code === 0) {
                message.success('保存成功！');
                this.setState({
                  visible: false,
                });
                this.componentDidMount();
              } else {
                message.error('保存失败！');
              }
            })
          }
        }
      }
    })
  }

  onChange = (value) => {
    if(value === "top"){
      this.setState({
        isCompany:true
      });
    }else{
      this.setState({
        isCompany:false
      });
    }
    this.setState({ value });
  }

  render() {
    const { partyMemberData,partyBranchPostList,partyPostList,partyOrganizationList,userGroupList } = {};
    const { listLoading } = this.props;
    const data = this.state.data;
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 16 },
    };
    return (
      <div>
        <div className="tr">
          <Button type="primary" className='add fl' onClick={this.handleBtnClick}>新增</Button>
          <Modal
            title="新增单位部门"
            visible={this.state.visible}
            onOk={this.submitUserGroup}
            onCancel={this.handleCancel}
            destroyOnClose={true}
            width={600}
            bodyStyle={{minHeight:200,overflow:'auto'}}
          >
            <Form onSubmit={this.handleSubmit}>

              <FormItem
                {...formItemLayout}
                label="上级菜单"
                hasFeedback
              >
                {getFieldDecorator('parentOrganizationId', {
                  rules: [
                    { required: true,
                      message: '请选择上级菜单'
                    },
                  ],
                  initialValue:data === null ? "":data.parentOrganizationId === null ? "top":data.parentOrganizationId
                })(
                  <TreeSelect
                    // value={this.state.value}
                    allowClear={true}
                    dropdownStyle={{ maxHeight: 500, overflow: 'auto' }}
                    treeData={this.state.treeData}
                    placeholder="请选择上级菜单"
                    onChange={this.onChange}
                  />
                )}
              </FormItem>

              <FormItem
                {...formItemLayout}
                label="名称"
              >
                {getFieldDecorator('name', {
                  rules: [
                    { required: true,
                      message: '请输入名称'
                    },
                  ],
                  initialValue:data === null ? "":data.name
                })(
                  <Input/>
                )}
              </FormItem>

              <FormItem
                {...formItemLayout}
                label="详情"
              >
                {getFieldDecorator('details', {
                  initialValue:data === null ? "":data.details
                })(
                  <TextArea rows={4} />
                )}
              </FormItem>

            </Form>
          </Modal>
        </div>
        <Table
          style={{marginTop:20}}
          columns={this.columns}
          dataSource={this.state.tableData}
          loading={listLoading}
          rowKey="id"
        />
      </div>
    );
  }
}
const AddForm = Form.create()(List);
export default connect(mapStateToProps)(AddForm);


