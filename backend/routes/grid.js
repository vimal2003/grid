const express=require('express')

const {addGrid,getGrid,updateGrid,deleteGrid}=require('../controllers/gridController')
const router=express.Router();

router.route('/addGrid').post(addGrid)
router.route('/getGrid').get(getGrid)
router.route('/updateGrid/:id').patch(updateGrid)
router.route('/deleteGrid/:id').delete(deleteGrid)

module.exports=router;