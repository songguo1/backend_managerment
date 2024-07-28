<template>
  <div class="manage">
    <!-- //提交表单 -->
    <el-dialog
      :title="operateType === 'add' ? '新增商品' : '修改商品'"
      :visible.sync="isShow"
    >
      <CommenForm
        :formLabel="operateFormLabel"
        :form="operateForm"
        :inline="true"
        ref="form"
      ></CommenForm>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isShow = false">取消</el-button>
        <el-button type="primary" @click="confirm()">提交</el-button>
      </div>
    </el-dialog>

    <!-- 新增按钮 -->
    <div class="manage-header">
      <el-button
        type="primary"
        @click="addUser"
        size="small"
        icon="el-icon-circle-plus-outline"
        >新增</el-button
      >
      <div>
        <!-- 搜索框 -->
        <el-input
          class="search"
          placeholder="请输入商品名称"
          v-model="searchContent"
        >
        </el-input>
        <el-button
          class="searchBtn"
          type="primary"
          size="small"
          @click="handleSearch"
          >搜索</el-button
        >
      </div>
    </div>

    <div class="table_container">
      <el-table :data="tableData" max-height="650" style="width: 100%" stripe>
        <el-table-column
          type="index"
          prop="id"
          align="center"
          label="序号"
          width="70"
        >
          <template slot-scope="scope">
            {{ scope.row.id }}
          </template>
        </el-table-column>

        <el-table-column
          prop="code"
          align="center"
          label="商品编码"
          
        ></el-table-column>

        <el-table-column
          prop="name"
          align="center"
          label="商品名称"
        ></el-table-column>
        
        <el-table-column
          prop="buy"
          align="center"
          label="商品进价"
        ></el-table-column>
        <el-table-column
          prop="sell"
          align="center"
          label="商品售价"
        ></el-table-column>
        <el-table-column
          prop="date"
          align="center"
          label="出售日期"
        ></el-table-column>
        <el-table-column
          prop="operation"
          align="center"
          label="操作"
          fixed="right"
        >

        <!-- //删除按钮与删除按钮 -->
          <template slot-scope="scope">
            <el-button
              type="warning"
              icon="el-icon-edit-outline"
              title="编辑"
              size="small"
              @click="handleEdit(scope.$index, scope.row)"
            >
            </el-button>
            <el-button
              type="danger"
              icon="el-icon-delete-solid"
              size="small"
              title="删除"
              @click="handleDelete(scope.$index, scope.row)"
            ></el-button>
          </template>

        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="paginations.page_index"
          :page-sizes="paginations.page_sizes"
          :page-size="paginations.page_size"
          :layout="paginations.layout"
          :total="paginations.total"
        >
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import CommenForm from "../../components/CommenForm.vue";

