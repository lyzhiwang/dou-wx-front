<template>
  <div>HelloWorld</div>
</template>

<script>
// import { mapActions } from "vuex";
export default {
  name: "HelloWorld",
  props: {
    msg: String,
  },
  methods: {
    // ...mapActions("activity", ["getActivityInfo"]),
  },
  created() {
    this.$store
      .dispatch("activity/getActivityInfo", { id: 807 })
      .then((res) => {
        console.log(res);
      });
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
