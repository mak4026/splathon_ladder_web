<template>
  <v-layout
    column
    justify-center
    align-center
  >
  <v-container>
      <v-card v-if="ranking">
        <v-card-title>
          Season {{ season }}  のランキング
          <v-spacer />
          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="検索"
            sigle-line
          />
        </v-card-title>
        <v-tabs
          v-model="activeRound"
          grow
        >
          <v-tab
            v-for="round in rounds"
            :key="round"
          >
            Round {{ round }}
          </v-tab>
        </v-tabs>
        <v-tabs-items v-model="activeRound">
          <v-tab-item
            v-for="round in rounds"
            :key="round"
          >
            <v-data-table
              :headers="headers"
              :items="ranking[round]"
              :search="search"
              :loading="loading"
              :disable-pagination=true
              :hide-default-footer=true
              sort-by="rank"
              class="elevation-1"
            >
            </v-data-table>
          </v-tab-item>
        </v-tabs-items>
      </v-card>
    </v-container>
  </v-layout>
</template>

<script>
import { mapActions, mapState } from 'vuex'
export default {
  data() {
    return {
      activeRound: 0,
      loading: true,
      search: "",
      headers: [
        { text: 'Rank', value: 'rank' },
        { text: 'Team', value: 'name' },
      ],
      season: 5,
    }
  },
  computed: {
    ...mapState({
      ranking: state => state.ranking.ranking,
      tournament: state => state.tournament
    }),
    rounds() {
      return this.tournament.round
    },
  },
  async mounted () {
    await Promise.all([
      this.getTournament(),
      this.getRanking({season : this.season})
    ]);
    this.activeRound = this.rounds - 1
    this.loading = false;
  },
  methods: {
    ...mapActions({
      getRanking: 'ranking/getRanking',
      getTournament: 'tournament/getLatestTournament',
    }),
  },
}
</script>
