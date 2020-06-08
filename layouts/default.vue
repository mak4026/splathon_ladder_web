<template>
  <v-app dark>
    <v-navigation-drawer
      v-model="drawer"
      fixed
      app
    >
      <v-list>
        <v-list-item
          v-for="(item, i) in items"
          :key="i"
          :to="item.to"
          router
          exact
        >
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="item.title" />
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar
      fixed
      app
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-toolbar-title v-text="title" />
      <v-spacer />
    </v-app-bar>
    <v-content>
      <v-container fluid>
        <nuxt />
      </v-container>
    </v-content>

    <error-snackbar />

    <v-footer
      :fixed="fixed"
      app
    >
      <span>&copy; {{ new Date().getFullYear() }}
        <a class="copyright white--text" href="https://twitter.com/splathon" target="_blank">Splathon</a>
         / Developed by
        <a class="copyright white--text" href="https://mak4026.github.io/" target="_blank">maktopia</a></span>
    </v-footer>
  </v-app>
</template>

<script>
import ErrorSnackbar from "../components/ErrorSnackBar.vue"

export default {
  components: {
    ErrorSnackbar
  },
  data () {
    return {
      drawer: false,
      fixed: false,
      items: [
        {
          icon: 'mdi-apps',
          title: 'Welcome',
          to: '/'
        },
        {
          icon: 'mdi-account-supervisor-circle',
          title: 'チーム一覧',
          to: '/teams',
        },
        {
          icon: 'mdi-map-marker',
          title: 'ルール＆ステージ',
          to: '/rules',
        },
        {
          icon: 'mdi-clipboard-flow',
          title: 'ランキング',
          to: '/ranking'
        },
        {
          icon: 'mdi-calendar',
          title: '対戦一覧',
          to: '/challenges'
        }
      ],
      title: 'Spladder Portal'
    }
  }
}
</script>
<style lang="scss">
a.copyright {
  text-decoration: none;
  &:hover{
    text-decoration-line: underline;
  }
}
a.header-title {
  text-decoration: none;
  color: inherit;
}
</style>
