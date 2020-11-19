<template>
  <div>
    <div class="mblog">
      <h2> {{ blog.title }}</h2>
      <el-link v-if="ownBlog" icon="el-icon-edit">
        <router-link :to="{name: 'BlogEdit', params: {blogId: blog.id}}" >
          编辑
        </router-link>
      </el-link>
      <el-divider/>
      <div class="markdown-body" v-html="blog.content"/>

    </div>

  </div>
</template>

<script>
import 'github-markdown-css'
import 'mavon-editor/dist/css/index.css'
import blogs from '@/api/blog/blogs'

export default {
  data() {
    return {
      blog: {
        id: '',
        title: '',
        content: ''
      },
      ownBlog: false
    }
  },
  created() {
    // 进入页面之前就调用方法 查询出博客详细
    const blogId = this.$route.params.blogId
    // console.log(blogId + 'blgogo98345347589')
    this.showBlogDetail(blogId)
  },
  methods: {
    showBlogDetail(blogId) {
      blogs.showBlogDetail(blogId).then(request => {
        const blog = request.data.data
        this.blog.id = blog.id
        this.blog.title = blog.title
        var MardownIt = require('markdown-it')
        var md = new MardownIt()
        var result = md.render(blog.content)
        this.blog.content = result
      })
    }
  }
}
</script>

<style scoped>
  .mblog {
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    width: 100%;
    min-height: 700px;
    padding: 20px 15px;
  }

</style>
