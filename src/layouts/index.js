/* eslint-disable */
import { Component } from 'react';
import { Layout, Menu, Icon,LocaleProvider,Dropdown,Avatar,Tag } from 'antd';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import NoticeIcon from '../components/NoticeIcon';
import '../components/NoticeIcon/ant-design-pro.css';
import Link from 'umi/link';
import moment from 'moment';
import groupBy from 'lodash/groupBy';
import myStyles from './index.less';
import 'moment/locale/zh-cn';
import {delCookie, getCookie} from "../util/auth";
import { connect } from 'dva';

const { Header, Footer, Sider, Content } = Layout;

// 引入子菜单组件
const SubMenu = Menu.SubMenu;

function onItemClick(item, tabProps) {
  console.log(item, tabProps);
}

function onClear(tabTitle) {
  console.log(tabTitle);
}

function getNoticeData(notices) {
  if (notices.length === 0) {
    return {};
  }
  const newNotices = notices.map((notice) => {
    const newNotice = { ...notice };
    if (newNotice.datetime) {
      newNotice.datetime = moment(notice.datetime).fromNow();
    }
    // transform id to item key
    if (newNotice.id) {
      newNotice.key = newNotice.id;
    }
    if (newNotice.extra && newNotice.status) {
      const color = ({
        todo: '',
        processing: 'blue',
        urgent: 'red',
        doing: 'gold',
      })[newNotice.status];
      newNotice.extra = <Tag color={color} style={{ marginRight: 0 }}>{newNotice.extra}</Tag>;
    }
    return newNotice;
  });
  return groupBy(newNotices, 'type');
}


class BasicLayout extends Component {
  state = {
    noticeData:[],
    timer:null,
  }

  logout(){
    delCookie('userName');
    delCookie(getCookie('userName'));
    this.props.history.push('/login')
  }

  componentDidMount() {
    this.props.dispatch({
      type: 'loginSpace/getLoginUser',
    }).then(() => {
      //查通知和待办
      this.props.dispatch({
        type: 'noticeMessage/queryNoticeMessageListByUserId',
        payload: {
          userId:this.props.loginUser.id,
          pageNum:0,
        },
      }).then(() => {
        const NoticeMessageList = this.props.initNoticeMessageList.content;
        const noticeData = [];
        NoticeMessageList.map((item) => {
          const noticeItem = {};
          if(!item.readFlag){
            noticeItem.id = item.id;
            noticeItem.title = item.noticeMessage.title;
            noticeItem.type = '通知';
            noticeItem.datetime = moment(item.createDate).format('YYYY-MM-DD');
            noticeData.push(noticeItem)
          }
        });
        this.setState({
          noticeData:noticeData
        })
      })
    })

    this.state.timer=setInterval(()=>{


    }, 3000)
  }
  componentWillUnmount(){
    clearInterval(this.state.timer);
  }

