/* eslint-disable */
import React,{ Component } from "react";
import { Table,Divider,Button,Input,Modal,message,Form,Checkbox, Row } from 'antd';
import { connect } from 'dva';
import Link from 'umi/link';

const confirm = Modal.confirm;
const FormItem = Form.Item;

function mapStateToProps(state) {
  return {
    initRoleList: state.roleManage.initRoleList,
    initState: state.roleManage.initState,
    listLoading: state.loading.effects['roleManage/getRoleList'],

  };
}

class List extends Component {
  state = {
    isAdd:1,
    data:'',
    userRoles:[],
    userId:'',
    visible: false,
  }

  columns = [
    {
      title: '编号',
      dataIndex: 'code',
    },
    {
      title: '角色',
      dataIndex: 'name',
    },
    {
      title: '操作',
      width:210,
      render: (text, record) => (
        <span>
          <a onClick={this.handleUserGroup.bind(this,record)}>用户组</a>
          <Divider type="vertical" />
          <a onClick={this.handleDelete.bind(this,record)}>删除</a>
          <Divider type="vertical" />
          <a onClick={this.handleEditorInfo.bind(this,record)}>编辑</a>
          <Divider type="vertical" />
          {
            record.delFlag === '2'?<a onClick={this.handleAuditing.bind(this,record)}>锁定</a >:<a disabled onClick={this.handleAuditing.bind(this,record)}>解锁</a >
          }
        </span>
      ),
    }
  ];
  componentDidMount() {
    this.props.dispatch({
      type: 'roleManage/getRoleList',
      payload: {
        code:'',
        name:'',
        pageNum:0,
      },
    });
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
          type: 'roleManage/deleteRole',
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
      isAdd:0
    });
  }
  handleUserGroup(data){
    this.setState({
      visible: true,
      userId:data.id
    });
    this.props.dispatch({
      type: 'partyMemberInfo/getUserGroupList',
    });
    this.props.dispatch({
      type: 'partyMemberInfo/getUserRoles',
      payload:{
        id:data.id
      }
    }).then(() => {
      this.setState({userRoles:this.props.userRoles})
    })
  }
  handleAuditing(data) {
    const that = this;
    confirm({
      title: '审核通过',
      okText: '确认',
      okType: 'danger',
      cancelText: '取消',
      onOk(close) {
        that.props.dispatch({
          type: 'comment/auditingComment',
          payload: data.id
        }).then(() => {
          if (that.props.auditingState.code === 0) {
            message.success('审核成功！');
            close();
            that.props.dispatch({
              type: 'comment/queryList',
              payload: {
                keyword:that.state.keyword,
              },
            });
          } else {
            message.error('审核失败！请稍后重试');
            close();
          }
        })
      }
    })
  }
  changeSize = (page) => {
    this.props.dispatch({
      type: 'partyMemberInfo/queryPartyMemberList',
      payload: {
        partyName:this.state.keyword,
        pageNum:page-1,
      },
    });
  }
  handleCancel = () => {
    this.setState({
      visible: false,
    });
  }

  onChange = (checkedValues) => {
    this.setState({
      userRoles:checkedValues
    })
  }

  addRole = () =>{
    this.setState({
      visible: true,
      isAdd:1,
      data:''
    });
  }

  submitData = () => {
    if(this.state.isAdd === 1){
      this.props.form.validateFields((err, values) => {
        const filedValues = {
          ...values,
        };
        this.props.dispatch({
          type: 'roleManage/saveRole',
          payload: filedValues,
        }).then(() => {
          if (this.props.initState.code === 0) {
            this.setState({
              visible: false,
            });
            message.success('保存成功！');
            this.componentDidMount();
          } else {
            message.error(this.props.initState.msg);
            this.setState({
              visible: false,
            });
          }
        });
      })
    }else{
      this.props.form.validateFields((err, values) => {
        const filedValues = {
          ...values,
          id:this.state.data.id
        };
        this.props.dispatch({
          type: 'roleManage/updateRole',
          payload: filedValues,
        }).then(() => {
          if (this.props.initState.code === 0) {
            this.setState({
              visible: false,
            });
            message.success('修改成功！');
            this.componentDidMount();
          } else {
            message.error(this.props.initState.msg);
            this.setState({
              visible: false,
            });
          }
        });
      })
    }

  }
  render() {
    const { initRoleList,listLoading } = this.props;
    const { data } = this.state;
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 10 },
    };
    return (
      <div>
        <div className="tr">
          <Button type="primary" className='add fl' onClick={this.addRole}>新增</Button>
          <Modal
            title="新增角色"
            visible={this.state.visible}
            onOk={this.submitData}
            onCancel={this.handleCancel}
            destroyOnClose={true}
            width={600}
            bodyStyle={{minHeight:200,overflow:'auto'}}
          >
            <Form onSubmit={this.handleSubmit}>
              <FormItem
                {...formItemLayout}
                label="编号"
              >
                {getFieldDecorator('code', {
                  rules: [{
                    required: true,
                    message: '请输入编号',
                  }],
                  initialValue:data === '' ? '':data.code
                })(
                  <Input/>
                )}
              </FormItem>

              <FormItem
                {...formItemLayout}
                label="名称"
              >
                {getFieldDecorator('name', {
                  rules: [{
                    required: true,
                    message: '请输入名称',
                  }],
                  initialValue:data === '' ? '':data.name
                })(
                  <Input/>
                )}
              </FormItem>
            </Form>
          </Modal>
          {/*<Modal*/}
            {/*title="设置用户组"*/}
            {/*visible={this.state.visible}*/}
            {/*onOk={this.submitUserGroup}*/}
            {/*onCancel={this.handleCancel}*/}
            {/*destroyOnClose={true}*/}
            {/*width={600}*/}
            {/*bodyStyle={{minHeight:200,overflow:'auto'}}*/}
          {/*>*/}
            {/*<Checkbox.Group style={{ width: "100%" }} onChange={this.onChange} value={this.state.userRoles}>*/}
              {/*<Row>*/}
                {/*/!*{*!/*/}
                  {/*/!*userGroupList.map(item => {*!/*/}
                    {/*/!*return (<Col key={item.id} span={12}><Checkbox value={item.id}>{item.name}</Checkbox></Col>)*!/*/}
                  {/*/!*})*!/*/}
                {/*}*/}
              {/*</Row>*/}
            {/*</Checkbox.Group>*/}
          {/*</Modal>*/}
        </div>
        <Table
          style={{marginTop:20}}
          columns={this.columns}
          dataSource={initRoleList.content}
          loading={listLoading}
          rowKey="id"
          pagination={{  // 分页
            defaultCurrent: 1,
            pageSize:10,
            total: initRoleList.totalElements,
            onChange:this.changeSize,
          }}
        />
      </div>
    );
  }
}

const AddForm = Form.create()(List);
export default connect(mapStateToProps)(AddForm);


