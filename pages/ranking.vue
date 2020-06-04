<template>
  <v-layout
    column
    justify-center
    align-center
  >
  <v-container>
      <v-card v-if="ranking">
        <v-card-title>
          Season {{ season }} Round {{ round }} のランキング
          <v-spacer />
          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="検索"
            sigle-line
          />
        </v-card-title>
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
      </v-card>
    </v-container>
  </v-layout>
</template>

<script>
import { mapActions, mapState } from 'vuex'
export default {
  data() {
    return {
      loading: true,
      search: "",
      headers: [
        { text: 'Rank', value: 'rank' },
        { text: 'Team', value: 'name' },
      ],
      season: 5,
      round: 1,
    }
  },
  computed: {
    ...mapState({
      ranking: state => state.ranking.ranking,
    }),
  },
  async mounted () {
    await this.getRanking({season : this.season});
    this.loading = false;
  },
  methods: {
    ...mapActions({
      getRanking: 'ranking/getRanking',
    }),
  },
}
</script>
