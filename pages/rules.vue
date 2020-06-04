<template>
  <v-layout column justify-center align-center>
    <v-container>
      <v-card v-if="rules"></v-card>
      {{ rules }}
    </v-container>
  </v-layout>
</template>
<script>
import { mapActions, mapState, mapGetters } from "vuex";
export default {
  data() {
    return {
      loading: true,
      season: 5,
    }
  },
  computed: {
    ...mapState({
      rules: state => state.rules.rules,
    }),
  },
  mounted () {
    this.getRules({season : this.season}).then(() => this.loading = false );
  },
  methods: {
    ...mapActions({
      getRules: 'rules/getRules',
    }),
  },
}
</script>
