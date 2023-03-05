<script setup>
import { auth } from "../plugins/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { signOut } from "firebase/auth";
import { reactive, onMounted } from "vue";
import router from "@/router/index";

const state = reactive({
  isLogin: false,
  userName: "",
});

onMounted(() => {
  // ログインしているか判定する
  onAuthStateChanged(auth, (user) => {
    if (user) {
      // ログインしている場合
      state.isLogin = true;
      state.userName = user.email;
    } else {
      // ログインしていない場合
      state.isLogin = false;
      state.userName = "";
    }
  });
});

// HomeView.vueからlogout関数をコピペ
async function logout() {
  try {
    state.loading = true;
    await signOut(auth);
    // ログアウトした後、ログインページに遷移しています。
    router.push("/login");
  } catch (error) {
    alert(`エラー ${error}`);
  } finally {
    state.loading = false;
  }
}
</script>

<template>
  <v-app-bar elevation="0" color="#42b983" dark class="px-4">
    <v-app-bar-title style="font-weight: 800; color: #fff">
      Vaindersチャット
    </v-app-bar-title>
    <v-spacer></v-spacer>
    <!-- ログインしている時に表示するコンテンツ -->
    <v-menu left bottom rounded v-if="state.isLogin">
      <template v-slot:activator="{ props }">
        <!-- v-avatarをクリックしたら、メニューが表示されるようにしています。 -->
        <v-btn icon v-bind="props">
          <v-avatar color="white" dark size="46">
            <span class="text-h5" style="color: #42b983">
              <!-- ここで最初の一文字だけ切り取って表示しています -->
              {{ state.userName.slice(0, 1) || "" }}
            </span>
          </v-avatar>
        </v-btn>
      </template>
      <v-list>
        <!-- ユーザー名表示 -->
        <v-list-item>
          <v-list-item-title>{{ state.userName }}</v-list-item-title>
        </v-list-item>
        <!-- ログアウトボタン -->
        <v-list-item @click="logout">
          <v-list-item-title>ログアウト</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
    <!-- ログインしていない時に表示させている -->
    <div v-else>
      <v-btn variant="text" class="mr-1" color="white" href="#/signup">
        サインアップ
      </v-btn>
      <v-btn variant="flat" color="white" dark href="#/login"> ログイン </v-btn>
    </div>
  </v-app-bar>
</template>
