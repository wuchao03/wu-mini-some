# 人员添加、删除组件

## demo 演示

:::demo

```html
<template>
  <wu-peopleselect
    :config="config"
    @addUser="addUser"
    @deleteUser="deleteUser"
  />
  <test />
</template>
<script>
  export default {
    data() {
      return {
        config: {
          list: [
            {
              f_name: '人员1',
              f_mail: 'renyuan1@niupi.com',
            },
            {
              f_name: '人员2',
              f_mail: 'renyuan2@niupi.com',
            },
          ],
          options: [
            {
              f_name: '人员1',
              f_mail: 'renyuan1@niupi.com',
            },
            {
              f_name: '人员2',
              f_mail: 'renyuan2@niupi.com',
            },
            {
              f_name: '人员3',
              f_mail: 'renyuan3@niupi.com',
            },
            {
              f_name: '人员4',
              f_mail: 'renyuan4@niupi.com',
            },
          ],
          name: 'f_name',
          mail: 'f_mail',
          tooltips: true,
        },
      }
    },
    methods: {
      addUser(select, list) {
        // 添加人员后，返回添加人员弹窗中选择人员列表
        if (!this.config.list.length) {
          this.config.list = JSON.parse(JSON.stringify(select))
        } else {
          const currentUserMail = []
          this.config.list.forEach((item) => {
            currentUserMail.push(item[this.config.mail])
          })
          select.forEach((item) => {
            if (!currentUserMail.includes(item[this.config.mail])) {
              this.config.list.push(item)
            }
          })
        }
        this.$message.success('添加成功')
      },
      deleteUser(info, list) {
        // 点击删除按钮，返回需要删除人员信息
        let deleteIndex = this.config.list.findIndex(
          (item) => item[this.config.mail] === info[this.config.mail]
        )
        if (deleteIndex !== -1) {
          this.config.list.splice(deleteIndex, 1)
        }
        this.$message.success('删除成功')
      },
    },
    mounted() {},
  }
</script>
```

:::

## 项目依赖

- Vue 2.0.0+
- Element-ui 2.0.0+
- axios

## 安装

```
npm i wu-peopleselect -S

import wuPeopleSelect from 'wu-peopleselect'

Vue.use(wuPeopleSelect)
```

## 参数说明

- addUser 事件：选择需要添加的人员并点击确定按钮触发此事件，并返回两个参数。参数一为下拉选中的人员列表，参数二为原本被展示出的人员列表（不包含下拉框中被选中人员）
- deleteUser 事件：点击删除按钮触发此事件，并返回两个参数。参数一为当前被删除人员信息，参数二为未删除当前人员的人员列表（仍包含当前需要被删除的人员）
- config：有关已选人员列表、下拉选择列表等基础信息配置
  - list：已添加人员展示列表 Array[{name: 人名, mail: 邮箱}]
  - options：添加人员弹窗中的下拉选中列表，如果填写远程搜索请求地址（remote.url），则优先使用远程搜索，与 remote.url 二选一必填 Array[{name: 人名, mail: 邮箱}]
  - remote：远程搜索相关配置
    - url：远程搜索请求地址，与 options 二选一必填
    - params：远程搜索请求时的参数，除在下拉框中输入的关键字以外的其他参数
    - key_name：下拉框中输入的关键字在发起请求时的字段名，默认为'key'
  - name：参数 options 中用于展示姓名的字段名，默认为'name'
  - mail：参数 options 中用于展示邮箱的字段名，默认为'mail'
  - tooltips：用来控制卡片上的提示是否展示，默认不展示提示框(值类型必须为布尔类型)
  - cardClass：自定义卡片样式的 class 名（样式不能写在 scoped 内，要取唯一的 class 名，避免样式污染）。
  - mailClass：自定义邮箱部分样式的 class 名（样式不能写在 scoped 内，要取唯一的 class 名，避免样式污染）。
  - nameClass：自定义名字部分的 class 名（样式不能写在 scoped 内，要取唯一的 class 名，避免样式污染）。
  - addClass：自定义添加人员模块样式的 class 名（样式不能写在 scoped 内，要取唯一的 class 名，避免样式污染）。
  - tipsClass：自定义卡片提示框样式的 class 名（样式不能写在 scoped 内，要取唯一的 class 名，避免样式污染）。

## 插槽

- 卡片插槽
  - 用于自定义卡片内容，用法类似于 element-ui 中表格内自定义展示内容
  - 在插槽内 scope.info 即为每个卡片返回的信息，可通过 scope.info.name 渲染人名等
  - 字段 slot 值为'card'，为必填字段，用来与提示插槽做区分

```html
<wuPeopleSelect :config="config" @addUser="addUser">
  <template slot-scope="scope" slot="card"> </template>
</wuPeopleSelect>
```

- 卡片提示插槽
  - 用于自定义卡片上提示框的内容，用法与自定义卡片内容的插槽一样
  - 在插槽内 scope.info 即为每个卡片返回的信息，可通过 scope.info.name 渲染人名等
  - 字段 slot 值为'tips'，为必填字段，用来与卡片插槽做区分

```html
<wuPeopleSelect :config="config" @addUser="addUser">
  <template slot-scope="scope" slot="tips"> </template>
</wuPeopleSelect>
```
