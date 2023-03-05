<script setup>
import ChatRoom from "@/components/ChatRoom.vue";
import { onAuthStateChanged } from "firebase/auth";
import { reactive, onMounted } from "vue";
import { auth, db } from "../plugins/firebase";
import { doc, onSnapshot } from "firebase/firestore";
import UserList from "@/components/UserList";

const state = reactive({
  userId: "",
  name: "",
  email: "",
  password: "",
  loading: false,
});

async function getUser() {
  return await new Promise((resolve, reject) => {
    onAuthStateChanged(auth, (user) => {
      if (user) resolve(user);
      else reject(null);
    });
  });
}

function goToChatRoom(selectUserId) {
  state.selectUserId = selectUserId;
}

onMounted(async () => {
  //ログイン情報取得
  const user = await getUser();
  //ログイン情報がないときは、処理を抜ける
  if (!user) return;
  const docRef = doc(db, "users", user.uid);
  onSnapshot(docRef, (doc) => {
    const data = doc.data();
    if (!data) return;
    state.userId = doc.id;
    state.name = data.name;
    state.email = data.email;
  });
});
</script>

<template>
  <div class="mt-16">
    <v-row align="center" justify="center">
      <v-col class="text-center mb-auto" cols="12" md="4">
        <h2 class="pb-2">チャットアプリ</h2>
        <h4 class="subheading">名前: {{ state.name }}</h4>
        <h4 class="subheading">メールアドレス:{{ state.email }}</h4>

        <div class="mt-4">
          <UserList
            :userId="state.userId"
            @goToChatRoom="goToChatRoom"
          ></UserList>
        </div>
      </v-col>
      <v-col cols="12" md="8">
        <ChatRoom
          :userId="state.userId"
          :userName="state.name"
          :talkUserId="state.selectUserId"
        ></ChatRoom>
      </v-col>
    </v-row>
  </div>
</template>
