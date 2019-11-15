/* eslint-disable */
import React,{ Component } from "react";
import { Table,Divider,Button,Input,Modal,message,Avatar,Select,Checkbox, Row } from 'antd';
import { connect } from 'dva';
import Link from 'umi/link';

const confirm = Modal.confirm;

function mapStateToProps(state) {
  return {
    initCompanyList: state.depManage.initCompanyList,
    initState: state.depManage.initState,
    listLoading: state.loading.effects['depManage/queryCompanyList'],

  };
}

class List extends Component {
  state = {
    keyword:'',
    userRoles:[],
    userId:'',
  }

  columns = [
    {
      title: '图标',
      dataIndex: 'icon',
    },
    {
      title: '名称',
      dataIndex: 'name',
    },
    {
      title: '编号',
      dataIndex: 'code',
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
      type: 'depManage/queryCompanyList',
      payload: {
        name:'',
        pageNum:0
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
          type: 'depManage/deleteCompany',
          payload: data.id
        }).then(() => {
          if (that.props.initState.code === 0) {
            message.success('删除成功！');
            close();
            that.props.dispatch({
              type: 'depManage/queryCompanyList',
              payload: {
                name:'',
                pageNum:0
              },
            });
          } else {
            message.error('删除失败！请稍后重试');
            close();
          }
        })
      }
    })
  }
  handleEditorInfo(data){
    this.props.history.push({ pathname: '/systemManage/unitManage/add', state: { isAdd:0,data:data } })
  }
  changeSize = (page) => {
    this.props.dispatch({
      type: 'depManage/queryCompanyList',
      payload: {
        name:this.state.keyword,
        pageNum:page-1,
      },
    });
  }
  handleSearch(value){
    this.setState({keyword:value},() =>(
      this.props.dispatch({
        type: 'partyMemberInfo/queryPartyMemberList',
        payload: {partyName:this.state.keyword},
      })
    ));
  }

  render() {
    const { initCompanyList,listLoading } = this.props;
    return (
      <div>
        <div className="tr">
          <Button type="primary" className='add fl'><Link to={{pathname:'/systemManage/unitManage/add',state:{isAdd:1}}}>新增</Link></Button>
        </div>
        <Table
          style={{marginTop:20}}
          columns={this.columns}
          dataSource={initCompanyList.content}
          loading={listLoading}
          rowKey="id"
          pagination={{  // 分页
            defaultCurrent: 1,
            pageSize:10,
            total: initCompanyList.totalElements,
            onChange:this.changeSize,
          }}
        />
      </div>
    );
  }
}

export default connect(mapStateToProps)(List);


