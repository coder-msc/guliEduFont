<template>
  <div class="mcontaner">
    <div class="block">
      <el-timeline>

        <el-timeline-item v-for="blog in blogs" :timestamp="blog.created" placement="top">
          <el-card>
            <h4>
              <!--      this.$router.push({ path: '/blogs/Blogs' })
-->
              <router-link :to="'/blogs/Blogs'">
                <!--              <router-link :to="{name: '/blogs/Blogs', params: {blogId: blog.id}}">-->
                {{ blog.title }}
              </router-link>
            </h4>
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
    getAllBlogs(currentPage) {
      blogs.showAllBlogs(currentPage).then(response => {
        console.log('-==============---' + response.data.pageData)
        this.blogs = response.data.pageData.records
        this.currentPage = response.data.pageData.current
        this.total = response.data.pageData.total
        this.pageSize = response.data.pageData.size
      })
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
