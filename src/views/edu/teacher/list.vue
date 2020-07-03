<template>
 <el-table
      :data="list"
      style="width: 100%">
      <el-table-column
        prop="name"
        label="姓名"
        width="180">
      </el-table-column>

      <el-table-column
        prop="intro"   
        label="简介"
        width="180">
      </el-table-column>

      <el-table-column
        prop="career"
        label="资历"
        width="180">
      </el-table-column>
      <el-table-column  label="头衔" width="180">
        <template slot-scope="scope">
          {{scope.row.level===1?"高级讲师":'首席讲师'}}
        </template>
      </el-table-column>
    </el-table>



  </template>
<script>
  //引入JS
import teacher from '@/api/edu/teacher.js'
//  写核心代码
export default {
    data(){   //定义变量和初始值
      return {  
    list:null,   //查询之后接口返回的集合
    page:1,      //当前页
    limit:10,    //每页显示的数量
    total:0,    //总记录数
    teacherQuery:{}   //条件封装对象
            }
          },
    created(){  //在页面渲染之前执行，一般是调用Methods里定义的方法。
//调用
this.getList()

    },
    methods:{  //创建具体的方法，调用teacher.js中定义的方法
    getList(){
      teacher.getTeacherList(this.page,this.limit,this.teacherQuery)
      .then(response=>{
         
          this.list=response.data.rows
          this.total=response.data.total
console.log( this.list)
console.log(this.total)

      })   //请求成功
      .catch(error=>{
        console.log(error)
      })   //请求失败
    }
    }
    
}
</script>