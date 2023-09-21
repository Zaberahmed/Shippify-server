import { Request, Response } from "express";
import { createWarehouseToDB, deleteWarehouseFromDB, getWarehouseListFromDB } from "./warehouse.service";
import { getUserByIdFromDB } from "../user/user.service";

export const createWarehouse = async (req: Request | any, res: Response) => {
    const queryData = {
        user: req.authUser,
        ...req.body
    }
    // console.log(queryData);

    const warehouse = await createWarehouseToDB(queryData);
    // console.log(warehouse);

    return res.status(200).json({
        status: 'success',
        data: warehouse
    });
}

export const getAllWarehouse = async (req: Request | any, res: Response) => {
    const userDetail = await getUserByIdFromDB(req.authUser);
    const warehouseList = await getWarehouseListFromDB(req.authUser);
    const centralWarehouse = {
        "warehouse_name": "Central Warehouse",
        "origin_address": userDetail?.address,
        "user": req.authUser,
        "_id": "000000000000000"
    }
    // console.log(warehouseList);

    const data = [centralWarehouse, ...warehouseList];
    // console.log(data);

    return res.status(200).json({
        status: 'success',
        data: data
    });
}

export const removeWarehouse = async (req: Request | any, res: Response) => {
    const { id } = req.params;
    const user = req.authUser;

    const queryData = {
        user: user,
        id: id
    }
    const dbRes = await deleteWarehouseFromDB(queryData);
    return res.status(200).json({
        status: 'success',
        data: dbRes
    });
}

