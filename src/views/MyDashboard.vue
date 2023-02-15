<template>
  <div class="page-dashboard">
    <div class="tile">
      <a href="https://developers.strava.com/" target="_blank">
        <img id="strava-logo" alt="Strava logo" :src="require('@/assets/strava.jpeg')" />
      </a>
    </div>
    <div class="columns is-multiline">
      <div class="column is-12" v-if="athlete.id">
        <athlete :athlete="athlete"></athlete>
      </div>
      <div class="column is-12">
        <button v-if="!strava_logged_in" class="button is-dark" @click="stravaAuthorise()">Login to Strava</button>
      </div>

      <hr />
    </div>
  </div>
</template>

<script>
import axios from "axios";

import Athlete from "@/components/Athlete.vue";

export default {
  name: "MyDashboard",
  components: {
    Athlete
  },
  data() {
    return {
      athlete: {},
      code: "",
      error: "",
      token: {},
      strava_client_id: "",
      strava_client_secret: "",
      strava_logged_in: false
    };
  },
  beforeMount() {
    //console.log("before mount");
  },
  mounted() {
    let stravaAthlete = localStorage.getItem('stravaAthlete');
    if (stravaAthlete !== null) {
      this.athlete = JSON.parse(localStorage.getItem('stravaAthlete'));
      this.athlete.stravaUrl = "https://www.strava.com/athletes/" + this.athlete.id;
    }

    let params = new URLSearchParams(document.location.search);
    if (params.has("code")) {
      let code = params.get("code");

      //https://developers.strava.com/docs/getting-started/#
      // The response should include the refresh token, access token,
      // and access token expiration date (step 8 from the graph).
      this.getToken(code);
    } else {
      this.getStravaAppKeys();
    }
  },
  methods: {
    async getStravaAppKeys() {
      //console.log("getStravaAppKeys");

      await axios
        .get("/strava/app/key")
        .then((response) => {
          let stravaClient = {};
          stravaClient.id = response.data.strava_client_id;
          stravaClient.secret = response.data.strava_client_secret;
          this.$store.commit("setStravaClient", stravaClient);
          localStorage.setItem(
            "stravaClient",
            JSON.stringify(this.$store.state.stravaClient)
          );
        })
        .catch((error) => {
          console.log("error", error);
        });
    },
    async getToken(code) {
      let stravaClient = JSON.parse(localStorage.getItem('stravaClient'));
      const data = {
        client_id: stravaClient.id,
        code: code,
        client_secret: stravaClient.secret,
        grant_type: "authorization_code",
      };

      await axios
        .post("https://www.strava.com/api/v3/oauth/token", data)
        .then((response) => {
          //console.log("response", response);
          this.athlete = response.data.athlete;
          this.token.access = response.data.access_token;
          this.token.expiresAt = response.data.expires_at;
          this.token.duration = response.data.expires_in;
          this.token.type = response.data.token_type;
          this.token.refresh = response.data.refresh_token;

          this.$store.commit("setStravaToken", this.token);
          localStorage.setItem(
            "stravaToken",
            JSON.stringify(this.$store.state.stravaToken)
          );
          this.$store.commit("setStravaAthlete", this.athlete);
          localStorage.setItem(
            "stravaAthlete",
            JSON.stringify(this.$store.state.stravaAthlete)
          );
          this.strava_logged_in = true;
          // TODO Clear strava client data as no longer needed now we have strava token data?
          this.$router.push("/dashboard");
        })
        .catch((error) => {
          console.log(error);
        });
    },

    stravaAuthorise() {
      console.log("Strava Authorise", this.$store.state.stravaClient.id);
      let webOAuthUrl =
        "https://www.strava.com/oauth/authorize?client_id=" +
        this.$store.state.stravaClient.id +
        "&redirect_uri=http://localhost:8080/dashboard&response_type=code&approval_prompt=force&scope=read";

      window.location = webOAuthUrl;
    },
  },
};
</script>

<style scoped>
  #strava-logo {
    display: block;
    margin-top: auto;
    margin-bottom: auto;
    margin-left: auto;
    margin-right: auto;
    width: 400px;
    height: 300px;
  }
</style>