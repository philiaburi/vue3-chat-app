<script setup>
import { reactive } from "vue";
import { auth, db } from "../plugins/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import router from "@/router/index";

const state = reactive({
  name: "",
  email: "",
  password: "",
  loading: false,
});

async function singup() {
  try {
    state.loading = true;
    const { user } = await createUserWithEmailAndPassword(
      auth,
      state.email,
      state.password
    );
    const docRef = doc(db, "users", user.uid);
    await setDoc(docRef, {
      name: state.name,
      email: state.email,
    });
    router.push("/");
  } catch (error) {
    alert(`エラー ${error}`);
  } finally {
    state.loading = false;
  }
}
</script>

<template>
  <div class="my-16">
    <v-card elevation="2">
      <v-container>
        <v-row dense>
          <v-col>
            <v-card-title class="text-center"> サインアップ </v-card-title>
          </v-col>
          <v-col cols="12">
            <v-text-field
              v-model="state.name"
              label="ユーザー名"
              outlined
            ></v-text-field>
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
              depressed
              color="#42b983"
              block
              @click="singup"
              :loading="state.loading"
            >
              サインアップ
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </div>
</template>
