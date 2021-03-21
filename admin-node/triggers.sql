USE inventory
-- 更新预采购单relatedToId
CREATE TRIGGER updatePrePurchaseRelatedId 
AFTER INSERT ON purchase_info 
FOR EACH ROW
    UPDATE prepurchase_info 
    SET relatedToId=(SELECT id FROM purchase_info ORDER BY id DESC LIMIT 1) 
    WHERE id=(SELECT relatedFromId FROM purchase_info ORDER BY id DESC LIMIT 1);

-- 更新采购订单relatedToId
CREATE TRIGGER updatePurchaseRelatedId 
AFTER INSERT ON prestockin_info 
FOR EACH ROW
    UPDATE purchase_info 
    SET relatedToId=(SELECT id FROM prestockin_info ORDER BY id DESC LIMIT 1) 
    WHERE id=(SELECT relatedFromId FROM prestockin_info ORDER BY id DESC LIMIT 1);

-- 更新预入库订单relatedToId
CREATE TRIGGER updatePreStockinRelatedId 
AFTER INSERT ON purchasestockin_info 
FOR EACH ROW
    UPDATE prestockin_info 
    SET relatedToId=(SELECT id FROM purchasestockin_info ORDER BY id DESC LIMIT 1) 
    WHERE id=(SELECT relatedFromId FROM purchasestockin_info ORDER BY id DESC LIMIT 1);

-- 更新销售单relatedToId
CREATE TRIGGER updateSalesRelatedId 
AFTER INSERT ON salesstockout_info 
FOR EACH ROW
    UPDATE sales_info 
    SET relatedToId=(SELECT id FROM salesstockout_info ORDER BY id DESC LIMIT 1) 
    WHERE id=(SELECT relatedFromId FROM salesstockout_info ORDER BY id DESC LIMIT 1);

-- 更新销售出库单relatedToId
CREATE TRIGGER updateSalesStockoutRelatedId 
AFTER INSERT ON salesreturn_info 
FOR EACH ROW
    UPDATE salesstockout_info 
    SET relatedToId=(SELECT id FROM salesreturn_info ORDER BY id DESC LIMIT 1) 
    WHERE id=(SELECT relatedFromId FROM salesreturn_info ORDER BY id DESC LIMIT 1);

