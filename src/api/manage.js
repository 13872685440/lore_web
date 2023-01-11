import { axios } from '@/utils/request'
import store from '@/store'
import qs from 'qs'
import moment from "moment";

export function queryService(url, parameter) {
  if (parameter.userId == null || parameter.userId == '') {
    parameter.userId = store.getters.userInfo.id;
  }
  const param = qs.stringify(parameter, { arrayFormat: 'repeat' });
  return axios({
    url: url + "?" + param,
    method: 'get'
  })
}

export function saveService(url, parameter) {
  if (parameter.userId == null || parameter.userId == '') {
    parameter.userId = store.getters.userInfo.id;
    parameter.userName = store.getters.userInfo.name;
  }
  const param = qs.stringify(parameter, { arrayFormat: 'repeat' });
  return axios({
    url: url + "?" + param,
    method: 'post'
  })
}

export function toService(method, url, parameter) {
  if (parameter.userId == null || parameter.userId == '') {
    parameter.userId = store.getters.userInfo.id;
    parameter.userName = store.getters.userInfo.name;
  }
  const param = qs.stringify(parameter, { arrayFormat: 'repeat' });
  return axios({
    url: url + "?" + param,
    method: method
  })
}

export function save(that) {
  return new Promise((resolve) => {
    that.spinning = true;
    that.form.validateFields((err, values) => {
      if (!err) {
        that.form_datas.forEach((items) => {
          if (items instanceof Array) {
            items.forEach((item) => {
              if (item.type == "Date") {
                if (values[item.prop]) {
                  values[item.prop] = moment(values[item.prop]).format(
                    item.format
                  );
                }
              } else if (item.type == "UploadImg" || item.type == "UploadFile") {
                values[item.datas.sign] = "";
              }
            });
          } else {
            if (items.type == "Date") {
              if (values[items.prop]) {
                values[items.prop] = moment(values[items.prop]).format(
                  items.format
                );
              }
            } else if (items.type == "UploadImg" || items.type == "UploadFile") {
              values[items.datas.sign] = "";
            }
          }
        });
        //  resolve(99);
        values.tmpId = that.tmpId;
        saveService(that.path.save_path, values)
          .then((res) => {
            if (res.code != "200") {
              that.$notification.error({
                message: "保存失败",
                description: res.message,
              });
              that.spinning = false;
              resolve(0);
            } else {
              that.$notification.success({
                message: "保存成功",
                description: "",
              });
              if (that.init_params.reRender) {
                that.form.setFieldsValue(res.result);
                that.spinning = false;
                resolve(2);
              } else {
                that.spinning = false;
                resolve(1);
              }

            }
          })
          .catch((error) => {
            that.spinning = false;
            console.log(error);
            resolve(99);
          });
      } else {
        that.spinning = false;
        resolve(99);
      }

    });
  });
}

