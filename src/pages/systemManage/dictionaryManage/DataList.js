/* eslint-disable */
import React,{ Component } from "react";
import { Table, Divider, Button, Input, Modal, message, Avatar, Select, Form } from 'antd';
import { connect } from 'dva';
import Link from 'umi/link';

const Search = Input.Search;
const confirm = Modal.confirm;
const Option = Select.Option;
const FormItem = Form.Item;

function mapStateToProps(state) {
  return {
    dataList: state.dataManage.dataList,
    listLoading: state.loading.effects['dataManage/getDataList'],
    initState: state.dataManage.initState,
    dataTypeListAll: state.dataManage.dataTypeListAll,
  };
}

class DataList extends Component {
  state = {
    keyword:'',
    data:'',
    visible: false,
  }

  columns = [
    {
      title: '字段名称',
      dataIndex: 'name',
    },
    {
      title: '字段值',
      dataIndex: 'value',
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
      type: 'dataManage/getDataList',
      payload: {
        typeId:'',
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
          type: 'dataManage/deleteData',
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
  handleEditorInfo(data){
    this.props.dispatch({
      type: 'dataManage/getDataTypeListAll',
      payload: {
        name:'',
      },
    });
    this.setState({
      visible: true,
      isAdd:0,
      data:data
    });
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
  handleSearch(value){
    this.setState({keyword:value},() =>(
      this.props.dispatch({
        type: 'dataManage/getDataList',
        payload: {
          name:this.state.keyword,
          pageNum:0,
          typeId:'',
        },
      })
    ));
  }
  handleCancel = () => {
    this.setState({
      visible: false,
    });
  }

  handleBtnClick = () => {
    this.props.dispatch({
      type: 'dataManage/getDataTypeListAll',
      payload: {
        name:'',
      },
    });
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
          type: 'dataManage/saveData',
          payload: filedValues,
        }).then(() => {
          if (this.props.initState.code === 0) {
            this.setState({
              visible: false,
            });
            message.success('保存成功！');
            this.componentDidMount();
          } else {
            message.error("新增失败，" + this.props.initState.msg);
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
          type: 'dataManage/saveData',
          payload: filedValues,
        }).then(() => {
          if (this.props.initState.code === 0) {
            this.setState({
              visible: false,
            });
            message.success('修改成功！');
            this.componentDidMount();
          } else {
            message.error("修改失败，" + this.props.initState.msg);
            this.setState({
              visible: false,
            });
          }
        });
      })
    }
  }

  render() {
    const { dataList,dataTypeListAll,listLoading } = this.props;
    const { getFieldDecorator } = this.props.form;
    const { data } = this.state;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 10 },
    };
    return (
      <div>
        <div className="tr">
          <Button type="primary" className='add fl'  onClick={this.handleBtnClick}>新增</Button>
          <Search
            placeholder="输入关键字搜索"
            enterButton="搜索"
            size="default"
            style={{ width: 400,marginLeft:40 }}
            onSearch={this.handleSearch.bind(this)}
          />
          <Modal
            title="新增数据字典"
            visible={this.state.visible}
            onOk={this.submitData}
            onCancel={this.handleCancel}
            destroyOnClose={true}
            width={600}
            bodyStyle={{minHeight:200,overflow:'auto'}}
          >
            <Form>

              <FormItem
                {...formItemLayout}
                label="名称"
              >
                {getFieldDecorator('name', {
                  initialValue:data === '' ? '':data.name
                })(
                  <Input/>
                )}
              </FormItem>

              <FormItem
                {...formItemLayout}
                label="数据类型"
              >
                {getFieldDecorator('typeId', {
                  initialValue:data === '' ? '':data.typeId
                })(
                  <Select
                    placeholder="请选择数据类型"
                    onChange={this.handleUnitChange}
                  >
                    {
                      dataTypeListAll.map((item) => {
                        return (<Option key={item.id} value={item.id}>{item.name}</Option>)
                      })
                    }
                  </Select>
                )}
              </FormItem>

              <FormItem
                {...formItemLayout}
                label="值"
              >
                {getFieldDecorator('value', {
                  initialValue:data === '' ? '':data.value
                })(
                  <Input/>
                )}
              </FormItem>

            </Form>
          </Modal>
        </div>
        <Table
          style={{marginTop:20}}
          columns={this.columns}
          dataSource={dataList.content}
          loading={listLoading}
          rowKey="id"
          pagination={{  // 分页
            defaultCurrent: 1,
            pageSize:10,
            total: dataList.totalElements,
            onChange:this.changeSize,
          }}
        />
      </div>
    );
  }
}

const AddForm = Form.create()(DataList);
export default connect(mapStateToProps)(AddForm);


