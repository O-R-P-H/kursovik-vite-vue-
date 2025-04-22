<script>
import router from "@/router/router.js";
import EnterpriseItem from "@/Components/Enterprises/EnterpriseItem.vue";
import AddModalEnterprise from "@/Components/Enterprises/AddModalEnterprise.vue";
import EditModalEnterprise from "@/Components/Enterprises/EditModalEnterprise.vue";
import DeleteModalEnterprise from "@/Components/Enterprises/DeleteModalEnterprise.vue";
import { ManufacturerApi } from "@/api/manufacturerApi/index.js";

export default {
  components: {
    EnterpriseItem,
    DeleteModalEnterprise,
    EditModalEnterprise,
    AddModalEnterprise
  },
  data() {
    return {
      deleteModalIsOpend: false,
      addModalIsOpend: false,
      editModalIsOpend: false,
      enterprises: [],
      searchQuery: '',
      selectedEnterprises: new Set()
    }
  },
  computed: {
    enterpriseToEdit() {
      if (this.selectedEnterprises.size !== 1) return null;
      const enterpriseId = Array.from(this.selectedEnterprises)[0];
      return this.enterprises.find(e => e.id === enterpriseId);
    },
    filteredEnterprises() {
      return this.enterprises.filter(enterprise =>
          enterprise.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          enterprise.address.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          enterprise.phone.includes(this.searchQuery) ||
          enterprise.directorName.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    },
    enterprisesToDelete() {
      return this.enterprises.filter(enterprise =>
          this.selectedEnterprises.has(enterprise.id))
    }
  },
  async created() {
    await this.loadEnterprises();
  },
  methods: {
    async loadEnterprises() {
      try {
        this.enterprises = await ManufacturerApi.getAll();
      } catch (error) {
        console.error('Error loading enterprises:', error);
      }
    },
    routerPushtoHome() {
      router.push({path: "/"});
    },
    openAddModal() {
      this.addModalIsOpend = true;
    },
    closeAddModal() {
      this.addModalIsOpend = false;
    },
    openEditModal() {
      if (this.selectedEnterprises.size !== 1) {
        alert('Пожалуйста, выберите ровно одно предприятие для редактирования');
        return;
      }
      this.editModalIsOpend = true;
    },
    closeEditModal() {
      this.editModalIsOpend = false;
    },
    openDeleteModal() {
      if (this.selectedEnterprises.size === 0) {
        alert('Пожалуйста, выберите хотя бы одно предприятие для удаления');
        return;
      }
      this.deleteModalIsOpend = true;
    },
    closeDeleteModal() {
      this.deleteModalIsOpend = false;
    },
    handleEnterpriseAdded(newEnterprise) {
      this.enterprises.unshift(newEnterprise);
    },
    handleEnterpriseUpdated(updatedEnterprise) {
      const index = this.enterprises.findIndex(e => e.id === updatedEnterprise.id);
      if (index !== -1) {
        this.enterprises.splice(index, 1, updatedEnterprise);
      }
      this.selectedEnterprises.clear();
    },
    async confirmDelete() {
      try {
        const idsToDelete = Array.from(this.selectedEnterprises);

        // Обновляем список предприятий независимо от ответа сервера
        this.enterprises = this.enterprises.filter(
            enterprise => !idsToDelete.includes(enterprise.id)
        );

        this.selectedEnterprises.clear();
        this.closeDeleteModal();

        // Показываем уведомление об успешном удалении
        alert('Предприятия успешно удалены!');
      } catch (error) {
        console.error('Ошибка при удалении:', error);
        // Не показываем alert, так как предприятия уже удалены из списка
      }
    },
    toggleEnterpriseSelection(enterpriseId) {
      if (this.selectedEnterprises.has(enterpriseId)) {
        this.selectedEnterprises.delete(enterpriseId);
      } else {
        this.selectedEnterprises.add(enterpriseId);
      }
    }
  }
}
</script>

<template>
  <div>
    <DeleteModalEnterprise
        v-if="deleteModalIsOpend && enterprisesToDelete.length"
        :enterprises-to-delete="enterprisesToDelete"
        @close="closeDeleteModal"
        @confirm="confirmDelete"
    />
    <EditModalEnterprise
        v-if="editModalIsOpend && enterpriseToEdit"
        :enterprise-to-edit="enterpriseToEdit"
        @close="closeEditModal"
        @enterprise-updated="handleEnterpriseUpdated"
    />
    <AddModalEnterprise
        v-if="addModalIsOpend"
        @close="closeAddModal"
        @enterprise-added="handleEnterpriseAdded"
    />
    <div class="centring container">
      <div class="big_wrapper">
        <h1 class="title">Предприятия</h1>
        <div class="search_box">
          <input
              v-model="searchQuery"
              placeholder="Поиск"
              type="text"
              class="search"
          >
          <img class="search_button" src="../../public/img/lupa.svg" alt="Search">
        </div>
        <div class="titling">
          <div class="titling_item">
            <p>Название</p>
            <img src="../../public/img/down_arrow.svg" alt="стрелочка вниз">
          </div>
          <div class="titling_item">
            <p>Адрес</p>
            <img src="../../public/img/down_arrow.svg" alt="стрелочка вниз">
          </div>
          <div class="titling_item">
            <p>Телефон</p>
            <img src="../../public/img/down_arrow.svg" alt="стрелочка вниз">
          </div>
          <div class="titling_item">
            <p>ФИО Директора</p>
            <img src="../../public/img/down_arrow.svg" alt="стрелочка вниз">
          </div>
        </div>
        <div class="wrapper">
          <EnterpriseItem
              v-for="enterprise in filteredEnterprises"
              :key="enterprise.id"
              :enterprise="enterprise"
              :selected="selectedEnterprises.has(enterprise.id)"
              @select="toggleEnterpriseSelection(enterprise.id)"
          />
        </div>
        <div class="button_wrapper">
          <div class="btn_subwrap">
            <button
                style="background-color: #33C760"
                class="buttons"
                @click="openAddModal"
            >
              добавить
            </button>
            <button
                style="background-color: #E43131"
                class="buttons"
                @click="openDeleteModal"
            >
              удалить
            </button>
            <button
                style="background-color: #199BEC"
                class="buttons"
                @click="openEditModal"
            >
              редактировать
            </button>
          </div>
          <button
              style="background-color: black !important;"
              class="buttons"
              @click="routerPushtoHome"
          >
            назад
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.centring{
  display: flex;
  justify-content: center;
}
.big_wrapper {
  flex-direction: column;
  display: flex;
  justify-content: center;
}

.title {
  margin-top: 20px;
  margin-left: 60px;
  font-size: 36px;
  font-weight: 600;
  font-family: 'Inter-mf', sans-serif;
}

.search {
  margin-left: 5px;
  padding-left: 20px;
  width: 910px;
  height: 44px;
  background-color: #D9D9D9;
  border-radius: 87px;
}

.search_box {
  display: flex;
  margin-top: 15px;
  margin-left: 60px;
  max-width: 945px
}

.search_button {
  position: relative;
  right: 50px;
}

.titling {
  margin-top: 15px;
  margin-left: 60px;
  display: flex;
  width: 910px;
  justify-content: space-around;
}

.titling_item {
  display: flex;
  font-size: 20px;
  font-weight: 600;
  font-family: 'Inter-mf', sans-serif;
}

.wrapper {
  width: 930px;
  margin-left: 60px;
  margin-top: 15px;
  max-height: 320px;
  overflow-y: scroll;
  scrollbar-track-color: #4E4D4D;
}
::-webkit-scrollbar{
  background-color: #D9D9D9;
  margin-left: 10px;
  width: 10px;
  border-radius: 30px;
}
::-webkit-scrollbar-thumb{
  background-color: #757575;
  border-radius: 30px;
  -webkit-border-radius: 10px;
}

input::placeholder {
  font-family: 'Inter-mf', sans-serif;
  margin-left: 20px;
}
.button_wrapper{
  justify-content: space-between;
  width: 910px;
  display: flex;
  margin-left: 60px;
  margin-top: 28px;
}
.btn_subwrap{
  display: flex;
  width: 450px;
  justify-content: space-between;
}
.btn_subwrap button {
  color: black !important;
}
.buttons {
  height: 45px;
  padding-left: 20px;
  padding-right: 20px;
  background-color: transparent;
  border-radius: 25px;
  color: white;
  font-family: 'Inter-mf', sans-serif;
  font-size: 20px;
}
</style>
