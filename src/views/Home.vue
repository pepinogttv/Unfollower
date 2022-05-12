<template>
  <div class="pt-16 mt-16 d-flex flex-column align-center">
    <Logo />
    <h2>Dejar de seguir en cantidad nunca fue tan facil.</h2>
    <v-btn to="/groups" x-large outlined class="mt-8"> Comenzar </v-btn>
  </div>
</template>

<script>
// @ is an alias to /src
import Logo from "@/components/Logo.vue";

// import { RelatedUsersDB } from "../services/RelatedUsersDB";

export default {
  components: {
    Logo,
  },
  name: "Home",
  // async mounted() {
  //   const request = window.indexedDB.open("RelatedUsers", 1);
  //   request.onsuccess = () => {
  //     const db = request.result;
  //     const transaction = db.transaction("followers", "readonly");
  //     console.log(transaction);
  //     const invoiceStore = transaction.objectStore("invoices");
  //     const getCursorRequest = invoiceStore.openCursor();
  //     getCursorRequest.onsuccess = (e) => {
  //       console.log(e);
  //       // Cursor logic here
  //     };
  //   };
  // },
};
</script>
