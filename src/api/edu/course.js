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
  },
  //课程信息确认显示
  getPublishCourseInfo(id){
    return request({
      url:`/eduservice/educourse/getPublishCourseInfo/${id}`,
      method:'get'
    })
  },
  //最终发布
  PublishCourse(id){
    return request({
      url:`/eduservice/educourse/publishCourse/${id}`,
      method:'post'
    })
  },
  //课程列表信息
  getlistCourse(){
    return request({
      url:`/eduservice/educourse`,
      method:'get'
    })
  },
  //显示课程列表，带有条件查询的分页
  getCourselist(current,limit,courseQuery){
    console.log('-------======')
    return request({
      url:`/eduservice/educourse/getCourseListCondition/${current}/${limit}`,
      method:'post',
      data:courseQuery
    })
  },
  //删除课程
  deleteCourse(courseId){
    return request({
      url:`/eduservice/educourse/deleteCourse/${courseId}`,
      method:'delete'
    })
  }

  }
