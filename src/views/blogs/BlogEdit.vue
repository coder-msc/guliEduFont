<template>
  <div>
    <div class="m-content">

      <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="100px" class="demo-ruleForm">
        <el-form-item label="标题" prop="title">
          <el-input v-model="ruleForm.title"/>
        </el-form-item>

        <el-form-item label="摘要" prop="description">
          <el-input v-model="ruleForm.description" type="textarea"/>
        </el-form-item>

        <el-form-item label="内容" prop="content">
          <!--          <mavon-editor ref="md" v-model="ruleForm.content" @imgAdd="$imgAdd" @imgDel="$imgDel"/>-->
          <mavon-editor
            ref="md"
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

export default {
  data() {
    return {
      ruleForm: {
        id: '',
        title: '',
        description: '',
        content: ''
      },
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
          blogs.editBlog(this.ruleForm)
            .then(res => {
              console.log(res)
              alert('操作成功', '提示', {
                confirmButtonText: '确定',
                callback: action => {
                // _this.$router.push('/blogs')
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
      this.$refs[formName].resetFields()
    }
  }
}
</script>

<style scoped>
  .m-content {
    text-align: center;
  }
</style>
