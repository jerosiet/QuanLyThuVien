import axios from "axios";
import { ref } from "vue";

export const nhanviens = ref([]); // Store danh sách nhân viên

// Hàm lấy danh sách nhân viên từ server
export const fetchnhanviens = async () => {
  try {
    const response = await axios.get("http://localhost:5000/api/nhanvien");
    nhanviens.value = response.data;
  } catch (error) {
    console.error("Error fetching nhanviens:", error);
  }
};

// Hàm thêm nhân viên mới
export const addnhanvien = async (newnhanvien) => {
  try {
    await axios.post("http://localhost:5000/api/nhanvien/add", newnhanvien);
    await fetchnhanviens();
  } catch (error) {
    console.error("Error adding nhanvien:", error);
  }
};

// Hàm cập nhật thông tin nhân viên
export const updatenhanvien = async (updatednhanvien) => {
  try {
    await axios.put(`http://localhost:5000/api/nhanvien/edit/${updatednhanvien._id}`, updatednhanvien);
    await fetchnhanviens();
  } catch (error) {
    console.error("Error updating nhanvien:", error);
  }
};

import { useAuthStore } from "./auth";


export const deletenhanvien = async (id) => {
  try {
    const authStore = useAuthStore(); // Lấy thông tin từ store auth
    const userCV = authStore.user.ChucVu; // Lấy user ID từ người dùng đã đăng nhập

    if (userCV !== "Giám đốc") {
      Error.value = "Không có thẩm quyền xóa!";
      alert(Error.value);
      return;
    }
    await axios.delete(`http://localhost:5000/api/nhanvien/delete/${id}`);
    await fetchnhanviens();
  } catch (error) {
    console.error("Error deleting nhanvien:", error);
  }
};
