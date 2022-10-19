<template>
  <div class="container mt-2">
    <b-form class="p-3">
    <h1>Editar projeto</h1>
    <hr>
    <h5>Personalize os dados abaixo</h5>
      <b-form-group label="Titulo" label-for="title">
        <b-form-input
          id="title"
          v-model.trim="$v.form.title.$model"
          type="text"
          required
          autocomplete="off"
          :state="getValidation"
        ></b-form-input>
      </b-form-group>      
      <b-form-group label="CEP" label-for="zipcode">
        <b-form-input
          id="zipcode"
          v-model="form.zipcode"
          type="text"
          required
          autocomplete="off"
        ></b-form-input>
      </b-form-group>
      <b-form-group label="Data de vencimento" label-for="deadline">
        <b-form-datepicker
          id="deadline"
          v-model="form.deadline"
          label-no-date-selected="Selecione uma data"
        ></b-form-datepicker>
      </b-form-group>
      <b-form-group label="Custo" label-for="cost">
        <b-form-input
          id="cost"
          v-model="form.cost"
          type="text"
          required
          autocomplete="off"
        ></b-form-input>
      </b-form-group>
      <b-form-group>
      <b-button type="submit" 
      class="col-12" variant="outline-primary" @click="saveProject">
        Salvar
      </b-button>
      </b-form-group>
    </b-form>
  </div>
</template>

<script>
import ToastMixin from "@/mixins/toastMixin.js";
import { required, minLength } from "vuelidate/lib/validators";
import axios from 'axios';

export default {
  name: "Edit",

  mixins: [ToastMixin],
  data() {
    return {
      form: {
        title: "",
        cost: "",
        deadline: "",
        zipcode: "",        
      },
    };
  },

  validations: {
    form: {
      title: {
        required,
        minLength: minLength(3),
      },
    },
  },

  async created() {
    if (this.$route.params.projectId) {
      this.form = {
        title: this.$route.params.projectId.title,
        cost: this.$route.params.projectId.cost,
        deadline: this.$route.params.projectId.deadline,
        zipcode: this.$route.params.projectId.zip_code
      }
    } else{
        this.$router.push({ name: "projects" })
    }
  },

  methods: {
    saveProject() {
        var user= JSON.parse(localStorage.getItem("authUser")).username
        var config = { headers: { username: user } }

        var body = {
          title: this.form.title,
          zip_code: this.form.zipcode,
          cost: this.form.cost,
          deadline: this.form.deadline
        }

        axios
        .put(`http://localhost:3000/api/project/${this.$route.params.projectId.id}`, body, config)
        .then(function (response) {
          console.log(response.data)
            if(response.data.message == 'Projeto atualizado com sucesso.'){
              this.showToast("success", "Sucesso!", "Status da tarefa atualizado com suceso");
              this.$router.push({ name: "projects" })
            } else {
              this.showToast("danger", "Erro!", "Não foi possível atualizar o projeto");
            }
          }.bind(this)
        )
        .catch(function (error) {
          this.showToast("danger", "Erro!", "Não foi possível atualizar o projeto");
        });  
      } 
  },

  computed: {
    getValidation() {
      if (this.$v.form.title.$dirty === false) {
        return null;
      }

      return !this.$v.form.title.$error;
    },      
  },
};
</script>
