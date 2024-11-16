// models/NhanVien.js
const mongoose = require('mongoose');

const nhanVienSchema = new mongoose.Schema({
    HoTenNV: { type: String, required: true },
    Password: { type: String, required: true },
    ChucVu: { type: String, required: true },
    DiaChi: { type: String },
    SoDienThoai: { type: String, required: true, unique: true },
    Role: { type: String, required: true, default: 'admin'}
});

module.exports = mongoose.model('NhanVien', nhanVienSchema);
