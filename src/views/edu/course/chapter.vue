<template>

  <div class="app-container">

    <h2 style="text-align: center;">发布新课程</h2>

    <el-steps :active="2" process-status="wait" align-center style="margin-bottom: 40px;">
      <el-step title="填写课程基本信息"/>
      <el-step title="创建课程大纲"/>
      <el-step title="最终发布"/>
    </el-steps>
    <el-button type="text" @click="openChapterDialog()">添加章节</el-button>
    <!-- 章节 -->
    <ul class="chanpterList">
      <li
        v-for="chapter in chapterVideo"
        :key="chapter.id">
        <p>
          {{ chapter.title }}

          <span class="acts">
            <el-button style="" type="text" @click="openVideo(chapter.id)">添加小节</el-button>
            <el-button style="" type="text" @click="openEditChatper(chapter.id)">编辑</el-button>
            <el-button type="text" @click="removeChapter(chapter.id)">删除</el-button>
          </span>
        </p>
        <!-- 小节 -->
        <ul class="chanpterList videoList">
          <li
            v-for="video in chapter.children"
            :key="video.id">
            <p>{{ video.title }}

              <span class="acts">
                <el-button type="text" @click="editVideo(video.id)">编辑</el-button>
                <el-button type="text" @click="removeVideo(video.id)">删除</el-button>
              </span>
            </p>
          </li>
        </ul>
      </li>
    </ul>
    <div>
      <el-button @click="previous">上一步</el-button>
      <el-button :disabled="saveBtnDisabled" type="primary" @click="next">下一步</el-button>
    </div>

    <!-- 添加和修改章节表单 -->
    <el-dialog :visible.sync="dialogChapterFormVisible" title="添加章节">
      <el-form :model="chapter" label-width="120px">
        <el-form-item label="章节标题">
          <el-input v-model="chapter.title"/>
        </el-form-item>
        <el-form-item label="章节排序">
          <el-input-number v-model="chapter.sort" :min="0" controls-position="right"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogChapterFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveOrUpdate">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 添加和修改课时表单 -->
    <el-dialog :visible.sync="dialogVideoFormVisible" title="添加课时">
      <el-form :model="video" label-width="120px">
        <el-form-item label="课时标题">
          <el-input v-model="video.title"/>
        </el-form-item>
        <el-form-item label="课时排序">
          <el-input-number v-model="video.sort" :min="0" controls-position="right"/>
        </el-form-item>
        <el-form-item label="是否免费">
          <el-radio-group v-model="video.free">
            <el-radio :label="true">免费</el-radio>
            <el-radio :label="false">默认</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="上传视频">
          <el-upload
            :on-success="handleVodUploadSuccess"
            :on-remove="handleVodRemove"
            :before-remove="beforeVodRemove"
            :on-exceed="handleUploadExceed"
            :file-list="fileList"
            :action="BASE_API+'/eduvod/video/uploadAlyiVideo'"
            :limit="1"
            class="upload-demo">
            <el-button size="small" type="primary">上传视频</el-button>
            <el-tooltip placement="right-end">
              <div slot="content">最大支持1G，<br>
                支持3GP、ASF、AVI、DAT、DV、FLV、F4V、<br>
                GIF、M2T、M4V、MJ2、MJPEG、MKV、MOV、MP4、<br>
                MPE、MPG、MPEG、MTS、OGG、QT、RM、RMVB、<br>
                SWF、TS、VOB、WMV、WEBM 等视频格式上传</div>
              <i class="el-icon-question"/>
            </el-tooltip>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVideoFormVisible = false">取 消</el-button>
        <el-button :disabled="saveVideoBtnDisabled" type="primary" @click="saveOrUpdateVideo">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import chapter from '@/api/edu/chapter'