export function submit(that, params) {
  return new Promise((resolve) => {
    const thatx = that;
    that.spinning = true;
    that.form.validateFields((err, values) => {
      if (!err) {
        that.$confirm({
          title: "提示",
          content: "确认提交吗 ?",
          async onOk() {
            thatx.form_datas.forEach((items) => {
              items.forEach((item) => {
                if (item.type == "Date") {
                  if (values[item.prop]) {
                    values[item.prop] = moment(values[item.prop]).format(
                      item.format
                    );
                  }
                } else if (item.type == "UploadImg" || item.type == "UploadFile") {
                  values[item.datas.sign] = "";
                }
              });
            });
            values.tmpId = thatx.tmpId;
            await saveService(thatx.path.save_path, values)
              .then((res) => {
                if (res.code != "200") {
                  thatx.$notification.error({
                    message: "提交失败",
                    description: res.message,
                  });
                  thatx.spinning = false;
                  resolve(0);
                } else {
                  thatx.form.setFieldsValue(res.result);
                  // 处理提交
                  params.entity_id = res.result.id;
                  //var params = { entity_id: res.result.id };

                  //if (thatx.task_params.task_id != null && thatx.task_params.task_id != "") {
                  //params.step_id = thatx.task_params.task_id;
                  //} else {
                  // params.app_id = thatx.task_params.app_id;
                  //}
                  params.sqr_id = thatx.$store.getters.userId;
                  //(params.organ_id =
                  //thatx.$store.getters.userInfo.posts.length > 0
                  //  ? thatx.$store.getters.userInfo.posts[0].id
                  //  : ""),
                  saveService(thatx.path.submit_path, params).then(
                    (res2) => {
                      if (res2.code != "200") {
                        thatx.$notification.error({
                          message: "提交失败",
                          description: res2.message,
                        });
                        thatx.spinning = false;
                        resolve(0);
                      } else {
                        thatx.$notification.success({
                          message: "提交成功",
                          description: "",
                        });
                        thatx.spinning = false;
                        resolve(1);
                      }
                    }
                  ).catch((error) => {

                    thatx.spinning = false;
                    resolve(99);
                    console.log(error);
                  });
                }
              })
              .catch((error) => {
                thatx.spinning = false;
                resolve(99);
                console.log(error);
              });
          }, onCancel() {
            thatx.spinning = false;
            resolve(99);
          }
        });
      } else {
        thatx.spinning = false;
        resolve(99);
      }
    });
  })
}

export function submit_cxtj(that, params) {
  return new Promise((resolve) => {
    const thatx = that;
    that.spinning = true;
    that.form.validateFields((err, values) => {
      if (!err) {
        that.$confirm({
          title: "提示",
          content: "确认提交吗 ?",
          async onOk() {
            thatx.form_datas.forEach((items) => {
              items.forEach((item) => {
                if (item.type == "Date") {
                  if (values[item.prop]) {
                    values[item.prop] = moment(values[item.prop]).format(
                      item.format
                    );
                  }
                } else if (item.type == "UploadImg" || item.type == "UploadFile") {
                  values[item.datas.sign] = "";
                }
              });
            });
            values.tmpId = thatx.tmpId;
            await saveService(thatx.path.save_path, values)
              .then((res) => {
                if (res.code != "200") {
                  thatx.$notification.error({
                    message: "提交失败",
                    description: res.message,
                  });
                  thatx.spinning = false;
                  resolve(0);
                } else {
                  thatx.form.setFieldsValue(res.result);

                  params.entity_id = res.result.id;
                  params.shyj = "重新提交";

                  params.sqr_id = thatx.$store.getters.userId;
                  // (params.organ_id =
                  // thatx.$store.getters.userInfo.posts.length > 0
                  // ? thatx.$store.getters.userInfo.posts[0].id
                  // : ""),
                  saveService(thatx.path.submit_path, params).then(
                    (res2) => {
                      if (res2.code != "200") {
                        thatx.$notification.error({
                          message: "提交失败",
                          description: res2.message,
                        });
                        thatx.spinning = false;
                        resolve(0);
                      } else {
                        thatx.$notification.success({
                          message: "提交成功",
                          description: "",
                        });
                        thatx.spinning = false;
                        resolve(1);
                      }
                    }
                  ).catch((error) => {
                    thatx.spinning = false;
                    console.log(error);
                    resolve(99);
                  });
                }
              })
              .catch((error) => {
                thatx.spinning = false;
                console.log(error);
                resolve(99);
              });
          }, onCancel() { thatx.spinning = false; resolve(99); }
        });
      } else {
        thatx.spinning = false;
        resolve(99);
      }
    });
  })
}

export function handle_delete(that, id, path) {
  return new Promise((resolve) => {
    const parameter = { id: id, app_code: that.$route.name };
    that.$confirm({
      title: "提示",
      content: "真的要删除该记录吗 ?",
      onOk() {
        toService("post", path, parameter).then(res => {
          if (res.code === "400") {
            that.$notification.error({
              message: "删除失败",
              description: "有相关子记录"
            });
          } else {
            that.$notification.success({
              message: "删除成功",
              description: ""
            });
            resolve(0);
            //     that.$refs.table.refresh(true);
          }
        });
      },
      onCancel() { }
    })
  });
}


