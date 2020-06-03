import firebase from "firebase/app";

export const state = () => ({
  ranking: {}
})

export const actions = {
  async getRanking({ commit }, { season } = { season: 5 }) {
    const db = firebase.firestore();
    const res = await db.collection(`tournaments/spladder${season}/ranking`).get()
    let list = {};
    res.forEach(round => {
      const roundId = parseInt(round.id);
      const ranking = Object.entries(round.data()).map(([rank, name]) => ({
        rank: parseInt(rank),
        name: name
      }));
      list[roundId] = ranking;
    });
    commit('setRanking', list);
  },
}

export const mutations = {
  setRanking(state, data) {
    state.ranking = data;
  },
}
