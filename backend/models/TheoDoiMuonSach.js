// models/TheoDoiMuonSach.js
const mongoose = require('mongoose');

const theoDoiMuonSachSchema = new mongoose.Schema({
    MaDocGia: { type: mongoose.Schema.Types.ObjectId, ref: 'DocGia', required: true },
    MaSach: { type: mongoose.Schema.Types.ObjectId, ref: 'Sach', required: true }, 
    NgayMuon: { type: Date, required: true },
    NgayTra: { type: Date, required: true },
    TrangThai: { type: String, enum: ['Chờ duyệt', 'Đang mượn', 'Đã trả'], default: 'Chờ duyệt' }
});

module.exports = mongoose.model('TheoDoiMuonSach', theoDoiMuonSachSchema);
