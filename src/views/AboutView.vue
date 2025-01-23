<template>
  <div class="about">
    <h1>This is an about page</h1>
  </div>
</template>
<script>
import { getActivityDetail } from "@/api/index";
export default {
  created() {
    const { activity_id, user_id } = this.$route.query;
    console.log(333, activity_id, user_id);
    getActivityDetail({ activity_id, user_id }).then((res) => {
      console.log(333, res);
    });
  },
  methods: {},
};
</script>
<style lang="css" scoped></style>
