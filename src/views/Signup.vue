<template>
    <div class="page-sign-up">
        <div class="columns">
            <div class="column is-4 is-offset-4">
                <h1 class="title">Sign up</h1>

                <form @submit.prevent="submitForm">
                    <div class="field">
                        <label>Email</label>
                        <div class="control">
                            <input type="text" class="input" v-model="email">
                        </div>
                    </div>

                    <div class="field">
                        <label>Password</label>
                        <div class="control">
                            <input type="password" class="input" v-model="password">
                        </div>
                    </div>

                    <div class="field">
                        <label>Repeat password</label>
                        <div class="control">
                            <input type="password" class="input" v-model="password2">
                        </div>
                    </div>

                    <div class="field">
                        <label>Strava ID</label>
                        <div class="control">
                            <input type="number" class="input" v-model="stravaid">
                        </div>
                    </div>

                    <div class="notification is-danger is-light" v-if="errors.length">
                        <button class="delete" @click="clearErrors()"></button>
                        <p v-for="error in errors" v-bind:key="error">{{ error }}</p>
                    </div>

                    <div class="field">
                        <div class="control">
                            <button class="button is-dark">Sign up</button>
                        </div>
                    </div>

                    <hr>

                    Or <router-link to="/log-in">click here</router-link> to log in!
                </form>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
import { toast } from 'bulma-toast'

export default {
    name: 'Signup',
    data() {
        return {
            email: '',
            password: '',
            password2: '',
            stravaid: null,
            errors: []
        }
    },
    methods: {
        clearErrors() {
            this.errors = [];
        },
        submitForm() {
            this.errors = []

            if (this.email === '') {
                this.errors.push('The email is missing')
            }

            if (this.password === '') {
                this.errors.push('The password is too short')
            }

            if (this.password !== this.password2) {
                this.errors.push('The passwords do not match')
            }

            if (!this.errors.length) {
                const formData = {
                    email: this.email,
                    password: this.password,
                    strava_id: this.stravaid
                }

                axios
                    .post("/auth/register", formData)
                    .then(response => {
                        toast({
                            message: 'Account created, please log in!',
                            type: 'is-success',
                            dismissible: true,
                            pauseOnHover: true,
                            duration: 2000,
                            position: 'bottom-right',
                        })

                        this.$router.push('/log-in')
                    })
                    .catch(error => {
                        if (error.response) {
                            for (const property in error.response.data) {
                                this.errors.push(`${property}: ${error.response.data[property]}`);
                            }
                            console.log(JSON.stringify(error.response.data));
                        } else if (error.message) {
                            this.errors.push('Something went wrong. Please check and try again');                            
                            console.log(JSON.stringify(error))
                        }
                    })
            }
        }
    }
}
</script>