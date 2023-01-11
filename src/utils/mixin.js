import { deviceEnquire, DEVICE_TYPE } from '@/utils/device'
import { mapState } from 'vuex'

const mixin = {
  computed: {
    ...mapState({
      layoutMode: state => state.app.layout,
      navTheme: state => state.app.theme,
      primaryColor: state => state.app.color,
      colorWeak: state => state.app.weak,
      fixedHeader: state => state.app.fixedHeader,
      fixSiderbar: state => state.app.fixSiderbar,
      fixSidebar: state => state.app.fixSiderbar,
      contentWidth: state => state.app.contentWidth,
      autoHideHeader: state => state.app.autoHideHeader,
      sidebarOpened: state => state.app.sidebar,
      multiTab: state => state.app.multiTab
    })
  },
  methods: {
    isTopMenu() {
      return this.layoutMode === 'topmenu'
    },
    isSideMenu() {
      return !this.isTopMenu()
    }
  }
}

const mixinDevice = {
  computed: {
    ...mapState({
      device: state => state.app.device
    })
  },
  methods: {
    isMobile() {
      return this.device === DEVICE_TYPE.MOBILE
    },
    isDesktop() {
      return this.device === DEVICE_TYPE.DESKTOP
    },
    isTablet() {
      return this.device === DEVICE_TYPE.TABLET
    }
  }
}

const AppDeviceEnquire = {
  mounted() {
    const { $store } = this
    deviceEnquire(deviceType => {
      switch (deviceType) {
        case DEVICE_TYPE.DESKTOP:
          $store.commit('TOGGLE_DEVICE', 'desktop')
          $store.dispatch('setSidebar', true)
          break
        case DEVICE_TYPE.TABLET:
          $store.commit('TOGGLE_DEVICE', 'tablet')
          $store.dispatch('setSidebar', false)
          break
        case DEVICE_TYPE.MOBILE:
        default:
          $store.commit('TOGGLE_DEVICE', 'mobile')
          $store.dispatch('setSidebar', true)
          break
      }
    })
  }
}
const main = {
  data() {
    return {
      // 公共参数，包含name_path
      public_params: {},
      // 属性参数,用来加载公共属性，如list，tree等
      prop_params: {},
      // 打开form时传递的参数
      form_params: {
        query_params: {
          id: ""
        },
        source: "main"
      },
      // list参数
      list_params: {},
      // 隐藏参数
      hidden_datas: [],
      task_params: {
        app_id: this.$route.name.substring(
          1,
          this.$route.name.length
        )
      },
      task_view_params: { title: "", prcocess_steps: [], current: 0, comments: [], comment_current: 0 },

      // 路径参数，用来初始化路径
      path: {},

      // 打开list时传递的参数
      //list_params: {},
      // list 初始化参数
      //init_params: {},
      // list 操作权限
      //oper_roles: {},
      // 抽屉参数
      draw_params: {
        visible: false,
        closable: true,
        maskClosable: true,
      },
      // 当列表是tree时显示的参数
      //tree_params: {
      //
      //},
      spinning: false
    }
  }, methods: {
    // 打开抽屉
    edit_new() {
      this.form_params.query_params.id = "";
      this.form_params.query_params.tmp_id = Math.random().toString(36).substring(2);
      this.form_params.entity_datas = null;
      this.form_params.readOnly = false;
      this.draw_params.visible = true;
      this.form_params.source = "main";
      this.form_params.type = "edit";
    },
    // 打开抽屉
    edit(data) {
      if (data.record.id != null) {
        this.form_params.query_params.id = data.record.id;
        this.form_params.query_params.tmp_id = data.record.id;
        this.form_params.entity_datas = data.record;

        if (this.$store.getters.userInfo.id != this.form_params.entity_datas.crtUid) {
          if (data.record.readOnly) {
            this.form_params.readOnly = true;
          } else {
            this.form_params.readOnly = false;
          }
        } else {
          this.form_params.readOnly = data.record.readOnly;
        }
      } else {
        this.form_params.query_params.id = "";
        this.form_params.query_params.tmp_id = Math.random().toString(36).substring(2);
        this.form_params.entity_datas = null;
        this.form_params.readOnly = false;
      }
      //if (data.record.step_id != null) {
      //this.task_params.task_id = data.record.step_id;
      //} else {
      //this.task_params.task_id = "";
      // }
      this.form_params.source = "main";
      this.form_params.type = "edit";


      this.draw_params.visible = true;
    },
    // 打开抽屉 新增下级
    edit_lower(data) {
      this.form_params.source = "main";
      this.form_params.type = "addlower";
      this.form_params.query_params.scId = data.id;
      this.form_params.query_params.tmp_id = Math.random().toString(36).substring(2);
      //this.form_params.edit_path = this.get_path(this.$route.path + "/addlower")
      this.form_params.entity_datas = null;
      this.draw_params.visible = true;
    },
    // 打开抽屉
    edit_workspace(data) {
      this.form_params.source = "workspace";
      this.form_params.type = "edit";
      this.form_params.query_params.id = data.task.key_value;
      this.form_params.query_params.tmp_id = data.task.key_value;
      this.form_params.entity_datas = data.entity;

      if (data.task.step_id != null) {
        this.task_params.step_id = data.task.step_id;
        this.task_params.task_id = data.task.step_id.substring(0, 4);

        if (data.task.step_id.substring(4, 8) == '0000') {
          this.form_params.readOnly = false;
        } else {
          this.form_params.readOnly = true;
        }
      } else {
        //this.task_params.task_id = "";
      }
      this.form_params.edit_path = this.get_path(
        "/" +
        data.task.params_map.service_path +
        "/" +
        data.task.params_map.service_path_type
      );
      this.task_params.id = data.task.id;

      //  this.task_params.open_task = true;
      //this.form_params.entity_datas = data.record;
      //this.form_params.readOnly = data.readOnly;
      this.draw_params.visible = true;
    },
    // 关闭抽屉
    onClose() {
      this.draw_params.visible = false;
      this.form_params.edit_path = null;
    },
    get_path(path) {
      return "/" + this.GLOBAL.MODEL_SYSTEM + path;
    }
  }
}
const queryList = {
  data() {
    return {
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {},
      // 路径
      path: {},
      // 操作权限
      //permission_map: {
      //canNew: true,
      //canEdit: true,
      //canView: false,
      //canDelete: true
      //},
      // 默认查询条数
      pageSize: 20,
      columns: []
      // 是否开启查询
      //hasQuery: true,
    }
  },
  methods: {
    // 获取路径
    get_path(name_path, query) {
      return "/" + this.GLOBAL.MODEL_SYSTEM + name_path + query;
    },
    assign(target, source) {
      if (source != null) {
        target = source;
      }
      return target;
    },
    // 展开关闭查询
    toggleAdvanced() {
      this.advanced = !this.advanced;
    },
    //handle_edit(record, readOnly) {
    //this.$emit("edit", { record: record, readOnly: readOnly });
    // },
    // 初始化方法
    init() {
      const name_path = this.$route.path;
      // init路径 如果不传递路径时 使用默认路径
      if (this.list_params.path_query == null) {
        this.path.query_path = this.get_path(name_path, "/main");
      } else {
        this.path.query_path = this.list_params.path_query;
      }
      if (this.list_params.path_delete == null) {
        this.path.delete_path = this.get_path(name_path, "/delete");
      } else {
        this.path.delete_path = this.list_params.path_delete;
      }
      // init一页显示数 不传递时 =20
      if (this.list_params.pageSize != null) {
        this.pageSize = this.list_params.pageSize;
      }
      // 初始化columns 检查是否有参数
      this.list_columns.forEach(p => {
        if (p.roles != null && p.roles.length > 0) {
          if (hasRoles(this, p.roles)) {
            this.columns.push(p);
          }
        } else {
          this.columns.push(p);
        }
      })
      //if (this.columns.length != 0) {
      // this.columns.c
      // }
    },
  }
}

