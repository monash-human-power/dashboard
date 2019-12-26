<template>
  <b-container>
    <h1>Files</h1>
    <b-list-group v-if="files !== null">
      <b-list-group-item
        v-for="(file, index) in files"
        :key="index"
        :href="`/files/${file}`"
        target="_blank"
      >
        {{ file }}
        <b-button
          variant="danger"
          size="sm"
          class="float-right"
          @click="event => handleDelete(event, file)"
        >
          Delete
        </b-button>
      </b-list-group-item>
    </b-list-group>

    <b-modal
      id="deleteModal"
      title="Delete File"
      @ok="handleConfirmDelete"
    >
      Are you sure you want to delete {{ deletingFile }}?

      <template v-slot:modal-footer="{ ok, cancel }">
        <b-button @click="cancel()">
          Cancel
        </b-button>
        <b-button variant="danger" @click="ok()">
          Delete
        </b-button>
      </template>
    </b-modal>
  </b-container>
</template>

<script>
import { getFiles, deleteFile } from '@/api/files';

export default {
  name: 'dashboard-files-view',
  data() {
    return {
      files: null,
      deletingFile: null,
    };
  },
  methods: {
    handleDelete(event, file) {
      this.deletingFile = file;
      this.$bvModal.show('deleteModal');
      event.preventDefault();
    },
    async handleConfirmDelete() {
      await deleteFile(this.deletingFile);
      this.files = await getFiles();
    },
  },
  async created() {
    this.files = await getFiles();
  },
};
</script>

<style>

</style>
