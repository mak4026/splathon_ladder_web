<template>
  <v-layout
    column
    justify-center
    align-center
  >
  <v-container>
      <v-card v-if="results">
        <v-card-title>
          ランキング
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
          :items="results"
          :search="search"
          :loading="loading"
          :disable-pagination=true
          :hide-default-footer=true
          sort-by="Rank"
          class="elevation-1"
        >
        </v-data-table>
      </v-card>
    </v-container>
  </v-layout>
</template>

<script>
import { parseString } from "@fast-csv/parse"
export default {
  data() {
    return {
      loading: true,
      search: "",
      headers: [
        { text: 'Rank', value: 'Rank' },
        { text: 'Prev', value: 'Prev Rank' },
        { text: 'Division', value: 'Div' },
        { text: 'Team', value: 'Team' },
      ],
      results: []
    }
  },
  mounted () {
    this.loading = true
    const getUrl = 'https://docs.google.com/spreadsheets/d/1pa_ZikS9Ox_A40aMVaOMlTxryJhc6Y8Mxd8rvlzvnnA/export?gid=232891296&format=csv'
    const response = this.$axios.$get(getUrl).then(response => {
      let retArray = []

      parseString(response, { headers: true })
          .on('error', error => console.error(error))
          .on('data', row => retArray.push(row))
          .on('end', rowCount => console.log(`Parsed ${rowCount} rows`));
      this.results = retArray;
      this.loading = false;
    })
  }
}
</script>
