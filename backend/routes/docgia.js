// routes/docgia.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const auth = require('../middleware/auth');
const DocGia = require('../models/DocGia');
const authorize = require('../middleware/authorize');


// Liệt kê danh sách độc giả
router.get('/', auth, authorize(['admin', 'user']), async (req, res) => {
    try {
        const danhSachDocGia = await DocGia.find();
        res.json(danhSachDocGia);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy danh sách độc giả' });
    }
});

// Tìm kiếm độc giả theo tên
router.get('/timkiem/ten', auth, authorize(['admin', 'user']), async (req, res) => {
    try {
        const { Ten } = req.query;
        const ketQua = await DocGia.find({ Ten:  Ten });
        res.json(ketQua);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi tìm độc giả theo tên' });
    }
});

// Tìm kiếm độc giả theo số điện thoại
router.get('/timkiem/sodienthoai', auth, authorize(['admin', 'user']), async (req, res) => {
    try {
        const { DienThoai } = req.query;
        const ketQua = await DocGia.find({ DienThoai });
        res.json(ketQua);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi tìm độc giả theo số điện thoại' });
    }
});

// Tạo độc giả mới
router.post('/add', auth, authorize(['admin']), async (req, res) => {
    try {
        const docGiaMoi = new DocGia(req.body);
        const hashedPassword = await bcrypt.hash(docGiaMoi.Password, 10);
        docGiaMoi.Password = hashedPassword;
        await docGiaMoi.save();
        res.json({ message: 'Độc giả đã được tạo' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi tạo độc giả' });
    }
});



router.put('/edit/:id', auth, authorize(['admin', 'user']), async (req, res) => {
    try {
        const { id } = req.params;
        const { Password, ...otherFields } = req.body; // Tách riêng Password để xử lý riêng

        let updatedFields = { ...otherFields };

        // Kiểm tra nếu Password được gửi và không rỗng
        if (Password && Password.trim() !== "") {
            const hashedPassword = await bcrypt.hash(Password, 10);
            updatedFields.Password = hashedPassword; // Gắn mật khẩu đã băm vào updatedFields
        }

        const docGiaCapNhat = await DocGia.findByIdAndUpdate(id, updatedFields, { new: true });

        res.json({ message: 'Thông tin độc giả đã được cập nhật', docGia: docGiaCapNhat });
    } catch (error) {
        console.error("Lỗi khi cập nhật độc giả:", error);
        res.status(500).json({ message: 'Lỗi khi cập nhật độc giả' });
    }
});


// Xóa độc giả
router.delete('/delete/:id', auth, authorize(['admin']), async (req, res) => {
    try {
        const { id } = req.params;
        await DocGia.findByIdAndDelete(id);
        res.json({ message: 'Độc giả đã được xóa' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi xóa độc giả' });
    }
});

module.exports = router;
