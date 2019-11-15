export default {
  treeShaking: true,
  plugins: [
    // ref: https://umijs.org/plugin/umi-plugin-react.html
    ['umi-plugin-react', {
      antd: true,
      dva: true,
      dynamicImport: false,
      title: 'safetyManagementPlatform',
      dll: false,
      hardSource: false,
    }],
  ],
  routes:[
    {
      path: '/login',
      component:'./Login'
    },
    {
      path: '/',
      component: '../layouts',
      routes: [
        {path:'/',exact:true,redirect: '/Login'},

        {
          path: '/index',
          component: './index'},
        {
          path: '/worktable',
          component: 'worktable/index'
        },
        {
          path:'/deviceManagement',
          routes:[
            {
              path:'/deviceManagement/equipmentLedger',
              component:'deviceManagement/equipmentLedger/EquipmentLedger',
              routes:[
                {
                  path: '/deviceManagement/equipmentLedger',
                  component: 'deviceManagement/equipmentLedger/List',
                },
                {
                  path: '/deviceManagement/equipmentLedger/add',
                  component: 'deviceManagement/equipmentLedger/AddForm',
                },
                {
                  path: '/deviceManagement/equipmentLedger/details',
                  component: 'deviceManagement/equipmentLedger/Details',
                },
              ]
            },
            {
              path: '/deviceManagement/equipmentMaintain/add',
              component: 'deviceManagement/equipmentMaintain/AddForm',
            },
            {
              path: '/deviceManagement/equipmentRepair/add',
              component: 'deviceManagement/equipmentRepair/AddForm',
            },
            {
              path:'/deviceManagement/area',
              component:'deviceManagement/area/Area',
              routes:[
                {
                  path: '/deviceManagement/area',
                  component: 'deviceManagement/area/List',
                },
                {
                  path: '/deviceManagement/area/add',
                  component: 'deviceManagement/area/Form',
                },
                {
                  path: '/deviceManagement/area/details',
                  component: 'deviceManagement/area/Details',
                },
              ]
            },
            {
              path:'/deviceManagement/classification',
              component:'deviceManagement/classification/classification',
              routes:[
                {
                  path: '/deviceManagement/classification',
                  component: 'deviceManagement/classification/List',
                },
                {
                  path: '/deviceManagement/classification/add',
                  component: 'deviceManagement/classification/Form',
                }
              ]
            },
          ]
        },
        {
          path:'/systemManage',
          routes:[
            {
              path:'/systemManage/userManage',
              component:'systemManage/userManage/UserManage',
              routes:[
                {
                  path: '/systemManage/userManage',
                  component: 'systemManage/userManage/List',
                },
                {
                  path: '/systemManage/userManage/add',
                  component: 'systemManage/userManage/Form',
                },
                {
                  path: '/systemManage/userManage/details',
                  component: 'systemManage/userManage/Details',
                }
              ]
            },
            {
              path:'/systemManage/roleManage',
              component:'systemManage/roleManage/RoleManage',
              routes:[
                {
                  path: '/systemManage/roleManage',
                  component: 'systemManage/roleManage/List',
                }
              ]
            },
            {
              path:'/systemManage/dictionaryManage',
              component:'systemManage/dictionaryManage/DictionaryManage',
              routes:[
                {
                  path: '/systemManage/dictionaryManage/dataList',
                  component: 'systemManage/dictionaryManage/DataList',
                },
                {
                  path: '/systemManage/dictionaryManage/dataType',
                  component: 'systemManage/dictionaryManage/DataType',
                }
              ]
            },
            {
              path:'/systemManage/depManage',
              component:'systemManage/depManage/DepManage',
              routes:[
                {
                  path: '/systemManage/depManage',
                  component: 'systemManage/depManage/List',
                }
              ]
            },
            {
              path:'/systemManage/unitManage',
              component:'systemManage/unitManage/UnitManage',
              routes:[
                {
                  path: '/systemManage/unitManage',
                  component: 'systemManage/unitManage/List',
                },
                {
                  path: '/systemManage/unitManage/add',
                  component: 'systemManage/unitManage/Form',
                }
              ]
            }
          ]
        },
        {
          path:'/planManage',
          routes:[
            //巡检计划
            {
              path:'/planManage/patrolPlan',
              component:'planManage/patrolPlan/PatrolPlan',
              routes:[
                {
                  path: '/planManage/patrolPlan',
                  component: 'planManage/patrolPlan/List',
                },
                {
                  path: '/planManage/patrolPlan/add',
                  component: 'planManage/patrolPlan/Form',
                },
                {
                  path: '/planManage/patrolPlan/details',
                  component: 'planManage/patrolPlan/Details',
                },
              ]
            },
            //计划追踪
            {
              path:'/planManage/planTrace',
              component:'planManage/planTrace/PlanTrace',
              routes:[
                {
                  path: '/planManage/planTrace',
                  component: 'planManage/planTrace/List',
                },
                {
                  path: '/planManage/planTrace/add',
                  component: 'planManage/planTrace/Form',
                },
                {
                  path: '/planManage/planTrace/details',
                  component: 'planManage/planTrace/Details',
                },
              ]
            },
            {
              path:'/planManage/checkItem',
              component:'planManage/checkItem/CheckItem',
              routes:[
                {
                  path: '/planManage/checkItem',
                  component: 'planManage/checkItem/List',
                },
                {
                  path: '/planManage/checkItem/add',
                  component: 'planManage/checkItem/Form',
                },
                {
                  path: '/planManage/checkItem/details',
                  component: 'planManage/checkItem/Details',
                },
              ]
            },
            //目标库
            {
              path:'/planManage/securityTarget',
              component:'planManage/securityTarget/SecurityTarget',
              routes:[
                {
                  path: '/planManage/securityTarget',
                  component: 'planManage/securityTarget/List',
                },
                {
                  path: '/planManage/securityTarget/add',
                  component: 'planManage/securityTarget/Form',
                },
                {
                  path: '/planManage/securityTarget/details',
                  component: 'planManage/securityTarget//Details',
                },
              ]
            },
            //安全计划
            {
              path:'/planManage/securityPlan',
              component:'planManage/securityPlan/SecurityPlan',
              routes:[
                {
                  path: '/planManage/securityPlan',
                  component: 'planManage/securityPlan/List',
                },
                {
                  path: '/planManage/securityPlan/add',
                  component: 'planManage/securityPlan/Form',
                },
              ]
            },
          ]
        },
        {
          path:'/dangerManage',
          routes:[
            {
              path:'/dangerManage/DangerManage',
              component:'dangerManage/DangerManage',
              routes:[
                {
                  path: '/dangerManage/dangerManage',
                  component: 'dangerManage/List',
                },
                {
                  path: '/dangerManage/dangerManage/add',
                  component: 'dangerManage/Form',
                },
                {
                  path: '/dangerManage/dangerManage/dangerRepair',
                  component: 'dangerManage/DangerRepairForm',
                },
                {
                  path: '/dangerManage/dangerManage/dangerReview',
                  component: 'dangerManage/DangerReviewForm',
                },
                {
                  path: '/dangerManage/dangerManage/repairList',
                  component: 'dangerManage/RepairList',
                },
                {
                  path: '/dangerManage/dangerManage/reviewList',
                  component: 'dangerManage/ReviewList',
                },
              ]
            },
            {
              path: '/dangerManage/details',
              component: 'dangerManage/Details',
            },
          ]
        },
        //消息中心
        {
          path: '/noticeMessage',
          routes: [
            {
              path: '/noticeMessage/Message',
              component: 'message/Message',
              routes: [
                {
                  path: '/noticeMessage/Message',
                  component: 'message/List',
                },
                {
                  path: '/noticeMessage/Message/add',
                  component: 'message/Form',
                },
                {
                  path: '/noticeMessage/Message/details',
                  component: 'message/Details',
                },
              ]
            },
          ]
        },
        //维保单位
        {
          path: '/maintenance',
          routes: [
            {
              path: '/maintenance/Maintenance',
              component: 'maintenance/Maintenance',
              routes: [
                {
                  path: '/maintenance/Maintenance',
                  component: 'maintenance/List',
                },
                {
                  path: '/maintenance/Maintenance/add',
                  component: 'maintenance/Form',
                },
                {
                  path: '/maintenance/maintenance/details',
                  component: 'maintenance/Details',
                },
              ],
            },
          ],
        },
        //客户管理
        {
          path: '/customer',
          routes: [
            {
              path: '/customer/Customer',
              component: 'customer/Customer',
              routes: [
                {
                  path: '/customer/Customer',
                  component: 'customer/List',
                },
                {
                  path: '/customer/Customer/add',
                  component: 'customer/Form',
                },
                {
                  path: '/customer/details',
                  component: 'customer/Details',
                },
              ],
            },
          ],
        },
        //合同管理
        {
          path: '/contract',
          routes: [
            {
              path: '/contract/Contract',
              component: 'contract/Contract',
              routes: [
                {
                  path: '/contract/Contract',
                  component: 'contract/List',
                },
                {
                  path: '/contract/Contract/add',
                  component: 'contract/Form',
                },
                {
                  path: '/contract/details',
                  component: 'contract/Details',
                },
              ],
            },
          ],
        },
        //维保人员管理
        {
          path: '/staff',
          routes: [
            {
              path: '/staff/Staff',
              component: 'staff/Staff',
              routes: [
                {
                  path: '/staff/Staff',
                  component: 'staff/List',
                },
                {
                  path: '/staff/Staff/add',
                  component: 'staff/Form',
                },
                {
                  path: '/staff/details',
                  component: 'staff/Details',
                },
              ],
            },
          ],
        },
        //报告管理
        {
          path: '/report',
          routes: [
            {
              path: '/report/Report',
              component: 'report/Report',
              routes: [
                {
                  path: '/report/Report',
                  component: 'report/List',
                },
                {
                  path: '/report/Report/add',
                  component: 'report/Form',
                },
                {
                  path: '/report/details',
                  component: 'report/Details',
                },
              ],
            },
          ],
        },
        //培训管理
        {
          path: '/train',
          routes: [
            {
              path: '/train/Train',
              component: 'train/Train',
              routes: [
                {
                  path: '/train/Train',
                  component: 'train/List',
                },
                {
                  path: '/train/Train/add',
                  component: 'train/Form',
                },
                {
                  path: '/train/details',
                  component: 'train/Details',
                },
              ],
            },
          ],
        },
      ]
    },
  ]
}
