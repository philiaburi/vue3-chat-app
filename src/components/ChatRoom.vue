<script setup>
import { mdiSend } from "@mdi/js";
import { reactive, onMounted, defineProps, watch } from "vue";
import {
  query,
  where,
  onSnapshot,
  collection,
  getDocs,
  addDoc,
  orderBy,
} from "firebase/firestore";
import { db } from "../plugins/firebase";
const props = defineProps(["userId", "userName", "talkUserId"]);
const state = reactive({
  sendMessageText: "",
  messages: [],
  roomId: null,
});

onMounted(async () => {
  if (!props.userId) return;
  if (!props.talkUserId) return;
  setMessages();
});

watch(
  () => props.talkUserId,
  (id) => {
    if (!id) return;
    state.sendMessageText = "";
    state.messages = [];
    state.roomId = null;
    setMessages();
  }
);

async function setMessages() {
  const collectionRef = collection(db, "rooms");
  const q = query(
    collectionRef,
    where("user_ids", "array-contains", props.userId)
  );
  const rooms = await getDocs(q);
  const roomIds = [];
  rooms.forEach((doc) => {
    if (!doc?.id) return;
    const data = doc.data();
    if (!data.user_ids.includes(props.talkUserId)) return;
    roomIds.push(doc.id);
  });
  state.roomId = roomIds[0];
  if (!state.roomId) {
    const docRef = await addDoc(collectionRef, {
      user_ids: [props.userId, props.talkUserId],
    });
    state.roomId = docRef.id;
  }
  const messagesRef = collection(db, "rooms", state.roomId, "messages");
  const messageQ = query(messagesRef, orderBy("send_time"));
  onSnapshot(messageQ, (querySnapshot) => {
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      if (state.messages.some((item) => item.id === doc.id)) return;
      state.messages.push({
        id: doc.id,
        message: data.message,
        name: data.name,
        user_id: data.user_id,
        send_time: data.send_time,
      });
    });
  });
}
function sendMessage() {
  if (!state.sendMessageText) return;
  if (!props.userName) return;
  if (!props.userId) return;
  const messagesRef = collection(db, "rooms", state.roomId, "messages");
  addDoc(messagesRef, {
    message: state.sendMessageText,
    name: props.userName,
    user_id: props.userId,
    send_time: new Date(),
  });
  state.sendMessageText = "";
}
</script>
<template>
  <v-card
    class="d-flex flex-column position-relative"
    elevation="0"
    height="calc(100vh - 200px)"
    max-height="calc(100vh - 200px)"
  >
    <ul v-if="talkUserId" class="d-flex flex-column px-0 py-12 px-6">
      <li
        v-for="item in state.messages"
        :key="item.id"
        class="my-2 d-flex flex-column"
        :class="item.user_id === userId ? 'ml-auto' : 'mr-auto'"
      >
        <span
          class="text-caption"
          :class="item.user_id === userId ? 'text-right' : 'text-left'"
        >
          {{ item.name }}
        </span>
        <span
          class="pa-2 text-subtitle-2 chat-box text-start"
          :class="item.user_id === userId ? 'my-chat-box' : 'other-chat-box'"
        >
          {{ item.message }}
        </span>
      </li>
    </ul>
    <div class="d-flex bottom-bar mt-auto px-2 py-3" v-if="talkUserId">
      <v-text-field
        v-model="state.sendMessageText"
        :append-icon="mdiSend"
        filled
        variant="outlined"
        hide-details
        label="メッセージ"
        type="text"
        @click:append="sendMessage"
      ></v-text-field>
    </div>
    <!-- 会話する相手がいない場合 -->
    <div class="ma-auto text-heading-6" v-if="!talkUserId">
      会話する相手を選ぼう！
    </div>
  </v-card>
</template>
<style scoped>
ul li {
  list-style: none;
}
.my-chat-box {
  margin-left: auto;
  background: #a2eccb;
  border-radius: 4px;
}
.chat-box {
  display: inline-block;
  position: relative;
  max-width: 300px;
}
.my-chat-box:after {
  content: "";
  position: absolute;
  top: 3px;
  right: -19px;
  border: 8px solid transparent;
  border-left: 18px solid #a2eccb;
  -webkit-transform: rotate(-35deg);
  transform: rotate(-35deg);
}

.other-chat-box {
  margin-right: auto;
  border-radius: 4px;
  background: #cacaca;
}

.other-chat-box:after {
  content: "";
  display: inline-block;
  position: absolute;
  top: 3px;
  left: -19px;
  border: 8px solid transparent;
  border-right: 18px solid #cacaca;
  -webkit-transform: rotate(35deg);
  transform: rotate(35deg);
}
.position-relative {
  position: relative;
  overflow: auto;
}
.bottom-bar {
  border-top: 1px solid #cacaca;
  background: #fff;
  position: sticky;
  top: auto;
  bottom: 0;
  left: 0;
  right: 0;
}
</style>
