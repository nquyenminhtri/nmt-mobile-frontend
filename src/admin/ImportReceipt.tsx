import { useEffect, useState } from "react";
import axios from "axios";
import "./ImportReceipt.css";

function ImportReceipt(){
const [searchParts,setSearchParts] = useState<{[key:number]:string}>({});
const [parts,setParts] = useState<any[]>([]);
const [supplier,setSupplier] = useState("");
const [note,setNote] = useState("");

const [items,setItems] = useState<any[]>([
{part_id:"",quantity:"",price:""}
]);

useEffect(()=>{

axios.get("https://nmt-mobile-backend.onrender.com/api/parts")
.then(res=>setParts(res.data));

},[]);


const addRow = ()=>{

setItems([...items,{part_id:"",quantity:"",price:""}]);

};


const handleChange = (index:number,field:string,value:any)=>{

const updated = [...items];

updated[index][field] = value;

setItems(updated);

};


const handleSubmit = async()=>{

await axios.post(
"https://nmt-mobile-backend.onrender.com/api/import-receipts",
{
supplier,
note,
items
}
);

alert("Tạo phiếu nhập thành công");

};


return(

<div>

<div className="import-wrapper">
<div className="import-container">

<h2 className="import-title">Tạo Phiếu Nhập</h2>

<div className="import-form">

<input
placeholder="Nhà cung cấp"
value={supplier}
onChange={(e)=>setSupplier(e.target.value)}
/>

<textarea
placeholder="Ghi chú"
value={note}
onChange={(e)=>setNote(e.target.value)}
/>

</div>

<table className="import-table">

<thead>

<tr>
<th>Linh kiện</th>
<th>Số lượng</th>
<th>Giá</th>
</tr>

</thead>

<tbody>

{items.map((item,index)=>(

<tr key={index}>

<td>

<div className="part-search">

<input
type="text"
placeholder="Tìm linh kiện..."
value={searchParts[index] || ""}
onChange={(e)=>{

setSearchParts({
...searchParts,
[index]: e.target.value
});

}}
/>

{searchParts[index] && (

<div className="part-dropdown">

{parts
.filter(p =>
p.name.toLowerCase().includes(
(searchParts[index] || "").toLowerCase()
)
)
.slice(0,6)
.map(p=>(

<div
key={p.id}
className="part-item"
onClick={()=>{

handleChange(index,"part_id",p.id);

setSearchParts({
...searchParts,
[index]: p.name
});

}}
>

{p.name} (còn {p.quantity})

</div>

))}

</div>

)}

</div>

</td>

<td>

<input
type="number"
value={item.quantity}
onChange={(e)=>handleChange(index,"quantity",e.target.value)}
/>

</td>

<td>

<input
type="number"
value={item.price}
onChange={(e)=>handleChange(index,"price",e.target.value)}
/>

</td>

</tr>

))}

</tbody>

</table>

<div className="import-buttons">

<button className="add-btn" onClick={addRow}>
+ Thêm linh kiện
</button>

<button className="submit-btn" onClick={handleSubmit}>
Tạo phiếu nhập
</button>

</div>
</div>
</div>
</div>

);

}

export default ImportReceipt;