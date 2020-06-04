<template>
  <v-layout column justify-center align-center>
    <v-container>
      <v-card v-if="challenges">
        <v-card-title>
          Season {{ this.tournament.season }} Round {{ this.tournament.round }} の対戦一覧
          <v-spacer />
          <v-text-field v-model="search" append-icon="mdi-magnify" label="検索" sigle-line />
        </v-card-title>
        <v-data-table
          :headers="headers"
          :items="getChallengesByRound(this.tournament.round)"
          :search="search"
          :loading="loading"
          :disable-pagination="true"
          :hide-default-footer="true"
          sort-by="ChallengerRank"
          class="elevation-1 ranking-table"
        >
          <template v-slot:top>
            <v-dialog v-model="dialog" max-width="600px">
              <v-card>
                <v-card-title>
                  <span class="headline">対戦データの編集</span>
                </v-card-title>
                <v-card-subtitle>
                  <span>{{ getStreamTitle }}</span>
                </v-card-subtitle>

                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col cols="12">
                        <v-datetime-picker label="開始日時" v-model="editedItem.Date">
                          <template v-slot:dateIcon>
                            <v-icon>mdi-calendar</v-icon>
                          </template>
                          <template v-slot:timeIcon>
                            <v-icon>mdi-clock</v-icon>
                          </template>
                        </v-datetime-picker>
                      </v-col>
                      <v-col cols="12">
                        <v-text-field
                          v-model="editedItem.ChallengerScore"
                          :label="'挑戦者スコア（'+editedItem.Challenger+'）'"
                          :rules="[rules.score]"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12">
                        <v-text-field
                          v-model="editedItem.DefenderScore"
                          :label="'防衛者スコア（'+editedItem.Defender+'）'"
                          :rules="[rules.score]"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12">
                        <v-text-field
                          v-model="editedItem.Streamer"
                          label="配信者"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12">
                        <v-text-field
                          v-model="editedItem.StreamURL"
                          label="配信URL"
                          :rules="[rules.url]"
                        ></v-text-field>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card-text>

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" text @click="close">キャンセル</v-btn>
                  <v-btn class="primary" color="darken-1" text @click="update">更新</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </template>
          <template v-slot:item.Date="{ value }">{{ value ? value.toLocaleString('ja-JP') : "" }}</template>
          <template v-slot:item.Division="{ value }">{{ getDivisionStr(value) }}</template>
          <template v-slot:item.StreamURL="{ item }">
            <v-tooltip top v-if="item.Streamer && item.StreamURL">
              <template v-slot:activator="{ on }">
                <v-btn icon :href="item.StreamURL" target="_blank" v-on="on">
                  <v-icon>mdi-youtube</v-icon>
                </v-btn>
              </template>
              <span>配信者: {{ item.Streamer }}</span>
            </v-tooltip>
          </template>
          <template v-slot:item.actions="{ item }">
            <v-icon small @click="copyTitle(item)">mdi-content-copy</v-icon>
            <v-icon small @click="editItem(item)">mdi-pencil</v-icon>
          </template>
        </v-data-table>
        <v-snackbar v-model="snackbar" :bottom="true" :timeout="3000">
          <span>配信タイトルをコピーしました</span>
          <v-icon>mdi-checkbox-marked-circle-outline</v-icon>
        </v-snackbar>
      </v-card>
    </v-container>
  </v-layout>
</template>

<script>
import { mapActions, mapState, mapGetters } from "vuex";
export default {
  data() {
    return {
      loading: true,
      dialog: false,
      snackbar: false,
      search: "",
      headers: [
        { text: "試合コード", value: "GameId", sort: this.gameIdSort },
        { text: "開始日時", value: "Date", sort: this.dateSort },
        { text: "ディビジョン", value: "Division" },
        { text: "挑戦者順位", value: "ChallengerRank" },
        { text: "挑戦チーム", value: "Challenger" },
        { text: "挑戦者スコア", value: "ChallengerScore" },
        { text: "防衛者順位", value: "DefenderRank" },
        { text: "防衛チーム", value: "Defender" },
        { text: "防衛者スコア", value: "DefenderScore" },
        { text: "配信", value: "StreamURL", sortable: false },
        { text: "", value: "actions" }
      ],
      editedItem: {
        GameId: "",
        Date: null,
        Division: "",
        ChallengerRank: 0,
        Challenger: "",
        ChallengerScore: 0,
        DefenderRank: 0,
        Defender: "",
        DefenderScore: 0,
        Streamer: "",
        StreamURL: "",
      },
      rules: {
        score: x => (0 <= x && x <= 4) || "0から4の整数を入力してください",
        url: s => {
          if(!s) return true; // s is empty
          const reg = /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/;
          return reg.test(s) || "URLの形式で入力してください"
        },
      }
    };
  },
  computed: {
    ...mapState({
      challenges: state => state.challenges.challenges,
      tournament: state => state.tournament,
    }),
    ...mapGetters("challenges", ["getChallengesByRound"]),
    getStreamTitle: function() {
      const challenge = this.editedItem;
      return this.createTitle(challenge);
    }
  },
  async fetch({ store }) {
    await store.dispatch("tournament/getLatestTournament");
  },
  mounted() {
    this.getChallenges({ season: this.tournament.season }).then(
      () => (this.loading = false)
    );
  },
  methods: {
    ...mapActions({
      getChallenges: "challenges/getChallenges",
      updateChallenge: "challenges/updateChallenge",
    }),
    gameIdSort: (a, b) => {
      const reg = /^.*\d+-(\d+).*$/;
      const aCode = reg.exec(a)[1];
      const bCode = reg.exec(b)[1];
      return aCode - bCode;
    },
    dateSort: (a, b) => {
      if(a === null) return 1;
      if(b === null) return -1;
      return a.getTime() - b.getTime();
    },
    getDivisionStr(divId){
      const divArray = [
        "X",
        "S+ Upper",
        "S+ Lower",
        "S Upper",
        "S Middle",
        "S Lower",
        "A+ Upper",
        "A+ Middle",
        "A+ Lower",
        "A Upper",
        "A Middle",
        "A Lower",
        "B+"
      ];
      return divArray[divId] || "???";
    },
    editItem(item) {
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },
    createTitle(item) {
      return `${this.tournament.hashtag} [${item.GameId}] Div ${this.getDivisionStr(item.Division)}: ${item.ChallengerRank}位 ${item.Challenger} vs ${item.DefenderRank}位 ${item.Defender} [Splatoon2]`;
    },
    copyTitle(item) {
      const str = this.createTitle(item);
      if (navigator.clipboard) {
        navigator.clipboard.writeText(str).then(() => (this.snackbar = true));
      }
    },
    update() {
      const id = this.editedItem.GameId;
      const payload = {
        Date: this.editedItem.Date || null,
        ChallengerScore: parseInt(this.editedItem.ChallengerScore),
        DefenderScore: parseInt(this.editedItem.DefenderScore),
        Streamer: this.editedItem.Streamer || "",
        StreamURL: this.editedItem.StreamURL || "",
      };
      this.updateChallenge({
        id: id,
        season: this.tournament.season,
        challenge: payload
      });
      this.dialog = false;
    },
    close() {
      this.dialog = false;
    }
  }
};
</script>
