import { baseService } from "../interceptor"

export const getPersonalAll = async () => {
    const response = await baseService.get("admin/personal");
    return response;
}

export const addUser = async (item) => {
    const response = await baseService.post('admin/personal', item);
    return response.data;
};

export const deleteUser = async (id) => {
    const response = await baseService.delete(`admin/personal/${id}`);
    return response.data;
}

export const editUser = async (data) => {
    const response = await baseService.put(`admin/personal/${data.id}`, data);
    return response.data;
}

export const getProvinceWithDistMuni = async () => {
    const response = await baseService.get("admin/provinceWithDistMuni");
    return response;
}

export const getForeignSkills = async () => {
    const response = await baseService.get("admin/foreignSkills");
    return response;
};

export const getBloodGroup = async () => {
    const response = await baseService.get("admin/bloodGroup");
    return response;
};