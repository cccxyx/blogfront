<template>
  <div class="article-detail-container">
    <el-page-header @back="goBack" content="文章详情">
      <template #extra>
        <el-button @click="editArticle" type="primary">编辑</el-button>
      </template>
    </el-page-header>
    <el-card v-loading="isLoading" class="article-card">
      <h1 class="article-title">{{ article.title }}</h1>
      <div class="article-meta">
        <span><el-icon><Clock /></el-icon> 发布于: {{ article.formattedCreatedAt }}</span>
        <span v-if="article.formattedUpdatedAt && article.formattedUpdatedAt !== article.formattedCreatedAt" style="margin-left: 15px;">
          <el-icon><RefreshRight /></el-icon> 更新于: {{ article.formattedUpdatedAt }}
        </span>
      </div>
      <el-divider />
      <div class="article-content" v-html="article.content"></div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, defineProps } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import { ElMessage, ElCard, ElButton, ElPageHeader, ElDivider } from 'element-plus';
import { Clock, RefreshRight } from '@element-plus/icons-vue';

interface Props {
  id: string;
}
const props = defineProps<Props>();

const router = useRouter();

interface ArticleDetail {
  id: number;
  title: string;
  content: string;
  user_id: number;
  created_at: string;
  updated_at: string;
  formattedCreatedAt?: string;
  formattedUpdatedAt?: string;
}

const article = ref<ArticleDetail>({
  id: parseInt(props.id),
  title: '',
  content: '',
  user_id: 0,
  created_at: '',
  updated_at: '',
});
const isLoading = ref(true);

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

const fetchArticleDetail = async () => {
  isLoading.value = true;
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      ElMessage.error('未登录');
      router.push('/');
      return;
    }
    const response = await axios.get(`http://localhost:8080/api/articles/${props.id}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (response.data.code === 200 && response.data.data) {
      const data = response.data.data;
      article.value = {
        ...data,
        formattedCreatedAt: formatDate(data.created_at),
        formattedUpdatedAt: formatDate(data.updated_at),
      };
    } else {
      ElMessage.error(response.data.message || '获取文章详情失败！');
      router.push('/Home/' + (localStorage.getItem('username') || 'User'));
    }
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      ElMessage.error('发生未知错误！');
    }
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  if (props.id) {
    fetchArticleDetail();
  } else {
    ElMessage.error('未获取到文章id');
    router.push('/Home/' + (localStorage.getItem('username') || 'User'));
  }
});

const goBack = () => {
  router.back();
};

const editArticle = () => {
  router.push(`/Edit/${props.id}`);
};
</script>

<style scoped>
.article-detail-container {
  max-width: 960px;
  margin: 20px auto;
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.article-card {
  margin-top: 20px;
}

.article-title {
  text-align: center;
  font-size: 2.5em;
  color: #303133;
  margin-bottom: 20px;
}

.article-meta {
  text-align: center;
  color: #909399;
  font-size: 0.9em;
  margin-bottom: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
}

.article-meta span {
  display: flex;
  align-items: center;
}

.article-meta .el-icon {
  margin-right: 5px;
}

.article-content {
  line-height: 1.8;
  font-size: 1.1em;
  color: #606266;
  white-space: pre-wrap;
  word-wrap: break-word;
}
</style>