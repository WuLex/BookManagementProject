<script lang="ts" setup>
  import { reactive, computed } from 'vue';
  import { Table } from 'ant-design-vue';
  import { XYToolbar, XYRefreshButton } from '@xycloud/xycloud-ui-kit-2';
  import useServers from '@/composables/useServers';
  import SearchInput from '@/components/SearchInput.vue';
  import {
    columns,
    customizedDisplayItemOptions,
    filterOptions,
    actionOptions,
    exportExcelOptions,
  } from '@/configs/serverList';
  import LTMStatusLabel from '@/components/LTMStatusLabel.vue';
  const { servers } = useServers();
  const state = reactive<{
    selectedRowKeys: string[];
    loading: boolean;
  }>({
    selectedRowKeys: [],
    loading: false,
  });
  const hasSelected = computed(() => state.selectedRowKeys.length > 0);
  const onSelectChange = (selectedRowKeys: string[]) => {
    state.selectedRowKeys = selectedRowKeys;
  };
  console.log(hasSelected.value);
</script>

<template>
  <div class="server-list">
    <div class="server-list__toolbar toolbar">
      <SearchInput class="toolbar__search-input"></SearchInput>
      <XYRefreshButton class="toolbar__refresh-btn"></XYRefreshButton>
      <XYToolbar
        class="toolbar__main"
        :customize-display-checkbox-option="customizedDisplayItemOptions"
        :customize-display-default-selected="customizedDisplayItemOptions"
        :filter-option="filterOptions"
        :filter-default-value="[]"
        :action-option="actionOptions"
        :table-page-setting="{ total: 100, defaultPageSize: 1 }"
        :table-page-setting-default-current="1"
        :export-excel-option="exportExcelOptions"
        :is-table-checkbox="true"
        :is-export-loading="false"
      ></XYToolbar>
    </div>
    <Table
      row-key="id"
      :pagination="false"
      :scroll="{ x: 1368 }"
      :row-selection="{ selectedRowKeys: state.selectedRowKeys, onChange: onSelectChange }"
      :data-source="servers"
      :columns="columns"
    >
      <template #serviceLANIp="{ record }">
        <router-link :to="`/server/${record.id}`">{{ record.serviceLANIp }}</router-link>
      </template>
      <template #ltmStatus="{ record }">
        <LTMStatusLabel :enabled="record.ltmStatus === 'Enabled'"></LTMStatusLabel>
      </template>
    </Table>
  </div>
</template>

<style lang="scss" scoped>
  .server-list__toolbar {
    padding: 32px 32px 32px 16px;
    display: grid;
    row-gap: 32px;
    grid-template-areas:
      'searchInput refreshBtn'
      'main main';
  }
  .toolbar__search-input {
    grid-area: searchInput;
  }
  .toolbar__refresh-btn {
    width: min-content;
    justify-self: end;
    grid-area: refreshBtn;
  }
  .toolbar__main {
    grid-area: main;
  }
  :deep(.xy-table-pagination .ant-pagination-options-size-changer.ant-select) {
    margin-right: 0px;
  }
</style>