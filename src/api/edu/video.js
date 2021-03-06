import request from '@/utils/request'

export default{
  //添加小节
  addVideo(eduvideo) {
    return request({
      url:`/eduservice/video/addVideo`,
      method:'post',
      data:eduvideo
    })
  },
  //修改得查询一条
  getVideo(videoId){
    return request({
      url:`/eduservice/video/getVideoById/${videoId}`,
      method:'get'
    })
  },
  //修改提交
  updateVideo(eduvideo){
    return request({
      url:`/eduservice/video/updateVideo`,
      method:'post',
      data:eduvideo
    })
  },
  //删除小节
  deleteVideo(videoId){
    return request({
      url:`/eduservice/video/${videoId}`,
      method:'delete'
    })
  },
  //删除视频
  removeAlyyunVod(id){
    return request({
      url:`/eduvod/video/removeAlyVideo/${id}`,
      method:'delete'
    })
  }

}
