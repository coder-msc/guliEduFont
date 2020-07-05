import request from '@/utils/request'
import id from "element-ui/src/locale/lang/id";

export default{
    getTeacherList(current,limit,teacherQuery){
     return request({
     url: `/eduservice/teacher/pageTeacherCondition/${current}/${limit}`,
     method: 'post',
     //后端使用ResquestBody获取数据
     //data表示将对象转程JSON传递给后端
     data:teacherQuery
  })
},deleteTeacherByid(id){
    return request({
      url: `/eduservice/teacher/${id}`,
      method: 'delete'
  })

},
  addteacher(teacher){
      return request({
        url:`/eduservice/teacher/addTeacher`,
        method:'post',
        data:teacher
      })
  },
  getTeacherById(id){
      return request({
        url:`/eduservice/teacher/getTeacherInfo/${id}`,
        method:'get'
      })
  },
  updateTeacherInfo(teacher){
    return request({
      url:`/eduservice/teacher/updateTeacher`,
      method:'post',
      data:teacher
    })
  }



}
