const db = require("../db/index");

const mallHandler = {
  mallAdd: (req, res) => {
    const fields = {};
    if (req.body.code) fields.code = req.body.code;
    if (req.body.name) fields.name = req.body.name;
    if (req.body.buy) fields.buy = req.body.buy;
    if (req.body.sell) fields.sell = req.body.sell;
    if (req.body.date) fields.date = req.body.date;

    const sql = "insert into mall set ?";
    db.query(sql, fields, (err, results) => {
      if (err) return res.cc(err);
      if (results.affectedRows !== 1) return res.cc("添加失败");
      res.json(fields);
    });
  },

  mallAll: (req, res) => {
    const sql = "select * from mall order by id desc";
    db.query(sql, (err, results) => {
      if (err) return res.status(404).json(err);
      if (results.length === 0) return res.status(404).json("无商品数据");
      res.status(200).json(results);
    });
  },

  mallEdit: (req, res) => {
    const fields = {};
    if (req.body.code) fields.code = req.body.code;
    if (req.body.name) fields.name = req.body.name;
    if (req.body.buy) fields.buy = req.body.buy;
    if (req.body.sell) fields.sell = req.body.sell;
    if (req.body.date) fields.date = req.body.date;

    const sql = "update mall set ? where id=?";
    db.query(sql, [fields, req.params.id], (err, results) => {
      if (err) return res.status(400).json(err);
      if (results.affectedRows !== 1) return res.status(400).json("添加失败");
      res.json(fields);
    });
  },

  mallDelete: (req, res) => {
    const sql = "delete from mall where id = ?";
    db.query(sql, req.params.id, (err, results) => {
      if (err) return res.status(400).json(err);
      if (results.affectedRows !== 1) return res.status(400).json("删除失败");
      res.json("删除成功");
    });
  },
};

module.exports=mallHandler
