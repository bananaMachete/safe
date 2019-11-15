/* eslint-disable */
import React, { Component, Fragment  } from 'react';
import { Row, Col, Card } from 'antd';
import { ChartCard, MiniArea, MiniBar, MiniProgress } from 'ant-design-pro/lib/Charts';
import Trend from 'ant-design-pro/lib/Trend';
import moment from 'moment';
import style from './index.less';
import {
  Chart,
  Geom,
  Axis,
  Tooltip,
  Legend,
  Guide,
  Coord,
  Label
} from "bizcharts";
import DataSet from "@antv/data-set";
import { connect } from 'dva/index';

function mapStateToProps(state) {
  return {
    loginUser: state.loginSpace.loginUser,
    initNoticeMessageList: state.noticeMessage.initNoticeMessageList,
    dangerAnalysis:state.dangerManage.dangerAnalysis,
    equipmentAnalyses:state.equipmentLedger.equipmentAnalyses,
  };
}

class Analysis extends Component {
  state={
    loginUser:{},
    noticeData:[],
    dangerAnalysis:[],
    equipmentAnalyses:[],
  }

  componentDidMount(){
     //获取当前登录的用户
    this.props.dispatch({
      type: 'loginSpace/getLoginUser',
    }).then(() => {
      this.setState({
        loginUser:this.props.loginUser
      })
    });
    this.props.dispatch({
      type: 'equipmentLedger/getEquipmentGroupClassAnalysis',
    }).then(() =>{
      this.setState({
        equipmentAnalyses:this.props.equipmentAnalyses
      })
    })
    //查询统计
    this.props.dispatch({
      type: 'dangerManage/findDangerMouthAnalysis',
      payload:{
        userId:this.state.loginUser.id
      }
    }).then(() => {
      this.setState({
        dangerAnalysis:this.props.dangerAnalysis
      })
    });

  }

