import { baseService } from "./interceptor"
export const LoginForm = async (data) => {
    const response = await baseService.post("admin/login", data, {
        headers: {
            "Content-Type": "application/json"
        }
    })
    return response;
}