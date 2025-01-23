<template>
  <div
    :class="['home', act.red_template_type === 1 ? 'bg1' : 'bg2']"
    v-if="act"
  >
    <div class="top">
      <img
        src="@/assets/mode/type-one.png"
        alt=""
        class="topImg1"
        v-if="act.red_template_type === 1"
      />
      <img src="@/assets/mode/type-two.png" alt="" class="topImg2" v-else />
    </div>
    <div class="video-box" @click="play()">
      <video
        class="video"
        @pause="is_stop = true"
        @play="is_stop = false"
        ref="video"
        :src="act.integrity.upload.path"
      ></video>
      <div v-if="is_stop" class="play" @click.stop="play()"></div>
    </div>
    <div class="tips">
      温馨提示：视频描述已经粘贴在剪切板，发布时可直接粘贴使用。
    </div>

    <div class="textBox">
      <textarea readonly disabled v-model="act.des" class="textarea"></textarea>
    </div>

    <div class="btn" v-if="!is_publish" @click="release()">
      <span class="span">发布视频领取奖励</span>
    </div>
    <div class="btn" v-else>
      <span class="span">已发布</span>
    </div>
    <!-- 微信浏览器内的蒙层 -->
  </div>
  <div class="mask" v-else-if="isGzh">
    <div>
      <img class="arrow" src="@/assets/mode/arrow.png" alt="" width="100px" />
      <div class="text">
        <div class="tip1">
          <span>点击右上角</span>
          <img src="@/assets/mode/write.png" width="2%" class="mar20" />
        </div>
        <div class="tip1">
          选择在<img
            src="@/assets/mode/browser.png"
            width="10%"
            class="mar20"
          />浏览器中打开，
        </div>
        <div v-if="authorization !== 0">
          <div class="tip2">
            <span> 如果下方出现完整授权，</span>
          </div>
          <div class="tip1">
            <span> 请先点击授权。 </span>
          </div>
          <img
            class="arrowhead"
            src="@/assets/mode/arrowhead.gif"
            alt=""
            width="100px"
          />
        </div>
      </div>
    </div>

    <!-- 授权弹窗 -->
    <!-- <van-popup
      v-model="authPop"
      class="authPop"
      :close-on-click-overlay="false"
      :lock-scroll="false"
    >
      <div class="pop_con" @click="getAuth">
        <h2>您还未授权</h2>
        <p class="desc1">授权后获得最佳体验</p>
        <img src="@/assets/mode/auth.png" width="133px" />
        <p class="desc2">*授权获取你的公开信息（昵称，头像等）</p>
        <button>确认授权</button>
      </div>
    </van-popup> -->
  </div>
  <div v-else-if="!act" class="centerRH"></div>
</template>

