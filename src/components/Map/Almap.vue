<template>
  <a-modal
    :title="title"
    :width="800"
    :height="450"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel"
  >
    <div class="content">
      <div class="amap-wrapper">
        <el-amap-search-box
          class="search-box"
          :search-option="searchOption"
          :on-search-result="onSearchResult"
        ></el-amap-search-box>
        <el-amap
          class="amap-box"
          :zoom="zoom"
          :center="center"
          :events="events"
          :mapStyle="mapStyle"
        >
          <el-amap-marker
            v-for="(marker, i) in markers"
            :key="i"
            :position="marker"
          ></el-amap-marker>
        </el-amap>
      </div>
      <div class="Y-font-size-20 Y-margin-vertical-top-8">
        您选择的地址是：{{ address }}, 经纬度为：{{ longitude }} , {{ latitude }}
      </div>
    </div></a-modal
  >
</template>
<script>
export default {
  props: {
    longitude: {
      type: Number,
      default: 111.348198,
    },
    latitude: {
      type: Number,
      default: 30.760082,
    },
    address: {
      type: String,
      default: "宜昌市东方大厦",
    },
    markers: {
      type: Array,
    },
    title: {
      type: String,
      default: "选择地图",
    },
  },
  data() {
    let _this = this;
    console.log(this.markers);
    return {
      visible: false,
      confirmLoading: false,
      center: [this.longitude, this.latitude], //地图中心点坐标 济南市
      zoom: 16, //初始化地图显示层级
      mapStyle: "amap://styles/8b6be8ec497009e17a708205348b899a", //设置地图样式
      searchOption: {
        city: "全国",
        citylimit: true,
      },
      lng: this.longitude,
      lat: this.latitude,
      adress : this.address,
      events: {
        init: () => {},
        moveend: () => {},
        zoomchange: () => {},
        click: (e) => {
          let { lng, lat } = e.lnglat;
          this.center = [lng, lat];
          this.markers = [[lng, lat]];
          this.lng = lng;
          this.lat = lat;
          // 这里通过高德 SDK 完成。
          var geocoder = new window.AMap.Geocoder({
            // city 指定进行编码查询的城市，支持传入城市名、adcode 和 citycode
            city: "全国",
          });

          geocoder.getAddress([lng, lat], function (status, result) {
            if (status === "complete" && result.info === "OK") {
              if (result && result.regeocode) {
                _this.adress = result.regeocode.formattedAddress;
              }
            }
          });
        },
      },
    };
  },
  created() {
    // 已载入高德地图API，则直接初始化地图
    if (window.AMap && window.AMapUI) {
      this.initMap();
      // 未载入高德地图API，则先载入API再初始化
    }
  },
  methods: {
    onSearchResult(pois) {
      if (pois.length > 0) {
        let center = pois[0];
        this.lng = center.lng;
        this.lat = center.lat;
        this.address = center.name;
        this.adress = center.name;
        this.center = [center.lng, center.lat];
        this.markers = [[center.lng, center.lat]];
      }
    },
    add() {
      this.visible = true;
    },
    handleCancel() {
      this.visible = false;
    },
    handleSubmit() {
      this.$emit("getPosi", this.lng, this.lat, this.adress);
      this.visible = false;
      this.confirmLoading = false;
    },
  },
};
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.search-box {
  position: absolute;
  top: 25px;
  left: 20px;
}
.amap-wrapper {
  width: 100%;
  height: 500px;
  position: relative;
}
</style>
