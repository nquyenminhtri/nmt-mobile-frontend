import { useEffect, useState } from "react";
import axios from "axios";
import "./StockAuditPage.css";

function StockAuditPage(){

const [parts,setParts] = useState<any[]>([]);
const [actual,setActual] = useState<{[key:number]:number}>({});

useEffect(()=>{

axios.get("https://nmt-mobile-backend.onrender.com/api/admin/inventory")
.then(res=>setParts(res.data));

},[]);

const submitAudit = async(partId:number)=>{

await axios.post("https://nmt-mobile-backend.onrender.com/api/admin/stock-audit",{
part_id: partId,
actual_quantity: actual[partId]
});

alert("Kiểm kê xong");

};

return(

<div className="audit-wrapper">

<h2 className="audit-title">Kiểm kê kho</h2>

<table className="audit-table">

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
className="audit-input"
type="number"
onChange={(e)=>setActual({
...actual,
[p.id]: Number(e.target.value)
})}
/>

</td>

<td
className={
diff > 0
? "diff-positive"
: diff < 0
? "diff-negative"
: ""
}
>
{diff}
</td>

<td>

<button
className="audit-btn"
onClick={()=>submitAudit(p.id)}
>
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