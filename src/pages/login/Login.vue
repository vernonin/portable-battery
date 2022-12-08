<template>
  <div class="login-container">
    <div class="left-bg">
      <img src="../../assets/img/login-left.png">
    </div>
  
    <div class="right-form">
      <a-form class="login-form" @submit="onSubmit" :form="form">
        <h1>万笙充电管理系统</h1>
        <p class="subtitle">winson charge management system</p>
        <div class="welcome">欢迎登录</div>
        <a-form-item>
          <a-input
            autocomplete="autocomplete"
            size="large"
            placeholder="请输入账号"
            v-decorator="['userAccount', {rules: [{ required: true, message: '请输入账户名', whitespace: true}]}]"
          >
            <a-icon slot="prefix" type="user" />
          </a-input>
        </a-form-item>
        <a-form-item>
          <a-input
            size="large"
            placeholder="请输入密码"
            autocomplete="autocomplete"
            type="password"
            v-decorator="['userPassword', {rules: [{ required: true, message: '请输入密码', whitespace: true}]}]"
          >
            <a-icon slot="prefix" type="lock" />
          </a-input>
        </a-form-item>
        <a-form-item>
          <a-button :loading="logging" style="width: 100%;margin-top: 12px;" size="large" htmlType="submit" type="primary">登录</a-button>
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>

<script>
import { login } from '@/services/user'
import { SET_AUTH } from '@/utils/auth'
import { mapMutations } from 'vuex'

export default {
  name: 'Login',
  data () {
    return {
      logging: false,
      error: '',
      form: this.$form.createForm(this)
    }
  },
  computed: {
    systemName () {
      return this.$store.state.setting.systemName
    }
  },
  methods: {
    ...mapMutations('account', ['setUser', 'setPermissions', 'setRoles']),
    onSubmit (e) {
      e.preventDefault()
      this.form.validateFields(async (err) => {
        if (!err) {
          this.logging = true

          try {
            const userAccount = this.form.getFieldValue('userAccount')
            const userPassword = this.form.getFieldValue('userPassword')
            let result = await login(userAccount, userPassword)

            this.afterLogin(result.data)
            this.$message.success('登录成功！')
          } catch (err){
            // pass
          }
          this.logging = false
        }
      })
    },
    afterLogin(data) {

      this.setUser({...data, token: ''})
      SET_AUTH(data.token)
      this.$router.replace('/dashboard/analysis')

      // const {permissions, roles} = data
      // this.setPermissions(permissions)
      // this.setRoles(roles)
      // setAuthorization({token: data.token, expireAt: new Date(data.expireAt)})
      // 获取路由配置
      // getRoutesConfig().then(result => {
      //   const routesConfig = result.data.data
      //   loadRoutes(routesConfig)
      //   this.$router.replace('/dashboard/workplace')
      // })
    }
  }
}
</script>

<style lang="less" scoped>
  .login-container {
    display: flex;
    width: 100vw;
    height: 100vh;
    background-color: #f7f7f7;

    .left-bg {
      flex: 1;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      
      img {
        width: 500px;
      }
    }

    .right-form {
      flex: 1;
      .login-form {
        position: relative;
        width: 420px;
        margin: 0 auto;
        margin-top: 24vh;
        padding: 24px 30px;
        background-color: #fff;
        border-radius: 6px;
        box-shadow: 4px 4px 8px #cacaca;
        overflow: hidden;

        .subtitle {
          font-size: 16px;
          color: #3A62D7;
          font-weight: bold;
          text-transform: uppercase;
        }

        .welcome {
          position: absolute;
          top: 18px;
          right: -20px;
          color: #666;
          font-size: 12px;
          transform: rotate(45deg);
          padding: 1px 20px;
          box-sizing: border-box;
          letter-spacing: 2px;
          background-color: antiquewhite;
        }
        .icon {
          font-size: 24px;
          color: @text-color-second;
          margin-left: 16px;
          vertical-align: middle;
          cursor: pointer;
          transition: color 0.3s;

          &:hover {
            color: @primary-color;
          }
        }
      }
    }
  }
  
</style>
