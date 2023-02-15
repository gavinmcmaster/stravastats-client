<template>
  <div class="home">
    <section class="hero is-medium is-dark mb-6">
        <div class="hero-body has-text-centered">
            <p class="title mb-6">
                Strava Stats
            </p>
            <p class="subtitle">
                Extended Features
            </p>
        </div>
    </section>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'Home',
  data() {
  },
  components: {
  },
  mounted() {
    document.title = 'Home | Strava Stats'
  },
  methods: {
   
  }
}
</script>
