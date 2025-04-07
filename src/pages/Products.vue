<script>
import router from "@/router/router.js";
import ProductItem from "@/Components/ProductItem.vue";
import {ProductApi} from "@/api/productApi/index.js";

export default {
  components: {ProductItem},
  data() {
    return {
      products: [],
      searchQuery: '', // Добавим состояние для поиска
      selectedProducts: new Set() // Для хранения выбранных продуктов
    }
  },
  async created() {
    try {
      const data = await ProductApi.getAll();
      this.products = data;
      console.log('Products loaded:', data);
    } catch (error) {
      console.error('Error loading products:', error);
      // Можно добавить уведомление об ошибке
    }
  },
  computed: {
    filteredProducts() {
      // Фильтрация продуктов по поисковому запросу
      return this.products.filter(product =>
          product.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          product.group.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          product.number.includes(this.searchQuery)
      );
    }
  },
  methods: {
    routerPushtoHome() {
      router.push({path: "/"});
    },
    handleAddProduct() {
      // Логика добавления нового продукта
      router.push({path: "/products/new"});
    },
    handleDeleteProducts() {
      // Логика удаления выбранных продуктов
      if (this.selectedProducts.size === 0) {
        alert('Please select products to delete');
        return;
      }

      if (confirm('Are you sure you want to delete selected products?')) {
        // Вызов API для удаления
        const idsToDelete = Array.from(this.selectedProducts);
        ProductApi.deleteMultiple(idsToDelete)
            .then(() => {
              this.products = this.products.filter(p => !idsToDelete.includes(p.id));
              this.selectedProducts.clear();
            })
            .catch(error => {
              console.error('Error deleting products:', error);
            });
      }
    },
    handleEditProduct() {
      // Логика редактирования (предполагаем редактирование одного продукта)
      if (this.selectedProducts.size !== 1) {
        alert('Please select exactly one product to edit');
        return;
      }

      const productId = Array.from(this.selectedProducts)[0];
      router.push({path: `/products/edit/${productId}`});
    },
    toggleProductSelection(productId) {
      // Переключение выбора продукта
      if (this.selectedProducts.has(productId)) {
        this.selectedProducts.delete(productId);
      } else {
        this.selectedProducts.add(productId);
      }
    }
  }
}
</script>

<template>
  <div>
    <div class="centring container">
      <div class="big_wrapper">
        <h1 class="title">Products</h1>
        <div class="search_box">
          <input
              v-model="searchQuery"
              placeholder="Search"
              type="text"
              class="search"
          >
          <img class="search_button" src="../../public/img/lupa.svg" alt="Search">
        </div>
        <div class="titling">
          <div class="titling_item">
            <p>Name</p>
            <img src="../../public/img/down_arrow.svg" alt="стрелочка вниз">
          </div>
          <div class="titling_item">
            <p>Count</p>
            <img src="../../public/img/down_arrow.svg" alt="стрелочка вниз">
          </div>
          <div class="titling_item">
            <p>Group</p>
            <img src="../../public/img/down_arrow.svg" alt="стрелочка вниз">
          </div>
          <div class="titling_item">
            <p>Number</p>
            <img src="../../public/img/down_arrow.svg" alt="стрелочка вниз">
          </div>
          <div class="titling_item">
            <p>Manufacturer</p>
            <img src="../../public/img/down_arrow.svg" alt="стрелочка вниз">
          </div>
          <div class="titling_item">
            <p>Price</p>
            <img src="../../public/img/down_arrow.svg" alt="стрелочка вниз">
          </div>
        </div>
        <div class="wrapper">
          <ProductItem
              v-for="product in filteredProducts"
              :key="product.id"
              :product="product"
              :selected="selectedProducts.has(product.id)"
              @select="toggleProductSelection(product.id)"
          />
        </div>
        <div class="button_wrapper">
          <div class="btn_subwrap">
            <button
                style="background-color: #33C760"
                class="buttons"
                @click="handleAddProduct"
            >
              add
            </button>
            <button
                style="background-color: #E43131"
                class="buttons"
                @click="handleDeleteProducts"
            >
              delete
            </button>
            <button
                style="background-color: #199BEC"
                class="buttons"
                @click="handleEditProduct"
            >
              edit
            </button>
          </div>
          <button
              style="background-color: black !important;"
              class="buttons"
              @click="routerPushtoHome"
          >
            back
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
  margin-top: 50px;
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
  width: 130px;
  background-color: transparent;
  border-radius: 25px;
  color: white;
  font-family: 'Inter-mf', sans-serif;
  font-size: 20px;
}
</style>