export default {
  name: "Index",
  data() {
    return {
      operateType: "add",
      isShow: false,//提交表单是否显示

      tableData: [], // 存放当前页面表格数据
      allTableData: [], // 存放所有表格数据以及搜索后的数据
      filterTableData: [], // 存放所有表格数据供搜索
      
      tableLabel: [
        {
          prop: "id",
          label: "序号",
        },
        {
          prop: "code",
          label: "商品编码",
        },
        {
          prop: "name",
          label: "商品名称",
          width: 320,
        },
        {
          prop: "buy",
          label: "商品进价",
        },
        {
          prop: "sell",
          label: "商品售价",
        },
        {
          prop: "date",
          label: "出售日期",
          width: 200,
        },
      ],
      config: {
        page: 1,
        total: 30,
      },

      //提交表单里的元素
      operateFormLabel: [
        {
          model: "code",
          label: "商品编码",
          type: "input",
        },
        {
          model: "name",
          label: "商品名称",
          type: "input",
        },
        {
          model: "buy",
          label: "商品进价",
          type: "input",
        },
        {
          model: "sell",
          label: "商品售价",
          type: "input",
        },
        {
          model: "date",
          label: "出售日期",
          type: "date",
        },
      ],
      operateForm: {
        id: "",
        code: "",
        name: "",
        buy: "",
        sell: "",
        date: "",
      },
      formLabel: [
        {
          model: "keyword",
          label: "",
          type: "input",
        },
      ],
      
      searchFrom: {
        keyword: "",
      },
      paginations: {
        page_index: 1, // 当前页
        total: 0, // 总数
        page_size: 10, // 默认每页显示多少条
        page_sizes: [5, 10, 15, 20], // 选择每页显示多少条
        layout: "total, sizes, prev, pager, next, jumper",
      },
      // 搜索框里面的内容
      searchContent: "",
    };
  },
  components: { CommenForm},
  methods: {
    confirm() {
      const url =
        this.operateType == "add" ? "add" : `edit/${this.operateForm.id}`;

      this.$axios.post(`/mall/${url}`, this.operateForm).then((res) => {
        this.isShow = false;
        this.getList();
      });
    },
    getList() {
      this.$axios
        .get("/mall/all")
        .then((res) => {

          this.tableData=res.data
          console.log(this.tableData)
          this.allTableData = res.data;
          this.filterTableData = res.data;
          this.setPaginations();

        })
        .catch((err) => {
          console.log(err);
        });
    },
    addUser() {
      this.isShow = true;
      this.operateType = "add";
      this.operateForm = {
        code: "",
        name: "",
        buy: "",
        sell: "",
        date: "",
        id: "",
      };
    },

    handleEdit(index, row) {
      this.operateType = "edit";
      this.isShow = true;
      // const date = new Date(Date.parse(row.birth))
      // 这里编辑用户信息的时候，birth这个字段老是出错，最后改成了提取字符串就不报错了
      const date = row.date.slice(0, 10);
      this.operateForm = {
        code: row.code,
        name: row.name,
        buy: row.buy,
        sell: row.sell,
        date: date,

        id: row.id,
      };
      // console.log(this.operateForm.birth)
    },
    handleDelete(index, row) {
      this.$confirm("此操作将永久删除该用户，是否继续？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.$axios.post(`/mall/delete/${row.id}`).then((res) => {
          this.$message({
            type: "success",
            message: "删除成功",
          });
          this.getList();
        });
      });
    },

    // 分页相关函数
    setPaginations() {
      this.paginations.total = this.allTableData.length;
      this.paginations.page_index = 1;
      this.tableData = this.allTableData.filter(
        (item, index) => index < this.paginations.page_size
      );
      // console.log(this.allTableData[0])
    },
    handleSizeChange(page_size) {
      this.paginations.page_index = 1;
      this.paginations.page_size = page_size;
      this.tableData = this.allTableData.filter((item, index) => {
        return index < page_size;
      });
    },
    // 页面跳转
    handleCurrentChange(page) {
      const index = this.paginations.page_size * (page - 1);
      const nums = this.paginations.page_size * page;
      const tables = [];
      for (let i = index; i < nums; i++) {
        if (this.allTableData[i]) tables.push(this.allTableData[i]);
      }
      this.tableData = tables;
    },

    // 内容搜索
    handleSearch() {
      if (!this.searchContent) {
        this.$message({ type: "warning", message: "请输入商品名称或商品编码" });
        this.getList();
        return;
      }

      this.allTableData = this.filterTableData.filter((item, index) => {
        return (
          this.searchContent === item.name || this.searchContent === item.code
        );
      });
      this.setPaginations();
    },
  },
  created() {
    this.getList();
  },
  // computed: {
  //     user(){
  //         return this.$store.getters.user
  //     }
  // }
};
</script>

<style lang="less">
.manage-header {
  display: flex; // 弹性部局
  justify-content: space-between; // 分散对齐
  align-items: center; // 居中
  margin-bottom: 10px;
}

.search {
  // height: 32px;
  width: 200px;
  // float: right;
}
.searchBtn {
  margin-left: 10px;
}

.pagination {
  float: right;
  margin-top: 10px;
}
</style>
