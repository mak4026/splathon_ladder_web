import firebase from "firebase";

export const state = () => ({
  challenges: []
})

export const actions = {
  async getChallenges({ commit }, { season } = { season: 5 }) {
    const db = firebase.firestore();
    const res = await db.collection(`tournaments/spladder${season}/challenges`).get()
    let list = [];
    res.forEach(challengeRef => {
      const data = {
        GameId: challengeRef.id,
        ...challengeRef.data()
      }
      list.push(data);
    });
    commit('setChallenges', list);
  },
}

export const mutations = {
  setChallenges(state, data) {
    state.challenges = data;
  },
}

export const getters = {
  getChallengesByRound: (state) => (round) => {
    return state.challenges.filter(c => c.Round === round);
  }
}
