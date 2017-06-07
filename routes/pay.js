var express = require('express');
var router = express.Router();
var GoodsModel = require('../models/GoodsModel');
var ShoppingModel = require('../models/ShoppingModel');

/* GET home page. */
router.get('/putshopping', function(req, res, next) {
	loginbean = req.session.loginbean;
	if(typeof(loginbean)=='undefined'){
		res.send('<script>alert("您没登陆,请登陆后操作");window.close();</script>');
		return;
	}
  //res.locals.loginbean = loginbean;
  //--------查询goods表--------------------------
  goodsid = req.query.goodsid;
  
  GoodsModel.findOne({where:{id:goodsid}}).then(function(goodsRs){
          //--------插入购物意向表----------------------
          syl = {
          	goodsid:goodsid,
          	uid:loginbean.id,
          	price:goodsRs.price,
          	num:1,
          	shopid:goodsRs.shopid,
          	creattime:new Date()
          };
          ShoppingModel.create(syl).then(function(rs){
	          console.log(rs);
	          //--------查询购物意向表---------------------
	          ShoppingModel.findAll({where:{uid:loginbean.id}}).then(function(shopList){
	          	//--------显示购物车---------------------------
	          	res.render('shoppingcar',{shopList:shopList});
	          });
	       }).catch(function(err){
	          console.log(err);
	          if(err.errors[0].path=='shoppinguniq')
			  {
				ShoppingModel.update({num:sequelize.literal('num+1')},{where:{'goodsid':goodsid,'uid':loginbean.id,'orderid':0}}).then(function(rs){
					//--------查询购物意向表---------------------
			          ShoppingModel.findAll({where:{uid:loginbean.id}}).then(function(shopList){
			          	//--------显示购物车---------------------------
			          	res.render('shoppingcar',{shopList:shopList});
			          });
					res.render('shoppingcar',{shopList:shopList});
				})
			  }else{
			  	res.send('数据库错误,请稍后再试');
			  }
	          // res.send('创建失败');
	       })

  });

  
  
  
  res.send('购物车');
});


module.exports = router;
