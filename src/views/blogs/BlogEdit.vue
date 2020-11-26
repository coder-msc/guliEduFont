<template>
  <div>
    <div class="app-container">

      <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="100px" class="demo-ruleForm">
        <el-form-item label="标题" prop="title">
          <el-input v-model="ruleForm.title"/>
        </el-form-item>

        <el-form-item label="摘要" prop="description">
          <el-input v-model="ruleForm.description" type="textarea"/>
        </el-form-item>

        <!-- 讲师头像 -->
        <el-form-item label="博客头像">

          <!-- 头衔缩略图 -->
          <pan-thumb :image="ruleForm.blogAvatar"/>
          <!-- 文件上传按钮 -->
          <el-button type="primary" icon="el-icon-upload" @click="imagecropperShow=true">更换头像
          </el-button>

          <!--
      v-show：是否显示上传组件
      :key：类似于id，如果一个页面多个图片上传控件，可以做区分
      :url：后台上传的url地址
      @close：关闭上传组件
      @crop-upload-success：上传成功后的回调
        <input type="file" name="file"/>
      -->
          <image-cropper
            v-show="imagecropperShow"
            :width="300"
            :height="300"
            :key="imagecropperKey"
            :url="BASE_API+'/blogservice/blogs/bolg/url'"
            field="file"
            @close="close"
            @crop-upload-success="cropSuccess"/>
        </el-form-item>

        <el-form-item label="内容" prop="content">
          <!--          <mavon-editor ref="md" v-model="ruleForm.content" @imgAdd="$imgAdd" @imgDel="$imgDel"/>-->
          <mavon-editor
            ref="md"
            :ishljs = "true"
            v-model ="ruleForm.content"
            @imgAdd="$imgAdd"
            @imgDel="$imgDel"
          />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">立即创建</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
      </el-form>

    </div>

  </div>
</template>

<script>
import blogs from '@/api/blog/blogs'
import ImageCropper from '@/components/ImageCropper'
import PanThumb from '@/components/PanThumb'

export default {
  components: { ImageCropper, PanThumb },

  data() {
    return {
      ruleForm: {
        id: '',
        title: '',
        blogAvatar: '',
        description: '',
        content: ''
      },
      // 上传弹框组件是否显示
      imagecropperShow: false,
      imagecropperKey: 0, // 上传组件key值
      BASE_API: process.env.BASE_API, // 获取dev.env.js里面地址
      saveBtnDisabled: false, // 保存按钮是否禁用,
      rules: {
        title: [
          { required: true, message: '请输入标题', trigger: 'blur' },
          { min: 3, max: 25, message: '长度在 3 到 25 个字符', trigger: 'blur' }
        ],
        description: [
          { required: true, message: '请输入摘要', trigger: 'blur' }
        ],
        content: [
          { trequired: true, message: '请输入内容', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    const blogId = this.$route.params.blogId
    console.log(blogId)
    const _this = this
    if (blogId) {
      this.$axios.get('/blog/' + blogId).then(res => {
        const blog = res.data.data
        _this.ruleForm.id = blog.id
        _this.ruleForm.title = blog.title
        _this.ruleForm.description = blog.description
        _this.ruleForm.content = blog.content
      })
    }
  },
  methods: {
    cropSuccess(data) {
      this.ruleForm.blogAvatar = data.url
      this.imagecropperShow = false
      // 上传组件初始化
      this.imagecropperKey = this.imagecropperKey + 1
    },
    close() {
      this.imagecropperShow = false
      this.imagecropperKey = this.imagecropperKey + 1
    },

    $imgAdd(pos, $file) {
      // 第一步.将图片上传到服务器.
      var formdata = new FormData()
      formdata.append('image', $file)
      blogs.uploadAddpicture(formdata).then((response) => {
        // console.log('-=-=hello'+response)
        this.$refs.md.$img2Url(pos, response.data.url)
      })
      // this.img_file[pos] = $file
      // eslint-disable-next-line no-undef
      // axios({
      //   url: '/bolg/url',
      //   method: 'post',
      //   data: formdata,
      //   headers: { 'Content-Type': 'multipart/form-data' }
      // })
      //   .then(response => {
      //     console.log('-=============' + response + '=======' + response.data)
      //
      //     const _res = response.url
      //     // 第二步.将返回的url替换到文本原位置![...](0) -> ![...](url)
      //     this.$refs.md.$img2Url(pos, _res)
      //   })
    },
    $imgDel(pos) {
      delete this.img_file[pos]
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log(this.ruleForm)
          blogs.editBlog(this.ruleForm)
            .then(res => {
              // this.$router.push({ path: '/course/list' })
              this.$router.push({ path: '/blogs/Blogs' })
              console.log(res)
              alert('操作成功', '提示', {
                confirmButtonText: '确定',
                callback: action => {
                // _this.$router.push('/blogs')
                  this.$router.push({ path: '/blogs/Blogs' })
                }
              })
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },

    resetForm(formName) {
      // this.$router.push({ path: '/subject/list' })
      // this.$router.push({ path: '/blogs/Blogs' })
      this.$router.push({ path: '/blogs/Blogs' })
      // this.$refs[formName].resetFields()
    }
  }
}
</script>

<style scoped>
  .m-content {
    text-align: center;
  }
</style>
