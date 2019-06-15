import F2 from '../../lib/my-f2';
var handel = require('../../utils/handel.js');
Page({
  data: {
    loading: true,
    tabbar: {},
    latesHumid: '',
    latesPa: '',
    latesSunlux: '',
    latestTemp: '',
    latesWirect: '',
    latesWspeed: 0,
    latesWspeed1: 10,
    latesSoiltemp: 0,
    latesSoilmture: 0,
    latesRain: 0
  },
  onLoad() {
    const _this = this;
    this.getWindChart()
  },
  chartInit(canvas, width, height, data, obj, unit, lineType) {
    const chart = new F2.Chart({
      el: canvas,
      width,
      height,
      pixelRatio: my.getSystemInfoSync().pixelRatio
    });
    chart.source(data, {
      month: {
      },
      value: {
        tickCount: 6,
        alias: '风速',
        formatter(val) {
          console.log(val);
          return val
        }
      }
    });
    chart.axis(obj.propertX, {
      label(text, index, total) {
        const textCfg = {};
        if (index === 0) {
          textCfg.textAlign = 'left';
        }
        if (index === total - 1) {
          textCfg.textAlign = 'right';
        }
        return textCfg;
      }
    });
    chart.axis(obj.propertX, {
      label: {
        rotate: -Math.PI / 5,
        textAlign: 'end',
        textBaseline: 'middle'
      },
      grid: {
        stroke: '#efefef',
        lineWidth: 1,
        lineDash: [2, 2]
      }
    });

    chart.tooltip({
      showCrosshairs: true,
      custom: true, // 自定义 tooltip 内容框
      onChange(obj) {
        const legend = chart.get('legendController').legends.top[0];
        const tooltipItems = obj.items;
        const legendItems = legend.items;
        const map = {};
        legendItems.map(item => {
          map[item.name] = Object.assign({}, item);
        });
        tooltipItems.map(item => {
          const { name, value } = item;
          if (map[name]) {
            if (lineType == 2) {
              var num = parseFloat(value);
              if (num <= 5.4) {
                map[name].value = "微风";
              }
              if (5.4 < num && num <= 7.9) {
                map[name].value = "和风";
              }
              if (7.9 < num && num <= 10.7) {
                map[name].value = "劲风";
              }
              if (10.7 < num && num <= 13.8) {
                map[name].value = "强风";
              }
              if (13.8 < num) {
                map[name].value = "大风";
              }
            } else {
              map[name].value = value + " " + unit;
            }
          }
        });
        legend.setItems(Object.values(map));
      },
    });
    if (lineType == 1) {
      chart.area().position(obj.propertX + '*' + obj.propertY).shape('smooth').color(obj.color).style({
        fill: 'l(90) 0.01:' + obj.color + ' 1:#fff',
        fillOpacity: 0.5
      });;
      chart.line().position(obj.propertX + '*' + obj.propertY).shape('smooth').color('type', val => {
        return obj.color;
      });
      chart.render();
      return chart;
    }

    if (lineType == 2) {
      chart.line().position(obj.propertX + '*' + obj.propertY).color('type', val => {
        return obj.color;
      });
      chart.point().position(obj.propertX + '*' + obj.propertY).color(obj.color).adjust('stack');
      chart.render();
      return chart;
    }
    if (lineType == 3) {
      chart.area().position(obj.propertX + '*' + obj.propertY).color('type', function (type) {
        if (type == "湿度") {
          return '#00751e'
        } else {
          return obj.color;
        }
      });
      chart.line().position(obj.propertX + '*' + obj.propertY).color('type', function (type) {
        if (type == "湿度") {
          return '#00751e'
        } else {
          return obj.color;
        }

      });
      chart.point().position(obj.propertX + '*' + obj.propertY).color(obj.color).style('type', {
        lineWidth: 1,
        fill: '#fff',
        stroke: function stroke(type) {
          if (type === "湿度") {
            return '#00751e'
          } else {
            return obj.color
          }
        }
      });
      chart.render();
      return chart;
    }
    if (lineType == 4) {
      chart.area().position(obj.propertX + '*' + obj.propertY).color('type', function (type) {
        if (type == "温度") {
          return '#ff9c00'
        } else {
          return '#00b9bb'
        }
      }).shape('smooth');
      chart.line().position(obj.propertX + '*' + obj.propertY).shape('smooth').color('type', function (type) {
        if (type == "温度") {
          return '#ff9c00'
        } else {
          return '#00b9bb'
        }
      });
      chart.render();
      return chart;
    }
  },
  getWindChart(url, data, ele) {//风向风速
    const that = this;
    console.log(my.getStorageSync({ key: 'plot_id' }).data);
    handel.handelRequest(that, {
      url: "/weather/climate",
      data: { plot_id: my.getStorageSync({ key: 'plot_id' }).data || '' }
    }, function (res) {
      that.setData({
        loading: false
      })
      if (Object.keys(res).length > 0 || res.length > 0) {
        var windData = res.Windspds || [];
        var rainData = res.rain || [];
        var airPa = res.airPa.pa || [];
        var airSunlux = res.airSunlux.sunlux || [];
        var airTemp = res.airTemp.temps || [];
        var airHumid = res.airHumid.humids || [];
        var airHumid = res.Soilmtures || [];
        if (res.soiltemps && res.soiltemps.length > 0) {
          airTemp = res.soiltemps.concat(res.airTemp.temps)
        }
        if (res.Soilmtures && res.Soilmtures.length > 0) {
          var airHumid = res.Soilmtures.concat(res.airHumid.humids);
        }
        that.setData({
          latesHumid: res.airHumid.latestHumid || 0,
          latesPa: res.airPa.latesPa || 0,
          latesSunlux: res.airSunlux.latesSunlux || 0,
          latestTemp: res.airTemp.latestTemp || 0,
          latesWirect: res.latesWinddir || 0,
          latesWspeed: res.lateswindspd || 0,
          latesRain: res.latesRain || 0,
          latesSoiltemp: res.latesSoiltemp || 0,
          latesSoilmture: res.latesSoilmture || 0,
        })
      }

      /*  风向风速 */
      my.createSelectorQuery()
        .select('#wind')
        .boundingClientRect()
        .exec((res) => {
          const pixelRatio = my.getSystemInfoSync().pixelRatio;
          const canvasWidth = res[0].width;
          const canvasHeight = res[0].height;
          const myCtx = my.createCanvasContext('wind');
          myCtx.scale(pixelRatio, pixelRatio);
          const canvas = new F2.Renderer(myCtx);
          that.windCanvas = canvas;
          that.chartInit(canvas, canvasWidth, canvasHeight, windData, { 'color': '#004b7f', 'propertX': 'date', 'propertY': 'windspd' }, "", '2')
        });

      /* 降雨量 */
      my.createSelectorQuery()
        .select('#rain')
        .boundingClientRect()
        .exec((res) => {
          const pixelRatio = my.getSystemInfoSync().pixelRatio;
          const canvasWidth = res[0].width;
          const canvasHeight = res[0].height;
          const myCtx = my.createCanvasContext('rain');
          myCtx.scale(pixelRatio, pixelRatio);
          const canvas = new F2.Renderer(myCtx);
          that.rainCanvas = canvas;
          that.chartInit(canvas, canvasWidth, canvasHeight, rainData, { 'color': '#29bec0', 'propertX': 'date', 'propertY': 'rain' }, "mm", '1')
        });

      /*  空气土壤湿度 */
      my.createSelectorQuery()
        .select('#airHM')
        .boundingClientRect()
        .exec((res) => {
          const pixelRatio = my.getSystemInfoSync().pixelRatio;
          const canvasWidth = res[0].width;
          const canvasHeight = res[0].height;
          const myCtx = my.createCanvasContext('airHM');
          myCtx.scale(pixelRatio, pixelRatio);
          const canvas = new F2.Renderer(myCtx);
          that.airHMCanvas = canvas;
          that.chartInit(canvas, canvasWidth, canvasHeight, airHumid, { 'color': '#0aa666', 'propertX': 'date', 'propertY': 'soilmture' }, "%", '3')
        });
      /* 空气土壤温度 */
      my.createSelectorQuery()
        .select('#airTemp')
        .boundingClientRect()
        .exec((res) => {
          const pixelRatio = my.getSystemInfoSync().pixelRatio;
          const canvasWidth = res[0].width;
          const canvasHeight = res[0].height;
          const myCtx = my.createCanvasContext('airTemp');
          myCtx.scale(pixelRatio, pixelRatio);
          const canvas = new F2.Renderer(myCtx);
          that.airTempCanvas = canvas;
          that.chartInit(canvas, canvasWidth, canvasHeight, airTemp, { 'color': '#29bec0', 'propertX': 'date', 'propertY': 'temp' }, "℃", '4')
        });


      /* 光照 */
      my.createSelectorQuery()
        .select('#beam')
        .boundingClientRect()
        .exec((res) => {
          const pixelRatio = my.getSystemInfoSync().pixelRatio;
          const canvasWidth = res[0].width;
          const canvasHeight = res[0].height;
          const myCtx = my.createCanvasContext('beam');
          myCtx.scale(pixelRatio, pixelRatio);
          const canvas = new F2.Renderer(myCtx);
          that.beamCanvas = canvas;
          that.chartInit(canvas, canvasWidth, canvasHeight, airSunlux, { 'color': '#ff8708', 'propertX': 'date', 'propertY': 'avg_sunlux' }, 'H', '1')
        });


      /* 气压 */
      my.createSelectorQuery()
        .select('#pressure')
        .boundingClientRect()
        .exec((res) => {
          const pixelRatio = my.getSystemInfoSync().pixelRatio;
          const canvasWidth = res[0].width;
          const canvasHeight = res[0].height;
          const myCtx = my.createCanvasContext('pressure');
          myCtx.scale(pixelRatio, pixelRatio);
          const canvas = new F2.Renderer(myCtx);
          that.pressureCanvas = canvas;
          that.chartInit(canvas, canvasWidth, canvasHeight, airPa, { 'color': '#0aa666', 'propertX': 'date', 'propertY': 'avg_pa' }, 'Pa', '1')
        });
    })
  },
  touchStart(e) {
    const currCanvas = e.currentTarget.id + 'Canvas'
    if (this[currCanvas]) {
      this[currCanvas].emitEvent('touchstart', [e]);
    }
  },
  touchMove(e) {
    const currCanvas = e.currentTarget.id + 'Canvas'
    if (this[currCanvas]) {
      this[currCanvas].emitEvent('touchmove', [e]);
    }
  },
  touchEnd(e) {
    const currCanvas = e.currentTarget.id + 'Canvas'
    if (this[currCanvas]) {
      this[currCanvas].emitEvent('touchEnd', [e]);
    }
  },
});
