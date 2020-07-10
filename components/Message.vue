<template>
  <div
    class="messageContainer"
    :class="isSentByCurrentUser(message.username) ? 'justifyEnd' : 'justifyStart'"
  >
    <p class="sentText pr-10">{{isSentByCurrentUser(message.username) ? "Вы" : message.username}} {{$moment(message.date).format('LT')}}</p>
    <div
      class="messageBox"
      :class="isSentByCurrentUser(message.username) ? 'backgroundBlue' : 'colorDefault'">
      <p class="messageText">{{message.text}}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MessageItem',
  props: {
    message: {},
    username: String
  },
  methods: {
    isSentByCurrentUser(username) {
      return username === this.username;
    }
  }
};
</script>

<style lang="scss" scoped>
.messageBox {
  background: #f3f3f3;
  border-radius: 20px;
  padding: 0 20px;
  color: white;
  display: inline-block;
  max-width: 80%;
}

.messageText {
  width: 100%;
  letter-spacing: 0;
  float: left;
  font-size: 1.1em;
  word-wrap: break-word;
}

.messageText img {
  vertical-align: middle;
}

.messageContainer {
  display: flex;
  justify-content: flex-end;
  padding: 5px 10px;
}

.sentText {
  display: flex;
  align-items: center;
  font-family: Helvetica;
  color: #828282;
  letter-spacing: 0.3px;
}

.pl-10 {
  padding-left: 10px;
}

.pr-10 {
  padding-right: 10px;
}

.justifyStart {
  justify-content: flex-start;
}

.justifyEnd {
  justify-content: flex-end;
}

.colorWhite {
  color: white;
}

.colorDark {
  color: #353535;
}

.colorDefault {
  background-color: #9c7bc0;
}

.backgroundBlue {
  background: #2979ff;
}

.backgroundLight {
  background: #f3f3f3;
}
</style>