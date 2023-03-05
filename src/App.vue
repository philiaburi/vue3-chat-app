<script setup>
import BaseHeader from "@/components/BaseHeader.vue";
</script>
<template>
  <v-app style="background: #e8e2df">
    <v-layout>
      <BaseHeader></BaseHeader>
      <v-container class="py-16">
        <router-view />
      </v-container>
    </v-layout>
  </v-app>
</template>
