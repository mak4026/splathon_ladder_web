<template>
  <v-layout column justify-center align-center>
    <v-container fluid>
      <v-card v-if="challenges">
        <v-card-title>
          Season {{ season }} Round {{ round }} の対戦一覧
          <v-spacer />
          <v-text-field v-model="search" append-icon="mdi-magnify" label="検索" sigle-line />
        </v-card-title>
        <v-data-table
          :headers="headers"
          :items="getChallengesByRound(round)"
          :search="search"
          :loading="loading"
          :disable-pagination="true"
          :hide-default-footer="true"
          sort-by="ChallengerRank"
          class="elevation-1 ranking-table"
        ></v-data-table>
      </v-card>
    </v-container>
  </v-layout>
</template>

<script>
import { mapActions, mapState, mapGetters } from "vuex";
export default {
  data() {
    return {
      loading: true,
      search: "",
      headers: [
        { text: "試合コード", value: "GameId", sort: this.gameIdSort },
        { text: "ディビジョン", value: "Division" },
        { text: "挑戦者順位", value: "ChallengerRank" },
        { text: "挑戦チーム", value: "Challenger" },
        { text: "挑戦者スコア", value: "ChallengerScore" },
        { text: "防衛者順位", value: "DefenderRank" },
        { text: "防衛チーム", value: "Defender" },
        { text: "防衛者スコア", value: "DefenderScore" }
      ],
      season: 5,
      round: 1
    };
  },
  computed: {
    ...mapState({
      challenges: state => state.challenges.challenges
    }),
    ...mapGetters("challenges", ["getChallengesByRound"])
  },
  mounted() {
    this.getChallenges({ season: this.season }).then(
      () => (this.loading = false)
    );
  },
  methods: {
    ...mapActions({
      getChallenges: "challenges/getChallenges"
    }),
    gameIdSort: (a, b) => {
      const reg = /^.*\d+-(\d+).*$/;
      const aCode = reg.exec(a)[1];
      const bCode = reg.exec(b)[1];
      return aCode - bCode;
    }
  }
};
</script>

<style>
.ranking-table th {
  white-space: nowrap;
}
</style>
