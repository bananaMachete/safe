/* eslint-disable */
import React,{ Component } from "react";
import { Table,Divider,Button,Input,Modal,message,Avatar,Select,Checkbox, Row,Col,Tag } from 'antd';
import { connect } from 'dva';
import Link from 'umi/link';

const Search = Input.Search;
const confirm = Modal.confirm;
const Option = Select.Option;

function mapStateToProps(state) {
  return {
    userList: state.userManage.userList,
    listLoading: state.loading.effects['userManage/getUserList'],
    initState: state.userManage.initState,
    initBindRoles: state.userManage.initBindRoles,
    initRolesList: state.userManage.initRolesList,
  };
}

class List extends Component {
  state = {
    keyword:'',
    userRoles:[],
    userId:'',
    visible: false,
    username:'',
    name:'',
  }

  columns = [
    {
      title: '头像',
      dataIndex: 'imgHref',
      render:(text) => {
        const url = 'http://192.168.1.19'+text;
        return <Avatar src={url} shape='square' size={48} />
      }
    },
    {
      title: '姓名',
      dataIndex: 'name',
      render: (text, record) => (
        <a onClick={this.handleDetails.bind(this,record)}>{text}</a>

      ),
    },
    {
      title: '职位',
      dataIndex: 'position',
    },
    {
      title: '岗位',
      dataIndex: 'post',
    },
    {
      title: '所在部门',
      dataIndex: 'organizationName',
    },
    {
      title: '联系电话',
      dataIndex: 'phoneNum',
    },
    {
      title: '状态',
      dataIndex: 'enable',
      render:(text) => {
        return text === true ? ( <Tag color="green">已启用</Tag>):(<Tag color="red">已禁用</Tag>)
      }
    },
    {
      title: '操作',
      width:210,
      render: (text, record) => (
        <span>
          <a onClick={this.handleDelete.bind(this,record)}>删除</a>
          <Divider type="vertical" />
          <a onClick={this.handleEditorInfo.bind(this,record)}>编辑</a>
          <Divider type="vertical" />
          <a onClick={this.handleAuthority.bind(this,record)}>权限</a>
        </span>
      ),
    }
  ];
  componentDidMount() {
    this.props.dispatch({
      type: 'userManage/getUserList',
      payload: {
        username:'',
        name:'',
        pageNum:'',
      },
    });
  }

  handleAuthority(data){
    this.setState({
      visible: true,
      userId:data.id,
    });
    this.props.dispatch({
      type: 'userManage/getRolesList',
      payload: {
        code:'',
        name:'',
      }
    });
    this.props.dispatch({
      type: 'userManage/getBindRoles',
      payload:data.id
    }).then(() => {
      const arr = [];
      this.props.initBindRoles.map((item) => {
        arr.push(item.id);
      })
      this.setState({userRoles:arr})
    })
  }

  submitUserGroup = () => {
    const id = this.state.userId;
    const userRoles = this.state.userRoles
    this.props.dispatch({
      type: 'userManage/bindRoles',
      payload: {
        userId:id,
        roleIds:userRoles.join(',')
      }
    }).then(() => {
      if (this.props.initState.code === 0) {
        message.success('保存成功！');
        this.setState({
          visible: false,
        });
      } else {
        message.error('保存失败！');
      }
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
          type: 'userManage/deleteUser',
          payload: data.id
        }).then(() => {
          if (that.props.initState.code === 0) {
            message.success('删除成功！');
            close();
            that.componentDidMount();
          } else {
            message.error('删除失败！请稍后重试');
            close();
          }
        })
      }
    })
  }
  //编辑功能
  handleEditorInfo(data){
    this.props.history.push({ pathname: '/systemManage/userManage/add', state: { isAdd:0,data:data } })
  }
  //查看用户信息
  handleDetails(data){
    this.props.history.push({ pathname: '/systemManage/userManage/details', state: {userId:data.id} })
  }

  changeSize = (page) => {
    this.props.dispatch({
      type: 'userManage/getUserList',
      payload: {
        username:this.state.username,
        name:this.state.name,
        pageNum:page-1,
      },
    });
  }
  handleUserNameSearch(value){
    this.setState({username:value},() =>(
      this.props.dispatch({
        type: 'userManage/getUserList',
        payload: {
          username:this.state.username,
          name:this.state.name,
          pageNum:0,
        },
      })
    ));
  }
  handleNameSearch(value){
    this.setState({name:value},() =>(
      this.props.dispatch({
        type: 'userManage/getUserList',
        payload: {
          username:this.state.username,
          name:this.state.name,
          pageNum:0,
        },
      })
    ));
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

  render() {
    const { userList,listLoading,initRolesList } = this.props;
    return (
      <div>
        <div className="tr">
          <Button type="primary" className='add fl'><Link to={{pathname:'/systemManage/userManage/add',state:{isAdd:1}}}>新增</Link></Button>
          <Search
            placeholder="输入用户名搜索"
            enterButton="搜索"
            size="default"
            style={{ width: 400,marginLeft:40 }}
            onSearch={this.handleUserNameSearch.bind(this)}
          />
          <Modal
            title="设置角色权限"
            visible={this.state.visible}
            onOk={this.submitUserGroup}
            onCancel={this.handleCancel}
            destroyOnClose={true}
            width={600}
            bodyStyle={{minHeight:200,overflow:'auto'}}
          >
            <Checkbox.Group style={{ width: "100%" }} onChange={this.onChange} value={this.state.userRoles}>
              <Row>
                {
                  initRolesList.map(item => {
                    return (<Col key={item.id} span={12}><Checkbox value={item.id}>{item.name}</Checkbox></Col>)
                  })
                }
              </Row>
            </Checkbox.Group>
          </Modal>
        </div>
        <Table
          style={{marginTop:20}}
          columns={this.columns}
          dataSource={userList.content}
          loading={listLoading}
          rowKey="id"
          pagination={{  // 分页
            defaultCurrent: 1,
            pageSize:10,
            total: userList.totalElements,
            onChange:this.changeSize,
          }}
        />
      </div>
    );
  }
}

export default connect(mapStateToProps)(List);


