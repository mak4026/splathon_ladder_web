import firebase from "firebase";

export const state = () => ({
  teams: []
})

export const actions = {
  async getTeams({ commit }) {
    const db = firebase.firestore();
    const res = await db.collection("tournaments/spladder4/teams").get();
    commit('setTeams', res.docs.map(x => x.data()));
  },
}

export const mutations = {
  setTeams(state, data) {
    state.teams = data;
  },
}
