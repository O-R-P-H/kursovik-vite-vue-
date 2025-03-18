<script>

</script>

<template>
  <div>
    <div class="background"></div>
    <div class="main">
      <p class="z">An advertising company</p>
      <div class="buttons">
        <button>enterprises</button>
        <button>products</button>
        <button>price lists</button>
      </div>
    </div>

  </div>

</template>

<style scoped>
.background {
  background-image: url("../../public/img/fon.svg");
  width: 100vw;
  height: max-content;
  position: absolute;
  z-index: -1000;
  bottom: 0;
  background-size: cover;
}
.main {
  width: 100vw;
  height: 100vh;
}

.z {
  color: #4E4D4D;
  font-size: 6.4vh;
  font-weight: bolder;
  margin-left: 36px;
  margin-top: 32px;
  font-family: 'Inter-mf',sans-serif;
}
.buttons {
  display: flex;
  flex-direction: column;
  align-content: flex-start;
  flex-wrap: wrap;
  margin-top: 42px;
  margin-left: 36px;
  height: 34vh;
  justify-content: space-between

}
button {
  width: 24vw;
  height: 9vh;
  border-radius: 45px;
  background-color: #D0CDCD;
  color: #4E4D4D;
  font-size: 2.8vh;
  font-weight: 560;
  margin-bottom: 10px;
  cursor: pointer;
  font-family: 'Inter-mf',sans-serif;
}
</style>
