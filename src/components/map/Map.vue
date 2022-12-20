<template>
  <div id="container-map">
  </div>
</template>

<script>
import AMapLoader from "@amap/amap-jsapi-loader";
// 设置安全密钥
window._AMapSecurityConfig = {
  securityJsCode: '4eda3a25bd506b9451fe868c12275625',
}
export default {
  name: 'Map',
  props: {
    center: { type: Array, default: () => []},
    onClick: { type: Function }
  },
  data() {
    return {
      map : null,
      AMap: null,
      mouseTool : null,
      overlays : [],
      auto : null,
      placeSearch : null,
      marker: null,
      markerPosition: [116.397428, 39.90923]
    }
  },
  // 鉴定地图位置变化，重新 init map
  watch: {
    center: {
      deep: true,
      handler() {
        this.initMap()
      }
    }
  },
  mounted() {
    this.initMap()
  },
  methods : {
    initMap() {
      AMapLoader.load({
        "key": "c056c7bb7344be62356bed0f5e4ac0f2", 
        "version": "2.0",
        "plugins": ["AMap.Scale","AMap.ToolBar","AMap.ControlBar","AMap.MouseTool","AMap.MapType","AMap.HawkEye"],
      }).then((AMap) => {
        this.AMap = AMap
        var layer = new AMap.TileLayer({
            zooms:[3,20],    //可见级别
            visible:true,    //是否可见
            opacity:1,       //透明度
            zIndex:0         //叠加层级
        })
        // 初始化地图
        this.map = new AMap.Map('container-map', {
            viewMode: '2D', 
            zoom:11,
            layers: [layer],
            center: this.center,
            resizeEnable: true
        })

        this.map.addControl(new AMap.Scale());   // 添加左下角的比例尺
        let toolBar = new AMap.ToolBar({
            position: {
                top: '120px',
                left: '42px'
            }
        });
        let controlBar = new AMap.ControlBar({
          position: {
            top: '10px',
            left: '10px',
          },
        });
        this.map.addControl(toolBar);       // 添加右下角的放大缩小
        this.map.addControl(controlBar);    // 方向盘
        this.map.addControl(new AMap.MapType());      // 添加右上角的标准图和卫星图  和路况
        // this.map.addControl(new AMap.HawkEye());   // 添加地图放大镜

        this.addMarker(this.center)
        this.map.on('click', this.showInfoClick)
      }).catch(e => {
        console.log(e)
      })
    },
    showInfoClick(e) {
      this.clearMarker()

      const clickPosition = [e.lnglat.getLng(), e.lnglat.getLat()]
      this.markerPosition = clickPosition

      this.onClick(clickPosition)
      this.addMarker(clickPosition)
    },
    // 实例化点标记
    addMarker(position) {
      this.marker = new this.AMap.Marker({
        icon: "//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-default.png",
        position: position,
        offset: new this.AMap.Pixel(-24, -58)
      })
      this.marker.setMap(this.map);
    },
    // 清除标记
    clearMarker() {
      if (this.marker) {
            this.marker.setMap(null);
            this.marker = null;
        }
    }
  }
}
</script>

<style scoped>
#container-map {
  overflow: hidden;
  width: 100%;
  height: 400px;
  margin: 0;
  font-family: "微软雅黑";
}
</style>
