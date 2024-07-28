const express=require('express')
router=express.Router()

const mallHandler=require('../router_handler/malls')

router.get('/all',mallHandler.mallAll)
router.post('/add',mallHandler.mallAdd)
router.post('/edit/:id',mallHandler.mallEdit)
router.post('/delete/:id',mallHandler.mallDelete)

module.exports=router