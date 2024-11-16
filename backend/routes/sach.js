// routes/sach.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Sach = require('../models/Sach');
const authorize = require('../middleware/authorize');
const NhaXuatBan = require("../models/NhaXuatBan");


// Liệt kê tất cả các sách
router.get('/', auth, authorize(['admin', 'user']), async (req, res) => {
    try {
        const danhSachSach = await Sach.find();
        res.json(danhSachSach);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy danh sách sách' });
    }
});

// Tìm kiếm sách theo tên
router.get('/timkiem/tensach', auth, authorize(['admin', 'user']), async (req, res) => {
    try {
        const { TenSach } = req.query;
        const ketQua = await Sach.find({ TenSach: { $regex: TenSach, $options: 'i' } });
        res.json(ketQua);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi tìm sách theo tên' });
    }
});

// Tìm kiếm sách theo tác giả
router.get('/timkiem/tacgia', auth, authorize(['admin', 'user']), async (req, res) => {
    try {
        const { TacGia } = req.query;
        const ketQua = await Sach.find({ TacGia: { $regex: TacGia, $options: 'i' } });
        res.json(ketQua);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi tìm sách theo tác giả' });
    }
});

// Tìm kiếm sách theo nhà xuất bản
router.get('/timkiem/nxb', auth, authorize(['admin', 'user']), async (req, res) => {
    try {
        const { MaNXB } = req.query;
        const ketQua = await Sach.find({ MaNXB });
        res.json(ketQua);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi tìm sách theo nhà xuất bản' });
    }
});

// Thêm sách mới

router.post('/add', auth, authorize(['admin']), async (req, res) => {
    try {
        const { TenSach, DonGia, SoQuyen, NamXuatBan, TenNXB, TacGia } = req.body;

        // Tìm mã nhà xuất bản từ tên nhà xuất bản
        const nhaXuatBan = await NhaXuatBan.findOne({ TenNXB });
        
        if (!nhaXuatBan) {
            return res.status(404).json({ message: 'Không tìm thấy nhà xuất bản' });
        }

        // Tạo sách mới với mã nhà xuất bản
        const sachMoi = new Sach({
            TenSach,
            DonGia,
            SoQuyen,
            NamXuatBan,
            MaNXB: nhaXuatBan._id, // Sử dụng _id của nhà xuất bản tìm được
            TacGia
        });

        await sachMoi.save();
        res.json({ message: 'Sách đã được thêm' });
    } catch (error) {
        console.error("Lỗi khi thêm sách:", error);
        res.status(500).json({ message: 'Lỗi khi thêm sách' });
    }
});


// Sửa thông tin sách
router.put('/edit/:id', auth, authorize(['admin']), async (req, res) => {
    try {
        const { id } = req.params;
        const { TenSach, DonGia, SoQuyen, NamXuatBan, TacGia, TenNXB } = req.body;

        // Tìm Nhà Xuất Bản dựa trên TenNXB
        const nhaXuatBan = await NhaXuatBan.findOne({ TenNXB });

        // Nếu không tìm thấy NXB, trả về lỗi
        if (!nhaXuatBan) {
            return res.status(404).json({ message: 'Không tìm thấy Nhà Xuất Bản với tên đã cho' });
        }

        // Lấy MaNXB từ NXB tìm thấy
        const MaNXB = nhaXuatBan._id;

        // Cập nhật thông tin sách với MaNXB mới
        const sachCapNhat = await Sach.findByIdAndUpdate(
            id,
            { TenSach, DonGia, SoQuyen, NamXuatBan, MaNXB, TacGia },
            { new: true }
        );

        if (!sachCapNhat) {
            return res.status(404).json({ message: 'Không tìm thấy sách' });
        }

        res.json({ message: 'Sách đã được cập nhật', sach: sachCapNhat });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi khi cập nhật sách' });
    }
});


// Xóa sách
router.delete('/delete/:id', auth, authorize(['admin']), async (req, res) => {
    try {
        const { id } = req.params;
        const sachXoa = await Sach.findByIdAndDelete(id);
        if (!sachXoa) {
            return res.status(404).json({ message: 'Không tìm thấy sách' });
        }
        res.json({ message: 'Sách đã được xóa' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi xóa sách' });
    }
});

module.exports = router;
