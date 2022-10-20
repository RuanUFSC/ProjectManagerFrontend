<template>
  <b-row class="vh-100 vw-100 row-login">
    <b-col sm="5" class="d-flex justifiy-content-center align-items-center left-login">
      <img alt="logo" src="../assets/login.png">
    </b-col>
    <b-col sm="7" class="d-flex justifiy-content-center align-items-center right-login">
      <div class="col-2"></div>
      <div class="col-8">
        <h2 class="text-center mb-5">Faça o cadastro</h2>

        
        <b-form>

          <b-form-group
            label="Nome"
            label-for="name"
          >
            <b-form-input
              id="name"
              type="text"
              placeholder="Insira seu nome"
              autocomplete="off"         
              v-model.trim="$v.form.name.$model"
              :state="getValidation('name')">          
            >

            </b-form-input>
          </b-form-group>

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
              v-model.trim="$v.form.password.$model"
              :state="getValidation('password')">
            >

            </b-form-input>
          </b-form-group>

          <b-form-group
            label="Confirmação de Senha"
            label-for="passwordConfirm"
          >
            <b-form-input
              id="passwordConfirm"
              type="password"
              placeholder="Confirme sua senha"              
              v-model.trim="$v.form.passwordConfirm.$model"
              :state="getValidation('passwordConfirm')">
              <!-- v-model="form.passwordConfirm" -->
            </b-form-input>
          </b-form-group>

          <b-button
            type="button"
            block
            @click="register"
          >
            Criar conta
          </b-button>

          <hr>

          <b-button
            type="button"
            variant="outline-secondary"
            block
            @click="goToLogin"
          >
            Voltar
          </b-button>

        </b-form> 
      </div>
    </b-col>
  </b-row>
</template>

<script>

import { required, minLength, sameAs, alphaNum } from "vuelidate/lib/validators";
import ToastMixin from "@/mixins/toastMixin.js";
import axios from "axios";

export default {
  name: 'RegisterUser',
  components: {
  },

  mixins: [ToastMixin],

  data() {
    return {
      form: {
        name: "",
        username: "",
        password: "",
        passwordConfirm:""
      },
    };
  },

  validations: {
    form: {
      username: {
        required,
        minLength: minLength(3),
      },
      password: {
        required,
        minLength: minLength(6),
      },
      name: {
        required,
        minLength: minLength(3),
        alphaNum
      },
      passwordConfirm: {
        required, 
        sameAsPassword: sameAs('password'),
      }
    },
  },
  methods: {
    register() {
      this.$v.$touch();
      if(this.$v.$error) {
        return;
      }

      var user = {
        "name": this.form.name,
        "username": this.form.username,
        "password": this.form.password
      }

      axios
      .post("http://localhost:3000/api/users", user)
      .then(
        function (response) {
          console.log("Response do axios", response);
          this.showToast("success", "Sucesso!", "Usuário criado com sucesso");
          this.goToLogin();
        }.bind(this)
      )
      .catch(function (error) {
        console.log(error);
        alert("Erro ao enviar formulário!", error.message);
      });
    },

    goToLogin() {
      this.$router.push({ name: 'login' });
    },
    
    getValidation(field) {
      if(this.$v.form[field].$dirty === false) {
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