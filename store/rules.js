import firebase from "firebase";

export const state = () => ({
  rules: []
})

export const actions = {
  async getRules({ commit }, { season } = { season: 5 }){
    const db = firebase.firestore();
    const res = await db.collection(`tournaments/spladder${season}/rules`).get();
    let list = [];
    res.forEach(doc => list.push(doc.data()));
    list.sort((a, b) => a.round - b.round);
    commit('setRules', list);
  },
}

export const mutations = {
  setRules(state, data) {
    state.rules = data;
  },
}
