import request from '@/utils/request'
import id from "element-ui/src/locale/lang/id";

export default{
  getSubjectList(){
     return request({
     url: `/eduservice/edusubject/getAllSubject`,
     method: 'get'
     })
}
}
