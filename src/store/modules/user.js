import Vue from 'vue'
import { login, getInfo, logout, makepwd } from '@/api/login'
import { ACCESS_TOKEN, DEFAULT_SEESION_OUTTIME } from '@/store/mutation-types'
import md5 from "md5";

const user = {
  state: {
    token: '',
    name: '',
    avatar: '',
    id: '',
    roles: [],
    info: {}
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_INFO: (state, info) => {
      state.info = info
    },
    SET_ID: (state, id) => {
      state.id = id
    }
  },

  actions: {
    // 登录
    Login({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        login(userInfo).then(response => {
          const code = response.code
          if (code != '200') {
            throw new Error(response.message)
          } else {
            const result = response.result
            Vue.ls.set(ACCESS_TOKEN, result.token, DEFAULT_SEESION_OUTTIME)
            commit('SET_TOKEN', result.token)
            commit('SET_ID', result.id)
            resolve(result.name)
          }
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetInfo({ commit }) {
      return new Promise((resolve, reject) => {
        getInfo().then(response => {
          const result = response.result
          if (result.userRoles.length > 0) {
            commit('SET_ROLES', result.userRoles)
            commit('SET_INFO', result)
          } else {
            commit('SET_ROLES', ['wait'])
            commit('SET_INFO', result)
            //reject(new Error('getInfo: roles must be a non-null array !'))
          }
          commit('SET_NAME', result.name)
          commit('SET_ID', result.id)
          commit('SET_AVATAR', result.avatar)

          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 登出
    Logout({ commit, state }) {
      return new Promise((resolve) => {
        //commit('SET_TOKEN', '')
        //commit('SET_ROLES', [])
        //Vue.ls.remove(ACCESS_TOKEN)

        logout(state.token).then(() => {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          Vue.ls.remove(ACCESS_TOKEN)
          resolve()
        }).catch(() => {
          resolve()
        })
      })
    },

    MakePwd({ state }, values) {
      console.log(state);
      return new Promise((resolve, reject) => {
        makepwd({
          oldpwd: md5(md5(values.oldpwd)),
          newpwd: md5(md5(values.newpwd)),
          userId: values.userId
        })
          .then((response) => {
            resolve(response);
          })
          .catch(error => {
            reject(error)
          });
      })
    }

  }
}

export default user
