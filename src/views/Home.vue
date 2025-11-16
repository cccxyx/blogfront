<template>
  <div>
    <h1>{{ $route.params.username }}, welcome! </h1>
    <div class="header-buttons-container">
      <el-button type="primary" @click="buildnew">
        <el-icon><Edit /></el-icon>
        新建文章
      </el-button>
      <el-button type="danger" @click="logout">
        <el-icon><SwitchButton /></el-icon>
        退出登录
      </el-button>
    </div>

    <el-divider />

    <h2 class="section-title">所有文章 ({{ articles.length }})</h2>

    <div v-if="isLoading" class="loading-state">
      <el-skeleton :rows="5" animated />
      <p>文章加载中...</p>
    </div>

    <div v-else-if="articles.length === 0" class="empty-state">
      <el-empty description="暂时还没有文章哦，快去创建第一篇吧！" />
      <el-button type="primary" @click="buildnew">
        <el-icon><Plus /></el-icon>
        创建新文章
      </el-button>
    </div>

    <div v-else class="post-list">
      <el-card 
        v-for="article in articles" 
        :key="article.id" 
        class="post-item" 
        shadow="hover" 
        @click="viewArticle(article.id)">
        <template #header>
          <div class="post-item-header">
            <span class="post-title">{{ article.title }}</span>
          </div>
        </template>
        <div class="post-meta">
          <span><el-icon><Clock /></el-icon> 发表日期: {{ article.formattedCreatedAt }}</span>
          <span v-if="article.formattedUpdatedAt && article.formattedUpdatedAt !== article.formattedCreatedAt" style="margin-left: 15px;">
            <el-icon><RefreshRight /></el-icon> 更新日期: {{ article.formattedUpdatedAt }}
          </span>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import axios from 'axios';
import { ref, onMounted, defineProps } from 'vue';
import router from '@/router';
import { ElMessage, ElCard, ElButton, ElDivider, ElEmpty, ElSkeleton } from 'element-plus';
import { Edit, SwitchButton, Clock, Plus, RefreshRight } from '@element-plus/icons-vue';
const username = ref('User');
const route = useRoute();
interface Props {
  username: string;
}
const props = defineProps<Props>();
const buildnew = () => {
  router.push('/Write');
};
const displayUsername = ref(props.username || localStorage.getItem('username') || 'User'); 
const currentUserId = ref<number | null>(null);
const articles = ref<Article[]>([]);
const isLoading = ref(true);

interface Article {
  id: number;
  title: string;
  content: string;
  user_id: number;
  author?: {
    id: number;
    username: string;
    email: string;
  };
  created_at: string;
  updated_at: string;
  formattedCreatedAt?: string;
  formattedUpdatedAt?: string;
}

const formatDate = (isoString: string | undefined): string => {
  if (!isoString) return '';
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) {
      return isoString.split(' ')[0] || '';
    }
    return date.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
  } catch (e) {
    return isoString.split(' ')[0] || '';
  }
};

const fetchUserInfo = async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    ElMessage.warning('未检测到认证信息，请先登录！');
    localStorage.removeItem('username');
    localStorage.removeItem('userId');
    router.push('/');
    return false;
  }

  try {
    const response = await axios.get('http://localhost:8080/api/user/info', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (response.data.code === 200 && response.data.data) {
      const userData = response.data.data;
      displayUsername.value = userData.username; 
      currentUserId.value = userData.id;

      localStorage.setItem('username', userData.username);
      localStorage.setItem('userId', userData.id.toString());
      return true;
    } else {
      ElMessage.error(response.data.message || '获取用户信息失败！');
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      localStorage.removeItem('userId');
      router.push('/login');
      return false;
    }
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response && error.response.status === 401) {
      ElMessage.error('认证过期，请重新登录！');
    } else {
      ElMessage.error('获取用户信息失败，请检查网络或稍后再试。');
    }
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('userId');
    router.push('/login');
    return false;
  }
};

const fetchArticles = async () => {
  isLoading.value = true;
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      ElMessage.error('未检测到认证信息，请重新登录！');
      router.push('/');
      return;
    }
    const response = await axios.get('http://localhost:8080/api/articles', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (response.data.code === 200 && response.data.data) {
      const allArticles: Article[] = response.data.data;

      articles.value = allArticles.map(article => ({
        ...article,
        formattedCreatedAt: formatDate(article.created_at),
        formattedUpdatedAt: formatDate(article.updated_at),
      }));

      if (articles.value.length === 0) {
        ElMessage.info('目前还没有任何文章。');
      }
    } else {
      ElMessage.error(response.data.message || '获取文章列表失败！');
    }
  } catch (error: any) {
      ElMessage.error('发生未知错误！');
  } finally {
    isLoading.value = false;
  }
};

onMounted(async () => {
  if (props.username) {
    displayUsername.value = props.username;
  }

  const userFetched = await fetchUserInfo();

  if (userFetched && currentUserId.value !== null) {
    await fetchArticles();
  } else if (!userFetched) {
    articles.value = [];
  }
});

const viewArticle = (articleId: number) => {
  router.push(`/article/${articleId}`);
};

const logout = () => {
  localStorage.removeItem('username');
  localStorage.removeItem('userId');
  localStorage.removeItem('token');
  ElMessage.success('已成功退出登录！');
  router.push('/');
};
</script>

<style scoped>
div {
  background-color: #1a1a1a;
  color: white;
  min-height: 100vh;
  padding: 20px;
}
h1 {
  margin-bottom: 20px;
}
#buildnew {
  text-align: right;
  margin-right: 20px;
}
button {
  margin-top: 20px;
  margin-bottom: 20px;
}

.header-buttons-container {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 10px;
  margin-right: 20px;
}

.section-title {
  text-align: center;
  color: white;
  margin-bottom: 20px;
  font-size: 1.8em;
}

.loading-state, .empty-state {
  text-align: center;
  padding: 50px 0;
  color: #bbb;
}

.post-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  max-width: 960px;
  margin: 0 auto;
}

.post-item {
  transition: all 0.3s ease;
  cursor: pointer;
  height: auto;
  background-color: #444;
  border: none;
  color: white;
}
.post-item :deep(.el-card__header) {
  border-bottom: 1px solid #555;
}
.post-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 18px 0 rgba(0, 0, 0, 0.3);
}
.post-item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.post-title {
  font-size: 1.2em;
  font-weight: bold;
  color: white;
  text-decoration: none;
}
.post-title:hover {
  color: #409eff;
}
.post-meta {
  display: flex;
  align-items: center;
  font-size: 0.9em;
  color: #bbb;
  margin-top: 10px;
  flex-wrap: wrap;
}
.post-meta span:not(:first-child) {
    margin-left: 10px;
}
.post-meta .el-icon {
  margin-right: 5px;
}

@media (max-width: 768px) {
  .header-buttons-container {
    flex-direction: column;
    align-items: center;
    margin-right: 0;
  }
  .post-list {
    grid-template-columns: 1fr;
  }
}
</style>