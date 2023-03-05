<script setup>
import { reactive, onMounted, defineProps, computed, defineEmits } from "vue";
import { db } from "../plugins/firebase";
import { collection, onSnapshot } from "firebase/firestore";
const props = defineProps(["userId"]);

const state = reactive({
  users: [],
});

onMounted(async () => {
  setUsers();
});

const filterUsers = computed(() => {
  return state.users.filter((item) => item.id !== props.userId);
});

function setUsers() {
  const collectionRef = collection(db, "users");
  onSnapshot(collectionRef, (querySnapshot) => {
    querySnapshot.forEach((doc) => {
      state.users.push({
        id: doc.id,
        name: doc.data().name,
        email: doc.data().email,
      });
    });
  });
}

const emit = defineEmits(["goToChatRoom"]);

function goToRoom(status) {
  emit("goToChatRoom", status);
}
</script>

<template>
  <v-card>
    <v-list>
      <v-list-item
        v-for="(item, index) in filterUsers"
        :key="index"
        @click="goToRoom(item.id)"
      >
        <v-list-item-title class="text-start">{{
          item.name
        }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-card>
</template>
