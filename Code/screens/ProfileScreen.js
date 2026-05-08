import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView, TextInput, Modal, Image, KeyboardAvoidingView, Platform, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { AuthContext } from '../context/AuthContext';
import { COLORS, SHADOWS } from '../utils/constants';

// --- QUAN TRỌNG: ĐƯA PASSWORD INPUT RA NGOÀI ĐỂ SỬA LỖI MẤT BÀN PHÍM ---
const PasswordInput = ({ label, placeholder, value, onChangeText, showPassword, setShowPassword }) => (
  <View style={styles.inputWrapper}>
    <Text style={styles.inputLabel}>{label}</Text>
    <View style={styles.passwordInputContainer}>
      <Ionicons name="lock-closed-outline" size={20} color={COLORS.gray} style={styles.inputIcon} />
      <TextInput
        style={styles.passwordInput}
        placeholder={placeholder}
        placeholderTextColor="#CBD5E1"
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={!showPassword}
        autoCapitalize="none"
      />
      <TouchableOpacity style={styles.eyeButton} onPress={() => setShowPassword(!showPassword)}>
        <Ionicons name={showPassword ? "eye-outline" : "eye-off-outline"} size={22} color={COLORS.gray} />
      </TouchableOpacity>
    </View>
  </View>
);

export default function ProfileScreen({ navigation }) {
  const { user, logout, updateUserInfo, deleteAccount } = useContext(AuthContext);
  const [modalVisible, setModalVisible] = useState(false);
  const [editType, setEditType] = useState(''); 
  const [newName, setNewName] = useState('');
  
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleUpdate = async () => {
    if (editType === 'name') {
      if (newName.trim().length < 2) return Alert.alert("Lỗi", "Tên quá ngắn");
    }

    if (editType === 'password') {
      if (oldPassword !== user.password) {
        return Alert.alert("Lỗi", "Mật khẩu hiện tại không chính xác!");
      }
      if (newPassword.trim().length < 6) {
        return Alert.alert("Lỗi", "Mật khẩu mới phải từ 6 ký tự trở lên!");
      }
      if (newPassword !== confirmPassword) {
        return Alert.alert("Lỗi", "Mật khẩu nhập lại không khớp!");
      }
      if (oldPassword === newPassword) {
        return Alert.alert("Lỗi", "Mật khẩu mới phải khác mật khẩu cũ!");
      }
    }

    const result = await updateUserInfo(
      editType === 'name' ? newName : user.fullName,
      editType === 'password' ? newPassword : user.password,
      user.avatar
    );

    if (result.success) {
      Alert.alert("Thành công", "Đã cập nhật thông tin thành công!");
      setModalVisible(false);
    }
  };

  const openEdit = (type) => {
    setEditType(type);
    setNewName(user?.fullName);
    setOldPassword(''); 
    setNewPassword(''); 
    setConfirmPassword('');
    setShowPassword(false);
    setModalVisible(true);
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "CẢNH BÁO NGUY HIỂM",
      "Hành động này sẽ xóa vĩnh viễn tài khoản và toàn bộ lịch sử giao dịch. Bạn có chắc chắn muốn xóa?",
      [
        { text: "Hủy", style: "cancel" },
        { 
          text: "Xóa vĩnh viễn", 
          style: "destructive", 
          onPress: async () => {
            const res = await deleteAccount();
            if (res && res.success) {
              Alert.alert("Thông báo", "Tài khoản của bạn đã bị xóa.");
            }
          }
        }
      ]
    );
  };

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) return Alert.alert("Lỗi", "Cần cấp quyền truy cập ảnh.");

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true, aspect: [1, 1], quality: 0.5,
    });

    if (!result.canceled) {
      const updateRes = await updateUserInfo(user.fullName, user.password, result.assets[0].uri);
      if (updateRes.success) Alert.alert("Thành công", "Đã thay đổi ảnh đại diện!");
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primaryDark} />
      <View style={styles.headerBackground} />

      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <Text style={styles.pageTitle}>Hồ sơ cá nhân</Text>

          <View style={styles.profileCard}>
            <TouchableOpacity style={styles.avatarContainer} onPress={pickImage} activeOpacity={0.8}>
              {user?.avatar ? (
                <Image source={{ uri: user.avatar }} style={styles.avatarImage} />
              ) : (
                <Text style={styles.avatarText}>{user?.fullName?.charAt(0).toUpperCase()}</Text>
              )}
              <View style={styles.cameraBadge}>
                <Ionicons name="camera" size={14} color="#fff" />
              </View>
            </TouchableOpacity>
            
            <Text style={styles.userName}>{user?.fullName}</Text>
            <Text style={styles.userEmail}>{user?.username}</Text>
          </View>

          <View style={styles.menuGroup}>
            <Text style={sectionTitleStyle}>TÀI KHOẢN & BẢO MẬT</Text>
            <View style={[styles.cardBox, styles.cardBoxLight]}>
              <TouchableOpacity style={styles.menuItem} onPress={() => openEdit('name')}>
                <View style={[styles.iconBox, {backgroundColor: '#E0F2FE'}]}><Ionicons name="person" size={20} color="#0284C7" /></View>
                <Text style={styles.menuText}>Sửa thông tin cá nhân</Text>
                <Ionicons name="chevron-forward" size={20} color="#CBD5E1" />
              </TouchableOpacity>
              <View style={[styles.divider, { backgroundColor: '#E2E8F0' }]} />
              <TouchableOpacity style={styles.menuItem} onPress={() => openEdit('password')}>
                <View style={[styles.iconBox, {backgroundColor: '#FEF3C7'}]}><Ionicons name="key" size={20} color="#D97706" /></View>
                <Text style={styles.menuText}>Đổi mật khẩu bảo mật</Text>
                <Ionicons name="chevron-forward" size={20} color="#CBD5E1" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.menuGroup}>
            <Text style={sectionTitleStyle}>CÀI ĐẶT & HỖ TRỢ</Text>
            <View style={styles.cardBox}>
              <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
                <View style={[styles.iconBox, {backgroundColor: '#DCFCE7'}]}>
                  <Ionicons name="notifications" size={20} color={COLORS.income} />
                </View>
                <Text style={styles.menuText}>Thông báo đẩy</Text>
                <Text style={styles.statusText}>Bật</Text>
                <Ionicons name="chevron-forward" size={20} color="#CBD5E1" />
              </TouchableOpacity>
              <View style={styles.divider} />
              <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Guide')} activeOpacity={0.7}>
                <View style={[styles.iconBox, {backgroundColor: '#F3E8FF'}]}>
                  <Ionicons name="book" size={20} color="#9333EA" />
                </View>
                <Text style={styles.menuText}>Hướng dẫn sử dụng</Text>
                <Ionicons name="chevron-forward" size={20} color="#CBD5E1" />
              </TouchableOpacity>
              <View style={styles.divider} />
              <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('PrivacyPolicy', { title: 'Điều khoản sử dụng' })} activeOpacity={0.7}>
                <View style={[styles.iconBox, {backgroundColor: '#F1F5F9'}]}>
                  <Ionicons name="document-text" size={20} color="#475569" />
                </View>
                <Text style={styles.menuText}>Điều khoản sử dụng</Text>
                <Ionicons name="chevron-forward" size={20} color="#CBD5E1" />
              </TouchableOpacity>
              <View style={styles.divider} />
              <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('PrivacyPolicy', { title: 'Chính sách bảo mật' })} activeOpacity={0.7}>
                <View style={[styles.iconBox, {backgroundColor: '#F1F5F9'}]}>
                  <Ionicons name="shield-checkmark" size={20} color="#475569" />
                </View>
                <Text style={styles.menuText}>Chính sách bảo mật</Text>
                <Ionicons name="chevron-forward" size={20} color="#CBD5E1" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.dangerZone}>
            <TouchableOpacity style={styles.logoutButton} onPress={logout} activeOpacity={0.8}>
              <Ionicons name="log-out-outline" size={22} color={COLORS.gray} />
              <Text style={styles.logoutLabel}>Đăng xuất an toàn</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteAccount} activeOpacity={0.8}>
              <Ionicons name="trash-outline" size={22} color={COLORS.expense} />
              <Text style={styles.deleteLabel}>Xóa tài khoản vĩnh viễn</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>

      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalBg}>
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.keyboardAvoidingView}>
            <View style={styles.modalContent}>
              <Text style={styles.modalHeader}>{editType === 'name' ? 'Chỉnh sửa họ tên' : 'Cập nhật mật khẩu'}</Text>
              {editType === 'name' && (
                <View style={styles.inputWrapper}>
                  <Text style={styles.inputLabel}>Họ và tên của bạn</Text>
                  <View style={styles.passwordInputContainer}>
                    <Ionicons name="person-outline" size={20} color={COLORS.gray} style={styles.inputIcon} />
                    <TextInput style={styles.passwordInput} placeholder="Nhập tên mới..." placeholderTextColor="#CBD5E1" value={newName} onChangeText={setNewName} autoFocus />
                  </View>
                </View>
              )}
              {editType === 'password' && (
                <View style={{maxHeight: 400}}>
                  <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
                    <PasswordInput label="Mật khẩu hiện tại" placeholder="Mật khẩu đang dùng" value={oldPassword} onChangeText={setOldPassword} showPassword={showPassword} setShowPassword={setShowPassword} />
                    <PasswordInput label="Mật khẩu mới" placeholder="Tối thiểu 6 ký tự" value={newPassword} onChangeText={setNewPassword} showPassword={showPassword} setShowPassword={setShowPassword} />
                    <PasswordInput label="Xác nhận mật khẩu" placeholder="Nhập lại mật khẩu" value={confirmPassword} onChangeText={setConfirmPassword} showPassword={showPassword} setShowPassword={setShowPassword} />
                  </ScrollView>
                </View>
              )}
              <View style={styles.modalActions}>
                <TouchableOpacity style={styles.btnCancel} onPress={() => setModalVisible(false)}><Text style={styles.btnCancelText}>Hủy</Text></TouchableOpacity>
                <TouchableOpacity style={styles.btnSave} onPress={handleUpdate}><Text style={styles.btnSaveText}>Lưu lại</Text></TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>
    </View>
  );
}

