import request from '@/utils/request'
import id from "element-ui/src/locale/lang/id";

export default{
  //1 添加课程信息
  addCourseInfo(courseInfo) {
    return request({
      url:'/eduservice/educourse/addCourseInfo',
      method:'post',
      data:courseInfo
      })
},
  getListTeacher(){
    return request({
      url:'/eduservice/teacher/findAll',
      method:'get',
          })
  },
  //数据回显查询课程
  getCourseInfo(id){
    return request({
      url:`/eduservice/educourse/getCouseInfo/${id}`,
      method:'get',
    })
  },
  //修改课程信息
  updateCourseInfo(courseInfo){
    return request({
      url:`/eduservice/educourse/updateCourseInfo`,
      method:'post',
      data:courseInfo
    })
  }
  }
