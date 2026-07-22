<template>
  <el-container class="layout-container">
    <!-- Sidebar -->
    <el-aside :width="isCollapsed ? '64px' : '220px'" class="aside">
      <div class="logo">
        <el-icon v-if="isCollapsed" size="24" color="#fff"><TrophyBase /></el-icon>
        <span v-else class="logo-text">绩效考核激励系统</span>
      </div>
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapsed"
        :collapse-transition="false"
        router
        background-color="#001529"
        text-color="rgba(255,255,255,0.65)"
        active-text-color="#fff"
        class="side-menu"
      >
        <el-menu-item index="/dashboard">
          <el-icon><Odometer /></el-icon>
          <template #title>工作台</template>
        </el-menu-item>
        <el-menu-item index="/employee">
          <el-icon><User /></el-icon>
          <template #title>员工管理</template>
        </el-menu-item>
        <el-sub-menu index="/assessment">
          <template #title>
            <el-icon><DataAnalysis /></el-icon>
            <span>绩效考核</span>
          </template>
          <el-menu-item index="/assessment/indicators">
            <el-icon><List /></el-icon>
            <template #title>考核指标</template>
          </el-menu-item>
          <el-menu-item index="/assessment/plans">
            <el-icon><Document /></el-icon>
            <template #title>考核方案</template>
          </el-menu-item>
          <el-menu-item index="/assessment/records">
            <el-icon><Memo /></el-icon>
            <template #title>考核记录</template>
          </el-menu-item>
        </el-sub-menu>
        <el-sub-menu index="/incentive">
          <template #title>
            <el-icon><Money /></el-icon>
            <span>激励发放</span>
          </template>
          <el-menu-item index="/incentive/plans">
            <el-icon><Document /></el-icon>
            <template #title>激励方案</template>
          </el-menu-item>
          <el-menu-item index="/incentive/records">
            <el-icon><Ticket /></el-icon>
            <template #title>发放记录</template>
          </el-menu-item>
        </el-sub-menu>
      </el-menu>
    </el-aside>

    <!-- Main Content -->
    <el-container>
      <!-- Header -->
      <el-header class="header">
        <div class="header-left">
          <el-icon class="collapse-btn" size="20" @click="isCollapsed = !isCollapsed">
            <Fold v-if="!isCollapsed" />
            <Expand v-else />
          </el-icon>
          <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/dashboard' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item v-if="currentRoute.meta?.title">
              {{ currentRoute.meta.title }}
            </el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <div class="header-right">
          <el-avatar size="small" style="background-color: #1890ff; margin-right: 8px;">管</el-avatar>
          <span class="username">管理员</span>
        </div>
      </el-header>

      <!-- Content -->
      <el-main class="main">
        <router-view v-slot="{ Component }">
          <keep-alive>
            <component :is="Component" />
          </keep-alive>
        </router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'

const isCollapsed = ref(false)
const route = useRoute()

const activeMenu = computed(() => route.path)
const currentRoute = computed(() => route)
</script>

<style scoped>
.layout-container {
  height: 100vh;
}

.aside {
  background-color: #001529;
  transition: width 0.3s;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.logo {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  background-color: #002140;
  font-weight: bold;
  overflow: hidden;
  white-space: nowrap;
  padding: 0 12px;
}

.logo-text {
  font-size: 15px;
  letter-spacing: 1px;
}

.side-menu {
  border: none;
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
}

.side-menu:not(.el-menu--collapse) {
  width: 220px;
}

.header {
  background: #fff;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.collapse-btn {
  cursor: pointer;
  color: #595959;
}

.collapse-btn:hover {
  color: #1890ff;
}

.header-right {
  display: flex;
  align-items: center;
}

.username {
  font-size: 14px;
  color: #333;
}

.main {
  background-color: #f0f2f5;
  padding: 20px;
  overflow-y: auto;
}
</style>
