module.exports = [{
  name: '导航一',
  id: 'nav1',
  group: [{
    name: '分组一',
    id: 'nv1_gp1',
    group: [],
    sub: [{
      name: '选项1',
      id: 'nv1_gp1_op1',
      componentName: 'option1'
    },
    {
      name: '选项2',
      id: 'nv1_gp1_op2',
      componentName: 'option2'
    },
    {
      name: '选项3',
      id: 'nv1_gp1_op3',
      componentName: 'option3'
    }]
  },
  {
    name: '分组二',
    id: 'gp2',
    group: [],
    sub: [{
      name: '选项1',
      id: 'nv1_gp2_op1',
      componentName: 'option3'
    }, {
      name: '选项2',
      id: 'nv1_gp2_op2',
      componentName: 'option4'
    }]
  }],
  sub: [{
    name: '选项1',
    id: 'nv1_op1',
    sub: [{
      name: '选项1',
      id: 'nv1_op1_op1',
      componentName: 'About'
    }]
  }]
},
{
  name: '主页',
  id: 'nav2',
  componentName: 'Home',
  group: [],
  sub: []
},
{
  name: '关于',
  id: 'nav3',
  componentName: 'About',
  group: [],
  sub: []
},
{
  name: '联系方式',
  id: 'nav4',
  componentName: 'Contact',
  group: [],
  sub: []
}]
