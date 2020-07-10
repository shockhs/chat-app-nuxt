<template>
  <main>
    <form @submit.prevent="onSubmit" v-if="status">
      <label for="username">Введите имя для входа в комнату</label>
      <input type="text" placeholder="Введите имя..." v-model="username" />
      <span v-if="error">{{error}}</span>
      <button :disabled="isFetching || username.length === 0" type="submit">Войти</button>
    </form>
    <div v-else>
      <h1>404</h1>
      <h4>Комната не найдена</h4>
      <nuxt-link to="/">На главную страницу</nuxt-link>
    </div>
  </main>
</template>


<script>
import axios from "axios";

export default {
  async asyncData({ params }) {
    const roomId = params.id;
    return await axios
      .get(`http://localhost:4200/rooms/${roomId}`)
      .then(() => {
        return {
          roomId,
          status: true
        };
      })
      .catch(() => {
        return {
          status: false
        };
      });
  },
  data() {
    return {
      username: "",
      isFetching: false,
      roomId: "",
      error: "",
      status: false
    };
  },
  methods: {
    async onSubmit() {
      this.isFetching = true;
      const roomId = this.$router.history.current.params.id;
      await this.$axios
        .get(`http://localhost:4200/rooms/${roomId}`)
        .then(res => {
          if (res.status === 200) {
            const result = res.data.users.filter(
              user => user.toLowerCase() === this.username.toLowerCase()
            );
            if (result.length > 0) {
              this.error = "Имя занято";
              this.isFetching = false;
            } else {
              this.$axios
                .put(
                  `http://localhost:4200/rooms/${roomId}`,
                  {
                    name: res.data.name,
                    messages: res.data.messages,
                    users: [...res.data.users, this.username]
                  },
                  {
                    headers: {
                      "Content-Type": "application/json"
                    }
                  }
                )
                .then(res => {
                  if (res.status === 200) {
                    this.$router.push(`/room/${this.roomId}/${this.username}`);
                  }
                });
            }
          }
        });
    }
  }
};
</script>

<style lang='scss' scoped>
main {
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  form {
    display: flex;
    height: 180px;
    justify-content: space-between;
    align-items: center;
    flex-direction: column;
    input {
      width: 100%;
      font-size: 1rem;
      padding: 5px 0 5px 5px;
      border: none;
      outline: none;
      border-radius: 5px;
    }
    span {
      color: red;
      font-size: 1.2rem;
    }
    label {
      font-size: 1.5rem;
      font-weight: bold;
    }
    button {
      margin-left: 10px;
      outline: none;
      cursor: pointer;
      height: 30px;
      width: 200px;
      border: none;
      text-transform: uppercase;
      font-weight: bold;
      border-radius: 5px;
      background-color: #fff;
      color: #0e153a;
      transition: all 0.3s ease-in-out;
      &:hover {
        background-color: #2979ff;
        color: #fff;
      }
      &:hover:disabled {
        background-color: #fff;
        color: #0e153a;
      }
      &:disabled {
        cursor: default;
      }
    }
  }
}
</style>