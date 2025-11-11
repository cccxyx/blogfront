<template>
  <div class="common-layout">
    <el-container>
        <el-header>Header</el-header>
        <el-main>Main</el-main>
        <el-table :data="tableData" border style="width: 100%">
        <el-table-column prop="date" label="Date" width="180" />
        <el-table-column prop="name" label="Name" width="180" />
        <el-table-column prop="address" label="Address" />
    </el-table>
    </el-container>
  </div>
</template>
<script lang="ts" setup>
const tableData = [
  {
    date: '2016-05-03',
    articlename: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-02',
    articlename: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-04',
    articlename: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-01',
    articlename: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
]
</script>
