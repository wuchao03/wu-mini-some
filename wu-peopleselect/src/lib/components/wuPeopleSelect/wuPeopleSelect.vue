<template>
  <div class="wu-peopleselect-main">
    <template v-if="list.length">
      <span v-for="item in list" :key="item[defineMail]">
        <el-tooltip effect="dark" placement="bottom" :disabled="isTooltips" :popper-class="tipsClass" >
          <span slot="content">
            <slot :info="item" name="tips">
              <template>
                {{ item[defineName] }} <br/>
                {{ item[defineMail] }}
              </template>
            </slot>
          </span>
          <span class="wu-peopleselect-item" :class="cardClass">
            <slot :info="item" name="card">
              <template>
                <span class="wu-peopleselect-item-name" :class="nameClass">
                  {{ item[defineName] }}
                </span>
                <span class="wu-peopleselect-item-mail" :class="mailClass">
                  {{ item[defineMail] }}
                </span>
              </template>
            </slot>
            <span class="wu-peopleselect-item-delete el-icon-error" @click="deleteUser(item)"></span>
          </span>
        </el-tooltip>
      </span>
    </template>
    <span class="wu-peopleselect-item wu-peopleselect-add" :class="addClass" @click="addVisible = true; form.user = []">
      + 添加
    </span>
    <el-dialog
      :visible.sync="addVisible"
      v-if="addVisible"
      width="524px"
      :modal-append-to-body='true'
      :append-to-body='true'
      :close-on-click-modal="false"
      custom-class="wu-peopleselect-dialog"
    >
      <el-form
        :model="form"
        :rules="rules"
        ref="form"
        label-width="80px"
        class="demo-ruleForm"
      >
        <!-- :filter-method="filterMethod" -->
        <el-form-item label="选择人员" prop="user" ref="user">
          <el-select
            v-model="form.user"
            multiple
            filterable
            :remote="isRemote"
            :remote-method="remoteMethod"
            style="width: 364px"
            size="mini"
            placeholder="请选择"
            :value-key="defineMail"
            :loading="loading"
          >
            <el-option
              v-for="item in options"
              :key="item[defineMail]"
              :label="`${ item[defineName] }(${ item[defineMail].split('@')[0] })`"
              :value="item"
            >
              <div v-if="item[defineMail]" class="addName">
                {{ item[defineName] }} ({{ item[defineMail].split("@")[0] }})
              </div>
              <!-- <div class="department" v-if="item.dep3_name == ''">
                {{ item.dep1_name }}-{{ item.dep2_name }}
              </div>
              <div class="department" v-else>
                {{ item.dep1_name }}-{{ item.dep2_name }}-{{ item.dep3_name }}
              </div> -->
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button
          size="small"
          @click="handleAddClose()"
          >取 消</el-button
        >
        <el-button
          type="primary"
          size="small"
          @click="submit()"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>
