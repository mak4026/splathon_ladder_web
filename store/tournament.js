import firebase from "firebase";

export const state = () => ({
  round: 0,
  season: 0,
  hashtag: "",
  name: "",
  series: "",
})

export const actions = {
  async getLatestTournament({ commit }){
    const db = firebase.firestore();
    const res = await db.doc(`tournaments/spladder5`).get();
    commit('setTournament', res.data());
  },
}

export const mutations = {
  setTournament(state, data) {
    state.round = data.currentRound;
    state.season = data.currentSeason;
    state.hashtag = data.hashtag;
    state.name = data.name;
    state.series = data.series;
  },
}
