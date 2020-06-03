import firebase from "firebase/app";

export const state = () => ({
  challenges: []
})

export const actions = {
  async getChallenges({ commit }, { season } = { season: 5 }) {
    const db = firebase.firestore();
    const res = await db.collection(`tournaments/spladder${season}/challenges`).get()
    let list = [];
    res.forEach(challengeRef => {
      let data = {
        GameId: challengeRef.id,
        ...challengeRef.data()
      }
      if (data.Date instanceof firebase.firestore.Timestamp) {
        data.Date = data.Date.toDate();
      } else {
        data.Date = null;
      }
      list.push(data);
    });
    commit('setChallenges', list);
  },
  async updateChallenge({ commit }, { id, challenge, season }) {
    const db = firebase.firestore();
    const challengeRef = db.collection(`tournaments/spladder${season}/challenges`).doc(id);
    await challengeRef.update({
      ...challenge,
      updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    }).catch(err => console.log(err));
    commit("updateChallenge", {
      id: id,
      challenge: challenge
    });
  }

}

export const mutations = {
  setChallenges(state, data) {
    state.challenges = data;
  },
  updateChallenge(state, data) {
    let challenge = state.challenges.find(c => c.GameId === data.id);
    Object.assign(challenge, data.challenge);
  }
}

export const getters = {
  getChallengesByRound: (state) => (round) => {
    return state.challenges.filter(c => c.Round === round);
  },
}