<script>
import axios from "axios"
export default {
  name:'wuPeopleSelect',
  props:{
    config: {
      require: true,
      default: () => ({})
    }
  },
  data(){
    let validateUser = (rule, value, callback) => {
      if(value.length){
        callback()
      }else{
        callback('请选择人员')
      }
    }
    return {
      addVisible: false,
      form: {
        user: []
      },
      rules:{
        user: [
          {
            required: true, trigger: 'change', validator: validateUser
          }
        ]
      },
      list: [],
      isRemote: false,
      options: [],
      optionsCopy: [],
      loading: false,
      debounceTime: null,
    }
  },
  watch: {
    "config.list": {
      deep: true,
      immediate: true,
      handler: function(nVal){
        this.$nextTick(()=>{
          if(Object.prototype.toString.call(nVal) === '[object Array]' && nVal.length > 0){
            this.list = JSON.parse(JSON.stringify(nVal))
          }else{
            this.list = []
          }
        })
      }
    },
    "config.remote": {
      immediate: true,
      handler: function(nVal) {
        if (nVal && nVal.url) {
          this.isRemote = true
          return
        }
        this.isRemote = false
      }
    },
    "config.options": {
      immediate: true,
      handler: function(nVal){
        if (!(this.config.remote && this.config.remote.url) && nVal && Object.prototype.toString.call(nVal) === '[object Array]' && nVal.length > 0) {
          this.options = JSON.parse(JSON.stringify(nVal))
          this.optionsCopy = JSON.parse(JSON.stringify(this.options))
        }else{
          this.options = []
          this.optionsCopy = []
        }
      }
    }
  },
  computed: {
    defineName () {
      const defineName = this.config.name
      if(defineName){
        return defineName
      }else{
        return 'name'
      }
    },
    defineMail () {
      const defineMail = this.config.mail
      if(defineMail){
        return defineMail
      }else{
        return 'mail'
      }
    },
    cardClass () {
      const cardClass = this.config.cardClass
      if(cardClass){
        return cardClass
      }else{
        return ''
      }
    },
    nameClass () {
      const nameClass = this.config.nameClass
      if(nameClass){
        return nameClass
      }else{
        return ''
      }
    },
    mailClass () {
      const mailClass = this.config.mailClass
      if(mailClass){
        return mailClass
      }else{
        return ''
      }
    },
    addClass () {
      const addClass = this.config.addClass
      if(addClass){
        return addClass
      }else{
        return ''
      }
    },
    defineKey () {
      let key = 'key'
      if(this.config.remote && this.config.remote.key_name){
        key = this.config.remote.key_name
      }
      return key
    },
    defineParams () {
      let params = {}
      if(this.config.remote && this.config.remote.params){
        params = this.config.remote.params
      }
      return params
    },
    isTooltips () {
      let tooltips = true
      if(Object.prototype.toString.call(this.config.tooltips) === '[object Boolean]'){
        tooltips = this.config.tooltips ? false : true
      }
      return tooltips
    },
    tipsClass () {
      let tipsClass = ''
      if(Object.prototype.toString.call(this.config.tipsClass) === '[object String]'){
        tipsClass = this.config.tipsClass
      }
      return tipsClass
    },
  },
  methods:{
    handleAddClose(){
      this.addVisible = false;
      this.form.user = [];
    },
    submit(){
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.$emit('addUser', JSON.parse(JSON.stringify(this.form.user)),JSON.parse(JSON.stringify(this.list)))
          this.addVisible = false;
        } else {
          return false;
        }
      });
    },
    deleteUser(info){
      this.$emit('deleteUser', info, JSON.parse(JSON.stringify(this.list)))
    },
    remoteMethod(val){
      if (this.debounceTime) {
        clearTimeout(this.debounceTime);
      }
      this.debounceTime = setTimeout(() => {
        this.loading = true
        // 远程搜索
        if(val){
          let params = JSON.parse(JSON.stringify(this.defineParams))
          params[this.defineKey] = val
          axios.get(this.config.remote.url,{
            params
          }).then(res => {
            this.options = res.data
          }).catch(err => {
            this.$message.error(err.response.data)
          })
        }else{
          this.options = []
        }
      }, 500);
    },
    filterMethod(val){
      if(val){
        let currentUserListForMail = []
        if(this.form.user.length){
          this.form.user.forEach(item => {
            currentUserListForMail.push(item[this.defineMail])
          })
        }
        this.options = this.optionsCopy.filter(item => {
          if(Object.prototype.toString.call(item[this.defineMail]) === '[object String]' && Object.prototype.toString.call(item[this.defineMail]) === '[object String]'){
            return ((item[this.defineMail]).toLowerCase().indexOf(val.toLowerCase()) > -1 || (item[this.defineName]).toLowerCase().indexOf(val.toLowerCase()) > -1 || currentUserListForMail.includes(item[this.defineMail]))
          }
          return false
        })
      }else{
        this.options = JSON.parse(JSON.stringify(this.optionsCopy))
      }
    },
  }
}
</script>
<style lang="less" scoped>
@import "../../css/wuPeopleSelect-scope";
</style>
<style lang="less">
  .wu-peopleselect-dialog {
    border-radius: 10px;
  }
</style>