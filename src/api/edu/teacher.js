import request from '@/utils/request'

export default{
    getTeacherList(current,limit,teacherQuery){
     return request({
     url: `/eduservice/teacher/pageTeacherCondition/${current}/${limit}`,
     method: 'post',
     //后端使用ResquestBody获取数据
     //data表示将对象转程JSON传递给后端
     data:teacherQuery
  })
}}