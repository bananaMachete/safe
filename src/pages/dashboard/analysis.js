/* eslint-disable */
import React, { Component, Fragment  } from 'react';
import { Row, Col, Card,Progress,Statistic,Icon, } from 'antd';
import {
  Chart,
  Geom,
  Axis,
  Tooltip,
  Legend,
} from "bizcharts";

/*
 * Chart图表最顶级的组件，控制着图表的创建、绘制、销毁等
 * Geom几何标记对象，决定创建图表的类型
 * Legend图例
 * Axis坐标
 * 开启图表tooltip功能
 * Coord坐标体系
 * <Geom type="interval" position="month*value" size={18} />
 */
export default class Analysis extends Component {

  render() {
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
    const data = [
      {
        month: "1月",
        value: 3
      },
      {
        month: "2月",
        value: 4
      },
      {
        month: "3月",
        value: 3.5
      },
      {
        month: "4月",
        value: 5
      },
      {
        month: "5月",
        value: 4.9
      },
      {
        month: "6月",
        value: 6
      },
      {
        month: "7月",
        value: 7
      },
      {
        month: "8月",
        value: 9
      },
      {
        month: "9月",
        value: 13
      },
      {
        month: "10月",
        value: 13
      },
      {
        month: "11月",
        value: 13
      },{
        month: "12月",
        value: 13
      }
    ];
    const data1 = [
      {
        month: "1月",
        value: 2
      },
      {
        month: "2月",
        value: 1
      },
      {
        month: "3月",
        value: 6.5
      },
      {
        month: "4月",
        value: 4
      },
      {
        month: "5月",
        value: 2.9
      },
      {
        month: "6月",
        value: 1.2
      },
      {
        month: "7月",
        value: 1.5
      },
      {
        month: "8月",
        value: 2.5
      },
      {
        month: "9月",
        value: 6.2
      },
      {
        month: "10月",
        value: 4
      },
      {
        month: "11月",
        value: 2
      },{
        month: "12月",
        value: 7
      }
    ];
    const data2 = [
      {
        month: "1月",
        value: 1
      },
      {
        month: "2月",
        value: 1.2
      },
      {
        month: "3月",
        value: 8
      },
      {
        month: "4月",
        value: 6
      },
      {
        month: "5月",
        value: 2.6
      },
      {
        month: "6月",
        value: 4.6
      },
      {
        month: "7月",
        value: 7.5
      },
      {
        month: "8月",
        value: 4.5
      },
      {
        month: "9月",
        value: 1.3
      },
      {
        month: "10月",
        value: 4.3
      },
      {
        month: "11月",
        value: 2
      },{
        month: "12月",
        value: 6
      }
    ];
    const data3 = [
      {
        month: "1月",
        value: 3.3
      },
      {
        month: "2月",
        value: 5
      },
      {
        month: "3月",
        value: 11
      },
      {
        month: "4月",
        value: 10
      },
      {
        month: "5月",
        value: 8
      },
      {
        month: "6月",
        value: 7.9
      },
      {
        month: "7月",
        value: 10.5
      },
      {
        month: "8月",
        value: 5
      },
      {
        month: "9月",
        value: 1.3
      },
      {
        month: "10月",
        value: 6.3
      },
      {
        month: "11月",
        value: 11.3
      },{
        month: "12月",
        value: 7
      }
    ];
    const scale = {
      value: {
        alias: '数量(个)',
        min: 0
      },
      month: {
        alias: '月份',
        range: [0, 1]
      },
    };
    const title = {
      autoRotate: false, // 是否需要自动旋转，默认为 true
      offset: 50, // 设置标题 title 距离坐标轴线的距离
      textStyle: {
        fontSize: '14',
        textAlign: 'center',
        fill: '#999',
        fontWeight: 'bold',
      }, // 坐标轴文本属性配置
      position: 'end', // 标题的位置，**新增**
    }
    const { chart } = this.props;
    const visitData = [];
    const cols = {
      percent: {
        formatter: val => {
          val = val * 100 + "%";
          return val;
        }
      }
    };
    return (
      <Fragment>
        <Row gutter={24}>
          <Col
            {...topColResponsiveProps}
            xl={6}
          >
            <Card size="small" title="计划总计" >
              <Chart padding="auto" height={150} data={data} scale={scale} forceFit={true}>
                <Geom type="interval" position="month*value" size={18} />
                <Legend
                  position="right"
                  offsetY={-window.innerHeight / 2 + 120}
                  offsetX={-100}
                />
                <Tooltip
                  crosshairs={{
                    type: "y"
                  }}
                />
              </Chart>
            </Card>
          </Col>
          <Col
            {...topColResponsiveProps}
            xl={6}
          >
            <Card size="small" title="隐患分类统计" >
              <Chart padding="auto" height={150} data={data1} scale={scale} forceFit={true}>
                <Geom type="line" position="month*value" size={3} />
                <Geom
                  type="point"
                  position="month*value"
                  size={5}
                  shape={"circle"}
                  style={{
                    stroke: "#fff",
                    lineWidth: 2
                  }}
                />
                <Tooltip
                  crosshairs={{
                    type: "y"
                  }}
                />
              </Chart>
            </Card>
          </Col>
          <Col
            {...topColResponsiveProps}
            xl={6}
          >
            <Card size="small" title="访问量" >
              <Chart padding="auto" height={150} data={data2} scale={scale} forceFit={true}>
                <Geom type="area" position="month*value" size={3} />
                <Tooltip
                  crosshairs={{
                    type: "y"
                  }}
                />
              </Chart>
            </Card>
          </Col>
          <Col
            {...topColResponsiveProps}
            xl={6}
          >
            <Card size="small" title="客户数量" >
              <Chart padding="auto" height={150} data={data3} scale={scale} forceFit={true}>
                <Geom type="line" position="month*value" size={2} />
                <Tooltip
                  crosshairs={{
                    type: "y"
                  }}
                />
              </Chart>
            </Card>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col
            {...topColResponsiveProps}
            xl={18}
          >
            <Card
              title="日常监测"
              headStyle={{textAlign:"center"}}
            >
              <Chart height={341} data={data} scale={scale} forceFit={true}>
                <Axis name="month"/>
                <Axis name="value" title={title}/>
                <Tooltip
                  crosshairs={{
                    type: "y"
                  }}
                />
                <Geom type="line" position="month*value" size={3} />
                <Legend  name="value" visible={true} position="left-top"/>
                <Geom
                  type="point"
                  position="month*value"
                  size={5}
                  shape={"circle"}
                  style={{
                    stroke: "#fff",
                    lineWidth: 2
                  }}
                />
              </Chart>
            </Card>
          </Col>
          <Col
            {...topColResponsiveProps}
            xl={6}
          >
            <Card
              title="危害因素信息"
              headStyle={{textAlign:"center"}}
            >
              <Card.Grid style={gridStyle}>
                <p style={{fontSize:'30px',fontWeight:'bold',color:'#f00',marginBottom:0}}>58</p>
                <p style={{marginBottom:0}}>危害因素种类(种)</p>
              </Card.Grid>
              <Card.Grid style={gridStyle}>
                <p style={{fontSize:'30px',fontWeight:'bold',color:'#f00',marginBottom:0}}>148</p>
                <p style={{marginBottom:0}}>危害因素总数(个)</p>
              </Card.Grid>
              <Card.Grid style={gridStyle}>
                <p style={{fontSize:'30px',fontWeight:'bold',color:'#f00',marginBottom:0}}>32</p>
                <p style={{marginBottom:0}}>设计岗位总数(个)</p>
              </Card.Grid>
              <Card.Grid style={gridStyle}>
                <p style={{fontSize:'30px',fontWeight:'bold',color:'#f00',marginBottom:0}}>354</p>
                <p style={{marginBottom:0}}>总人数</p>
              </Card.Grid>
              <Card.Grid style={gridStyle}>
                <p style={{marginBottom:10}}>初次申报危害因素(个)</p>
                <Progress type="circle" percent={75} width={80}/>
                <Statistic
                  title="同比增长"
                  value={11.28}
                  precision={2}
                  valueStyle={{ color: '#3f8600' }}
                  prefix={<Icon type="arrow-up" />}
                  suffix="%"
                />
              </Card.Grid>
              <Card.Grid style={gridStyle}>
                <p style={{marginBottom:10}}>变更申报危害因素(个)</p>
                <Progress type="circle" percent={35} width={80}/>
                <Statistic
                  title="同比下降"
                  value={9.3}
                  precision={2}
                  width={80}
                  valueStyle={{ color: '#cf1322' }}
                  prefix={<Icon type="arrow-down" />}
                  suffix="%"
                />
              </Card.Grid>
            </Card>
          </Col>
        </Row>
        <Row>

        </Row>
      </Fragment>
    )
  };
}
