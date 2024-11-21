const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const NhanVien = require('../models/NhanVien');
const DocGia = require('../models/DocGia');

exports.register = async (req, res) => {
    try {
        const { HoLot, Ten, NgaySinh, Phai, DiaChi, SoDienThoai, Password } = req.body;

        // Kiểm tra nếu số điện thoại đã tồn tại
        const existingUser = await DocGia.findOne({ SoDienThoai });
        const existingAdmin = await NhanVien.findOne({ SoDienThoai });

        if (existingUser || existingAdmin) {
            return res.status(400).json({ message: 'Số điện thoại đã được sử dụng' });
        }
        if (Phai!== 'Nam' && Phai!== 'Nữ') {
            return res.status(400).json({ message: 'Phái phải là Nam hoặc Nữ' });
        }
        const minDate = new Date("1924-01-01");
        if (new Date(NgaySinh) <= minDate) {
            return res.status(400).json({ message: 'Ngày sinh phải lớn hơn 1920' });
        }
        // Mã hóa mật khẩu
        const hashedPassword = await bcrypt.hash(Password, 10);
        // Tạo độc giả mới
        const newDocGia = new DocGia({
            HoLot,
            Ten,
            NgaySinh,
            Phai,
            DiaChi,
            SoDienThoai,
            Password: hashedPassword,
            Role: 'user' // Thiết lập role là 'user' cho độc giả
        });

        // Lưu độc giả vào database
        await newDocGia.save();

        // Tạo token với vai trò user
        const token = jwt.sign(
            { id: newDocGia._id, role: newDocGia.Role },
            process.env.JWT_SECRET,
            { expiresIn: '30d' }
        );

        // Trả về token và role
        res.status(201).json({ message: 'Đăng ký độc giả thành công', token, role: newDocGia.Role });
    } catch (error) {
        console.error("Lỗi khi đăng ký độc giả:", error);
        res.status(500).json({ error: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { SoDienThoai, Password } = req.body;

        // Kiểm tra nếu số điện thoại có trong bảng NhanVien
        let user = await NhanVien.findOne({ SoDienThoai });
        let role = 'admin';

        if (!user) {
            // Nếu không tìm thấy trong bảng NhanVien, kiểm tra trong bảng DocGia
            user = await DocGia.findOne({ SoDienThoai });
            role = 'user';
        }

        if (!user) {
            return res.status(400).json({ message: 'Không tìm thấy tài khoản' });
        }

        // Kiểm tra mật khẩu
        const isMatch = await bcrypt.compare(Password, user.Password);
        if (!isMatch) {
            return res.status(500).json({ message: 'Mật khẩu không đúng' });
        }

        // Tạo token với vai trò người dùng
        const token = jwt.sign(
            { id: user._id, role },
            process.env.JWT_SECRET,
            { expiresIn: '30d' }
        );

        // Trả về token, role và thông tin người dùng
        res.json({ token, role, user });
    } catch (error) {
        console.error("Lỗi khi đăng nhập:", error);
        res.status(500).json({ error: error.message });
    }
};