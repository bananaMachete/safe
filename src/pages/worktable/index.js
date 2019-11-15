/* eslint-disable */
import React, { Component  } from 'react';
import { Radar, ChartCard,TagCloud  } from 'ant-design-pro/lib/Charts';
import moment from 'moment';
import 'moment/locale/zh-cn';
import { PageHeader, Tag, Statistic,Col, Avatar, Divider, Icon, Card, Table } from 'antd';
import style from './index.less';
import { connect } from 'dva/index';
const { Meta } = Card;

const columns = [
  {
    title: '标题',
    dataIndex: 'title',
    render: text => <a>{text}</a>,
  },
  {
    title: '类型',
    className: 'column-money',
    dataIndex: 'type',
  },
  {
    title: '时间',
    dataIndex: 'datetime',
  },
];

class Worksplace extends Component {
  state={
    daytime : "yy-MM-dd",
    hello:"",
    loginUser:{},
    noticeData:[],
    dangerCount:{},
    inspectionPlan:[],
    loading: true,
  }


  componentDidMount(){
    let today=new Date();
    if (today.getHours()<12){
      this.setState({
        daytime: "上午好",
        hello : "一日之际在于晨!"
      })
    }if (today.getHours()>=12 && today.getHours()<18){
      this.setState({
        daytime: "下午好",
        hello: "下午茶时间!",
      })
    }if (today.getHours()>18){
      this.setState({
        daytime: "晚上好",
        hello : "多注意休息!",
      })
    };

    //获取当前登录的用户
    this.props.dispatch({
      type: 'loginSpace/getLoginUser',
    }).then(() => {
      this.setState({
        loginUser:this.props.loginUser
      })
      //根据用户ID查待巡检计划
      this.props.dispatch({
        type: 'patrolPlan/queryInspectionPlanByUserId',
        payload:{
          userId:this.state.loginUser.id
        }
      }).then(() => {
        this.setState({
          inspectionPlan:this.props.inspectionPlan
        })
      });
      //查根据用户ID隐患
      this.props.dispatch({
        type: 'dangerManage/findCountByUserId',
        payload:{
          userId:this.state.loginUser.id
        }
      }).then(() => {
        this.setState({
          dangerCount:this.props.dangerCount
        })
      });
      //查通知
      this.props.dispatch({
        type: 'noticeMessage/queryNoticeMessageListByUserId',
        payload: {
          userId:this.state.loginUser.id,
          pageNum:0,
        }
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
      });
    });
  }
  render() {
    const  {noticeData,dangerCount,inspectionPlan}  = this.state;
    const tags = [];
    for (let i = 0; i < 20; i += 1) {
      tags.push({
        name: `${i}`,
        value: Math.floor(Math.random() * 20) + 20,
      });
    }
    const radarOriginData = [
      {
        name: '个人',
        ref: 10,
        mouth: 8,
        output: 4,
        contribute: 5,
        hot: 7,
      },
      {
        name: '团队',
        ref: 3,
        mouth: 9,
        output: 6,
        contribute: 3,
        hot: 1,
      },
      {
        name: '部门',
        ref: 4,
        mouth: 1,
        output: 6,
        contribute: 5,
        hot: 7,
      },
    ];
    const radarData = [];
    const radarTitleMap = {
      ref: '引用',
      mouth: '口碑',
      output: '产量',
      contribute: '贡献',
      hot: '热度',
    };
    radarOriginData.forEach(item => {
      Object.keys(item).forEach(key => {
        if (key !== 'name') {
          radarData.push({
            name: item.name,
            label: radarTitleMap[key],
            value: item[key],
          });
        }
      });
    });
    const content = (
      <div >
        <ul className={style.titleheader}>
          <li><Avatar  size={85} icon="user" src="https://imagev2.xmcdn.com/group64/M01/64/71/wKgMaV13XxvwZ4l0AAJF7sMx0-Q359.jpg!strip=1&quality=7&magick=jpg&op_type=5&upload_type=cover&name=large_pop&device_type=ios" alt="暂无图像"/></li>
          <li id={style.h5title}><h2>{this.state.daytime}，{this.props.location.state}，{this.state.hello}</h2><br/>
          <h5>{this.props.loginUser.position} | {this.props.loginUser.post}－{this.props.loginUser.companyName}－{this.props.loginUser.organizationName}－UED</h5></li>
          <li className={style.statisticText1}>
            <Col span={12}>
            <Statistic title="总任务" value={dangerCount.total} />
          </Col>
          </li>
          <li><Divider type="vertical" style={{height:80}} /></li>
          <li className={style.statisticText}>
            <Col span={12}>
            <Statistic title="已完成" value={dangerCount.finished}  /></Col>
          </li>
          <li><Divider type="vertical" style={{height:80}} /></li>
          <li className={style.statisticText}><Col span={12}>
            <Statistic title="未完成"  value={dangerCount.task}  />
          </Col>
        </li>
        </ul>
      </div>
    );
    const routes = [
      {
        path: '/index',
        breadcrumbName: '首页',
      },
      {
        path: 'first',
        breadcrumbName: '工作台',
      }
    ];
    return (
      <div className={style.backdiv}>
            <PageHeader
              className={style.headear}
              onBack={() => window.history.back()}
              title="工作台"
              subTitle="个人"
              breadcrumb={{ routes }}
              tags={<Tag color="blue">Running</Tag>}
            >
              <div className="wrap">
                <div className="content padding">{content}</div>
              </div>
            </PageHeader>
        <div className={style.bodyleft}>
          <h4><Icon type="sync" spin />进行中的任务<span>更多</span></h4>
          <hr/>
          <div className={style.bodyleftfirstDiv}>
            {inspectionPlan.map((item => {
              console.log(item);
              console.log(item.planName);
              return  <Col span={8}>
                <Card title={item.planName} bordered={true} style={{marginLeft:10}}>
                  Card content
                </Card>
              </Col>
            }))}
          </div>
        </div>
        <div className={style.bodyright}>
          <h4 className={style.h4title}><Icon type="radar-chart" />数据示例</h4>
          <ChartCard>
            <Radar hasLegend height={370} data={radarData} />
          </ChartCard>
        </div>
        <div className={style.div3left}>
          <h3 className={style.h4title}>通知动态</h3>
          <hr/>
            <div className={style.bodyDiv3context}>
            <Table
              columns={columns}
              dataSource={noticeData}
              bordered
              title={() => 'Header'}
              footer={() => 'Footer'}
            />
            </div>
        </div>
        <div className={style.div4right}>
          <h3 className={style.h4title}>分部</h3>
          <hr/>
          <div className={style.bodyDiv3context}>
            <TagCloud data={tags} height={270} />
          </div>
        </div>
      </div>
    )
  };
}
function mapStateToProps(state) {
  return {
    loginUser: state.loginSpace.loginUser,
    initNoticeMessageList: state.noticeMessage.initNoticeMessageList,
    dangerCount:state.dangerManage.dangerCount,
    inspectionPlan:state.patrolPlan.inspectionPlan,
  };
}
export default connect(mapStateToProps)(Worksplace);
