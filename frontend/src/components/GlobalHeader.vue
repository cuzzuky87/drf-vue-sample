<template>
  <!-- ヘッダナビゲーション -->
  <div id="header">
    <b-navbar type="dark" variant="dark">
      <a href="/" class="navbar-brand">DRF Sample</a>
      <b-navbar-nav class="ml-auto" v-if="$route.meta.requiresAuth">
        <b-nav-item-dropdown right v-if="isLoggedIn">
          <template slot="button-content">{{ username }}</template>
          <b-dropdown-item href="#" @click="clickLogout">ログアウト</b-dropdown-item>
        </b-nav-item-dropdown>
        <b-nav-item href="#" @click="clickLogin" velse>ログイン</b-nav-item>
      </b-navbar-nav>
    </b-navbar>
  </div>
</template>


<script>
export default {
  computed: {
    username: function() {
      return this.$store.getters["auth/username"];
    },
    isLoggedIn: function() {
      return this.$store.getters["auth/isLoggedIn"];
    }
  },
  methods: {
    // ログアウトリンク押下
    clickLogout: function() {
      this.$store.dispatch("message/clearMessage");
      this.$store.dispatch("message/setInfoMessage", {
        message: "ログアウトしました"
      });
      this.$router.replace("/login");
    },
    clickLogin: function() {
      this.$store.dispatch("message/clearMessages");
      this.$router.replace("/login");
    }
  }
};
</script>