<template>
  <div class="column is-3">
    <div class="box">
      <h3 class="is-size-5">
        Athlete name: {{ athlete.firstname }} {{ athlete.lastname }}
      </h3>
      <p class="is-size-6">City: {{ athlete.city }}</p>
      <p class="is-size-6">Joined date: {{ createdAt }}</p>
      <a v-bind:href="athlete.stravaUrl" target="_blank"> View on Strava</a>
    </div>
  </div>
</template>

<script>
export default {
  name: "Athlete",
  data() {
    return {
      createdAt: ''
    }
  },
  methods: {
    convertCreatedDate() {
      // Convert Java date format
      let date = new Date(Date.parse(this.athlete.created_at));
      const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      console.log(date.toLocaleDateString(undefined, options));
      this.createdAt = date.toLocaleDateString(undefined, options);
    }
  },
  props: {
    athlete: Object,
  },
  created() {
    this.convertCreatedDate();
  },
};
</script>
