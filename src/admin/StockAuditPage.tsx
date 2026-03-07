import { useEffect, useState } from "react";
import axios from "axios";

function StockAuditPage(){

const [parts,setParts] = useState<any[]>([]);
const [actual,setActual] = useState<{[key:number]:number}>({});

useEffect(()=>{

axios.get("/api/admin/inventory")
.then(res=>setParts(res.data));

},[]);

const submitAudit = async(partId:number)=>{

await axios.post("/api/admin/stock-audit",{
part_id: partId,
actual_quantity: actual[partId]
});

alert("Kiểm kê xong");

};

return(

<div>

<h2>Kiểm kê kho</h2>

<table>

<thead>
<tr>
<th>Linh kiện</th>
<th>Tồn hệ thống</th>
<th>Kiểm kê thực tế</th>
<th>Chênh lệch</th>
<th></th>
</tr>
</thead>

<tbody>

{parts.map(p=>{

const diff = (actual[p.id] || 0) - p.quantity;

return(

<tr key={p.id}>

<td>{p.name}</td>

<td>{p.quantity}</td>

<td>

<input
type="number"
onChange={(e)=>setActual({
...actual,
[p.id]: Number(e.target.value)
})}
/>

</td>

<td style={{color: diff !==0 ? "red":"black"}}>
{diff}
</td>

<td>

<button onClick={()=>submitAudit(p.id)}>
Lưu
</button>

</td>

</tr>

);

})}

</tbody>

</table>

</div>

);

}

export default StockAuditPage;