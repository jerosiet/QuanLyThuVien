// routes/nhaxuatban.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const NhaXuatBan = require('../models/NhaXuatBan');
const authorize = require('../middleware/authorize');

// Liệt kê danh sách nhà xuất bản
router.get('/', auth, authorize(['admin', 'user']), async (req, res) => {
    try {
        const danhSachNhaXuatBan = await NhaXuatBan.find();
        res.json(danhSachNhaXuatBan);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy danh sách nhà xuất bản' });
    }
});

// Thêm nhà xuất bản mới
router.post('/add', auth, authorize(['admin']), async (req, res) => {
    try {
        const nhaXuatBanMoi = new NhaXuatBan(req.body);
        await nhaXuatBanMoi.save();
        res.json({ message: 'Nhà xuất bản đã được thêm' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi thêm nhà xuất bản' });
    }
});

// Sửa thông tin nhà xuất bản
router.put('/edit/:id', auth, authorize(['admin']), async (req, res) => {
    try {
        const { id } = req.params;
        const nhaXuatBanCapNhat = await NhaXuatBan.findByIdAndUpdate(id, req.body, { new: true });
        res.json({ message: 'Thông tin nhà xuất bản đã được cập nhật', nhaXuatBan: nhaXuatBanCapNhat });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi cập nhật nhà xuất bản' });
    }
});

// Xóa nhà xuất bản
router.delete('/delete/:id', auth, authorize(['admin']), async (req, res) => {
    try {
        const { id } = req.params;
        await NhaXuatBan.findByIdAndDelete(id);
        res.json({ message: 'Nhà xuất bản đã được xóa' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi xóa nhà xuất bản' });
    }
});

module.exports = router;