  render() {

    const noticeData = getNoticeData(this.state.noticeData);

    const menu = (
      <Menu className={myStyles.menu} selectedKeys={[]}>
        <Menu.Item key="logout" onClick={this.logout.bind(this)}>
          <Icon type="logout" />退出登录
        </Menu.Item>
      </Menu>
    );
    return (
      <LocaleProvider locale={zh_CN}>
        <Layout>
          <Sider width={256} style={{ minHeight: '100vh' }}>
            <div style={{ height: '32px', color:'#ffffff', margin: '16px',fontSize:'22px'}}><Icon type="safety-certificate" />消防维保管理平台</div>
            <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
              <Menu.Item key="2">
                <Icon type="home" />
                <Link to="/index" style={{display: "inline"}}>首页</Link>
              </Menu.Item>
              <Menu.Item key="3">
                <Icon type="fund" />
                <Link to={{pathname:"/worktable",state:this.props.loginUser.username}} style={{display: "inline"}}>工作台 </Link>
              </Menu.Item>
              <Menu.Item key="7">
                <Icon type="message" />
                <Link to="/noticeMessage/Message" style={{display: "inline"}}>消息中心</Link></Menu.Item>
              <SubMenu
                key="sub1"
                title={<span><Icon type="tool" /><span>设备设施</span></span>}>
                <Menu.Item key="4"><Link to="/deviceManagement/area">区域管理</Link></Menu.Item>
                <Menu.Item key="8"><a href="http://188.131.165.6" target="_blank">标注工具</a></Menu.Item>
                <Menu.Item key="5"><Link to="/deviceManagement/classification">设备分类</Link></Menu.Item>
                <Menu.Item key="6"><Link to="/deviceManagement/equipmentLedger">设备台账</Link></Menu.Item>
              </SubMenu>
              <SubMenu
                key="sub3"
                title={<span><Icon type="profile" /><span>计划管理</span></span>}
              >
                <Menu.Item key="20"><Link to="/planManage/securityTarget">安全目标</Link></Menu.Item>
                <Menu.Item key="21"><Link to="/planManage/checkItem">检查标准</Link></Menu.Item>
                <Menu.Item key="22"><Link to="/planManage/securityPlan">安全计划</Link></Menu.Item>
                <Menu.Item key="23"><Link to="/planManage/patrolPlan">检查计划</Link></Menu.Item>
                <Menu.Item key="24"><Link to="/planManage/planTrace">计划追踪</Link></Menu.Item>
              </SubMenu>
              <SubMenu
                key="sub4"
                title={<span><Icon type="fund" theme="filled" /><span>隐患管理</span></span>}
              >
                <Menu.Item key="42"><Link to={{pathname:'/dangerManage/DangerManage',style:{display: "inline"}}}>隐患上报</Link></Menu.Item>
                <Menu.Item key="43"><Link to={{pathname:'/dangerManage/dangerManage/repairList',style:{display: "inline"}}}>隐患整改</Link></Menu.Item>
                <Menu.Item key="44"><Link to={{pathname:'/dangerManage/dangerManage/reviewList',style:{display: "inline"}}}>隐患复查</Link></Menu.Item>
              </SubMenu>
              <SubMenu
                key="sub5"
                title={<span><Icon type="safety-certificate" theme="filled"  /><span>维保单位</span></span>}
              >
                <Menu.Item key="51"><Link to="/maintenance/Maintenance" style={{display: "inline"}}>维保单位</Link></Menu.Item>
                <Menu.Item key="52"><Link to="/staff/Staff" style={{display: "inline"}}>维保人员</Link></Menu.Item>
                <Menu.Item key="53"><Link to="/contract/Contract" style={{display: "inline"}}>维保合同</Link></Menu.Item>
                <Menu.Item key="54"><Link to="/planManage/patrolPlan" style={{display: "inline"}}>维保计划</Link></Menu.Item>
                <Menu.Item key="55"><Link to="/report/Report" style={{display: "inline"}}>维保报告</Link></Menu.Item>
              </SubMenu>
              <SubMenu
                key="sub6"
                title={<span><Icon type="snippets" theme="filled"  /><span>客户管理</span></span>}
              >
                <Menu.Item key="61"><Link to="/customer/Customer" style={{display: "inline"}}>客户单位</Link></Menu.Item>
                <Menu.Item key="62"><Link to="/customer/Customer" style={{display: "inline"}}>项目管理</Link></Menu.Item>
                <Menu.Item key="63"><Link to="/contract/Contract" style={{display: "inline"}}>合同管理</Link></Menu.Item>
                <Menu.Item key="64"><Link to="/planManage/patrolPlan" style={{display: "inline"}}>计划管理</Link></Menu.Item>
                <Menu.Item key="65"><Link to="/report/Report" style={{display: "inline"}}>报告管理</Link></Menu.Item>
              </SubMenu>
              <SubMenu
                key="sub7"
                title={<span><Icon type="fire" theme="filled"  /><span>培训管理</span></span>}
              >
                <Menu.Item key="71"><Link to="/train/Train" style={{display: "inline"}}>消防培训</Link></Menu.Item>
              </SubMenu>
              <SubMenu
                key="sub2"
                title={<span><Icon type="setting" /><span>系统管理</span></span>}
              >
                <Menu.Item key="13"><Link to="/systemManage/userManage">用户管理</Link></Menu.Item>
                <Menu.Item key="14"><Link to="/systemManage/roleManage">角色管理</Link></Menu.Item>
                <Menu.Item key="15"><Link to="/systemManage/unitManage">单位管理</Link></Menu.Item>
                <Menu.Item key="5"><Link to="/systemManage/depManage">部门管理</Link></Menu.Item>
                <Menu.Item key="6"><Link to="/systemManage/dictionaryManage/dataList">数据字典</Link></Menu.Item>
                <Menu.Item key="7"><Link to="/systemManage/userManage">行为日志</Link></Menu.Item>
              </SubMenu>
            </Menu>
          </Sider>
          <Layout >
            <Header style={{ background: '#fff', textAlign: 'center', padding: 0 }}>
              <div className={myStyles.right}>
                <NoticeIcon
                  className="notice-icon"
                  count={this.state.noticeData.length}
                  onItemClick={onItemClick}
                  onClear={onClear}
                  popupAlign={{ offset: [24, -16] }}
                >
                  <NoticeIcon.Tab
                    list={noticeData['通知']}
                    title="通知"
                    emptyText="你已查看所有通知"
                    emptyImage="https://gw.alipayobjects.com/zos/rmsportal/wAhyIChODzsoKIOBHcBk.svg"
                  />
                </NoticeIcon>
                <Dropdown overlay={menu}>
                <span className={`${myStyles.action} ${myStyles.account}`}>
                  <Avatar size="default" shape="square" className={myStyles.avatar} src={ "http://192.168.1.19" + this.props.loginUser.imgHref} />
                  <span className={myStyles.name}>{this.props.loginUser.username}</span>
                </span>
                </Dropdown>
              </div>
            </Header>
            <Content style={{ margin: '24px 12px 0' }}>
              <div className={myStyles.colorblack}>
                <div className={myStyles.context}>
                  {this.props.children}
                </div>
              </div>
            </Content>
            <Footer style={{ textAlign: 'center' }}>Diconet Company ©2018 Created by Diconet DEV</Footer>
          </Layout>
        </Layout>
      </LocaleProvider>
    )
  }
}
function mapStateToProps(state) {
  return {
    loginUser: state.loginSpace.loginUser,
    initNoticeMessageList: state.noticeMessage.initNoticeMessageList,
  };
}
export default connect(mapStateToProps)(BasicLayout);
