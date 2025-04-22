<script>
import router from "@/router/router.js";
import PriceListItem from "@/Components/PriceList/PriceListItem.vue";
import AddModalPriceList from "@/Components/PriceList/AddModalPriceList.vue";
import EditModalPriceList from "@/Components/PriceList/EditModalPriceList.vue";
import DeleteModalPriceList from "@/Components/PriceList/DeleteModalPriceList.vue";
import MassUpdateModalPriceList from "@/Components/PriceList/MassUpdateModalPriceList.vue";
import { PriceListApi } from "@/api/priceListApi";
import { ManufacturerApi } from "@/api/manufacturerApi";

export default {
  components: {
    PriceListItem,
    DeleteModalPriceList,
    EditModalPriceList,
    AddModalPriceList,
    MassUpdateModalPriceList
  },
  data() {
    return {
      deleteModalIsOpend: false,
      addModalIsOpend: false,
      editModalIsOpend: false,
      massUpdateModalIsOpend: false,
      priceLists: [],
      manufacturers: [],
      searchQuery: '',
      selectedPriceLists: new Set(),
      massUpdateData: {
        manufacturer: null,
        price: null
      },
      isUpdating: false,
      updateProgress: 0,
      totalToUpdate: 0
    }
  },
  computed: {
    priceListToEdit() {
      if (this.selectedPriceLists.size !== 1) return null;
      const priceListId = Array.from(this.selectedPriceLists)[0];
      return this.priceLists.find(priceList => priceList.id === priceListId);
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
    await this.loadManufacturers();
  },
  methods: {
    async loadPriceLists() {
      try {
        this.priceLists = await PriceListApi.getAll();
      } catch (error) {
        console.error('Ошибка загрузки прайс-листов:', error);
        this.priceLists = [];
      }
    },
    async loadManufacturers() {
      try {
        const response = await ManufacturerApi.getAll();
        this.manufacturers = response.map(manufacturer => ({
          ...manufacturer,
          priceLists: manufacturer.priceLists?.map(priceList => ({
            ...priceList,
            manufacturer: manufacturer.id // Добавляем manufacturerId если его нет
          })) || []
        }));
      } catch (error) {
        console.error('Ошибка загрузки производителей:', error);
        this.manufacturers = [];
      }
    },
    routerPushToHome() {
      router.push({ path: "/" });
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
    openMassUpdateModal() {
      this.massUpdateModalIsOpend = true;
    },
    closeMassUpdateModal() {
      this.massUpdateModalIsOpend = false;
      this.massUpdateData = {
        manufacturer: null,
        price: null
      };
      this.isUpdating = false;
      this.updateProgress = 0;
    },
    handlePriceListAdded(newPriceList) {
      this.priceLists.unshift(newPriceList);
    },
    handlePriceListUpdated(updatedPriceList) {
      const index = this.priceLists.findIndex(priceList => priceList.id === updatedPriceList.id);
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
    },
    async confirmMassUpdate() {
      if (!this.massUpdateData.manufacturer || !this.massUpdateData.price) {
        alert('Пожалуйста, выберите производителя и укажите новую цену');
        return;
      }

      this.isUpdating = true;
      this.updateProgress = 0;

      try {
        // Находим выбранного производителя
        const selectedManufacturer = this.manufacturers.find(
            m => m.id === this.massUpdateData.manufacturer
        );

        if (!selectedManufacturer?.priceLists?.length) {
          alert('Не найдено прайс-листов для выбранного производителя');
          this.isUpdating = false;
          return;
        }

        this.totalToUpdate = selectedManufacturer.priceLists.length;
        let successCount = 0;

        // Обновляем каждый прайс-лист производителя
        for (let i = 0; i < selectedManufacturer.priceLists.length; i++) {
          const priceList = selectedManufacturer.priceLists[i];

          try {
            // Формируем данные согласно структуре API
            const updateData = {
              manufacturer: selectedManufacturer.name, // Используем имя производителя
              productName: priceList.productName,
              group: priceList.group,
              price: this.massUpdateData.price.toString() // Преобразуем в строку
            };

            console.log('Отправляемые данные:', updateData); // Для отладки

            await PriceListApi.update(priceList.id, updateData);
            successCount++;
          } catch (error) {
            console.error(`Ошибка при обновлении прайс-листа ${priceList.id}:`, error);
            if (error.response) {
              console.error('Детали ошибки:', error.response.data);
            }
          } finally {
            this.updateProgress = ((i + 1) / this.totalToUpdate) * 100;
          }
        }

        // Перезагружаем данные
        await this.loadPriceLists();
        await this.loadManufacturers();
        this.closeMassUpdateModal();

        if (successCount > 0) {
          alert(`Успешно обновлено ${successCount} из ${this.totalToUpdate} прайс-листов`);
        } else {
          alert('Не удалось обновить ни один прайс-лист. Проверьте консоль для деталей.');
        }
      } catch (error) {
        console.error('Общая ошибка при массовом обновлении:', error);
        alert('Произошла ошибка при обновлении');
      } finally {
        this.isUpdating = false;
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
    <MassUpdateModalPriceList
        v-if="massUpdateModalIsOpend"
        :manufacturers="manufacturers"
        :is-updating="isUpdating"
        :update-progress="updateProgress"
        @close="closeMassUpdateModal"
        @confirm="confirmMassUpdate"
        v-model:manufacturer="massUpdateData.manufacturer"
        v-model:price="massUpdateData.price"
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
              Добавить
            </button>
            <button
                style="background-color: #E43131"
                class="buttons"
                @click="openDeleteModal"
            >
              Удалить
            </button>
            <button
                style="background-color: #199BEC"
                class="buttons"
                @click="openEditModal"
            >
              Редактировать
            </button>
            <button
                style="background-color: #FFA500"
                class="buttons"
                @click="openMassUpdateModal"
            >
              Массовое обновление
            </button>
          </div>
          <button
              style="background-color: black !important;"
              class="buttons"
              @click="routerPushToHome"
          >
            Назад
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.centring {
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
::-webkit-scrollbar {
  background-color: #D9D9D9;
  margin-left: 10px;
  width: 10px;
  border-radius: 30px;
}
::-webkit-scrollbar-thumb {
  background-color: #757575;
  border-radius: 30px;
  -webkit-border-radius: 10px;
}

input::placeholder {
  font-family: 'Inter-mf', sans-serif;
  margin-left: 20px;
}
.button_wrapper {
  justify-content: space-between;
  width: 910px;
  display: flex;
  margin-left: 60px;
  margin-top: 28px;
}
.btn_subwrap {
  display: flex;
  width: 650px;
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