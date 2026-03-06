import { useEffect, useState } from "react";
import axios from "axios";
import "./ManageStaff.css";

function ManageStaff() {

const [users,setUsers] = useState<any[]>([]);
const [search,setSearch] = useState("");

const [showModal,setShowModal] = useState(false);
const [editingUser,setEditingUser] = useState<any>(null);

const [form,setForm] = useState({
username:"",
password:"",
full_name:"",
phone_number:"",
email:"",
role:"staff"
});

const token = localStorage.getItem("token");


const fetchUsers = async () => {

const res = await axios.get(
"https://nmt-mobile-backend.onrender.com/api/admin/users",
{headers:{Authorization:token}}
);

setUsers(res.data);

};


useEffect(()=>{
fetchUsers();
},[]);



const deleteUser = async(id:number)=>{

if(!window.confirm("Xoá nhân viên này ?")) return;

await axios.delete(
`https://nmt-mobile-backend.onrender.com/api/admin/users/${id}`,
{headers:{Authorization:token}}
);

setUsers(users.filter(u=>u.id!==id));

};



const changePassword = async(id:number)=>{

const password = prompt("Nhập mật khẩu mới");

if(!password) return;

await axios.put(
`https://nmt-mobile-backend.onrender.com/api/admin/users/change-password/${id}`,
{password},
{headers:{Authorization:token}}
);

alert("Đổi mật khẩu thành công");

};



const openAddModal = ()=>{

setEditingUser(null);

setForm({
username:"",
password:"",
full_name:"",
phone_number:"",
email:"",
role:"staff"
});

setShowModal(true);

};



const editUser = (user:any)=>{

setEditingUser(user);

setForm({
username:user.username,
password:"",
full_name:user.full_name,
phone_number:user.phone_number,
email:user.email,
role:user.role
});

setShowModal(true);

};



const handleChange = (e:any)=>{
setForm({...form,[e.target.name]:e.target.value});
};



const saveUser = async () => {

try {

if(editingUser){

await axios.put(
`https://nmt-mobile-backend.onrender.com/api/admin/users/${editingUser.id}`,
form,
{headers:{Authorization:token}}
);

}else{

await axios.post(
"https://nmt-mobile-backend.onrender.com/api/admin/users",
form,
{headers:{Authorization:token}}
);

}

setShowModal(false);
fetchUsers();

} catch(err: any){

if(err.response){
alert(err.response.data.message);
}else{
alert("Lỗi server");
}

}

};


const filteredUsers = users.filter((u)=>
u.username.toLowerCase().includes(search.toLowerCase()) ||
u.full_name.toLowerCase().includes(search.toLowerCase())
);


return(

<div className="manage-wrapper">

<div className="manage-container">

<h2 className="page-title">Danh sách nhân viên</h2>

<div className="top-bar">

<input
placeholder="Tìm nhân viên..."
value={search}
onChange={(e)=>setSearch(e.target.value)}
/>

<button className="add-btn" onClick={openAddModal}>
+ Thêm nhân viên
</button>

</div>


<div className="table-wrapper">

<table>

<thead>
<tr>
<th>ID</th>
<th>Username</th>
<th>Tên</th>
<th>SĐT</th>
<th>Email</th>
<th>Vai trò</th>
<th>Hành động</th>
</tr>
</thead>


<tbody>

{filteredUsers.map((user)=>(
<tr key={user.id}>

<td>{user.id}</td>
<td>{user.username}</td>
<td>{user.full_name}</td>
<td>{user.phone_number}</td>
<td>{user.email}</td>

<td>
<span className={user.role==="admin"?"role-admin":"role-staff"}>
{user.role}
</span>
</td>

<td>

<button className="edit-btn" onClick={()=>editUser(user)}>
Sửa
</button>

<button className="delete-btn" onClick={()=>deleteUser(user.id)}>
Xoá
</button>

<button className="pass-btn" onClick={()=>changePassword(user.id)}>
Đổi mật khẩu
</button>

</td>

</tr>
))}

</tbody>

</table>

</div>


{showModal && (

<div className="modal">

<div className="modal-content">

<h3>{editingUser ? "Sửa nhân viên" : "Thêm nhân viên"}</h3>

<input
name="username"
placeholder="Username"
value={form.username}
onChange={handleChange}
/>

{!editingUser && (
<input
name="password"
placeholder="Password"
type="password"
value={form.password}
onChange={handleChange}
/>
)}

<input
name="full_name"
placeholder="Tên"
value={form.full_name}
onChange={handleChange}
/>

<input
name="phone_number"
placeholder="SĐT"
value={form.phone_number}
onChange={handleChange}
/>

<input
name="email"
placeholder="Email"
value={form.email}
onChange={handleChange}
/>

<select name="role" value={form.role} onChange={handleChange}>
<option value="staff">staff</option>
<option value="admin">admin</option>
</select>

<div className="modal-buttons">

<button onClick={saveUser}>Lưu</button>

<button onClick={()=>setShowModal(false)}>Huỷ</button>

</div>

</div>

</div>

)}

</div>

</div>

);

}

export default ManageStaff;