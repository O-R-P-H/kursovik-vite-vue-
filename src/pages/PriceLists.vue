<script>
import router from "@/router/router.js";
import PriceListItem from "@/Components/PriceList/PriceListItem.vue";
import AddModalPriceList from "@/Components/PriceList/AddModalPriceList.vue";
import EditModalPriceList from "@/Components/PriceList/EditModalPriceList.vue";
import DeleteModalPriceList from "@/Components/PriceList/DeleteModalPriceList.vue";
import { PriceListApi } from "@/api/priceListApi";

export default {
  components: {
    PriceListItem,
    DeleteModalPriceList,
    EditModalPriceList,
    AddModalPriceList
  },
  data() {
    return {
      deleteModalIsOpend: false,
      addModalIsOpend: false,
      editModalIsOpend: false,
      priceLists: [],
      searchQuery: '',
      selectedPriceLists: new Set()
    }
  },
  computed: {
    priceListToEdit() {
      if (this.selectedPriceLists.size !== 1) return null;
      const priceListId = Array.from(this.selectedPriceLists)[0];
      return this.priceLists.find(p => p.id === priceListId);
    },
    filteredPriceLists() {
      const query = this.searchQuery?.toLowerCase() || '';
      return this.priceLists.filter(priceList => {
        const manufacturer = (priceList.manufacturer || '').toString().toLowerCase();
        const productName = (priceList.productName || '').toString().toLowerCase();
        const group = (priceList.group || '').toString().toLowerCase();
        const price = (priceList.price || '').toString().toLowerCase();

        return (
            manufacturer.includes(query) ||
            productName.includes(query) ||
            group.includes(query) ||
            price.includes(query)
        );
      });
    },
    priceListsToDelete() {
      return this.priceLists.filter(priceList =>
          this.selectedPriceLists.has(priceList.id)
      );
    }
  },
  async created() {
    await this.loadPriceLists();
  },
  methods: {
    async loadPriceLists() {
      try {
        this.priceLists = await PriceListApi.getAll();
      } catch (error) {
        console.error('Error loading price lists:', error);
        this.priceLists = []; // На случай ошибки устанавливаем пустой массив
      }
    },
    // Остальные методы остаются без изменений
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
      if (this.selectedPriceLists.size !== 1) {
        alert('Пожалуйста, выберите ровно один прайс-лист для редактирования');
        return;
      }
      this.editModalIsOpend = true;
    },
    closeEditModal() {
      this.editModalIsOpend = false;
    },
    openDeleteModal() {
      if (this.selectedPriceLists.size === 0) {
        alert('Пожалуйста, выберите хотя бы один прайс-лист для удаления');
        return;
      }
      this.deleteModalIsOpend = true;
    },
    closeDeleteModal() {
      this.deleteModalIsOpend = false;
    },
    handlePriceListAdded(newPriceList) {
      this.priceLists.unshift(newPriceList);
    },
    handlePriceListUpdated(updatedPriceList) {
      const index = this.priceLists.findIndex(p => p.id === updatedPriceList.id);
      if (index !== -1) {
        this.priceLists.splice(index, 1, updatedPriceList);
      }
      this.selectedPriceLists.clear();
    },
    async confirmDelete() {
      try {
        const idsToDelete = Array.from(this.selectedPriceLists);
        this.priceLists = this.priceLists.filter(
            priceList => !idsToDelete.includes(priceList.id)
        );
        this.selectedPriceLists.clear();
        this.closeDeleteModal();
        alert('Прайс-листы успешно удалены!');
      } catch (error) {
        console.error('Ошибка при удалении:', error);
      }
    },
    togglePriceListSelection(priceListId) {
      if (this.selectedPriceLists.has(priceListId)) {
        this.selectedPriceLists.delete(priceListId);
      } else {
        this.selectedPriceLists.add(priceListId);
      }
    }
  }
}
</script>

<template>
  <div>
    <DeleteModalPriceList
        v-if="deleteModalIsOpend && priceListsToDelete.length"
        :price-lists-to-delete="priceListsToDelete"
        @close="closeDeleteModal"
        @confirm="confirmDelete"
    />
    <EditModalPriceList
        v-if="editModalIsOpend && priceListToEdit"
        :price-list-to-edit="priceListToEdit"
        @close="closeEditModal"
        @price-list-updated="handlePriceListUpdated"
    />
    <AddModalPriceList
        v-if="addModalIsOpend"
        @close="closeAddModal"
        @price-list-added="handlePriceListAdded"
    />
    <div class="centring container">
      <div class="big_wrapper">
        <h1 class="title">Прайс-листы</h1>
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
            <p>Предприятия</p>
            <img src="../../public/img/down_arrow.svg" alt="стрелочка вниз">
          </div>
          <div class="titling_item">
            <p>Название</p>
            <img src="../../public/img/down_arrow.svg" alt="стрелочка вниз">
          </div>
          <div class="titling_item">
            <p>Группа</p>
            <img src="../../public/img/down_arrow.svg" alt="стрелочка вниз">
          </div>
          <div class="titling_item">
            <p>Прайс</p>
            <img src="../../public/img/down_arrow.svg" alt="стрелочка вниз">
          </div>
        </div>
        <div class="wrapper">
          <PriceListItem
              v-for="priceList in filteredPriceLists"
              :key="priceList.id"
              :price-list="priceList"
              :selected="selectedPriceLists.has(priceList.id)"
              @select="togglePriceListSelection(priceList.id)"
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
