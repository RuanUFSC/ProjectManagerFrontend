<template>
  <div id="app">

    <b-navbar toggleable="lg" type="dark" variant="dark" v-if="verifyLogin">
      
      <b-navbar-brand to="/projects">Project Manager</b-navbar-brand>
      
      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-collapse id="nav-collapse" class="d-flex flex-row justify-content-center" is-nav>
        <b-navbar-nav>
          <b-nav-item to="/projects">Meus projetos</b-nav-item>
        </b-navbar-nav>
        <b-navbar-nav>
          <b-nav-item to="/register">Criar projeto</b-nav-item>
        </b-navbar-nav>

        <b-navbar-nav class="ml-auto">       
          <b-nav-item-dropdown right>
            <template #button-content>
              <em>Usuário</em>
            </template>
            <b-dropdown-item @click="logout()">Sair</b-dropdown-item>
          </b-nav-item-dropdown>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>

    <transition name="fade" mode="out-in">
    <router-view/>
    </transition>
  </div>
</template>
<style>
.fade-enter-active, .fade-leave-active {
  transition-duration: 0.2s;
  transition-property: opacity;
  transition-timing-function: ease;
}

.fade-enter, .fade-leave {
  opacity: 0;
}
</style>
<script>
export default {
  computed: {
    verifyLogin() {
      return this.$route.name !== "login" && this.$route.name !== "user";
    }
  },

  methods: {
    logout() {
      localStorage.removeItem('authUser');
      this.$router.push('login')
    }
  }
}
</script>
<style>
.menu {
  display: flex;
  text-align: center;
  justify-content: space-around;
}

</style>