  render() {
    const {dangerAnalysis,equipmentAnalyses} = this.state;
    const topColResponsiveProps = {
      xs: 24,
      sm: 12,
      md: 12,
      lg: 12,
      style: { marginBottom: 24},
    };
    const gridStyle = {
      width: '50%',
      textAlign: 'center',
      boxShadow:'none',
      padding:15
    };
    const cols = {
      percent: {
        formatter: val => {
          val = val * 100 + "%";
          return val;
        }
      }
    };
    const visitData = [];
    const beginDay = new Date().getTime();
    for (let i = 0; i < 20; i += 1) {
      visitData.push({
        x: moment(new Date(beginDay + 1000 * 60 * 60 * 24 * i)).format('YYYY-MM-DD'),
        y: Math.floor(Math.random() * 100) + 10,
      });
    }
    //总和
    var equipmentCount = 0;
    equipmentAnalyses.map((item)=>{
      equipmentCount += item.count;
    })
    //大柱形图
    const ds = new DataSet();
    const dv = ds.createView().source(dangerAnalysis);
    // const dv = ds.createView().source(data4);
    dv.transform({
      type: "fold",
      // 展开字段集
      // fields: ["01.", "02.", "03.", "04.", "05.", "06.", "07.", "08.", "09.", "10.", "11.", "12."],
      fields: ["2019-01.", "2019-02", "2019-03", "2019-04", "2019-05", "2019-06", "2019-07", "2019-08", "2019-09", "2019-10", "2019-11", "2019-12"],
      // key字段
      key: "月份",
      // value字段
      value: "隐患数量"
    });
    //饼图示例
    const { DataView } = DataSet;
    const { Html } = Guide;
    const dv1 = new DataView();
    // dv1.source(data5).transform({
    //   type: "percent",
    //   field: "count",
    //   dimension: "item",
    //   as: "percent"
    // });

    dv1.source(equipmentAnalyses).transform({
      type: "percent",
      field: "count",
      dimension: "item",
      as: "percent"
    });
    const cols1 = {
      percent: {
        formatter: val => {
          val = val.toFixed(3) * 100 + "%";
          return val;
        }
      }
    };
    const text={
      _val:"<div style='color:#8c8c8c;font-size:1.16em;text-align: center;width: 10em;'>设备数量<br><span style='color:#262626;font-size:2.5em;'>"+equipmentCount+"</span>台</div>"
    }
    //雷达图
    const data6 = [
      {
        item: '设计',
        a: 70,
        b: 30,
      },
      {
        item: '研发',
        a: 60,
        b: 70,
      },
      {
        item: '市场',
        a: 50,
        b: 60,
      },
      {
        item: '用户',
        a: 40,
        b: 50,
      },
      {
        item: '测试',
        a: 60,
        b: 70,
      },
      {
        item: '外事',
        a: 70,
        b: 50,
      },
      {
        item: '技术',
        a: 50,
        b: 40,
      },
      {
        item: '运维',
        a: 30,
        b: 40,
      },
      {
        item: '销售',
        a: 60,
        b: 40,
      },
      {
        item: '综合',
        a: 50,
        b: 60,
      },
    ];
    const dv2 = new DataView().source(data6);
    dv2.transform({
      type: 'fold',
      fields: ['a', 'b'],
      // 展开字段集
      key: 'user',
      // key字段
      value: 'score', // value字段
    });
    const cols2 = {
      score: {
        min: 0,
        max: 80,
      },
      user: { formatter: val => ({ a: '当前岗位组成', b: '优化后岗位组成' }[val]) },
    };
    return (
      <div className={style.backdiv}>
        <Row>
          <Col className={style.divhead} span={24}>
            <div>
              <h5 className={style.textsizeh5}>月隐患数</h5>
              <h1 className={style.textsizeh1}>130</h1>
            </div>
            <ChartCard className={style.ChartLayout}>
              <MiniArea line height={50} data={visitData} />
              <hr className={style.hrmargin}/>
              <h5 className={style.footertexth5}>日隐患量：4</h5>
            </ChartCard>
          </Col>
          <Col className={style.divhead} span={24}>
            <div>
              <h5 className={style.textsizeh5}>月访问量</h5>
              <h1 className={style.textsizeh1}>￥131313</h1>
            </div>
            <ChartCard className={style.ChartLayout}>
              <MiniArea line height={50} data={visitData} />
              <hr className={style.hrmargin}/>
              <h5 className={style.footertexth5}>日访问量：1234</h5>
            </ChartCard>
          </Col>
          <Col className={style.divhead} span={24}>
            <div>
              <h5 className={style.textsizeh5}>用户数量</h5>
              <h1 className={style.textsizeh1}>313123</h1>
            </div>
            <ChartCard className={style.ChartLayout}>
              <MiniBar height={46} data={visitData} />
              <hr className={style.hrmargin}/>
              <h5 className={style.footertexth5}>日登录量：22344</h5>
            </ChartCard>
          </Col>
          <Col className={style.divhead} span={24}>
            <div>
              <h5 className={style.textsizeh5}>隐患整改率</h5>
              <h1 className={style.textsizeh1}>78%</h1>
            </div>
            <ChartCard className={style.ChartLayout} >
              <MiniProgress percent={78} strokeWidth={45} target={90}  />
              <hr className={style.hrmargin}/>
              <h5 className={style.footertexth5}>
                <span style={{ float:'left' }}>
                周同比
                <Trend flag="up" style={{ marginLeft: 8, color: 'rgba(0,0,0,.85)',float:'left' }}>
                  12%
                </Trend>
              </span>
                <span style={{ marginLeft: 26,float:'left' }}>
                日环比
                <Trend flag="down" style={{ marginLeft: 8, color: 'rgba(0,0,0,.85)',float:'left' }}>
                  11%
                </Trend>
              </span></h5>
            </ChartCard>
          </Col>
        </Row>
        <Row span={24} className={style.danger}>
          <Col
            {...topColResponsiveProps}
            xl={24}
          >
            <Card
              title="隐患监测"
              headStyle={{textAlign:"left"}}
            >
              <Chart height={400} data={dv} forceFit>
                <Axis name="月份" />
                <Axis name="隐患数量" />
                <Legend />
                <Tooltip
                  crosshairs={{
                    type: "y"
                  }}
                />
                <Geom
                  type="interval"
                  position="月份*隐患数量"
                  color={['name',['red','yellow','green']]}
                  adjust={[
                    {
                      type: "dodge",
                      marginRatio: 1 / 32
                    }
                  ]}
                />
              </Chart>
            </Card>
          </Col>
        </Row>
        <Row gutter={24} >
          <Col className={style.Leftdiv}>
            <Card
              title="设备分类占比"
              headStyle={{textAlign:"left"}}
            >
              <Chart
                data={dv1}
                scale={cols1}
                padding={[20, 20, 20, 20]}
                forceFit
              >
                <Coord type={"theta"} radius={0.75} innerRadius={0.6} />
                <Axis name="percent" />
                <Legend
                  position="right"
                  offsetY={-window.innerHeight / 2 + 120}
                  offsetX={-100}
                />
                <Tooltip
                  showTitle={true}
                  itemTpl="<li><span style=&quot;background-color:{color};&quot; class=&quot;g2-tooltip-marker&quot;></span>{name}: {value}</li>"
                />
                <Guide>
                  <Html
                    position={["50%", "50%"]}
                    html={text._val}
                    alignX="middle"
                    alignY="middle"
                  />
                </Guide>
                <Geom
                  type="intervalStack"
                  position="percent"
                  color="item"
                  tooltip={[
                    "item*percent",
                    (item, percent) => {
                      percent = percent * 100 + "%";
                      return {
                        name: item,
                        value: percent
                      };
                    }
                  ]}
                  style={{
                    lineWidth: 1,
                    stroke: "#fff"
                  }}
                >
                  <Label
                    content="percent"
                    formatter={(val, item) => {
                      return item.point.item + ": " + val;
                    }}
                  />
                </Geom>
              </Chart>
            </Card>
          </Col>
          <Col className={style.Leftdiv}>
            <Card
              title="系统优化节省"
              headStyle={{textAlign:"left"}}
            >
              <Chart
                data={dv2}
                padding={[20, 20, 95, 20]}
                scale={cols2}
                forceFit
              >
                <Coord type="polar" radius={0.8} />
                <Axis
                  name="item"
                  line={null}
                  tickLine={null}
                  grid={{
                    lineStyle: {
                      lineDash: null,
                    },
                    hideFirstLine: false,
                  }}
                />
                <Tooltip />
                <Axis
                  name="score"
                  line={null}
                  tickLine={null}
                  grid={{
                    type: 'polygon',
                    lineStyle: {
                      lineDash: null,
                    },
                    alternateColor: 'rgba(0, 0, 0, 0.04)',
                  }}
                />
                <Legend name="user" marker="circle" offset={30} />
                <Geom type="line" position="item*score" color="user" size={2} />
                <Geom
                  type="point"
                  position="item*score"
                  color="user"
                  shape="circle"
                  size={4}
                  style={{
                    stroke: '#fff',
                    lineWidth: 1,
                    fillOpacity: 1,
                  }}
                />
              </Chart>
            </Card>
          </Col>
        </Row>
      </div>
    )
  };
}

export default connect(mapStateToProps)(Analysis);
