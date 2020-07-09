<template>
  <div class="app-container">
    讲师表单
    <el-form label-width="120px">
      <el-form-item label="讲师名称">
        <el-input v-model="teacher.name"/>
      </el-form-item>
      <el-form-item label="讲师排序">
        <el-input-number v-model="teacher.sort" controls-position="right" min="0"/>
      </el-form-item>
      <el-form-item label="讲师头衔">
        <el-select v-model="teacher.level" clearable placeholder="请选择">
          <el-option :value="1" label="高级讲师"/>
          <el-option :value="2" label="首席讲师"/>
        </el-select>
      </el-form-item>
      <el-form-item label="讲师资历">
        <el-input v-model="teacher.career"/>
      </el-form-item>
      <el-form-item label="讲师简介">
        <el-input v-model="teacher.intro" :rows="10" type="textarea"/>
      </el-form-item>

      <!-- 讲师头像：TODO -->
      <!-- 讲师头像 -->
      <el-form-item label="讲师头像">

        <!-- 头衔缩略图 -->
        <pan-thumb :image="teacher.avatar"/>
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
          :url="BASE_API+'/eduoss/fileoss'"
          field="file"
          @close="close"
          @crop-upload-success="cropSuccess"/>
      </el-form-item>


      <el-form-item>
        <el-button :disabled="saveBtnDisabled" type="primary" @click="saveOrUpdate">保存</el-button>
      </el-form-item>
    </el-form>

  </div>
</template>

<script>
import teacherApi from '@/api/edu/teacher'
import ImageCropper from '@/components/ImageCropper'
import PanThumb from '@/components/PanThumb'
export  default {
  //组件引入需要申明才能使用
  components: { ImageCropper, PanThumb },
    data(){
      return{
        teacher:{
          name: '',
          sort: 0,
          level: 1,
          career: '',
          intro: '',
          avatar: ''
        },
        //上传弹框组件是否显示
        imagecropperShow:false,
        imagecropperKey:0,//上传组件key值
        BASE_API:process.env.BASE_API, //获取dev.env.js里面地址
        saveBtnDisabled:false  // 保存按钮是否禁用,
    }},
    created(){ //只会执行一次
      this.init()
    },
  watch:{  //路由监听器 只要路由发生变化 那么这个方法就会执行
    $route(to,from){
      this.init()
    }
  },
    methods:{
      cropSuccess(data){
        this.teacher.avatar=data.url
        this.imagecropperShow=false
        //上传组件初始化
        this.imagecropperKey=this.imagecropperKey+1
      },
      close(){
  this.imagecropperShow=false
        this.imagecropperKey=this.imagecropperKey+1

      },
      init(){
        //判断路径有id值,做修改
        if(this.$route.params && this.$route.params.id) {
          //从路径获取id值
          const id = this.$route.params.id
          //调用根据id查询的方法
          this.getTeacherInfo(id)
        }else{
          this.teacher={}
        }
      },
      //判断是修改还是添加
      saveOrUpdate(){
        //有id就是修改  没有id值 就是添加
        if(!this.teacher.id){
          this.addteacher()
        }else{
          this.updateTeacherById()
        }


      },
      //修改讲师回显
      getTeacherInfo(id){
        teacherApi.getTeacherById(id)
          .then(request=>{
          this.teacher=request.data.teacher
        }).catch()
      },
      //提交修改内容
      updateTeacherById(){
        teacherApi.updateTeacherInfo(this.teacher)
          .then(request=>{
            this.$message({
              type: 'success',
              message: '修改成功!'
            })
          }).catch()
        this.$router.push({path:'/teacher/table'})
      },
      //添加讲师
      addteacher(){
        teacherApi.addteacher(this.teacher)
          .then(response=>{
            this.$message({
              type: 'success',
              message: '添加成功!'
            })
          })
          .catch(error=>{
          })
        this.$router.push({path:'/teacher/table'})
      }

    }
  }
</script>
