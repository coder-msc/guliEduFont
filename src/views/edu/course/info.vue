<template>

  <div class="app-container">

    <h2 style="text-align: center;">发布新课程</h2>

    <el-steps :active="1" process-status="wait" align-center style="margin-bottom: 40px;">
      <el-step title="填写课程基本信息"/>
      <el-step title="创建课程大纲"/>
      <el-step title="最终发布"/>
    </el-steps>

    <el-form label-width="120px">
      <el-form-item label="课程标题">
        <el-input v-model="courseInfo.title" placeholder=" 示例：机器学习项目课：从基础到搭建项目视频课程。专业名称注意大小写"/>
      </el-form-item>

      <!-- 所属分类 TODO -->
      <el-form-item label="课程分类">
        <el-select
          v-model="courseInfo.subjectParentId"
          placeholder="一级分类" @change="subjectLevelOneChanged">
          <el-option
            v-for="subject in subjectOneList"
            :key="subject.id"
            :label="subject.title"
            :value="subject.id"/>

        </el-select>

        <!-- 二级分类 -->
        <el-select v-model="courseInfo.subjectId" placeholder="二级分类">
          <el-option
            v-for="subject in subjectTwoList"
            :key="subject.id"
            :label="subject.title"
            :value="subject.id"/>
        </el-select>
      </el-form-item>

      <!-- 课程讲师 TODO -->
      <!-- 课程讲师 -->
      <el-form-item label="课程讲师">
        <el-select
          v-model="courseInfo.teacherId"
          placeholder="请选择">
          <el-option
              v-for="teacher in teacherList"
              :key="teacher.id"
              :label="teacher.name"
              :value="teacher.id"/>

        </el-select>
      </el-form-item>

      <el-form-item label="总课时">
        <el-input-number :min="0" v-model="courseInfo.lessonNum" controls-position="right" placeholder="请填写课程的总课时数"/>
      </el-form-item>

      <!-- 课程简介 TODO -->
      <!-- 课程简介-->
      <el-form-item label="课程简介">
        <tinymce :height="300" v-model="courseInfo.description"/>
      </el-form-item>

      <!-- 课程封面 TODO -->
      <!-- 课程封面-->
      <el-form-item label="课程封面">

        <el-upload
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
          :action="BASE_API+'/eduoss/fileoss'"
          class="avatar-uploader">
          <img :src="courseInfo.cover">
        </el-upload>

      </el-form-item>

      <el-form-item label="课程价格">
        <el-input-number :min="0" v-model="courseInfo.price" controls-position="right" placeholder="免费课程请设置为0元"/> 元
      </el-form-item>

      <el-form-item>
           <el-button :disabled="saveBtnDisabled" type="primary" @click="saveOrUpdate">保存并下一步</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
  import course from '@/api/edu/course'
  import subject from '@/api/edu/subject'
  import Tinymce from '@/components/Tinymce' //引入组件
  export default {
    //声明组件
    components: { Tinymce },
    data(){
      return{
        saveBtnDisabled:false,
        courseInfo:{
          title: '',
          subjectId: '',//二级分类id
          subjectParentId:'',//一级分类id
          teacherId: '',
          lessonNum: 0,
          description: '',
          cover: '/static/01.jpg',
          price: 0
        },
        BASE_API: process.env.BASE_API, // 接口API地址
        teacherList:[],
        subjectOneList:[],
        subjectTwoList:[],
        courseId:''
      }
    },
    created() {
      if (this.$route.params && this.$route.params.id) {
        this.courseId = this.$route.params.id
        this.getCourseInfo()
      } else {
        //初始化所有讲师
        this.getTeacherList()
        this.getSubjectOne()
    }
    },
    methods:{
      //数据回显
      getCourseInfo(){
        course.getCourseInfo(this.courseId).then(response=>{
          this.courseInfo=response.data.courseInfoVo
          //处理回显后 得一级和二级分类显示问题
          subject.getSubjectList().then(response=>{
            this.subjectOneList=response.data.list
            for(var i=0;i<this.subjectOneList.length;i++) {
              //获取每个一级分类
              var oneSubject = this.subjectOneList[i]
              //比较当前courseInfo里面一级分类id和所有的一级分类id
              if(this.courseInfo.subjectParentId == oneSubject.id) {
                //获取一级分类所有的二级分类
                this.subjectTwoList = oneSubject.children
              }
            }
          })
          this.getTeacherList()
        })
      },
      //封面上传成功
      handleAvatarSuccess(res,file){
          this.courseInfo.cover = res.data.url
      },

      //封面上传之前
      beforeAvatarUpload(file){
        // const isJPG = file.type === 'image/jpeg/png'
        const isLt2M = file.size / 1024 / 1024 < 2
        //
        // if (!isJPG) {
        //   this.$message.error('上传头像图片只能是 JPG 格式!')
        // }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!')
        }
        // return isJPG && isLt2M
        return isLt2M
      },


      //点击一级分类 得到Id 进而查看二级分类
      subjectLevelOneChanged(value){
       // alert(value)
        for(var i=0;i<this.subjectOneList.length;i++){
          var a=this.subjectOneList[i]
          if(value===a.id){
            this.subjectTwoList=a.children

          }
        }
        this.courseInfo.subjectId=''
      },

      //查看所有一级分类
      getSubjectOne(){
        subject.getSubjectList().then(response=>{
          this.subjectOneList=response.data.list
        })
      },

      //查询所有讲师
      getTeacherList(){
        course.getListTeacher().then(response=>{
          this.teacherList=response.data.items
        })
      },
      //插入课程信息
      saveCourseInfo(){
        course.addCourseInfo(this.courseInfo).then(response=>{
          //提示
          this.$message({
            type: 'success',
            message: '添加课程信息成功!'
          });
          this.$router.push({path:'/course/chapter/'+response.data.courseId})

        })
      },
//修改课程信息
      updateCourseInfo(){
        course.updateCourseInfo(this.courseInfo)
          .then(response => {
            //提示
            this.$message({
              type: 'success',
              message: '修改课程信息成功!'
            });
            //跳转到第二步
            this.$router.push({path:'/course/chapter/'+this.courseId})
          })
      },
      saveOrUpdate(){
        if(!this.courseInfo.id){
        this.saveCourseInfo()
        }else{
          this.updateCourseInfo()
        }
      }
    }
  }

</script>
<style scoped>
  .tinymce-container {
    line-height: 29px;
  }
</style>
