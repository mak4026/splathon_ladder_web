<template>
  <v-layout column justify-center align-center>
    <v-container>
      <v-card v-if="rules">
        <v-skeleton-loader
          :loading="loading"
          transition="fade-transition"
          type="list-item"
        >
          <v-tabs v-model="tab" grow>
            <v-tab v-for="rule in rules" :key="rule.round">Round{{ rule.round }}</v-tab>
          </v-tabs>
        </v-skeleton-loader>
        <v-skeleton-loader
          :loading="loading"
          type="image"
          transition="scroll-x-transition"
        >
          <v-tabs-items v-model="tab">
            <v-tab-item v-for="rule in rules" :key="rule.round">
              <v-card flat>
                <v-data-table
                  :items="settingWithIndex(rule.settings)"
                  :headers="headers"
                  :loading="loading"
                  disable-sort
                  disable-pagination
                  hide-default-footer
                ></v-data-table>
              </v-card>
            </v-tab-item>
          </v-tabs-items>
        </v-skeleton-loader>
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
      headers: [
        { text: "", value: "index" },
        { text: "ルール", value: "rule" },
        { text: "ステージ", value: "stage" }
      ],
      season: 5
    };
  },
  computed: {
    ...mapState({
      rules: state => state.rules.rules
    })
  },
  mounted() {
    this.getRules({season: 5}).then(() => {
      this.loading = false;
      this.tab = this.rules.length - 1;
    })
  },
  methods: {
    ...mapActions({
      getRules: "rules/getRules"
    }),
    settingWithIndex(settings) {
      return settings.map((items, index) => ({
        ...items,
        index: index + 1
      }));
    }
  }
};
</script>