<script>
// import { Field } from "vant";
import checkBrower from "@/utils/checkBrower";
import {
  getActivityDetail,
  getVideobind,
  setLocation,
  checkLocation,
  getscheme,
} from "@/api/index";
import { MessageBox, Indicator } from "mint-ui";
import "mint-ui/lib/style.css";
// import { Dialog } from "vant"
export default {
  name: "HomeView",
  //   components: {
  //     [Dialog.Component.name]: Dialog.Component,
  //   },
  // components: { VanField: Field },
  data() {
    return {
      isGzh: false,
      type: 1,
      act: null,
      is_stop: true,
      is_publish: false,
      share_id: null,
      latitude: null,
      longitude: null,
      authorization: "",
      authPop: true,
    };
  },
  created() {
    // if (navigator.geolocation) {
    //   console.log(11111);
    //   navigator.geolocation.getCurrentPosition(
    //     (res) => {
    //       console.log(3333, res);
    //       const { latitude, longitude } = res.coords;
    //       this.sendLocation({ latitude, longitude });
    //     },
    //     (err) => {
    //       console.log(4444, err);
    //     }
    //   );
    // } else {
    //   MessageBox("提示", "您的浏览器不支持地理定位");
    // }

    this.isGzh = checkBrower() === 1 ? true : false;
    if (this.isGzh) {
      document.body.style.overflow = "hidden";
      // 初始化微信
      this.initWx();
    }
    const { activity_id, user_id } = this.$route.query;
    if (activity_id && user_id && !this.isGzh) {
      Indicator.open({
        text: "加载中...",
        spinnerType: "snake",
      });

      getActivityDetail({ activity_id, user_id })
        .then((res) => {
          if (res && res.code === 0) {
            this.act = res.data.activity;
            this.is_publish = res.data.is_publish;
            // this.share_id = res.data.activity.integrity.video.share_id;
            this.id = res.data.activity;
            document.title = res.data.activity.title;
            this.latitude = res.data.location.latitude;
            this.longitude = res.data.location.longitude;
          }

          checkLocation({
            latitude: this.latitude,
            longitude: this.longitude,
            activity_id,
            user_id,
          }).then((res) => {
            if (res.code === 0 && res.data.is_location === false) {
              MessageBox("提示", "您不在活动范围，发布将无奖励");
            }
          });
        })
        .catch((err) => {
          MessageBox("提示", err.message);
        })
        .finally(() => {
          Indicator.close();
        });
    }
  },

  methods: {
    play() {
      if (this.is_stop) {
        this.$refs.video.play();
      } else {
        this.$refs.video.pause();
      }
    },
    release() {
      if (Number(this.act.balance_money) < 0.3) {
        MessageBox.confirm("红包已领取完，请和商家确认").then(() => {
          //   window.open(this.act.integrity.scheme);
          this.sendData();
        });
      } else {
        this.sendData();
        // window.open(this.act.integrity.scheme);
      }
    },
    sendData() {
      Indicator.open({
        text: "加载中...",
        spinnerType: "snake",
      });
      //   let tmpWindow = window.open();
      const { activity_id, user_id } = this.$route.query;
      getscheme({ id: this.act.integrity.id, activity_id })
        .then((res) => {
          // console.log(res, "res");
          this.share_id = res.data.share_id;
          this.scheme = res.data.scheme;

          getVideobind({ activity_id, user_id, share_id: this.share_id })
            .then(() => {
              window.location.href = this.scheme;
            })
            .catch((err) => {
              MessageBox("提示", err.message);
            })
            .finally(() => {
              Indicator.close();
            });
        })
        .catch((err) => {
          const msg = err && err.message ? err.message : "网络错误";
          MessageBox("提示", msg);
        })
        .finally(() => {
          Indicator.close();
        });
    },

    async initWx() {
      try {
        // 微信配置
        var qx = await this.$store.dispatch("wx/getSdk");
        console.log(qx.code, "frpc.exe");
        this.authorization = qx.code;

        await this.$store.dispatch("wx/checkWxConfig", ["hideMenuItems"]);
        // this.wx.hideAllNonBaseMenuItem();
        // 地理位置
        var location = await this.$store.dispatch("wx/getLocation");
        this.sendLocation(location);
        // this.Location(location);
      } catch (e) {
        console.log("initWx1", e);
      }
    },
    // Location({ latitude, longitude }) {
    //   const { activity_id, user_id } = this.$route.query;
    //   checkLocation({ latitude, longitude, activity_id, user_id }).then(
    //     (res) => {
    //       console.log(res, "8888");
    //     }
    //   );
    // },

    sendLocation({ latitude, longitude }) {
      const { user_id } = this.$route.query;
      setLocation({ latitude, longitude, user_id }).then((res) => {
        console.log(res, "longitude");
      });
    },
  },
};
</script>
<style lang="css">
.centerRH {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100vh;
}
.centerRH img {
  width: 64px;
}
.topImg1 {
  width: 262px;
}
.topImg2 {
  width: 240px;
}
.home {
  min-height: 100vh;
  background-color: burlywood;
  padding: 0 40px 30px;
}
.home.bg1 {
  background-image: url("@/assets/mode/bg-one.png");
}
.home.bg2 {
  background-image: url("@/assets/mode/bg-two.png");
}
.top {
  padding-top: 38px;
}
.video {
  width: 100%;
  height: 100%;
}
.video-box {
  width: 300px;
  height: 192px;
  background-color: #000;
  border: 2.5px solid #68e8fe;
  border-radius: 10px;
  overflow: hidden;
  margin: 25px auto 0;
  position: relative;
}
.play {
  width: 55px;
  height: 55px;
  background-image: url("@/assets/mode/play.png");
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1;
}
.tips {
  width: 264px;
  margin: 13px auto;
  font-size: 12px;
  font-weight: 400;
  text-align: left;
  color: #ffffff;
}
.textarea {
  width: 100%;
  height: 100%;
  background: #f5f5f5;
  border-radius: 10px;
  display: block;
  border: 0;
  padding: 8px;
  font-size: 12px;
  color: #333333;
}
.textBox {
  width: 100%;
  height: 128px;
  background: #ffffff;
  /* border: 0.5px solid #68e8fe; */
  border-radius: 10px;
  padding: 10px;
  box-shadow: 0 0 8px #103e46;
}
.btn {
  width: 244px;
  height: 48px;
  position: relative;
  margin-left: 20px;
  display: block;
  background-image: url("@/assets/mode/btn.png");
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  margin-top: 15px;
  text-decoration: none;
  display: flex;
  justify-content: center;
  align-items: center;
}
.span {
  font-size: 18px;
  color: #fefefe;
  text-shadow: -0.5px 0px 0px 0.5px #ffb331;
}
.mask {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 2;
  background-color: rgba(41, 37, 37, 0.9);
  pointer-events: none;
}
.mask .arrow {
  margin-left: 264px;
}
.mask .arrowhead {
  margin-left: 204px;
}
.mask .tip1 {
  display: flex;
  align-items: center;
}
.mask .tip2 {
  padding-top: 100px;
}

.text {
  /* width: 253.5px; */
  height: 80.5px;
  font-size: 20px;
  padding-left: 50px;

  text-align: left;
  color: #ffffff;
  line-height: 60.5px;
}
.mar20 {
  margin: 0 12px;
}
.authPop {
  width: 85%;
  min-height: 344px;
  background: #ffffff;
  border-radius: 10px;
}
</style>
