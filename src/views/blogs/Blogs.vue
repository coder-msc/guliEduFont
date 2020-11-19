<template>
  <div class="mcontaner">
    <div class="block">
      <el-timeline>

        <el-timeline-item v-for="blog in blogs" :timestamp="blog.created" placement="top">
          <el-card>
            <h4>

              {{ blog.title }}
              <!--              </router-link>-->
            </h4>   <el-button type="primary" @click="seeBlogDetail(blog.id)" >查看详情</el-button>
            <el-button type="primary" @click="seeBlogDetail(blog.id)" >编辑</el-button><el-button type="primary" @click="seeBlogDetail(blog.id)" >删除</el-button>
            <p>{{ blog.description }}</p>
          </el-card>
        </el-timeline-item>

      </el-timeline>

      <!-- 分页 -->
      <el-pagination
        :current-page="page"
        :page-size="limit"
        :total="total"
        class="mpage"
        style="padding: 30px 0; text-align: center;"
        layout="total, prev, pager, next, jumper"
        @current-change="getAllBlogs"
      />
      <!--      <el-pagination-->
      <!--        :current-page="currentPage"-->
      <!--        :page-size="pageSize"-->
      <!--        :total="total"-->
      <!--        class="mpage"-->
      <!--        background-->
      <!--        layout="prev, pager, next"-->
      <!--        @current-change="getAllBlogs(currentPage)"/>-->

    </div>

  </div>
</template>

<script>
import blogs from '@/api/blog/blogs'

export default {
  data() {
    return {
      blogs: {},
      currentPage: 1,
      total: 0,
      pageSize: 5
    }
  },
  created() {
    // this.page(1)
    this.getAllBlogs(1)
  },

  methods: {
    // 显示所有博客列表
    getAllBlogs(currentPage) {
      blogs.showAllBlogs(currentPage).then(response => {
        console.log('-==============---' + response.data.pageData)
        this.blogs = response.data.pageData.records
        this.currentPage = response.data.pageData.current
        this.total = response.data.pageData.total
        this.pageSize = response.data.pageData.size
      })
    },
    // 查看博客详情
    seeBlogDetail(blogId) {
      this.$router.push({ path: `/blogs/BlogDetail/${blogId}` })
      console.log(blogId + '------------')
    }
  }
}
</script>

<style scoped>

  .mpage {
    margin: 0 auto;
    text-align: center;
  }

</style>
