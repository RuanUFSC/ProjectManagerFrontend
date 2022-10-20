<template>
  <div class="container mt-2">
  <b-form class="p-3">
    <h1>Criar projeto</h1>
    <hr>
    <h5>Preencha os dados abaixo</h5>
      <b-form-group label="" label-for="title" class="mt-2">
        <b-form-text>Título</b-form-text>
        <b-form-input 
          class="mb-3"
          id="title" 
          type="text"
          placeholder="Dê um título para o seu projeto"
          required
          autocomplete="off"
          v-model.trim="$v.form.title.$model"
          :state="getValidation('title')"
          >
        ></b-form-input>
        <b-form-text>CEP</b-form-text>
        <b-form-input 
          class="mb-3"
          id="zipcode" 
          type="text"
          placeholder="Informe o CEP de realização"
          required
          autocomplete="off"
          v-model.trim="$v.form.zipcode.$model"
          :state="getValidation('zipcode')"
        ></b-form-input>
        <b-form-text>Vencimento</b-form-text>
        <b-form-datepicker 
          class="mb-3"
          id="deadline" 
          required
          label-no-date-selected="Insira o vencimento do projeto"
          :min="getToday()"
          v-model.trim="$v.form.deadline.$model"
          :state="getValidation('deadline')"
        ></b-form-datepicker>
        <b-form-text>Custo</b-form-text>
        <b-form-input 
          class="mb-3"
          id="cost" 
          type="text"
          placeholder="Informe o custo de realização"
          required
          autocomplete="off"
          v-model.trim="$v.form.cost.$model"
          :state="getValidation('cost')"
        ></b-form-input>
        <b-button
          class="col-12" 
          type="submit" 
          :disabled='isDisabled'
          variant="outline-primary" 
          @click="createProject"
        >
          Salvar
        </b-button>
      </b-form-group>
    </b-form>
  </div>
</template>
<style>

</style>
<script>
import { required, minLength, maxLength, decimal, integer } from "vuelidate/lib/validators";
import ToastMixin from "@/mixins/toastMixin.js";
import axios from "axios";

export default {
  name: "Register",
  mixins: [ToastMixin],
  data() {
    return {
      form: {
        title: "",
        zipcode: "",
        deadline: "",
        cost: "",
      }
    }
  },

  mixins: [ToastMixin],

  validations: {
    form: {
      title: {
        required,
        minLength: minLength(3),
      },
      zipcode: {
        required,
        minLength: minLength(8),
        maxLength: maxLength(8),
        integer
      },
      deadline: {
        required,
      },
      cost: {
        required,
        minLength: minLength(1),
        decimal
      }
    },
  },

  methods: {

    getToday() {
      return new Date().toISOString().split("T")[0];
    },

    getValidation(field) {
      if(this.$v.form[field].$dirty === false) {
        return null;
      }
      return !this.$v.form[field].$error;
      //if(this.$v.form[field].$dirty === false) {
      //  return false;
      //}
      //return !this.$v.form[field].$error;
    },

    createProject() {
      var user= JSON.parse(localStorage.getItem("authUser")).username
      var config = { headers: { username: user } }

      var body = {
        title: this.form.title,
        zip_code: this.form.zipcode,
        cost: this.form.cost,
        deadline: this.form.deadline
      }
        
      axios
        .post(`http://localhost:3000/api/project`, body, config)
        .then(function (response) {
            if(response.data.id){
              this.showToast("success", "Sucesso!", "Projeto criado com suceso");
              this.$router.push({ name: "projects" })
            } else {
              this.showToast("danger", "Erro!", "Não foi possível criar o projeto");
            }
          }.bind(this)
        )
        .catch(function (error) {
          this.showToast("danger", "Erro!", "Não foi possível criar o projeto");
        });  
       this.$router.push({ name: "projects" });
      }
  },
  computed: {
    isDisabled: function(){      
      if(this.$v.form.title.$model.length < 3 || 
      !this.$v.form.deadline.$model ||
      this.$v.form.zipcode.$model.toString().length !== 8 ||
      !/^\d+(?:\.\d+)?$/.test(this.$v.form.cost.$model) ||
      !/^\d+$/.test(this.$v.form.zipcode.$model)
      ) {
        return true
      } else {
        return false
      }     
    }   
  },
}
</script>
  