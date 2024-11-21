// routes/NhanVien.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const auth = require('../middleware/auth');
const NhanVien = require('../models/NhanVien');
const authorize = require('../middleware/authorize');

// Liệt kê danh sách nhân viên
router.get('/', auth, authorize(['admin']), async (req, res) => {
    try {
        const danhSachNhanVien = await NhanVien.find();
        res.json(danhSachNhanVien);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy danh sách nhân viên' });
    }
});

// Tìm kiếm nhân viên theo tên
router.get('/timkiem/ten', auth, authorize(['admin']), async (req, res) => {
    try {
        const { Ten } = req.query;
        const ketQua = await NhanVien.find({ Ten: { $regex: Ten } });
        res.json(ketQua);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi tìm nhân viên theo tên' });
    }
});

// Tìm kiếm nhân viên theo số điện thoại
router.get('/timkiem/sodienthoai', auth, authorize(['admin']), async (req, res) => {
    try {
        const { DienThoai } = req.query;
        const ketQua = await NhanVien.find({ DienThoai });
        res.json(ketQua);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi tìm nhân viên theo số điện thoại' });
    }
});

// Tạo nhân viên mới
router.post('/add', auth, authorize(['admin']), async (req, res) => {
    try {
        // Hash mật khẩu trước khi lưu vào cơ sở dữ liệu
        const { HoTenNV, Password, ChucVu, DiaChi, SoDienThoai } = req.body;
        const hashedPassword = await bcrypt.hash(Password, 10);

        // Tạo nhân viên mới với mật khẩu đã được hash
        const NhanVienMoi = new NhanVien({
            HoTenNV, ChucVu, DiaChi, SoDienThoai,
            Password: hashedPassword
        });

        await NhanVienMoi.save();
        res.json({ message: 'Nhân viên đã được tạo' });
    } catch (error) {
        console.error("Lỗi khi tạo nhân viên:", error);
        res.status(500).json({ message: 'Lỗi khi tạo nhân viên' });
    }
});

// Sửa thông tin nhân viên
router.put('/edit/:id', auth, authorize(['admin']), async (req, res) => {
    try {
        const { id } = req.params;
        const { Password, ...otherFields } = req.body; // Tách riêng Password để xử lý riêng

        let updatedFields = { ...otherFields };

        // Kiểm tra nếu Password được gửi và không rỗng
        if (Password && Password.trim() !== "") {
            const hashedPassword = await bcrypt.hash(Password, 10);
            updatedFields.Password = hashedPassword; // Gắn mật khẩu đã băm vào updatedFields
        }
        const NhanVienCapNhat = await NhanVien.findByIdAndUpdate(id, updatedFields, { new: true });
        res.json({ message: 'Thông tin nhân viên đã được cập nhật', NhanVien: NhanVienCapNhat });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi cập nhật nhân viên' });
    }
});

// Xóa nhân viên
router.delete('/delete/:id', auth, authorize(['admin']), async (req, res) => {
    try {
        const { id } = req.params;
        await NhanVien.findByIdAndDelete(id);
        res.json({ message: 'nhân viên đã được xóa' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi xóa nhân viên' });
    }
});

module.exports = router;
