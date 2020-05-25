
<template>
  <ol>
    <li v-for="team in teams" v-bind:key="team.name">{{ team.name }}: {{team.player1}}, {{ team.player2 }}, {{ team.player3 }}, {{ team.player4 }}, {{ team.player5 }},  </li>
  </ol>
</template>

<script>
import firebase from "firebase";
import { mapActions, mapState } from 'vuex'
export default {
  // name: "Teams",
  computed: {
    ...mapState({
      teams: state => state.teams.teams,
    }),
  },
  mounted(){
    this.getTeams()
  },
  methods: {
    ...mapActions({
      getTeams: 'teams/getTeams',
    }),
  }
}
</script>
