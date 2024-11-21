// routes/nhaxuatban.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const NhaXuatBan = require('../models/NhaXuatBan');
const authorize = require('../middleware/authorize');
const Sach = require('../models/Sach');

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

        // Kiểm tra xem NXB có sách nào liên quan không
        const isPublisherUsed = await Sach.find({ id });
        if (isPublisherUsed) {
            return res.status(400).json({
                message: 'Không thể xóa Nhà Xuất Bản vì đang có sách thuộc NXB này',
            });
        }

        // Xóa NXB nếu không có sách liên quan
        const nxbXoa = await NhaXuatBan.findByIdAndDelete(id);
        if (!nxbXoa) {
            return res.status(404).json({ message: 'Không tìm thấy Nhà Xuất Bản' });
        }

        res.json({ message: 'Nhà Xuất Bản đã được xóa' });
    } catch (error) {
        console.error('Error deleting publisher:', error);
        res.status(500).json({ message: 'Lỗi khi xóa Nhà Xuất Bản' });
    }
});


module.exports = router;
