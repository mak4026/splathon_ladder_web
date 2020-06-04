<template>
  <v-layout column justify-center align-center>
    <v-container>
      <v-card v-if="rules">
        <v-tabs v-model="tab" grow>
          <v-tab v-for="rule in rules" :key="rule.round">Round{{ rule.round }}</v-tab>
        </v-tabs>
        <v-tabs-items v-model="tab">
          <v-tab-item v-for="rule in rules" :key="rule.round">
            <v-card flat>
              <v-card-text>{{ rule }}</v-card-text>
            </v-card>
          </v-tab-item>
        </v-tabs-items>
      </v-card>
    </v-container>
  </v-layout>
</template>
<script>
import { mapActions, mapState, mapGetters } from "vuex";
export default {
  data() {
    return {
      tab: null,
      loading: true,
      season: 5
    };
  },
  computed: {
    ...mapState({
      rules: state => state.rules.rules
    })
  },
  async fetch({ store }){
    await store.dispatch("rules/getRules");
  },
  mounted() {
    this.tab = this.rules.length - 1;
  },
  methods: {
    ...mapActions({
      getRules: "rules/getRules"
    })
  }
};
</script>