export function download(path, params, fileName) {
  axios({
    url: path,
    method: "get",
    params: params,
    responseType: "blob"
  }).then(res => {
    let blob = new Blob([res]);
    if (window.navigator.msSaveOrOpenBlob) {
      navigator.msSaveBlob(blob, fileName);
    } else {
      let link = document.createElement("a");
      let evt = document.createEvent("HTMLEvents");
      evt.initEvent("click", false, false);
      link.href = URL.createObjectURL(blob);
      link.download = fileName;
      link.style.display = "none";
      document.body.appendChild(link);
      link.click();
      window.URL.revokeObjectURL(link.href);
    }
  });
}

/* export function submit_save(that, savePath, submitPath, data) {
  that.spinning = true;
  that.form.validateFields((err, values) => {
    if (!err) {
      for (var p in data) {
        values[p] = data[p];
      }
      console.log("values", values)
      that.$confirm({
        title: "提示",
        content: "确认提交吗 ?",
        onOk() {
          saveService(savePath, values).then((r) => {
            values.id = r.result.id;
            saveService(submitPath, values).then((res) => {
              if (res.code != '200') {
                that.$notification.error({
                  message: "提交失败",
                  description: res.message
                })
                that.spinning = false;
              } else {
                back_to_list(that);
                that.$notification.success({
                  message: "提交成功",
                  description: ""
                })
              }
            }).catch(error => {
              that.spinning = false;
              console.log(error);
            }
            );
          }).catch(error => {
            that.spinning = false;
            console.log(error);
          }
          );
        },
        onCancel() { that.spinning = false; }
      })
    } else {
      that.spinning = false;
    }
  });
}

export function submit_msg(that, savePath, data) {
  that.spinning = true;
  that.form.validateFields((err, values) => {
    if (!err) {
      for (var p in data) {
        values[p] = data[p];
      }
      console.log("values", values)
      saveService(savePath, values).then((res) => {
        if (res.code != '200') {
          that.$notification.error({
            message: "提交失败",
            description: res.message
          })
          that.spinning = false;
        } else {
          back_to_list(that);
          that.$notification.success({
            message: "提交成功",
            description: ""
          })
        }
      }).catch(error => {
        that.spinning = false;
        console.log(error);
      }
      );
    } else {
      that.spinning = false;
    }
  });
}

export function submit_save_msg(that, savePath, submitPath, data) {
  that.spinning = true;
  that.form.validateFields((err, values) => {
    if (!err) {
      for (var p in data) {
        values[p] = data[p];
      }
      console.log("values", values)
      saveService(savePath, values).then((r) => {
        values.id = r.result.id;
        saveService(submitPath, values).then((res) => {
          if (res.code != '200') {
            that.$notification.error({
              message: "提交失败",
              description: res.message
            })
            that.spinning = false;
          } else {
            back_to_list(that);
            that.$notification.success({
              message: "提交成功",
              description: ""
            })
          }
        }).catch(error => {
          that.spinning = false;
          console.log(error);
        }
        );
      }).catch(error => {
        that.spinning = false;
        console.log(error);
      }
      );
    } else {
      that.spinning = false;
    }
  });
}

export async function submit_msg_novalid(that, savePath, data) {
  that.spinning = true;
  await saveService(savePath, data).then((res) => {
    if (res.code != '200') {
      that.$notification.error({
        message: "提交失败",
        description: res.message
      })
      that.spinning = false;
    } else {
      that.$notification.success({
        message: "提交成功",
        description: ""
      })
    }
  }).catch(error => {
    that.spinning = false;
    console.log(error);
  }
  );
} */



export function back_to_list(that) {
  that.$emit("edit", { record: {}, state: "list" });
}

export function hasRole(actionName) {
  var hasrole = false;
  const actions = actionName.split(",")
  const roles = store.getters.roles;
  roles.forEach(p => {
    if (actions && actions.includes(p)) {
      hasrole = true;
    }
  })
  return hasrole;
}