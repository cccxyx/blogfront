<template>
  <div id="editarea">
    
    <h1>更新文章内容</h1><br>
    <div id="title">
    <b class="text">标题</b>
    <el-input v-model="title" placeholder="Title" clearable />
    </div>
    <div id="content">
    <b class="text">文章内容</b><br>
    <v-md-editor
    v-model="textarea"
    height="500px"
    placeholder="Please input your content">
    </v-md-editor>
    </div>
    <el-button type="primary" @click="onSubmit">保存</el-button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import VMdEditor from '@kangc/v-md-editor';
import '@kangc/v-md-editor/lib/style/base-editor.css';
import { fetchArticleDetail, updateArticle } from '@/api/article';
const props = defineProps<{
  id: number;
}>();
const router = useRouter();
const title = ref('');
const textarea = ref('');
const isLoading = ref<boolean>(false);
const loadArticleData = async () => {
  isLoading.value = true;
  try {
    const data = await fetchArticleDetail(props.id);
    title.value = data.title;
    textarea.value = data.content;
  } catch (error) {
    console.error('获取文章失败:', error);
    ElMessage.error('文章加载失败或无权编辑');
    router.back();
  } finally {
    isLoading.value = false;
  }
};

const onSubmit = async () => {
  if (!title.value.trim() || !textarea.value.trim()) {
    ElMessage.warning('文章标题和内容不能为空');
    return;
  }
  try {
    await updateArticle(props.id, title.value, textarea.value);
    ElMessage.success('文章更新成功');
    router.push(`/article/${props.id}`);
  } catch (error) {
    console.error('更新文章失败:', error);
  }
};
onMounted(() => {
  loadArticleData();
});
</script>

<style scoped>
h1 { 
  font-size: 50px;
}
.editarea {
  display: flex;
  justify-content: center;
}
.text {
  font-size: 20px;
}
button {
  margin-top: 20px;
}
</style>
