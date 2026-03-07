import { useEffect, useState } from "react";
import axios from "axios";
import "./ImportReceipt.css";

function ImportReceipt(){

type ImportItem = {
part_id: number | "";
quantity: number | "";
price: number | "";
};

const [searchParts,setSearchParts] = useState<{[key:number]:string}>({});
const [showDropdown,setShowDropdown] = useState<{[key:number]:boolean}>({});
const [parts,setParts] = useState<any[]>([]);
const [supplier,setSupplier] = useState("");
const [note,setNote] = useState("");

const [items,setItems] = useState<ImportItem[]>([
{part_id:"",quantity:"",price:""}
]);

const addRow = ()=>{
    setSupplier("");
setNote("");

setItems(prev=>[
...prev,
{part_id:"",quantity:"",price:""}
]);
};

useEffect(()=>{

axios.get("https://nmt-mobile-backend.onrender.com/api/parts")
.then(res=>setParts(res.data));

},[]);




const handleChange = (
index:number,
field:keyof ImportItem,
value:any
)=>{

const updated = [...items];

updated[index][field] = value;

setItems(updated);

};


const handleSubmit = async()=>{

const cleanItems = items
.filter(i => i.part_id && i.quantity && i.price)
.map(i => ({
part_id: Number(i.part_id),
quantity: Number(i.quantity),
price: Number(i.price)
}));
if(!supplier){
alert("Nhập nhà cung cấp");
return;
}

if(cleanItems.length === 0){
alert("Thêm ít nhất 1 linh kiện");
return;
}
await axios.post(
"https://nmt-mobile-backend.onrender.com/api/import-receipts",
{
supplier,
note,
items: cleanItems
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

setShowDropdown({
...showDropdown,
[index]: true
});

}}
/>

{showDropdown[index] && searchParts[index] && (

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

setShowDropdown({
...showDropdown,
[index]: false
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
placeholder="Nhập giá"
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