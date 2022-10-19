<template>
  <b-row class="vh-100 vw-100 row-login">
    <b-col sm="5" class="d-flex justifiy-content-center align-items-center left-login">
      <img alt="logo" src="../assets/login.png">
    </b-col>
    <b-col sm="7" class="d-flex justifiy-content-center align-items-center right-login">
      <div class="col-2"></div>
      <div class="col-8">
        <h2 class="text-center mb-5">Faça o login</h2>

        
        <b-form>

          <b-form-group
            label="Username"
            label-for="username"
          >
            <b-form-input
              id="username"
              type="text"
              placeholder="Insira seu username"
              autocomplete="off" 
              v-model.trim="$v.form.username.$model"
              :state="getValidation('username')">
            >

            </b-form-input>
          </b-form-group>

          <b-form-group
            label="Senha"
            label-for="password"
          >
            <b-form-input
              id="password"
              type="password"
              placeholder="Insira sua senha"
              autocomplete="off" 
              v-model.trim="$v.form.password.$model"
              :state="getValidation('password')">
            >

            </b-form-input>
          </b-form-group>

          <b-button
            type="button"
            block
            @click="login"
          >
            Login
          </b-button>
          <hr>

          <b-button
            type="button"
            variant="outline-secondary"
            block
            @click="goToRegister"
          >
            Criar conta
          </b-button>

          
        </b-form> 
      </div>
    </b-col>
  </b-row>
</template>

<script>

import { required, minLength, sameAs } from "vuelidate/lib/validators";
import ToastMixin from "@/mixins/toastMixin.js";
import axios from "axios";

export default {
  name: 'Login',
  components: {
  },
  mixins: [ToastMixin],
  data() {
    return {
      form: {
        username: "",
        password: "",
      },
    };
  },

  validations: {
    form: {
      password: {
        required,
        minLength: minLength(6),
      },
      username: {
        required,
        minLength: minLength(3),
      }
    },
  },
  methods: {
    login() {
      this.$v.$touch();
      if(this.$v.$error) {
        return;
      }

      var user = {
        "username": this.form.username
      }

      axios
      .get(`http://localhost:3000/api/users?username=${this.form.username}&password=${this.form.password}`, user)
      .then(function (response) {
          if(response.status == 200) {
            this.showToast("success", "Sucesso!", "Logado com sucesso");
            var obj = {
              id: response.data.id,
              username: this.form.username
            }
            localStorage.setItem("authUser", JSON.stringify(obj));
            this.$router.push({ name: 'projects' });
          } else {
            this.showToast("danger", "Erro!", "Usuário e/ou senha incorretos");
          }
        }.bind(this)
      )
      .catch(function (error) {
        console.log(error);
        alert("Usuário e/ou senha incorretos", error.message);
      });      
    },

    goToRegister() {
      this.$router.push({ name: 'user' });
    },

    getValidation(field) {
      if(this.$v.form.$dirty === false) {
        return null;
      }
      return !this.$v.form[field].$error;
    }
  },
}
</script>

<style>
*, *::after, *::before {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  text-decoration: none;
}

img {
  width: 60%;
  margin: auto;
}
.row-login {
  margin-left: 0;
}

.left-login {
  padding: 10%;
  background-color: #f2f2f2;
}

.right-login {
  padding: 10px;
}

</style>