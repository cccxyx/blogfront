<template>
  <div class="article-detail-container">
    <el-page-header @back="goBack" content="文章详情">
      <template #extra>
        <div style="display: flex; gap: 10px;">
          <el-button v-if="isAuthor" @click="editArticle" type="primary">编辑</el-button>
          <el-button v-if="isAuthor" @click="deleteArticle" type="danger">删除</el-button>
        </div>
      </template>
    </el-page-header>
    <el-card v-loading="isLoading" class="article-card">
      <h1 class="article-title">{{ article.title }}</h1>
      <div class="article-meta">
        <span v-if="article.author && article.author.username" style="margin-right: 15px;">
          <el-icon><User /></el-icon> 作者: {{ article.author.username }}
        </span>
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

<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { useRouter } from 'vue-router';
import { User, Clock, RefreshRight, Edit, Delete } from '@element-plus/icons-vue';
import { fetchArticleDetail, deleteArticle } from '@/api/article';
import { Article } from '@/types/api';

const props = defineProps<{
  id: string;
}>();

const router = useRouter();
const article = ref<Article>({
  id: 0, title: '', content: '', user_id: 0,
  author: { id: 0, username: '', email: '' },
  created_at: '', updated_at: ''
});
const isLoading = ref(true);
const currentLoggedInUserId = ref<number | null>(null);

const isAuthor = computed(() => {
  if (currentLoggedInUserId.value === null || article.value.user_id === 0) {
    return false;
  }
  return currentLoggedInUserId.value === article.value.user_id;
});
const formatDate = (dateString: string) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
};
const loadArticleData = async () => {
  isLoading.value = true;
  try {
    const data = await fetchArticleDetail(props.id);
    article.value = {
      ...data
    };
    const userIdStr = localStorage.getItem('userId');
    if (userIdStr) {
      currentLoggedInUserId.value = parseInt(userIdStr);
    }
  } catch (error) {
    ElMessage.error('文章不存在或无法加载！');
    router.push('/home/' + (localStorage.getItem('username') || 'User'));
  } finally {
    isLoading.value = false;
  }
};
const goBack = () => {
  router.back();
};
const editArticle = () => {
  router.push(`/edit/${props.id}`);
};
const handleDeleteArticle = async () => {
  try {
    await ElMessageBox.confirm('此操作将永久删除该文章, 是否继续?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    });
    await deleteArticle(props.id);
    ElMessage.success('文章删除成功!');
    router.push('/home/' + (localStorage.getItem('username') || 'User'));
  } catch (error: any) {
    if (error === 'cancel') {
      ElMessage.info('已取消删除');
    } else {
      ElMessage.error('删除文章失败:', error);
    }
  }
};

onMounted(() => {
  loadArticleData();
});
</script>

<style scoped>
.article-detail-container {
  width: 100%;
  min-height: calc(100vh - var(--header-height, 0px) - var(--footer-height, 0px));
  padding: 20px;
  box-sizing: border-box;
  background-color: skyblue;
  color: white;
  border-radius: 10px;
}

.article-card {
  margin: 20px auto;
  background-color: white;
  color: black;
  border: 1px solid #555;
}

.article-title {
  font-size: 2.5em;
  text-align: center;
  margin-bottom: 20px;
  color: #5d9cec;
}

.article-meta {
  display: flex;
  justify-content: center;
  font-size: 0.9em;
  color: #bbb;
  margin-bottom: 20px;
}

.article-meta .el-icon {
  vertical-align: middle;
  margin-right: 5px;
}

.el-divider {
  background-color: #555;
}

.article-content {
  font-size: 1.1em;
  line-height: 1.8;
  padding: 0 15px;
  word-wrap: break-word;
}

.article-content :deep(p) {
  margin-bottom: 1em;
}

.article-content :deep(h1),
.article-content :deep(h2),
.article-content :deep(h3) {
  margin-top: 1.5em;
  margin-bottom: 0.8em;
  color: #a0cfff;
}

.el-page-header {
  margin-bottom: 20px;
  color: white;
}

.el-page-header :deep(.el-page-header__content),
.el-page-header :deep(.el-page-header__back .el-page-header__icon) {
  color: white;
}

.el-page-header :deep(.el-page-header__title) {
  color: #5d9cec;
}
</style>