import video from '@/api/edu/video'
export default {
  data() {
    return {
      chapterVideo: [],
      saveBtnDisabled: false,
      courseId: '',
      dialogChapterFormVisible: false, // 章弹框
      dialogVideoFormVisible: false, // 小节弹框
      chapter: {
        title: '',
        sort: ''
      },
      video: {
        title: '',
        sort: 0,
        free: 0,
        videoSourceId: '',
        videoOriginalName: ''// 视频名称
      },
      fileList: [], // 上传文件列表
      BASE_API: process.env.BASE_API // 接口API地址

    }
  },
  created() {
    if (this.$route.params && this.$route.params.id) {
      this.courseId = this.$route.params.id
    }
    this.getChapterVideo()
  },
  methods: {
    // ===========================================上传视频=========================================================
    // 删除视频之前，先确认
    beforeVodRemove(file, fileList) {
      return this.$confirm(`确认移除${file.name}`)
    },
    // 删除视频
    handleVodRemove() {
      console.log('---+++====')
      video.removeAlyyunVod(this.video.videoSourceId).then(response => {
        // 提示
        this.$message({
          type: 'success',
          message: '删除视频成功!'
        })
        // 清空文件列表
        this.fileList = []
        this.video.videoSourceId = ''
        this.video.videoOriginalName = ''
      })
    },
    // 上传视频成功调用的方法
    handleVodUploadSuccess(response, file, fileList) {
      // 上传视频id赋值
      this.video.videoSourceId = response.data.videoId
      // 上传视频名称赋值
      this.video.videoOriginalName = file.name
    },
    handleUploadExceed() {
      this.$message.warning('想要重新上传视频，请先删除已上传的视频')
    },

    // =================================小节操作===================================================
    saveOrUpdateVideo() {
      if (!this.video.id) {
        this.addEduvideo()
      } else {
        this.saveEditVideo()
      }
    },
    // 删除小节
    removeVideo(id) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        video.deleteVideo(id).then(response => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          // 刷新 展示
          this.getChapterVideo()
        })
      })
    },
    // 打开添加小节面板
    openVideo(chapterId) {
      this.dialogVideoFormVisible = true
      // 设置video属性
      this.video.chapterId = chapterId
      this.video.free = ''
      this.video.sort = ''
      this.video.title = ''
      this.fileList = []
    },
    addEduvideo() {
      this.video.courseId = this.courseId
      video.addVideo(this.video).then(response => {
        this.dialogVideoFormVisible = false
        this.$message({
          type: 'success',
          message: '添加成功!'
        })
        // 刷新 展示
        this.getChapterVideo()
      })
    },
    editVideo(id) {
      // this.dialogVideoFormVisible=true //显示弹框
      video.getVideo(id).then(response => {
        this.video = response.data.eduvideo
        this.dialogVideoFormVisible = true // 显示弹框
      })
    },
    saveEditVideo() {
      video.updateVideo(this.video).then(response => {
        this.dialogVideoFormVisible = false // 显示弹框
        // 提示
        this.$message({
          type: 'success',
          message: '修改章节信息成功!'
        })
        // 刷新 展示
        this.getChapterVideo()
      })
    },

    // =================================章节操作===================================================

    // 删除章节
    removeChapter(chapterId) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        chapter.deleteChapter(chapterId).then(response => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          // 刷新 展示
          this.getChapterVideo()
        })
      })
    },
    // 修改章节(查询)
    openEditChatper(chapterId) {
      chapter.getChapter(chapterId).then(response => {
        this.chapter = response.data.chapter
        this.dialogChapterFormVisible = true
      })
    },
    // 提交修改
    updateChapter() {
      this.chapter.courseId = this.courseId
      chapter.updateChapter(this.chapter).then(response => {
        // 关闭弹框
        this.dialogChapterFormVisible = false
        // 提示
        this.$message({
          type: 'success',
          message: '修改章节信息成功!'
        })
        // 刷新 展示
        this.getChapterVideo()
      })
    },
    // 添加章节
    addChapter() {
      this.chapter.courseId = this.courseId
      chapter.addChapter(this.chapter).then(response => {
        // 关闭弹框
        this.dialogChapterFormVisible = false
        // 提示
        this.$message({
          type: 'success',
          message: '添加章节信息成功!'
        })
        // 刷新 展示
        this.getChapterVideo()
      })
    },
    // 跟新或者添加
    saveOrUpdate() {
      if (!this.chapter.id) {
        this.addChapter()
      } else {
        this.updateChapter()
      }
    },
    // 弹框并清空表单
    openChapterDialog() {
      this.dialogChapterFormVisible = true
      this.chapter.title = ''
      this.chapter.sort = 0
    },
    // 上一步
    previous() {
      this.$router.push({ path: '/course/info/' + this.courseId })
    },
    // 下一步
    next() {
      this.$router.push({ path: '/course/publish/' + this.courseId })
    },
    // 根据CourseID 查询章节小节
    getChapterVideo() {
      chapter.getAllChapterVideo(this.courseId).then(response => {
        this.chapterVideo = response.data.allChapterVideo
      })
    }
  }
}
</script>
<style scoped>
  .chanpterList{
    position: relative;
    list-style: none;
    margin: 0;
    padding: 0;
  }
  .chanpterList li{
    position: relative;
  }
  .chanpterList p{
    float: left;
    font-size: 20px;
    margin: 10px 0;
    padding: 10px;
    height: 70px;
    line-height: 50px;
    width: 100%;
    border: 1px solid #DDD;
  }
  .chanpterList .acts {
    float: right;
    font-size: 14px;
  }

  .videoList{
    padding-left: 50px;
  }
  .videoList p{
    float: left;
    font-size: 14px;
    margin: 10px 0;
    padding: 10px;
    height: 50px;
    line-height: 30px;
    width: 100%;
    border: 1px dotted #DDD;
  }

</style>
