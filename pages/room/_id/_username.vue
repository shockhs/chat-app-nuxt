<template>
  <div v-if="status" class="room">
    <header>
      <nuxt-link to="/">На главную страницу</nuxt-link>
    </header>
    <div class="chat">
      <div class="header">
        <span class="name">{{roomName}}</span>
        <span>User: {{username}}</span>
      </div>
      <main>
        <ul v-if="messages" id="messagesContainer" ref="messagesContainer">
          <li v-for="message in messages" :key="`${message.date}.${message.username}`">
            <Message :message="message" :username="username" />
          </li>
        </ul>
      </main>
      <footer>
        <input type="text" placeholder="Введите сообщение..." v-model="message" />
        <button
          @click.prevent="sendMessage"
          :disabled="isFetching || message.length === 0"
        >Отправить</button>
      </footer>
    </div>
  </div>
  <div v-else>
    <h1>404</h1>
    <h4>Комната не найдена</h4>
    <nuxt-link to="/">На главную страницу</nuxt-link>
  </div>
</template>


<script>
import axios from "axios";
import Message from "../../../components/Message";

export default {
  components: {
    Message: Message
  },
  async asyncData({ params }) {
    const roomId = params.id;
    return await axios
      .get(`http://localhost:4200/rooms/${roomId}`)
      .then(res => {
        return {
          username: params.username,
          roomName: res.data.name,
          users: res.data.users,
          messages: res.data.messages,
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
  // watching to rerender
  watch: {
    messages(current, prev) {
      if (current.length > prev.length) this.scrollToBottom();
    }
  },
  methods: {
    // refresh data
    async refresh() {
      this.isFetching = true;
      await axios
        .get(`http://localhost:4200/rooms/${this.roomId}`)
        .then(res => {
          this.messages = res.data.messages;
        })
        .catch(() => {
          this.status = false;
        });
      this.isFetching = false;
    },
    startInterval() {
      this.refreshInterval = setInterval(this.refresh, 10000);
    },
    scrollToBottom() {
      const element = this.$refs.messagesContainer;
      element.scrollTop = element.scrollHeight;
    },
    sendMessage() {
      this.isFetching = true;
      const message = {
        roomId: this.roomId,
        date: new Date(Date.now()),
        text: this.message,
        username: this.username
      };
      this.$axios
        .put(
          `http://localhost:4200/rooms/${this.roomId}`,
          {
            name: this.roomName,
            users: this.users,
            messages: [message, ...this.messages]
          },
          {
            headers: {
              "Content-Type": "application/json"
            }
          }
        )
        .then(res => {
          if (res.status === 200) {
            this.message = "";
            this.refresh();
          }
        });
      this.isFetching = false;
    }
  },
  mounted() {
    this.startInterval();
  },
  beforeDestroy() {
    clearInterval(this.refreshInterval);
  },
  data() {
    return {
      isFetching: false,
      error: "",
      refreshInterval: null,
      message: "",
      status: false,
      messages: []
    };
  }
};
</script>


<style lang='scss' scoped>
.room {
  height: 100vh;
  display: flex;
  width: 100%;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

header {
  height: 10vh;
  align-self: flex-start;
  display: flex;
  align-items: center;
  a {
    font-size: 1.4rem;
    color: #fff;
    font-weight: bold;
    transition: color 0.3s ease-in-out;
  }
  a:hover {
    color: #143cf0;
  }
}

.chat {
  height: 70vh;
  width: 100%;
  border-radius: 15px;
  box-shadow: 0 1px 5px #3d5af1;
  .header {
    padding: 10px 20px;
    border-top-left-radius: 15px;
    border-top-right-radius: 15px;
    height: 7vh;
    background-color: #143cf0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .name {
      font-weight: 700;
    }
  }
  main {
    background-color: #fff;
    height: 56vh;
    overflow: auto;
    ul {
      height: 100%;
      width: 100%;
      overflow-y: auto;
      display: flex;
      flex-direction: column-reverse;
    }
  }
  footer {
    height: 7vh;
    display: grid;
    grid-template-columns: 85% 15%;
    button {
      width: 100%;
      cursor: pointer;
      outline: none;
      border: none;
      background-color: #3d5af1;
      font-weight: bold;
      color: #e2f3f5;
      text-transform: uppercase;
      height: 100%;
      border-bottom-right-radius: 15px;
      &:disabled {
        cursor: default;
      }
    }
    input[type="text"] {
      width: 100%;
      border: none;
      border-top: 1px solid #3d5af1;
      height: 100%;
      padding: 0 10px 0 15px;
      font-size: 1.2rem;
      border-bottom-left-radius: 15px;
    }
    input[type="text"]:focus {
      outline: none;
      border-bottom-left-radius: 15px;
    }
  }
}
</style>