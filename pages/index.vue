<template>
  <main>
    <h1>Active chat rooms</h1>
    <ul v-if='rooms'>
      <li v-for='room in rooms' :key='room.id'>
        <nuxt-link :data-content='room.name' :to='/room/+room.id'>{{room.name}}</nuxt-link>
      </li>
    </ul>
    <div v-else>
      <h4>Открытых комнат нет</h4>
    </div>
    <CreateForm />
    <div v-if='!status'>
      <h4>Ошибка на стороне сервера. Попробуйте позже</h4>
    </div>
  </main>
</template>

<script>
import axios from 'axios';
import CreateForm from '../components/CreateRoom'

export default {
  components: {
    CreateForm
  },
  async asyncData() {
    return await axios
      .get(`http://localhost:4200/rooms/`)
      .then(res => {
        return {
          rooms: res.data.map(item => {
            return {
              id: item.id,
              name: item.name
            };
          }),
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
      rooms: null,
      status: true
    };
  }
};
</script>

<style lang='scss' scoped>
main {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  flex-direction: column;
  letter-spacing: 2px;
  h1 {
    margin-bottom: 10px;
  }
  ul {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 20px;
    li + li  {
      margin-top: 10px;
    }
    li {
      a {
        color: #fff;
        font-size: 1.5rem;
      }
      a {
        position: relative;
        display: inline-block;
        overflow: hidden;
      }
      a:before {
        position: absolute;
        content: attr(data-content);
        top: 0;
        left: 0;
        color: #008cff;
        overflow: hidden;
        transition: width 475ms ease;
        width: 0;
        white-space: nowrap;
      }
      a:hover:before {
        width: 100%;
      }
      .active {
        color: #008cff;
      }
    }
  }
}
</style>