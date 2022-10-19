<template>
  <div class="container mt-2">
    <h1>Projetos</h1>
    <b-card-group deck v-for="project in projects" :key="project.id" class="col-8">
        <b-card class="d-flex mb-2">
          <div class="container-projects">
            <b-list-group flush class="col-project col-10">
              <div class="d-flex flex-row justify-content-between">
                <b-list-group-item class="col-12"><strong>Título:</strong> {{ project.title }}</b-list-group-item>
              </div>              
              <div class="d-flex justify-content-between">
                <b-list-group-item  class="col-12"><strong>Localidade:</strong> {{  project.address }}</b-list-group-item>
              </div>
              <div class="d-flex justify-content-between">
                <b-list-group-item  class="col-12"><strong>Vencimento</strong> {{ new Date(project.deadline).toLocaleString('pt-BR') }}</b-list-group-item>
              </div>
              <div class="d-flex justify-content-between">
                <b-list-group-item  class="col-12"><strong>Custo:</strong> {{ parseFloat(project.cost).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) }}</b-list-group-item>
              </div>          
              <div v-if="project.done" class="d-flex justify-content-between">
                <b-list-group-item  class="col-12"><strong>Status:</strong> <i class="fas fa-check"> </i></b-list-group-item>
              </div>
              <div v-else class="d-flex justify-content-between">
                <b-list-group-item  class="col-12"><strong>Status:</strong> <i class="fas fa-spinner"></i></b-list-group-item>
              </div>
            </b-list-group>
            <div class="col-menu">
              <b-button
                variant="outline-secondary"
                class="mr-2"
                @click="updateStatus(project.id)"
                v-b-tooltip.hover
                title="Concluir"
              >
                <i class="fas fa-check"></i>
              </b-button>
              
              <b-button
                variant="outline-secondary"
                class="mr-2"
                @click="edit(project)"
                v-b-tooltip.hover
                title="Editar"
              >
                <i class="fas fa-edit"></i>
              </b-button>
              <b-button
                variant="outline-danger"
                class="mr-2"
                @click="remove(project.id)"
                v-b-tooltip.hover
                title="Excluir"
              >
              <i class="fas fa-times"></i>
              </b-button>
            </div>
          </div>
        </b-card>
    </b-card-group>

    <b-modal ref="modalRemove" hide-footer title="Exclusão de projeto">
      <div class="d-block text-center">
        Deseja realmente excluir esse projeto? <!-- {{ projectSelected.title }} -->
      </div>
      <div class="mt-3 d-flex justify-content-end">
        <b-button variant="outline-secondary" class="mr-2" @click="hideModal">
          Cancelar
        </b-button>
        <b-button
          variant="outline-danger"
          class="mr-2"
          @click="confirmRemoveProject"
        >
          Excluir
        </b-button>
      </div>
    </b-modal>

  </div>
</template>
<style>

.container {
  display: grid;
  justify-items: center;
}

.container-projects {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.col-menu {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  padding-right: 10%;
}
</style>

<script>

import ToastMixin from "@/mixins/toastMixin.js";
import axios from "axios";

export default {
  name: "Projects",

  mixins: [ToastMixin],

  data() {
    return {
      projects: [],
      isLoading: false,
      }
  },
  async created() {
    this.projects = await this.getProjects();
  },
  methods: {
    edit(projectId) {
      this.$router.push({ name: "edit", params: { projectId } });
    },

    async remove(projectId) {
      this.projectSelected = projectId;
      this.$refs.modalRemove.show();
    },

    hideModal() {
      this.$refs.modalRemove.hide();
    },

    async confirmRemoveProject() {

      let user= JSON.parse(localStorage.getItem("authUser")).username
      let config = {
        headers: {
          username: user,
        }
      }
      axios
      .delete(`http://localhost:3000/api/project/${this.projectSelected}`, config)
      .then( async function (response) {
        console.log(response.data)
          if(response.data.message == 'Projeto apagado com sucesso.'){
            this.projects = await this.getProjects();
            this.hideModal();
          } else {
            this.showToast("danger", "Erro!", "Não foi possível deletar o projeto");
            this.hideModal();
          }
        }.bind(this)
      )
      .catch(async function (error) {
        this.showToast("danger", "Erro!", "Não foi possível deletar o projeto");
        this.projects = await this.getProjects();
        this.hideModal();
      });  
    },

    async updateStatus(id) {

      let user= JSON.parse(localStorage.getItem("authUser")).username
      let config = {
        headers: {
          username: user,
        }
      }

      axios
      .patch(`http://localhost:3000/api/project/${id}/done`, config)
      .then( async function (response) {
        console.log(response.data)
          if(response.data.message == 'Projeto marcado como concluído.'){
            this.projects = await this.getProjects();
            this.hideModal();
          } else {
            this.showToast("danger", "Erro!", "Não foi possível atualizar o projeto");
            this.hideModal();
          }
        }.bind(this)
      )
      .catch(async function (error) {
        this.showToast("danger", "Erro!", "Não foi possível deletar o projeto");
        this.projects = await this.getProjects();
        this.hideModal();
      });  

      this.projects = await this.getProjects();
      this.showToast("success", "Sucesso!", "Status da tarefa atualizado com suceso");
    },
    async getProjects() {
      this.isLoading = true;
      let self = this;
      setTimeout(function () {
        self.isLoading = false;
      }, 3000);

      let user= JSON.parse(localStorage.getItem("authUser")).username
      let config = {
        headers: {
          username: user,
        }
      }

      var projects = 
      axios
      .get(`http://localhost:3000/api/projects`, config)
      .then(function (response) {
        if(response.data.title == 'Nenhum projeto localizado') {
          return ''
        } else {
          console.log(response.data.title)
          return response.data
        }
          
        }.bind(this)
      )
      .catch(function (error) {
        return ([{title: 'Não localizamos projetos'}])
      });    
      return projects;
    },

  },

  computed: {
    isProjectsEmpty() {
      return this.projects.length === 0;
    }
  }
}
</script>