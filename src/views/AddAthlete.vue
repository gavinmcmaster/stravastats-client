<template>
  <div class="page-add-athlete">
    <div class="columns">
      <div class="column is-4 is-offset-4">
        <h1 class="title">Add Athlete</h1>
        <form @submit.prevent="submitForm">
          <div class="field">
            <label>Strava ID</label>
            <div class="control" :class="{ invalid: stravaIdValidity === 'invalid' }">
              <input
                type="number"
                class="input is-small"
                v-model.trim="stravaId"
                @blur="validateStravaId"
              />
              <p v-if="stravaIdValidity === 'invalid'">Please enter a valid Strava ID</p>
            </div>
          </div>

          <div class="field">
            <label>Username</label>
            <div class="control">
              <input type="text" class="input is-small" v-model.trim="userName" />
            </div>
          </div>

          <div class="field">
            <label>First name</label>
            <div class="control">
              <input type="text" class="input is-small" v-model.trim="firstName" />
            </div>
          </div>

          <div class="field">
            <label>Last name</label>
            <div class="control">
              <input type="text" class="input is-small" v-model.trim="lastName" />
            </div>
          </div>

          <div class="field">
            <label>Email</label>
            <div class="control">
              <input type="email" class="input is-small" v-model.trim="email" />
            </div>
          </div>

          <div class="field">
            <label>City</label>
            <div class="control">
              <input type="text" class="input is-small" v-model.trim="city" />
            </div>
          </div>

          <div class="field">
            <label>Country</label>
            <div class="control">
              <input type="text" class="input is-small" v-model.trim="country" />
            </div>
          </div>

          <div class="field">
            <label>Gender</label>
            <div class="control">
              <div>
                <input
                  id="gender-male"
                  name="gender"
                  type="radio"
                  value="M"
                  v-model="gender"
                />
                <label for="gender-male">Male</label>
              </div>
              <div>
                <input
                  id="gender-female"
                  name="gender"
                  type="radio"
                  value="F"
                  v-model="gender"
                />
                <label for="gender-female">Female</label>
              </div>
              <div>
                <input
                  id="gender-nb"
                  name="gender"
                  type="radio"
                  value="N"
                  v-model="gender"
                />
                <label for="gender-nb">Non-binary</label>
              </div>
            </div>
          </div>

          <div class="field">
            <label>Weight (kg)</label>
            <div class="control">
              <input 
                type="number"
                min="0"
                step="0.01"
                class="input is-small"
                v-model.trim="weight" />
            </div>
          </div>

          <div class="field">
            <label>Strava profile pic url</label>
            <div class="control">
              <input type="url" class="input is-normal" v-model.trim="profilePicUrl" />
            </div>
          </div>

          <div class="field">
            <label>Time created (unix timestamp)</label>
            <div class="control">
              <input
                type="number"
                min="0"
                class="input is-small"
                v-model.trim="createdAt"
              />
            </div>
          </div>
          <div class="notification is-danger is-light" v-if="errors.length">
            <button class="delete" @click="clearErrors()"></button>
            <p v-for="error in errors" v-bind:key="error">{{ error }}</p>
          </div>

          <div class="field">
            <div class="control">
              <button class="button is-dark">Upload Athlete</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { toast } from "bulma-toast";

export default {
  name: "AddAthlete",
  data() {
    return {
      stravaId: null,
      userName: "",
      firstName: "",
      lastName: "",
      email: "",
      city: "",
      gender: "",
      weight: null,
      profilePicUrl: "",
      createdAt: null,
      errors: [],
      stravaIdValidity: "pending",
    };
  },
  mounted() {
    document.title = "Add athlete | Strava Stats";
  },
  methods: {
    validateStravaId() {
      if (this.stravaId === "") {
        this.stravaIdValidity = "invalid";
      } else {
        this.stravaIdValidity = "valid";
      }
    },
    clearErrors() {
      this.errors = [];
    },

    async submitForm(event) {
      if (this.stravaId === null) {
        this.errors.push("The Strava ID must be set");
      }

      if (this.userName === "") {
        this.errors.push("The user name is missing");
      }

      if (this.email === "") {
        this.errors.push("The email is missing");
      }

      if (this.firstName === "") {
        this.errors.push("The first name is missing");
      }

      if (this.lastName === "") {
        this.errors.push("The last name is missing");
      }

      if (this.createdAt === null) {
        this.errors.push("The created at time must be set");
      }

      console.log("errors", this.errors);

      if (!this.errors.length) {
        const formData = {
          strava_id: this.stravaId,
          username: this.userName,
          firstname: this.firstName,
          lastname: this.lastName,
          email: this.email,
          country: this.country,
          sex: this.gender,
          weight: this.weight,
          profile: this.profilePicUrl,
          created_at: this.createdAt,
        };

        axios
          .post("/athlete/add", formData)
          .then((response) => {
            console.log("response.data.message", response.data.message);
            toast({
              message: "Strava Athlete Added!",
              type: "is-success",
              dismissible: true,
              pauseOnHover: true,
              duration: 2000,
              position: "bottom-right",
            });
            event.target.reset();
          })
          .catch((error) => {
            console.log("error", error);
            if (error.response) {
              for (const property in error.response.data) {
                this.errors.push(`${property}: ${error.response.data[property]}`);
              }
              console.log(JSON.stringify(error.response.data));
            } else if (error.message) {
              this.errors.push("Something went wrong. Please check and try again");
              console.log(JSON.stringify(error));
            }
          });

      }
    },
  },
};
</script>

<style lang="scss">
.control.invalid input {
  border-color: red;
}

.control.invalid p {
  color: red;
}
</style>