const sectionTitleStyle = { fontSize: 13, fontWeight: '800', color: COLORS.gray, marginBottom: 12, marginLeft: 12, letterSpacing: 1.2 };

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  headerBackground: { position: 'absolute', top: 0, left: 0, right: 0, height: 240, backgroundColor: COLORS.primaryDark, borderBottomLeftRadius: 35, borderBottomRightRadius: 35 },
  scrollContent: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 100 },
  pageTitle: { fontSize: 26, fontWeight: '900', color: COLORS.white, textAlign: 'center', marginBottom: 20 },
  profileCard: { backgroundColor: COLORS.white, borderRadius: 28, padding: 24, alignItems: 'center', marginBottom: 30, ...SHADOWS.medium },
  avatarContainer: { width: 96, height: 96, borderRadius: 48, backgroundColor: COLORS.primaryLight, justifyContent: 'center', alignItems: 'center', marginBottom: 16, borderWidth: 3, borderColor: '#F8FAFC', ...SHADOWS.light },
  avatarImage: { width: 90, height: 90, borderRadius: 45 },
  avatarText: { fontSize: 36, color: COLORS.primary, fontWeight: '900' },
  cameraBadge: { position: 'absolute', bottom: 0, right: 0, backgroundColor: COLORS.primaryDark, width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center', borderWidth: 3, borderColor: COLORS.white },
  userName: { fontSize: 24, fontWeight: '800', color: COLORS.dark, marginBottom: 4 },
  userEmail: { color: COLORS.gray, fontSize: 15, fontWeight: '500', marginBottom: 5 },
  menuGroup: { marginBottom: 25 },
  cardBox: { backgroundColor: COLORS.white, borderRadius: 24, paddingHorizontal: 16, ...SHADOWS.light },
  cardBoxLight: { backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#F1F5F9', elevation: 0, shadowOpacity: 0 },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 18 },
  divider: { height: 1, backgroundColor: '#F1F5F9', marginLeft: 56 },
  iconBox: { width: 44, height: 44, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
  menuText: { flex: 1, marginLeft: 16, fontSize: 16, fontWeight: '700', color: COLORS.dark },
  statusText: { fontSize: 15, color: COLORS.gray, fontWeight: '600', marginRight: 10 },
  dangerZone: { marginTop: 10 },
  logoutButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.white, paddingVertical: 18, borderRadius: 20, borderWidth: 1, borderColor: '#E2E8F0', marginBottom: 15 },
  logoutLabel: { color: COLORS.gray, fontWeight: '700', marginLeft: 8, fontSize: 16 },
  deleteButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FEF2F2', paddingVertical: 18, borderRadius: 20, borderWidth: 1, borderColor: '#FECACA' },
  deleteLabel: { color: COLORS.expense, fontWeight: '700', marginLeft: 8, fontSize: 16 },
  modalBg: { flex: 1, backgroundColor: 'rgba(15, 23, 42, 0.65)', justifyContent: 'center', alignItems: 'center' },
  keyboardAvoidingView: { width: '100%', justifyContent: 'center', alignItems: 'center' },
  modalContent: { width: '85%', backgroundColor: COLORS.white, borderRadius: 28, padding: 24, maxHeight: '85%', ...SHADOWS.large },
  modalHeader: { fontSize: 20, fontWeight: '900', color: COLORS.dark, marginBottom: 25, textAlign: 'center' },
  inputWrapper: { marginBottom: 20 },
  inputLabel: { fontSize: 14, fontWeight: '700', color: COLORS.gray, marginBottom: 8, marginLeft: 4 },
  passwordInputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8FAFC', borderRadius: 18, borderWidth: 1, borderColor: '#E2E8F0' },
  inputIcon: { marginLeft: 16 },
  passwordInput: { flex: 1, paddingVertical: 15, paddingHorizontal: 12, fontSize: 16, color: COLORS.dark, fontWeight: '500' },
  eyeButton: { padding: 16 },
  modalActions: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 },
  btnCancel: { flex: 1, paddingVertical: 16, alignItems: 'center', backgroundColor: '#F1F5F9', borderRadius: 16, marginRight: 8 },
  btnCancelText: { fontSize: 16, color: COLORS.gray, fontWeight: '800' },
  btnSave: { flex: 1, paddingVertical: 16, alignItems: 'center', backgroundColor: COLORS.primaryDark, borderRadius: 16, marginLeft: 8, ...SHADOWS.medium },
  btnSaveText: { color: COLORS.white, fontWeight: '800', fontSize: 16 }
});