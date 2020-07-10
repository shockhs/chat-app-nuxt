<template>
  <form @submit.prevent="onSubmit">
    <input type="text" placeholder="Введите название комнаты..." v-model="roomName" :maxlength="16" />
    <button type="submit" :disabled="isFetching || roomName.length === 0">Создать</button>
  </form>
</template>

<script>
export default {
  name: "CreateRoom",
  data() {
    return {
      roomName: "",
      isFetching: false
    };
  },
  methods: {
    async onSubmit() {
      this.isFetching = true;
      const room = {
        id: Date.now(),
        name: this.roomName,
        messages: [],
        users: []
      };
      await this.$axios
        .post(`http://localhost:4200/rooms/`, room)
        .then(res => {
          if (res.status === 201) {
            this.$router.push(`/room/${room.id}`);
          }
        })
        .catch(err => console.log(err));
      this.isFetching = false;
    }
  }
};
</script>


<style lang='scss' scoped>
form {
  height: 30px;
  width: 100%;
  display: grid;
  grid-template-columns: 60% 40%;
  width: 400px;
  input {
    width: 100%;
    font-size: 1rem;
    border: none;
    padding-left: 5px;
    outline: none;
    border-radius: 5px;
    height: 100%;
  }
  button {
    margin-left: 10px;
    outline: none;
    cursor: pointer;
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
</style>