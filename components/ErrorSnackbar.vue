<template>
  <v-snackbar
    v-if="hasError"
    :value="hasError"
    :multi-line="true"
    :top="true"
    :timeout="0"
    color="error"
  >
    <section class="d-flex flex-column">
      <h3 class="mt-2">エラーが発生しました</h3>
      <p class="ma-4">{{ $error.value }}</p>

      <v-btn
        @click="onClose"
        text
        max-width="80px"
        color="white"
        class="align-self-end"
      >Close</v-btn>
    </section>
  </v-snackbar>
</template>

<script>
export default {
  computed: {
    hasError() {
      return !!this.$error.value;
    }
  },
  methods: {
    onClose() {
      this.$error.value = undefined;
    }
  }
}
</script>
