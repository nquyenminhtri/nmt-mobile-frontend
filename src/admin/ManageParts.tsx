import { useEffect,useState } from "react";
import axios from "axios";
import "./ManageParts.css";

function ManageParts(){

const [parts,setParts] = useState<any[]>([]);
const [name,setName] = useState("");
const [price,setPrice] = useState("");
const [quantity,setQuantity] = useState("");

const fetchParts = async()=>{

const res = await axios.get(
"https://nmt-mobile-backend.onrender.com/api/admin/parts"
);

setParts(res.data);

};

useEffect(()=>{
fetchParts();
},[]);

const addPart = async()=>{

await axios.post(
"https://nmt-mobile-backend.onrender.com/api/admin/parts",
{
name,
price,
quantity
}
);

setName("");
setPrice("");
setQuantity("");

fetchParts();

};

const deletePart = async(id:number)=>{

if(!window.confirm("Xóa linh kiện?")) return;

await axios.delete(
`https://nmt-mobile-backend.onrender.com/api/admin/parts/${id}`
);

fetchParts();

};

return(

<div className="parts-wrapper">

<h2 className="parts-title">Quản lý linh kiện</h2>

<div className="parts-form">

<input
className="parts-input"
placeholder="Tên linh kiện"
value={name}
onChange={(e)=>setName(e.target.value)}
/>

<input
className="parts-input"
placeholder="Giá"
value={price}
onChange={(e)=>setPrice(e.target.value)}
/>

<input
className="parts-input"
placeholder="Số lượng"
value={quantity}
onChange={(e)=>setQuantity(e.target.value)}
/>

<button className="add-btn" onClick={addPart}>
Thêm
</button>

</div>
<div className="table-scroll">

<table className="parts-table" border={1}>

<thead>
<tr>
<th>ID</th>
<th>Tên</th>
<th>Giá</th>
<th>Số lượng</th>
<th></th>
</tr>
</thead>

<tbody>

{parts.map(p=>(

<tr key={p.id}>

<td>{p.id}</td>

<td>{p.name}</td>

<td>{p.price}</td>

<td>{p.quantity}</td>

<td>

<button
className="delete-btn"
onClick={()=>deletePart(p.id)}
>
Xóa
</button>

</td>

</tr>

))}

</tbody>

</table>
</div>
</div>

);

}

export default ManageParts;