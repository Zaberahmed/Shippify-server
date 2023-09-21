import Warehouse, { IWarehouse } from "./warehouse.model";


export const createWarehouseToDB = async (payload: any): Promise<IWarehouse> => {
    try {
        const warehouse = new Warehouse(payload);
        return await warehouse.save();
    } catch (err) {
        throw err;
    }
}

export const getWarehouseListFromDB = async (payload: object): Promise<IWarehouse[]> => {
    try {
        const warehouseList = await Warehouse.find({ user: payload });
        return warehouseList;
    } catch (err) {
        throw err;
    }
}

export const deleteWarehouseFromDB = async (payload: any): Promise<any> => {
    try {
        const warehouseList = await Warehouse.deleteOne({ user: payload.user, _id: payload.id });
        return warehouseList;
    } catch (err) {
        throw err;
    }
}