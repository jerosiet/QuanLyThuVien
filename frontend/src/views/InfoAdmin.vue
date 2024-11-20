<template>
  <div class="container">
    <!-- Navigation -->
    <nav class="navbar">
      <div class="nav-content">
        <div class="nav-left">
          <span class="nav-title">Library Admin</span>
        </div>
        <div class="nav-links">
          <RouterLink to="/admin-home" class="nav-link">Trang chủ</RouterLink>
          <RouterLink to="/quan-ly-sach" class="nav-link">Quản lý Sách</RouterLink>
          <RouterLink to="/quan-ly-doc-gia" class="nav-link">Quản lý Độc giả</RouterLink>
          <RouterLink to="/quan-ly-muon-sach" class="nav-link">Quản lý Mượn sách</RouterLink>
          <RouterLink to="/quan-ly-nxb" class="nav-link">Quản lý NXB</RouterLink>
          <RouterLink to="/quan-ly-nhan-vien" class="nav-link">Quản lý Nhân viên</RouterLink>
          <a class="user-info" @click="toggleDropdown">
            Xin chào, {{ authStore.user?.HoTenNV }}
            <div v-if="showDropdown" class="dropdown">
              <button @click.prevent="goToAdminInfo">Thông tin tài khoản</button>
              <button @click="logout">Đăng xuất</button>
            </div>
          </a>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <main class="main-content">
      <div class="account-card">
        <h1 class="section-title">Thông Tin Tài Khoản</h1>
        <form @submit.prevent="handleSave">
          <div class="info-grid">
            <div class="info-item">
              <label>Họ và tên:</label>
              <input v-model="editInfo.HoTenNV" :disabled="!isEditing" />
            </div>
            <div class="info-item">
              <label>Số Điện Thoại:</label>
              <input v-model="editInfo.SoDienThoai" :disabled="!isEditing" />
            </div>
            <div class="info-item">
              <label>Chức vụ:</label>
              <input v-model="editInfo.ChucVu" :disabled="!isEditing" />
            </div>
            <div class="info-item">
              <label>Địa chỉ:</label>
              <input v-model="editInfo.DiaChi" :disabled="!isEditing" />
            </div>
          </div>
          <div class="action-buttons">
            <button v-if="!isEditing" @click.prevent="toggleEdit">Chỉnh sửa</button>
            <button v-else type="submit">Lưu</button>
            <button v-if="isEditing" @click.prevent="cancelEdit">Hủy</button>
          </div>
        </form>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useAuthStore } from "../stores/auth";
import { useRouter } from "vue-router";
import { updatenhanvien } from "@/stores/nhanvien"; // API cập nhật thông tin admin

// Initializing the stores and router
const authStore = useAuthStore();
const router = useRouter();

// State for dropdown visibility
const showDropdown = ref(false);

// State for editing mode
const isEditing = ref(false);

// Clone the initial user info for editing
const editInfo = ref({ ...authStore.user });

// Toggle between view and edit mode
const toggleEdit = () => {
  isEditing.value = true;
};

// Cancel edit and reset the form
const cancelEdit = () => {
  editInfo.value = { ...authStore.user };
  isEditing.value = false;
};

// Save the updated information
const handleSave = async () => {
  try {
    await updatenhanvien(authStore.user, editInfo.value);
    // Update the user info in the store
    authStore.user = { ...editInfo.value };
    isEditing.value = false;
    alert("Thông tin đã được cập nhật!");
  } catch (error) {
    console.error("Lỗi khi cập nhật thông tin:", error);
    alert("Cập nhật thất bại!");
  }
};

// Dropdown menu toggle
const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value;
};

// Redirect to admin info
const goToAdminInfo = () => {
  router.push("/info-admin");
};

// Logout
const logout = () => {
  authStore.logout();
  router.push("/");
};
</script>

<style scoped>
/* Main container */
.container {
  background-color: #f7fafc;
  min-height: 100vh;
}

/* Navbar styling */
.navbar {
  background-color: #000000;
  color: white;
  padding: 1rem;
}
.nav-content {
  display: flex;
  justify-content: space-between;
  max-width: 1024px;
  margin: 0 auto;
}
.nav-title {
  font-size: 1.5rem;
  font-weight: bold;
}
.nav-links a {
  color: white;
  margin-left: 1rem;
  text-decoration: none;
  font-size: 0.875rem;
}
.nav-links a:hover {
  background-color: #3869ca;
  padding: 0.5rem;
  border-radius: 0.375rem;
}

/* Dropdown menu */
.user-info {
  position: relative;
  cursor: pointer;
}
.dropdown {
  position: absolute;
  right: 0;
  top: 30px;
  background-color: white;
  color: black;
  border: 1px solid #ddd;
  border-radius: 4px;
  width: 150px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  text-align: center;
  padding: 10px 0;
}
.dropdown button {
  width: 100%;
  background-color: transparent;
  color: #333;
  padding: 10px;
  cursor: pointer;
  border: none;
}
.dropdown button:hover {
  background-color: #f0f0f0;
}

/* Main content */
.main-content {
  max-width: 600px;
  margin: 2rem auto;
  padding: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* Account card styling */
.account-card {
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 100%;
}

.section-title {
  font-size: 1.8rem;
  font-weight: bold;
  text-align: center;
  margin-bottom: 1.5rem;
}

.info-grid {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.info-item label {
  flex: 1;
  font-weight: bold;
  color: #1f2937;
}

.info-item input {
  flex: 2;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
}

.action-buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
}

button {
  background-color: #4f46e5;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #3730a3;
}
</style>
