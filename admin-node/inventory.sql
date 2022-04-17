# 进销存管理系统数据库设计

#
# Structure for table "goods_info"
#

DROP TABLE IF EXISTS `goods_info`;
CREATE TABLE `goods_info` (
  `goodsId` varchar(8) NOT NULL COMMENT '商品编号',
  `goodsName` varchar(50) NOT NULL COMMENT '商品名称',
  `goodsUnit` varchar(5) NOT NULL COMMENT '商品单位',
  `goodsModel` varchar(50) NOT NULL COMMENT '规格型号',
  `sellingPrice` decimal(10,2) NOT NULL COMMENT '标准卖价',
  `buyingPrice` decimal(10,2) NOT NULL COMMENT '标准买价',
  `goodsCategory` varchar(20) NOT NULL COMMENT '商品分类',
  `maxStock` int(20) NOT NULL COMMENT '最高库存',
  `minStock` int(20) NOT NULL COMMENT '最低库存',
  `beginingNum` int(10) NOT NULL DEFAULT 0 COMMENT '期初库存',
  `goodsDisabled` tinyint(1) DEFAULT false COMMENT '是否被禁用',
  `createdDate` datetime NOT NULL COMMENT '创建日期',
  PRIMARY KEY (`goodsId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='商品信息表';

#
# Data for table "goods_info"
#

INSERT INTO `goods_info` (`goodsId`,`goodsName`,`goodsUnit`,`goodsModel`,`sellingPrice`,`buyingPrice`,`goodsCategory`,`maxStock`,`minStock`,`createdDate`)  VALUES 
('SP000001','兰蔻塑颜紧致焕白霜','瓶','31-50g/mL',895.00,411.00,'面霜',1000,200,'2021-03-02 12:51:00'),
('SP000002','珂润乳霜','瓶','31-50g/mL',249.00,99.00,'面霜',800,100,'2021-03-02 12:51:00'),
('SP000003','迪奥（Dior）口红999女士烈艳蓝金唇膏','支','3.5g',248.00,112.00,'口红',999,200,'2021-03-02 12:51:00'),
('SP000004','纪梵希（Givenchy）高定香榭红丝绒唇膏','支','3.4g',345.00,150.00,'口红',800,100,'2021-03-02 12:51:00');


#
# Structure for table "goods_category"
#
DROP TABLE IF EXISTS `goods_category`;
CREATE TABLE `goods_category` (
  `categoryId` int(3) unsigned zerofill NOT NULL AUTO_INCREMENT,
  `categoryName` varchar(20) NOT NULL DEFAULT '',
  `createdDate` datetime NOT NULL DEFAULT '1900-01-01 00:00:00',
  PRIMARY KEY (`categoryId`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8 COMMENT='商品分类表';

#
# Data for table "category"
#

INSERT INTO `goods_category` VALUES 
(001,'面霜','2018-03-26 13:29:00'),
(002,'口红','2018-03-26 13:29:00');

#
# Structure for table "customer_info"
#
DROP TABLE IF EXISTS `customer_info`;
CREATE TABLE `customer_info` (
  `customerId` varchar(8) NOT NULL COMMENT '客户编号',
  `customerName` varchar(20) NOT NULL DEFAULT '' COMMENT '客户名称',
  `customerType` varchar(8) NOT NULL COMMENT '客户类型',
  `owner` varchar(5)  NOT NULL COMMENT '负责人',
  `contactName` varchar(5) NOT NULL COMMENT '联系人',
  `contactPhone` char(11) NOT NULL COMMENT '联系人手机',
  `recipientName` varchar(20) NOT NULL COMMENT '收件人姓名',
  `recipientPhone` char(11) NOT NULL COMMENT '收件人手机',
  `recipientAddress` varchar(40) NOT NULL COMMENT '收件人地址',
  `debt` decimal(20,2) NOT NULL DEFAULT 0 COMMENT '欠款',
  `createdDate` datetime NOT NULL DEFAULT '1900-01-01 00:00:00' COMMENT '创建日期',
  PRIMARY KEY (`customerId`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COMMENT='客户信息表';

#
# Data for table "customer_info"
#

INSERT INTO `customer_info` (`customerId`,`customerName`,`customerType`,`owner`,`contactName`,`contactPhone`,`recipientName`,`recipientPhone`,`recipientAddress`,`debt`,`createdDate`) VALUES 
('KH000001','周建昌','普通客户','李海杰','周建昌','13421450124','刘希','18465741248','花城大道777号',0,'2021-03-03 09:39:00'),
('KH000002','大地公司','大客户','李海杰','徐导','13423450124','大地公司','18465741248','天河员村西街2号',0,'2021-03-03 09:39:00'),
('KH000003','天水南路揽投部','大客户','李海杰','洪合力','18521450124','天水南路揽投部','18465741248','天水南路777号',0,'2021-03-03 09:39:00'),
('KH000004','齐洁','大客户','李海杰','张强','18326470124','齐洁','18465741248','广州市天河区黄埔大道西118号',0,'2021-03-03 09:39:00'),
('KH000005','田总','大客户','李海杰','郭杰','17812450124','田福祥','18465741248','广东省广州市天河区兴盛路10号135铺',0,'2021-03-03 09:39:00'),
('KH000006','讯栖科瑞客户','批发客户','李海杰','徐畅','18421450124','刘晓玲','18465741248','广东省广州市越秀区中山四路',0,'2021-03-03 09:39:00'),
('KH000007','爱玛','普通客户','李海杰','林琳','17421450124','赖响晴','18465741248','深圳市光明区油麻岗路68号',0,'2021-03-03 09:39:00'),
('KH000008','周述','普通客户','李海杰','陈飞达','13521450124','周周','18465741248','深圳市光明区粤宝工业区37号',0,'2021-03-03 09:39:00');

#
# Structure for table "vendor_info"
#
DROP TABLE IF EXISTS `vendor_info`;
CREATE TABLE `vendor_info` (
  `vendorId` varchar(8) NOT NULL COMMENT '供应商编号',
  `vendorName` varchar(20) NOT NULL DEFAULT '' COMMENT '供应商名称',
  `vendorType` varchar(8) NOT NULL COMMENT '供应商类型',
  `owner` varchar(5)  NOT NULL COMMENT '负责人',
  `contactName` varchar(5) NOT NULL COMMENT '联系人',
  `contactPhone` char(11) NOT NULL COMMENT '联系人手机',
  `vendorAddress` varchar(40) NOT NULL COMMENT '供应商地址',
  `debt` decimal(20,2) NOT NULL DEFAULT 0 COMMENT '欠款',
  `createdDate` datetime NOT NULL DEFAULT '1900-01-01 00:00:00' COMMENT '创建日期',
  PRIMARY KEY (`vendorId`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COMMENT='供应商信息表';

#
# Data for table "vendorId"
#

INSERT INTO `vendor_info` (`vendorId`,`vendorName`,`vendorType`,`owner`,`contactName`,`contactPhone`,`vendorAddress`,`debt`,`createdDate`) VALUES 
('GYS00001','周建昌','个体','李海杰','周建昌','13421450124','花城大道777号',0,'2021-03-03 09:39:00'),
('GYS00002','大地公司','一级供应商','李海杰','徐导','13423450124','天河员村西街2号',0,'2021-03-03 09:39:00'),
('GYS00003','天水南路揽投部','二级供应商','李海杰','天水南路揽投部','18465741248','天水南路777号',0,'2021-03-03 09:39:00'),
('GYS00004','齐洁','批发','李海杰','张强','18326470124','广州市天河区黄埔大道西118号',0,'2021-03-03 09:39:00'),
('GYS00005','田总','个体','李海杰','郭杰','17812450124','广东省广州市天河区兴盛路10号135铺',0,'2021-03-03 09:39:00'),
('GYS00006','讯栖科瑞客户','一级供应商','李海杰','徐畅','18421450124','广东省广州市越秀区中山四路',0,'2021-03-03 09:39:00'),
('GYS00007','爱玛','个体','周述','林琳','17421450124','深圳市光明区油麻岗路68号',0,'2021-03-03 09:39:00'),
('GYS00008','周述','个体','李海杰','陈飞达','13521450124','深圳市光明区粤宝工业区37号',0,'2021-03-03 09:39:00');

#
# Structure for table "warehouse_info"
#
DROP TABLE IF EXISTS `warehouse_info`;
CREATE TABLE `warehouse_info` (
  `warehouseId` varchar(8) NOT NULL COMMENT '仓库编号',
  `warehouseName` varchar(20) NOT NULL DEFAULT '' COMMENT '仓库名称',
  `warehouseAddress` varchar(40) NOT NULL COMMENT '仓库地址',
  `owner` varchar(5)  NOT NULL COMMENT '负责人',
  `createdDate` datetime NOT NULL DEFAULT '1900-01-01 00:00:00' COMMENT '创建日期',
  `msg` varchar(50) NOT NULL COMMENT '备注',
  PRIMARY KEY (`warehouseId`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COMMENT='仓库信息表';

INSERT INTO `warehouse_info` (`warehouseId`,`warehouseName`,`warehouseAddress`,`owner`,`createdDate`,`msg`) VALUES 
('CK000001','广州一仓','花城大道777号','李海杰','2021-03-03 09:39:00','护肤美妆用品仓'),
('CK000002','广州总仓','天河员村西街2号','李海杰','2021-03-03 09:39:00','大客户群体仓'),
('CK000003','恒旺仓库','天水南路777号','李海杰','2021-03-03 09:39:00',''),
('CK000004','快捷1仓','广州市天河区黄埔大道西118号','李海杰','2021-03-03 09:39:00','');

#
# Structure for table "staff_info"
#
DROP TABLE IF EXISTS `staff_info`;
CREATE TABLE `staff_info` (
  `staffId` varchar(8) NOT NULL COMMENT '用户编号',
  `staffName` varchar(20) NOT NULL DEFAULT '' COMMENT '用户名称',
  `staffPermission` varchar(3000) NOT NULL COMMENT '用户权限',
  `staffRole` varchar(20) NOT NULL COMMENT '用户角色',
  `staffPhone` char(11)  NOT NULL COMMENT '用户手机',
  `staffAccount` varchar(12) NOT NULL COMMENT '用户账号',
  `staffPassword` varchar(50) NOT NULL COMMENT '用户密码',
  `createdDate` datetime NOT NULL DEFAULT '1900-01-01 00:00:00' COMMENT '创建日期',
  PRIMARY KEY (`staffId`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COMMENT='用户信息表';

INSERT INTO `staff_info` (`staffId`,`staffName`,`staffPermission`,`staffRole`,`staffPhone`,`staffAccount`,`staffPassword`,`createdDate`) VALUES 
('YH000001','李海杰','sp_read,sp_edit,sp_del,kh_read,kh_edit,ck_read,ck_edit,ck_del,gys_read,gys_edit,gys_del,yh_edit,yh_read,yh_del','超级管理员','14502347841','admin','91fe0e80d07390750d46ab6ed3a99316','2021-03-04 16:10:00'),
('YH000002','张述','sp_read,sp_edit,sp_del,kh_read,kh_edit,ck_read,ck_edit,ck_del,gys_read,gys_edit,gys_del,yh_edit,yh_read,yh_del','超级管理员','14502347841','role1','role1','2021-03-04 16:10:00'),
('YH000003','周强','sp_read,sp_edit,sp_del,kh_read,kh_edit,ck_read,ck_edit,ck_del,gys_read,gys_edit,gys_del,yh_edit,yh_read,yh_del','超级管理员','14502347841','role2','role2','2021-03-04 16:10:00'),
('YH000004','徐立','sp_read,sp_edit,sp_del,kh_read,kh_edit,ck_read,ck_edit,ck_del,gys_read,gys_edit,gys_del,yh_edit,yh_read,yh_del','超级管理员','14502347841','role3','role3','2021-03-04 16:10:00');

#
# Structure for table "ordergoods_info"
#
DROP TABLE IF EXISTS `ordergoods_info`;
CREATE TABLE `ordergoods_info` (
  `id` int(10) unsigned zerofill NOT NULL AUTO_INCREMENT COMMENT '单据商品明细编号',
  `orderId` char(16) NOT NULL COMMENT '相关单据编号',
  `goodsId` varchar(8) NOT NULL COMMENT '商品编号',
  `goodsName` varchar(50) NOT NULL COMMENT '商品名称',
  `goodsUnit` varchar(5) NOT NULL COMMENT '商品单位',
  `goodsModel` varchar(50) NOT NULL COMMENT '商品型号',
  `goodsNum` int(8) NOT NULL COMMENT '商品数量',
  `goodsPrice` decimal(10,2) NOT NULL COMMENT '商品价格',
  `warehouseId` varchar(8) NOT NULL COMMENT '仓库编号',
  `msg` varchar(100) NOT NULL DEFAULT '' COMMENT '备注',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COMMENT='各类单据商品明细信息表';

-- INSERT INTO `ordergoods_info` (`id`,`orderId`,`goodsId`,`goodsName`,`goodsUnit`,`goodsNum`,`goodsPrice`,`warehouseId`,`msg`) VALUES 
-- (1,'YCKD202103050001','SP000001','兰蔻塑颜紧致焕白霜','瓶',200,324.12,'CK000001','统一打包发货广州'),
-- (2,'YCKD202103050001','SP000002','珂润乳霜','瓶',100,324.12,'CK000001','统一打包发货广州'),
-- (3,'YCKD202103050001','SP000003','迪奥','瓶',300,324.12,'CK000001','统一打包发货广州');
#
# Structure for table "prepurchase_info"
#
DROP TABLE IF EXISTS `prepurchase_info`;
CREATE TABLE `prepurchase_info` (
  `id` varchar(16) NOT NULL COMMENT '预采购单编号',
  `owner` varchar(8) NOT NULL COMMENT '采购人员',
  `deliveryDate` datetime NOT NULL COMMENT '商品交货日期',
  `orderDate` datetime NOT NULL COMMENT '预采购单单据日期',
  `approvalStatus` int(1) DEFAULT 0 NOT NULL COMMENT '审核状态',
  `approvalMsg` varchar(100) NOT NULL COMMENT '审核备注',
  `approvalDate` datetime NOT NULL COMMENT '审批日期',
  `approvalBy` varchar(8) NOT NULL COMMENT '审批人',
  `createdDate` datetime NOT NULL COMMENT '创建日期',
  `createdBy` varchar(20) NOT NULL DEFAULT '' COMMENT '创建人',
  `relatedToId` varchar(16) NOT NULL COMMENT '关联的采购单',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COMMENT='预采购单信息表';

-- INSERT INTO `prepurchase_info` (`id`,`createdBy`,`deliveryDate`,`createdDate`,`collectStatus`) VALUES 
-- ('YCKD202103050001','李海杰','2021-03-10 16:10:00','2021-03-11 16:10:00',0);

#
# Structure for table "purchase_info"
#
DROP TABLE IF EXISTS `purchase_info`;
CREATE TABLE `purchase_info` (
  `id` varchar(16) NOT NULL COMMENT '采购单编号',
  `owner` varchar(8) NOT NULL COMMENT '采购人员',
  `deliveryDate` datetime NOT NULL COMMENT '商品交货日期',
  `orderDate` datetime NOT NULL COMMENT '采购单单据日期',
  `vendorId` varchar(8)  NOT NULL COMMENT '供应商编号',
  `approvalStatus` int(1) DEFAULT 0 NOT NULL COMMENT '审核状态',
  `approvalMsg` varchar(100) NOT NULL COMMENT '审核备注',
  `approvalBy` varchar(8) NOT NULL COMMENT '审批人',
  `approvalDate` datetime NOT NULL COMMENT '审批日期',
  `createdDate` datetime NOT NULL COMMENT '创建日期',
  `createdBy` varchar(8) NOT NULL DEFAULT '' COMMENT '创建人',
  `relatedFromId` varchar(16) NOT NULL COMMENT '关联的预采购单',
  `relatedToId` varchar(16) NOT NULL COMMENT '关联的预入库单',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COMMENT='采购单信息表';

-- INSERT INTO `purchase_info` (`id`,`createdBy`,`deliveryDate`,`createdDate`,`collectStatus`) VALUES 
-- ('YCKD202103050001','李海杰','2021-03-10 16:10:00','2021-03-11 16:10:00',0);



#
# Structure for table "prestockin_info"
#
DROP TABLE IF EXISTS `prestockin_info`;
CREATE TABLE `prestockin_info` (
  `id` varchar(16) NOT NULL COMMENT '预入库单编号',
  `owner` varchar(8) NOT NULL DEFAULT '' COMMENT '采购人员',
  `arrivalDate` datetime NOT NULL COMMENT '商品到货日期',
  `vendorId` varchar(8)  NOT NULL COMMENT '供应商编号',
  `approvalStatus` int(1) DEFAULT 0 NOT NULL COMMENT '审核状态',
  `approvalMsg` varchar(100) NOT NULL COMMENT '审核备注',
  `approvalBy` varchar(8) NOT NULL COMMENT '审批人',
  `approvalDate` datetime NOT NULL COMMENT '审批日期',
  `createdDate` datetime NOT NULL COMMENT '创建日期',
  `createdBy` varchar(8) NOT NULL DEFAULT '' COMMENT '创建人',
  `relatedFromId` varchar(16) NOT NULL COMMENT '关联的采购订单',
  `relatedToId` varchar(16) NOT NULL COMMENT '关联的采购入库单',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COMMENT='预入库单信息表';



#
# Structure for table "purchasestockin_info"
#
DROP TABLE IF EXISTS `purchasestockin_info`;
CREATE TABLE `purchasestockin_info` (
  `id` varchar(16) NOT NULL COMMENT '采购入库单编号',
  `owner` varchar(8) NOT NULL DEFAULT '' COMMENT '采购人员',
  `stockingDate` datetime NOT NULL COMMENT '商品入库日期',
  `approvalStatus` int(1) NOT NULL DEFAULT 0 COMMENT '审核状态',
  `vendorId` varchar(8)  NOT NULL COMMENT '供应商编号',
  `closingStatus` int(1) NOT NULL DEFAULT 0 COMMENT '订单结案状态',
  `settleStatus` int(1) NOT NULL DEFAULT 0 COMMENT '订单结算状态',
  `totalAmount` decimal(30,2) NOT NULL COMMENT '总金额',
  `approvalMsg` varchar(100) NOT NULL COMMENT '审核备注',
  `approvalBy` varchar(8) NOT NULL COMMENT '审批人',
  `approvalDate` datetime NOT NULL COMMENT '审批日期',
  `createdDate` datetime NOT NULL COMMENT '创建日期',
  `createdBy` varchar(8) NOT NULL DEFAULT '' COMMENT '创建人',
  `relatedFromId` varchar(16) NOT NULL COMMENT '关联的预入库订单',
  `payDate` datetime NOT NULL COMMENT '付款日期',
  `orderDate` datetime NOT NULL COMMENT '单据日期',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COMMENT='采购入库单信息表';


#
# Structure for table "sales_info"
#
DROP TABLE IF EXISTS `sales_info`;
CREATE TABLE `sales_info` (
  `id` varchar(16) NOT NULL COMMENT '销售单编号',
  `owner` varchar(8) NOT NULL DEFAULT '' COMMENT '销售人员',
  `orderDate` datetime NOT NULL COMMENT '销售单单据日期',
  `deliveryDate` datetime NOT NULL COMMENT '商品交货日期',
  `customerId` varchar(8) NOT NULL COMMENT '客户编号',
  `totalAmount` decimal(30,2) NOT NULL COMMENT '总金额',
  `closingStatus` int(1) NOT NULL DEFAULT 0 COMMENT '订单结案状态',
  `settleStatus` int(1) NOT NULL DEFAULT 0 COMMENT '订单结算状态',
  `recipientName` varchar(5) NOT NULL COMMENT '收件人姓名',
  `recipientPhone` varchar(11) NOT NULL COMMENT '收件人手机',
  `recipientAddress` varchar(40)  NOT NULL COMMENT '收件人地址',
  `approvalStatus` int(1) NOT NULL DEFAULT 0 COMMENT '审核状态',
  `approvalMsg` varchar(100) NOT NULL COMMENT '审核备注',
  `approvalBy` varchar(8) NOT NULL COMMENT '审批人',
  `approvalDate` datetime NOT NULL COMMENT '审批日期',
  `createdDate` datetime NOT NULL COMMENT '创建日期',
  `createdBy` varchar(8) NOT NULL DEFAULT '' COMMENT '创建人',
  `relatedToId` varchar(16) NOT NULL COMMENT '关联的销售入库单',
  `payDate` datetime NOT NULL COMMENT '收款日期',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COMMENT='销售单信息表';



#
# Structure for table "salesstockout_info"
#
DROP TABLE IF EXISTS `salesstockout_info`;
CREATE TABLE `salesstockout_info` (
  `id` varchar(16) NOT NULL COMMENT '销售出库单编号',
  `owner` varchar(8) NOT NULL DEFAULT '' COMMENT '销售人员',
  `deliveryDate` datetime NOT NULL COMMENT '商品出库日期',
  `customerId` varchar(8) NOT NULL COMMENT '客户编号',
  `totalAmount` decimal(30,2) NOT NULL COMMENT '总金额',
  `recipientName` varchar(5) NOT NULL COMMENT '收件人姓名',
  `recipientPhone` varchar(11) NOT NULL COMMENT '收件人手机',
  `recipientAddress` varchar(40)  NOT NULL COMMENT '收件人地址',
  `approvalStatus` int(1) NOT NULL DEFAULT 0 COMMENT '审核状态',
  `approvalMsg` varchar(100) NOT NULL COMMENT '审核备注',
  `approvalBy` varchar(8) NOT NULL COMMENT '审批人',
  `approvalDate` datetime NOT NULL COMMENT '审批日期',
  `createdDate` datetime NOT NULL COMMENT '创建日期',
  `createdBy` varchar(8) NOT NULL DEFAULT '' COMMENT '创建人',
  `relatedFromId` varchar(16) NOT NULL COMMENT '关联的销售单',
  `relatedToId` varchar(16) NOT NULL COMMENT '关联的销售退货单',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COMMENT='销售出库单信息表';


#
# Structure for table "salesreturn_info"
#
DROP TABLE IF EXISTS `salesreturn_info`;
CREATE TABLE `salesreturn_info` (
  `id` varchar(16) NOT NULL COMMENT '销售退货单编号',
  `owner` varchar(8) NOT NULL DEFAULT '' COMMENT '销售人员',
  `orderDate` datetime NOT NULL COMMENT '单据日期',
  `returnDate` datetime NOT NULL COMMENT '商品退货日期',
  `customerId` varchar(8) NOT NULL COMMENT '客户编号',
  `totalAmount` decimal(30,2) NOT NULL COMMENT '总金额',
  `closingStatus` int(1) NOT NULL DEFAULT 0 COMMENT '订单结案状态',
  `settleStatus` int(1) NOT NULL DEFAULT 0 COMMENT '订单结算状态',
  `approvalStatus` int(1) NOT NULL DEFAULT 0 COMMENT '审核状态',
  `approvalMsg` varchar(100) NOT NULL COMMENT '审核备注',
  `approvalBy` varchar(8) NOT NULL COMMENT '审批人',
  `approvalDate` datetime NOT NULL COMMENT '审批日期',
  `createdDate` datetime NOT NULL COMMENT '创建日期',
  `createdBy` varchar(8) NOT NULL DEFAULT '' COMMENT '创建人',
  `relatedFromId` varchar(16) NOT NULL COMMENT '关联的销售出库单',
  `payDate` datetime NOT NULL COMMENT '收款日期',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COMMENT='销售退货单信息表';

#
# Structure for table "purchasereturn_info"
#
DROP TABLE IF EXISTS `purchasereturn_info`;
CREATE TABLE `purchasereturn_info` (
  `id` varchar(16) NOT NULL COMMENT '采购退货单编号',
  `owner` varchar(8) NOT NULL DEFAULT '' COMMENT '采购人员',
  `returnDate` datetime NOT NULL COMMENT '采购退货日期',
  `vendorId` varchar(8) NOT NULL COMMENT '供应商编号',
  `totalAmount` decimal(30,2) NOT NULL COMMENT '总金额',
  `closingStatus` int(1) NOT NULL DEFAULT 0 COMMENT '订单结案状态',
  `settleStatus` int(1) NOT NULL DEFAULT 0 COMMENT '订单结算状态',
  `approvalStatus` int(1) NOT NULL DEFAULT 0 COMMENT '审核状态',
  `approvalMsg` varchar(100) NOT NULL COMMENT '审核备注',
  `approvalBy` varchar(8) NOT NULL COMMENT '审批人',
  `approvalDate` datetime NOT NULL COMMENT '审批日期',
  `createdDate` datetime NOT NULL COMMENT '创建日期',
  `createdBy` varchar(8) NOT NULL DEFAULT '' COMMENT '创建人',
  `relatedFromId` varchar(16) NOT NULL COMMENT '关联的入库单',
  `payDate` datetime NOT NULL COMMENT '付款日期',
  `orderDate` datetime NOT NULL COMMENT '单据日期',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COMMENT='采购退货单信息表';

#
# Structure for table "check_info"
#
DROP TABLE IF EXISTS `check_info`;
CREATE TABLE `check_info` (
  `id` varchar(16) NOT NULL COMMENT '盘点单编号',
  `owner` varchar(8) NOT NULL DEFAULT '' COMMENT '盘点人员',
  `checkDate` datetime NOT NULL COMMENT '盘点日期',
  `warehouseId` varchar(8) NOT NULL COMMENT '仓库编号',
  `checkNum` int(10) NOT NULL COMMENT '盘点产品量',
  `profitAndLoss` int(20) NOT NULL COMMENT '盘盈盘亏',
  `approvalStatus` int(1) NOT NULL DEFAULT 0 COMMENT '审核状态',
  `approvalMsg` varchar(100) NOT NULL COMMENT '审核备注',
  `approvalBy` varchar(8) NOT NULL COMMENT '审批人',
  `approvalDate` datetime NOT NULL COMMENT '审批日期',
  `createdDate` datetime NOT NULL COMMENT '创建日期',
  `createdBy` varchar(8) NOT NULL DEFAULT '' COMMENT '创建人',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COMMENT='盘点单信息表';

#
# Structure for table "goodsstock_info"
#
DROP TABLE IF EXISTS `goodsstock_info`;
CREATE TABLE `goodsstock_info` (
  `id` int(10) unsigned zerofill NOT NULL AUTO_INCREMENT COMMENT '商品库存编号',
  `goodsId` varchar(8) NOT NULL DEFAULT '' COMMENT '商品编号',
  `warehouseId` varchar(8) NOT NULL COMMENT '仓库编号',
  `currentNum` int(20) NOT NULL COMMENT '当前库存',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COMMENT='商品库存信息表';



