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


      <el-form-item>
        <el-button :disabled="saveBtnDisabled" type="primary" @click="saveOrUpdate">保存</el-button>
      </el-form-item>
    </el-form>

  </div>
</template>

<script>
import teacherApi from '@/api/edu/teacher'
export  default {
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
        saveBtnDisabled:false

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