const editForm = {
  data() {
    return {
      // 加载中
      spinning: true,
      // 路径
      path: {},
      // tmpId
      tmpId: Math.random().toString(36).substring(2),
      // 初始化参数
      init_params: {
        title: "",
        needCard: false,
        needId: true,
        needProcess: false,
        needBase: true,
        reRender: false,
        readOnly: false,
        query_params: { id: "" }
      }
    }
  },
  methods: {
    assign(target, source) {
      if (source != null) {
        target = source;
      }
      return target;
    },
    get_path(name_path, query) {
      return "/" + this.GLOBAL.MODEL_SYSTEM + name_path + query;
    },
  }
}

const treeList = {
  data() {
    return {
      code: "",
      tree: [],
      expandedKeys: [],
      autoExpandParent: true,
      searchValue: "",
      dataList: [],
      defaultExpandedKeys: [],
      selectedKeys: []
    }
  }, methods: {
    init_tree() {
      if (this.tree_params.path_tree == null) {
        this.path.tree_path = this.get_path("/tree", "/get");
      } else {
        this.path.tree_path = this.tree_params.path_tree;
      }
    },
    onExpand(expandedKeys) {
      this.expandedKeys = expandedKeys;
      this.autoExpandParent = false;
    },
    onChange(e) {
      const value = e.target.value;
      const expandedKeys = this.dataList
        .map(item => {
          if (item.title.indexOf(value) > -1) {
            return getParentKey(item.key, this.tree);
          }
          return null;
        })
        .filter((item, i, self) => item && self.indexOf(item) === i);
      Object.assign(this, {
        expandedKeys,
        searchValue: value,
        autoExpandParent: true
      });
    }
  }
}

const getParentKey = (key, tree) => {
  let parentKey;
  for (let i = 0; i < tree.length; i++) {
    const node = tree[i];
    if (node.children) {
      if (node.children.some(item => item.key === key)) {
        parentKey = node.key;
      } else if (getParentKey(key, node.children)) {
        parentKey = getParentKey(key, node.children);
      }
    }
  }
  return parentKey;
};

const generateList = (data, dataList) => {
  for (let i = 0; i < data.length; i++) {
    const node = data[i];
    const key = node.key;
    const title = node.title;
    dataList.push({ key, title: title });
    if (node.children) {
      generateList(node.children, dataList);
    }
  }
};

const hasRoles = (t, roles) => {
  var has = false;
  const role = t.$store.getters.roles;
  role.forEach(p => {
    if (roles && roles.includes(p)) {
      has = true;
    }
  })
  return has;
};


export { mixin, AppDeviceEnquire, mixinDevice, queryList, treeList, generateList, editForm, main }
