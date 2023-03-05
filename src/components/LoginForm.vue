<script setup>
import { reactive } from "vue";
import { auth } from "../plugins/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import router from "@/router/index";
const state = reactive({
  email: "",
  password: "",
  loading: false,
});

async function login() {
  try {
    state.loading = true;
    await signInWithEmailAndPassword(auth, state.email, state.password);
    router.push("/");
  } catch (error) {
    alert(`エラー ${error}`);
  } finally {
    state.loading = false;
  }
}
</script>

<template>
  <div class="d-flex flex-column my-16">
    <v-card elevation="2">
      <v-container>
        <v-row dense>
          <v-col>
            <v-card-title class="text-center">ログイン</v-card-title>
          </v-col>
          <v-col cols="12">
            <v-text-field
              v-model="state.email"
              label="メールアドレス"
              outlined
            ></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-text-field
              v-model="state.password"
              label="パスワード"
              outlined
              type="password"
            ></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-btn
              :loading="state.loading"
              depressed
              color="#42b983"
              block
              @click="login"
            >
              ログイン
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </div>
</template>
