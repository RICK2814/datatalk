import { useState, useRef, useEffect } from "react";
import { SignIn, SignedIn, SignedOut, UserButton, useUser } from "@clerk/clerk-react";
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer,
} from "recharts";

// ── Anthropic API key from env ────────────────────────────────────────────────
const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY || "";

// ── Amazon Sales Data (pre-aggregated from 50,000 rows) ──────────────────────
const DB = {
  monthly_revenue: [{"label":"2022-01","value":1419751.89},{"label":"2022-02","value":1266714.29},{"label":"2022-03","value":1392585.42},{"label":"2022-04","value":1371955.83},{"label":"2022-05","value":1374779.57},{"label":"2022-06","value":1352125.49},{"label":"2022-07","value":1346089.18},{"label":"2022-08","value":1449308.06},{"label":"2022-09","value":1403967.06},{"label":"2022-10","value":1334818.11},{"label":"2022-11","value":1291100.05},{"label":"2022-12","value":1386209.61},{"label":"2023-01","value":1464174.99},{"label":"2023-02","value":1238380.51},{"label":"2023-03","value":1366418.41},{"label":"2023-04","value":1307017.94},{"label":"2023-05","value":1431398.77},{"label":"2023-06","value":1394822.13},{"label":"2023-07","value":1442176.66},{"label":"2023-08","value":1396321.88},{"label":"2023-09","value":1341007.86},{"label":"2023-10","value":1425936.23},{"label":"2023-11","value":1334328.47},{"label":"2023-12","value":1335185.33}],
  revenue_by_category: [{"label":"Beauty","value":5550624.97},{"label":"Books","value":5484863.03},{"label":"Electronics","value":5470594.03},{"label":"Fashion","value":5480123.34},{"label":"Home & Kitchen","value":5473132.55},{"label":"Sports","value":5407235.82}],
  revenue_by_region: [{"label":"Asia","value":8175199.83},{"label":"Europe","value":8112311.57},{"label":"Middle East","value":8301844.5},{"label":"North America","value":8277217.84}],
  quantity_by_category: [{"label":"Beauty","value":25422},{"label":"Books","value":25065},{"label":"Electronics","value":24898},{"label":"Fashion","value":25089},{"label":"Home & Kitchen","value":24743},{"label":"Sports","value":24753}],
  avg_rating_by_category: [{"label":"Beauty","value":2.99},{"label":"Books","value":3.02},{"label":"Electronics","value":2.99},{"label":"Fashion","value":2.99},{"label":"Home & Kitchen","value":3.0},{"label":"Sports","value":3.0}],
  revenue_by_payment: [{"label":"Cash on Delivery","value":6546386.94},{"label":"Credit Card","value":6540087.16},{"label":"Debit Card","value":6522019.73},{"label":"UPI","value":6579441.44},{"label":"Wallet","value":6678638.47}],
  avg_discount_by_category: [{"label":"Beauty","value":13.4},{"label":"Books","value":13.3},{"label":"Electronics","value":13.3},{"label":"Fashion","value":13.4},{"label":"Home & Kitchen","value":13.3},{"label":"Sports","value":13.4}],
  revenue_region_category: [{"region":"Asia","category":"Beauty","value":1401916.92},{"region":"Asia","category":"Books","value":1391961.69},{"region":"Asia","category":"Electronics","value":1319074.46},{"region":"Asia","category":"Fashion","value":1334485.23},{"region":"Asia","category":"Home & Kitchen","value":1369676.45},{"region":"Asia","category":"Sports","value":1358085.08},{"region":"Europe","category":"Beauty","value":1358226.42},{"region":"Europe","category":"Books","value":1330671.45},{"region":"Europe","category":"Electronics","value":1407118.94},{"region":"Europe","category":"Fashion","value":1366107.0},{"region":"Europe","category":"Home & Kitchen","value":1326424.56},{"region":"Europe","category":"Sports","value":1323763.2},{"region":"Middle East","category":"Beauty","value":1387711.96},{"region":"Middle East","category":"Books","value":1428560.07},{"region":"Middle East","category":"Electronics","value":1379642.77},{"region":"Middle East","category":"Fashion","value":1390228.6},{"region":"Middle East","category":"Home & Kitchen","value":1375546.52},{"region":"Middle East","category":"Sports","value":1340154.58},{"region":"North America","category":"Beauty","value":1402769.67},{"region":"North America","category":"Books","value":1333669.82},{"region":"North America","category":"Electronics","value":1364757.86},{"region":"North America","category":"Fashion","value":1389302.51},{"region":"North America","category":"Home & Kitchen","value":1401485.02},{"region":"North America","category":"Sports","value":1385232.96}],
  quarterly_revenue: [{"label":"2022Q1","value":4079051.6},{"label":"2022Q2","value":4098860.89},{"label":"2022Q3","value":4199364.3},{"label":"2022Q4","value":4012127.77},{"label":"2023Q1","value":4068973.91},{"label":"2023Q2","value":4133238.84},{"label":"2023Q3","value":4179506.4},{"label":"2023Q4","value":4095450.03}],
  monthly_by_category: [{"month":"2022-01","category":"Beauty","value":222012.95},{"month":"2022-01","category":"Books","value":230176.59},{"month":"2022-01","category":"Electronics","value":219334.25},{"month":"2022-01","category":"Fashion","value":260202.37},{"month":"2022-01","category":"Home & Kitchen","value":255633.08},{"month":"2022-01","category":"Sports","value":232392.65},{"month":"2022-02","category":"Beauty","value":197458.31},{"month":"2022-02","category":"Books","value":220480.3},{"month":"2022-02","category":"Electronics","value":216580.03},{"month":"2022-02","category":"Fashion","value":216332.14},{"month":"2022-02","category":"Home & Kitchen","value":190921.93},{"month":"2022-02","category":"Sports","value":224941.58},{"month":"2022-03","category":"Beauty","value":262653.49},{"month":"2022-03","category":"Books","value":225353.48},{"month":"2022-03","category":"Electronics","value":221255.72},{"month":"2022-03","category":"Fashion","value":228852.19},{"month":"2022-03","category":"Home & Kitchen","value":202543.47},{"month":"2022-03","category":"Sports","value":251927.07},{"month":"2022-04","category":"Beauty","value":242767.7},{"month":"2022-04","category":"Books","value":231288.4},{"month":"2022-04","category":"Electronics","value":231088.51},{"month":"2022-04","category":"Fashion","value":236777.21},{"month":"2022-04","category":"Home & Kitchen","value":232025.78},{"month":"2022-04","category":"Sports","value":198008.23},{"month":"2022-05","category":"Beauty","value":248119.58},{"month":"2022-05","category":"Books","value":231432.39},{"month":"2022-05","category":"Electronics","value":210073.39},{"month":"2022-05","category":"Fashion","value":215797.52},{"month":"2022-05","category":"Home & Kitchen","value":234653.99},{"month":"2022-05","category":"Sports","value":234702.7},{"month":"2022-06","category":"Beauty","value":210459.15},{"month":"2022-06","category":"Books","value":221154.93},{"month":"2022-06","category":"Electronics","value":230913.26},{"month":"2022-06","category":"Fashion","value":218429.58},{"month":"2022-06","category":"Home & Kitchen","value":251686.58},{"month":"2022-06","category":"Sports","value":219481.99},{"month":"2022-07","category":"Beauty","value":230832.3},{"month":"2022-07","category":"Books","value":214313.12},{"month":"2022-07","category":"Electronics","value":237803.11},{"month":"2022-07","category":"Fashion","value":223804.75},{"month":"2022-07","category":"Home & Kitchen","value":231832.08},{"month":"2022-07","category":"Sports","value":207503.82},{"month":"2022-08","category":"Beauty","value":223674.6},{"month":"2022-08","category":"Books","value":233422.6},{"month":"2022-08","category":"Electronics","value":216200.02},{"month":"2022-08","category":"Fashion","value":242500.57},{"month":"2022-08","category":"Home & Kitchen","value":251982.86},{"month":"2022-08","category":"Sports","value":281527.41},{"month":"2022-09","category":"Beauty","value":235307.36},{"month":"2022-09","category":"Books","value":257623.07},{"month":"2022-09","category":"Electronics","value":245425.45},{"month":"2022-09","category":"Fashion","value":223124.01},{"month":"2022-09","category":"Home & Kitchen","value":211313.33},{"month":"2022-09","category":"Sports","value":231173.84},{"month":"2022-10","category":"Beauty","value":215398.91},{"month":"2022-10","category":"Books","value":212102.46},{"month":"2022-10","category":"Electronics","value":247942.97},{"month":"2022-10","category":"Fashion","value":215770.16},{"month":"2022-10","category":"Home & Kitchen","value":233641.1},{"month":"2022-10","category":"Sports","value":209962.51},{"month":"2022-11","category":"Beauty","value":205360.13},{"month":"2022-11","category":"Books","value":227350.6},{"month":"2022-11","category":"Electronics","value":204299.56},{"month":"2022-11","category":"Fashion","value":221118.37},{"month":"2022-11","category":"Home & Kitchen","value":226545.03},{"month":"2022-11","category":"Sports","value":206426.36},{"month":"2022-12","category":"Beauty","value":242517.42},{"month":"2022-12","category":"Books","value":214592.01},{"month":"2022-12","category":"Electronics","value":243350.48},{"month":"2022-12","category":"Fashion","value":251781.49},{"month":"2022-12","category":"Home & Kitchen","value":209548.48},{"month":"2022-12","category":"Sports","value":224419.73},{"month":"2023-01","category":"Beauty","value":253094.22},{"month":"2023-01","category":"Books","value":221338.49},{"month":"2023-01","category":"Electronics","value":258977.53},{"month":"2023-01","category":"Fashion","value":242910.45},{"month":"2023-01","category":"Home & Kitchen","value":224157.8},{"month":"2023-01","category":"Sports","value":263696.5},{"month":"2023-02","category":"Beauty","value":185260.57},{"month":"2023-02","category":"Books","value":219962.52},{"month":"2023-02","category":"Electronics","value":231502.96},{"month":"2023-02","category":"Fashion","value":201296.48},{"month":"2023-02","category":"Home & Kitchen","value":224483.15},{"month":"2023-02","category":"Sports","value":175874.83},{"month":"2023-03","category":"Beauty","value":208880.44},{"month":"2023-03","category":"Books","value":231078.29},{"month":"2023-03","category":"Electronics","value":220058.95},{"month":"2023-03","category":"Fashion","value":234882.15},{"month":"2023-03","category":"Home & Kitchen","value":218109.48},{"month":"2023-03","category":"Sports","value":253409.1},{"month":"2023-04","category":"Beauty","value":253366.32},{"month":"2023-04","category":"Books","value":205153.93},{"month":"2023-04","category":"Electronics","value":219184.41},{"month":"2023-04","category":"Fashion","value":214781.37},{"month":"2023-04","category":"Home & Kitchen","value":206386.16},{"month":"2023-04","category":"Sports","value":208145.75},{"month":"2023-05","category":"Beauty","value":263165.52},{"month":"2023-05","category":"Books","value":233700.76},{"month":"2023-05","category":"Electronics","value":252892.22},{"month":"2023-05","category":"Fashion","value":250136.56},{"month":"2023-05","category":"Home & Kitchen","value":215752.18},{"month":"2023-05","category":"Sports","value":215751.53},{"month":"2023-06","category":"Beauty","value":237549.48},{"month":"2023-06","category":"Books","value":245705.49},{"month":"2023-06","category":"Electronics","value":206485.96},{"month":"2023-06","category":"Fashion","value":211745.62},{"month":"2023-06","category":"Home & Kitchen","value":268043.64},{"month":"2023-06","category":"Sports","value":225291.94},{"month":"2023-07","category":"Beauty","value":219074.01},{"month":"2023-07","category":"Books","value":231334.19},{"month":"2023-07","category":"Electronics","value":236447.05},{"month":"2023-07","category":"Fashion","value":256699.91},{"month":"2023-07","category":"Home & Kitchen","value":255063.1},{"month":"2023-07","category":"Sports","value":243558.4},{"month":"2023-08","category":"Beauty","value":259610.32},{"month":"2023-08","category":"Books","value":220926.36},{"month":"2023-08","category":"Electronics","value":228405.3},{"month":"2023-08","category":"Fashion","value":216139.47},{"month":"2023-08","category":"Home & Kitchen","value":246945.06},{"month":"2023-08","category":"Sports","value":224295.37},{"month":"2023-09","category":"Beauty","value":245401.65},{"month":"2023-09","category":"Books","value":247861.23},{"month":"2023-09","category":"Electronics","value":213624.9},{"month":"2023-09","category":"Fashion","value":202346.81},{"month":"2023-09","category":"Home & Kitchen","value":189484.04},{"month":"2023-09","category":"Sports","value":242289.23},{"month":"2023-10","category":"Beauty","value":228747.28},{"month":"2023-10","category":"Books","value":259650.45},{"month":"2023-10","category":"Electronics","value":216139.26},{"month":"2023-10","category":"Fashion","value":251742.98},{"month":"2023-10","category":"Home & Kitchen","value":247024.96},{"month":"2023-10","category":"Sports","value":222631.3},{"month":"2023-11","category":"Beauty","value":226386.22},{"month":"2023-11","category":"Books","value":225766.08},{"month":"2023-11","category":"Electronics","value":238537.8},{"month":"2023-11","category":"Fashion","value":230548.54},{"month":"2023-11","category":"Home & Kitchen","value":209569.98},{"month":"2023-11","category":"Sports","value":203519.85},{"month":"2023-12","category":"Beauty","value":233527.04},{"month":"2023-12","category":"Books","value":223095.29},{"month":"2023-12","category":"Electronics","value":224070.94},{"month":"2023-12","category":"Fashion","value":212402.64},{"month":"2023-12","category":"Home & Kitchen","value":235785.29},{"month":"2023-12","category":"Sports","value":206304.13}],
  stats: { total_revenue: 32866573.74, total_orders: 50000, avg_order_value: 657.33, avg_rating: 3.0 },
};

// ── Helpers ───────────────────────────────────────────────────────────────────
const PALETTE = ["#6366f1","#10b981","#f59e0b","#ef4444","#3b82f6","#ec4899","#8b5cf6","#06b6d4"];
const fmt    = n => n>=1e6?`$${(n/1e6).toFixed(2)}M`:n>=1e3?`$${(n/1e3).toFixed(1)}K`:`$${n.toFixed(0)}`;
const fmtNum = n => n>=1e6?`${(n/1e6).toFixed(2)}M`:n>=1e3?`${(n/1e3).toFixed(1)}K`:String(n);

// ── Claude system prompt ──────────────────────────────────────────────────────
const SYSTEM_PROMPT = `You are DataTalk, a BI AI for non-technical executives. Dataset: Amazon Sales, 50K orders, Jan 2022–Dec 2023.
Columns: order_date, product_category (Beauty/Books/Electronics/Fashion/Home & Kitchen/Sports), price, discount_percent, quantity_sold, customer_region (Asia/Europe/Middle East/North America), payment_method (UPI/Credit Card/Wallet/Cash on Delivery/Debit Card), rating, total_revenue.
Available data keys: monthly_revenue, revenue_by_category, revenue_by_region, quantity_by_category, avg_rating_by_category, revenue_by_payment, avg_discount_by_category, revenue_region_category, quarterly_revenue, monthly_by_category.
Stats: total_revenue=32866573.74, total_orders=50000, avg_order_value=657.33, avg_rating=3.0
RULES: Never hallucinate. Only reference listed keys. Return JSON only — no markdown, no explanation.
Return exactly:
{"dashboard_title":"...","summary_insight":"...","charts":[{"chart_id":"chart_1","chart_type":"line|bar|pie|area|multiline","title":"...","data_key":"...","insight":"..."}],"follow_up_suggestions":["...","...","..."],"error":null}
For multiline: add "series_key":"category","x_key":"month". For grouped bar (revenue_region_category): add "grouped":true. Max 3 charts.`;

async function askGemini(messages) {
  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      temperature: 0.2,
      max_tokens: 1000,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        ...messages,
      ],
    }),
  });
  const data = await res.json();
  if (data.error) throw new Error(data.error.message || JSON.stringify(data.error));
  const raw = data.choices?.[0]?.message?.content || "";
  try { return JSON.parse(raw.replace(/```json|```/g, "").trim()); }
  catch { return { error: "Could not parse AI response. Please try again.", charts: [], follow_up_suggestions: [] }; }
}

// ── Chart renderer ────────────────────────────────────────────────────────────
const TT = { backgroundColor:"#0f1628", border:"1px solid #1e2d45", borderRadius:8, color:"#e2e8f0", fontSize:12 };

function ChartBlock({ spec }) {
  const data = DB[spec.data_key] || [];

  if (spec.chart_type === "line") return (
    <ResponsiveContainer width="100%" height={210}>
      <LineChart data={data} margin={{top:5,right:20,left:10,bottom:5}}>
        <CartesianGrid strokeDasharray="3 3" stroke="#1a2540"/>
        <XAxis dataKey="label" tick={{fill:"#4a6080",fontSize:10}} tickLine={false}/>
        <YAxis tickFormatter={fmt} tick={{fill:"#4a6080",fontSize:10}} tickLine={false} axisLine={false}/>
        <Tooltip formatter={v=>fmt(v)} contentStyle={TT}/>
        <Line type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={2} dot={false} activeDot={{r:4}}/>
      </LineChart>
    </ResponsiveContainer>
  );

  if (spec.chart_type === "area") return (
    <ResponsiveContainer width="100%" height={210}>
      <AreaChart data={data} margin={{top:5,right:20,left:10,bottom:5}}>
        <defs><linearGradient id="ag" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/><stop offset="95%" stopColor="#6366f1" stopOpacity={0}/></linearGradient></defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#1a2540"/>
        <XAxis dataKey="label" tick={{fill:"#4a6080",fontSize:10}} tickLine={false}/>
        <YAxis tickFormatter={fmt} tick={{fill:"#4a6080",fontSize:10}} tickLine={false} axisLine={false}/>
        <Tooltip formatter={v=>fmt(v)} contentStyle={TT}/>
        <Area type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={2} fill="url(#ag)"/>
      </AreaChart>
    </ResponsiveContainer>
  );

  if (spec.chart_type === "pie") return (
    <ResponsiveContainer width="100%" height={210}>
      <PieChart>
        <Pie data={data} dataKey="value" nameKey="label" cx="50%" cy="50%" outerRadius={78} innerRadius={38} paddingAngle={3}>
          {data.map((_,i) => <Cell key={i} fill={PALETTE[i%PALETTE.length]}/>)}
        </Pie>
        <Tooltip formatter={v=>fmt(v)} contentStyle={TT}/>
        <Legend wrapperStyle={{fontSize:11,color:"#4a6080"}}/>
      </PieChart>
    </ResponsiveContainer>
  );

  if (spec.chart_type === "bar") {
    if (spec.grouped) {
      const regions=[...new Set(data.map(d=>d.region))], cats=[...new Set(data.map(d=>d.category))];
      const grouped=regions.map(r=>{const row={region:r};data.filter(d=>d.region===r).forEach(d=>{row[d.category]=Math.round(d.value);});return row;});
      return (
        <ResponsiveContainer width="100%" height={210}>
          <BarChart data={grouped} margin={{top:5,right:20,left:10,bottom:5}}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1a2540"/>
            <XAxis dataKey="region" tick={{fill:"#4a6080",fontSize:10}} tickLine={false}/>
            <YAxis tickFormatter={fmt} tick={{fill:"#4a6080",fontSize:10}} tickLine={false} axisLine={false}/>
            <Tooltip formatter={v=>fmt(v)} contentStyle={TT}/>
            <Legend wrapperStyle={{fontSize:11,color:"#4a6080"}}/>
            {cats.map((c,i)=><Bar key={c} dataKey={c} fill={PALETTE[i%PALETTE.length]} radius={[2,2,0,0]}/>)}
          </BarChart>
        </ResponsiveContainer>
      );
    }
    const isRaw = spec.data_key?.includes("rating")||spec.data_key?.includes("discount");
    return (
      <ResponsiveContainer width="100%" height={210}>
        <BarChart data={data} margin={{top:5,right:20,left:10,bottom:5}}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1a2540"/>
          <XAxis dataKey="label" tick={{fill:"#4a6080",fontSize:10}} tickLine={false}/>
          <YAxis tickFormatter={isRaw?v=>v:fmt} tick={{fill:"#4a6080",fontSize:10}} tickLine={false} axisLine={false}/>
          <Tooltip formatter={v=>isRaw?v:fmt(v)} contentStyle={TT}/>
          <Bar dataKey="value" radius={[4,4,0,0]}>{data.map((_,i)=><Cell key={i} fill={PALETTE[i%PALETTE.length]}/>)}</Bar>
        </BarChart>
      </ResponsiveContainer>
    );
  }

  if (spec.chart_type === "multiline") {
    const xKey=spec.x_key||"month", sKey=spec.series_key||"category";
    const months=[...new Set(data.map(d=>d[xKey]))].sort(), series=[...new Set(data.map(d=>d[sKey]))];
    const pivoted=months.map(m=>{const row={[xKey]:m};data.filter(d=>d[xKey]===m).forEach(d=>{row[d[sKey]]=d.value;});return row;});
    return (
      <ResponsiveContainer width="100%" height={230}>
        <LineChart data={pivoted} margin={{top:5,right:20,left:10,bottom:5}}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1a2540"/>
          <XAxis dataKey={xKey} tick={{fill:"#4a6080",fontSize:9}} tickLine={false}/>
          <YAxis tickFormatter={fmt} tick={{fill:"#4a6080",fontSize:10}} tickLine={false} axisLine={false}/>
          <Tooltip formatter={v=>fmt(v)} contentStyle={TT}/>
          <Legend wrapperStyle={{fontSize:11,color:"#4a6080"}}/>
          {series.map((s,i)=><Line key={s} type="monotone" dataKey={s} stroke={PALETTE[i%PALETTE.length]} strokeWidth={1.5} dot={false}/>)}
        </LineChart>
      </ResponsiveContainer>
    );
  }

  return <div style={{color:"#4a6080",padding:20,textAlign:"center",fontSize:13}}>Unsupported chart type: {spec.chart_type}</div>;
}

// ── Small UI pieces ───────────────────────────────────────────────────────────
function KPICard({ label, value, sub, color }) {
  return (
    <div style={{background:"#0c1220",border:`1px solid ${color}28`,borderRadius:12,padding:"14px 18px",flex:1,minWidth:130}}>
      <div style={{fontSize:10,color:"#3a5070",letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:5}}>{label}</div>
      <div style={{fontSize:20,fontWeight:700,color,fontFamily:"monospace"}}>{value}</div>
      {sub && <div style={{fontSize:10,color:"#3a5070",marginTop:3}}>{sub}</div>}
    </div>
  );
}

function Chip({ text, onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <button onClick={onClick} onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{background:hov?"#1a2540":"#0c1220",border:"1px solid #1e2d45",borderRadius:20,padding:"6px 14px",color:hov?"#93c5fd":"#4a6080",fontSize:12,cursor:"pointer",transition:"all 0.15s",whiteSpace:"nowrap",flexShrink:0}}>
      {text}
    </button>
  );
}

// ── Sign-In Page (shown when signed out) ──────────────────────────────────────
function SignInPage() {
  return (
    <div style={{minHeight:"100vh",background:"#070c14",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:24,fontFamily:"'Inter',system-ui,sans-serif"}}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Inter:wght@400;500;600&display=swap');`}</style>

      {/* Background glow */}
      <div style={{position:"fixed",top:"15%",left:"50%",transform:"translateX(-50%)",width:600,height:500,background:"radial-gradient(ellipse, #6366f118 0%, transparent 70%)",pointerEvents:"none"}}/>

      {/* Logo + tagline */}
      <div style={{textAlign:"center",marginBottom:36}}>
        <div style={{fontFamily:"Syne,sans-serif",fontWeight:800,fontSize:48,letterSpacing:"-0.03em",marginBottom:12}}>
          Data<span style={{color:"#6366f1"}}>Talk</span>
        </div>
        <div style={{color:"#3a5070",fontSize:15,lineHeight:1.7}}>
          Conversational AI for instant<br/>Business Intelligence Dashboards
        </div>
      </div>

      {/* Feature badges */}
      <div style={{display:"flex",gap:8,justifyContent:"center",flexWrap:"wrap",marginBottom:40}}>
        {["50K Orders","6 Categories","4 Regions","Claude AI","Real-time Charts"].map(f => (
          <span key={f} style={{background:"#0c1220",border:"1px solid #1a2540",borderRadius:20,padding:"5px 14px",fontSize:11,color:"#4a7090"}}>{f}</span>
        ))}
      </div>

      {/* Clerk's pre-built SignIn component — matches our dark theme via appearance */}
      <SignIn
        routing="hash"
        appearance={{
          variables: {
            colorPrimary: "#6366f1",
            colorBackground: "#0c1220",
            colorInputBackground: "#080e1a",
            colorInputText: "#c8d8f0",
            colorText: "#e2e8f0",
            colorTextSecondary: "#4a7090",
            colorNeutral: "#1a2540",
            borderRadius: "12px",
            fontFamily: "Inter, system-ui, sans-serif",
          },
          elements: {
            card: { boxShadow: "0 0 0 1px #1a2540", border: "1px solid #1a2540" },
            headerTitle: { fontFamily: "Syne, sans-serif", fontWeight: 700 },
            socialButtonsBlockButton: { border: "1px solid #1e2d45", background: "#080e1a" },
            formButtonPrimary: { background: "#4338ca" },
            footerActionLink: { color: "#6366f1" },
            identityPreviewEditButton: { color: "#6366f1" },
          },
        }}
      />

      <div style={{marginTop:24,fontSize:11,color:"#1a2d40",textAlign:"center",lineHeight:1.7}}>
        Your data stays in your browser only.<br/>Nothing is stored on any server.
      </div>
    </div>
  );
}

// ── Dashboard (shown when signed in) ─────────────────────────────────────────
const SUGGESTIONS = [
  "Show me monthly revenue trend for 2022 vs 2023",
  "Which product category generates the most revenue?",
  "Break down revenue by region and category",
  "Compare payment methods by revenue",
  "Show quarterly revenue performance",
  "Which category has the highest average rating?",
];

function Dashboard() {
  const { user } = useUser();
  const [messages, setMessages] = useState([]);
  const [turns,    setTurns]    = useState([]);
  const [input,    setInput]    = useState("");
  const [loading,  setLoading]  = useState(false);
  const [dots,     setDots]     = useState(".");
  const bottomRef = useRef(null);

  useEffect(() => {
    if (!loading) return;
    const id = setInterval(() => setDots(d => d.length >= 3 ? "." : d + "."), 400);
    return () => clearInterval(id);
  }, [loading]);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [turns, loading]);

  const ask = async (query) => {
    if (!query.trim() || loading) return;
    setInput(""); setLoading(true);
    const newMsgs = [...messages, { role:"user", content:query }];
    setMessages(newMsgs);
    setTurns(t => [...t, { query, result:null }]);
    try {
      const result = await askGemini(newMsgs);
      setMessages(m => [...m, { role:"assistant", content:JSON.stringify(result) }]);
      setTurns(t => t.map((turn,i) => i===t.length-1 ? {...turn,result} : turn));
    } catch(e) {
      setTurns(t => t.map((turn,i) => i===t.length-1 ? {...turn,result:{error:e.message,charts:[],follow_up_suggestions:[]}} : turn));
    }
    setLoading(false);
  };

  const firstName = user?.firstName || user?.username || user?.emailAddresses?.[0]?.emailAddress?.split("@")[0] || "there";
  const s = DB.stats;

  return (
    <div style={{background:"#070c14",minHeight:"100vh",color:"#e2e8f0",display:"flex",flexDirection:"column",fontFamily:"'Inter',system-ui,sans-serif"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Inter:wght@400;500;600&display=swap');
        .send-btn:hover:not(:disabled){background:#4f46e5!important;}
        textarea:focus{outline:none;}
        @keyframes fadeUp{from{opacity:0;transform:translateY(10px);}to{opacity:1;transform:translateY(0);}}
        .fade-up{animation:fadeUp 0.3s ease forwards;}
        @keyframes blink{0%,100%{opacity:1}50%{opacity:0.3}}
        .dot{animation:blink 1.2s infinite;}.dot:nth-child(2){animation-delay:.2s;}.dot:nth-child(3){animation-delay:.4s;}
        @keyframes blip{0%,100%{opacity:1}50%{opacity:0.3}}.blip{animation:blip 2s infinite;}
        .chip-row{overflow-x:auto;scrollbar-width:none;}.chip-row::-webkit-scrollbar{display:none;}
      `}</style>

      {/* ── Top bar ── */}
      <div style={{borderBottom:"1px solid #0f1828",padding:"0 24px",display:"flex",alignItems:"center",height:52,gap:14,flexShrink:0}}>
        <span style={{fontFamily:"Syne,sans-serif",fontWeight:800,fontSize:20,letterSpacing:"-0.03em"}}>
          Data<span style={{color:"#6366f1"}}>Talk</span>
        </span>
        <div style={{width:1,height:18,background:"#1a2540"}}/>
        <span style={{fontSize:11,color:"#2a4060",letterSpacing:"0.06em",textTransform:"uppercase"}}>Amazon Sales · 2022–2023</span>
        <div style={{marginLeft:"auto",display:"flex",alignItems:"center",gap:16}}>
          <div style={{display:"flex",alignItems:"center",gap:6}}>
            <div className="blip" style={{width:6,height:6,borderRadius:"50%",background:"#10b981"}}/>
            <span style={{fontSize:11,color:"#2a5040"}}>50K orders</span>
          </div>
          {/* Clerk's UserButton — handles avatar, profile, sign out automatically */}
          <UserButton
            appearance={{
              variables: { colorPrimary:"#6366f1" },
              elements: {
                avatarBox: { width:30, height:30 },
                userButtonPopoverCard: { background:"#0c1220", border:"1px solid #1a2540", boxShadow:"0 8px 32px #00000080" },
                userButtonPopoverActionButton: { color:"#8ba0c0" },
                userButtonPopoverActionButton__signOut: { color:"#ef4444" },
                userButtonPopoverFooter: { display:"none" },
              },
            }}
          />
        </div>
      </div>

      {/* ── Body ── */}
      <div style={{flex:1,overflowY:"auto",padding:"20px 24px 8px"}}>

        {/* KPI cards */}
        <div style={{display:"flex",gap:12,marginBottom:20,flexWrap:"wrap"}}>
          <KPICard label="Total Revenue"    value={fmt(s.total_revenue)}     sub="Jan 2022 – Dec 2023" color="#6366f1"/>
          <KPICard label="Total Orders"     value={fmtNum(s.total_orders)}   sub="across all regions"  color="#10b981"/>
          <KPICard label="Avg Order Value"  value={`$${s.avg_order_value}`}  sub="per transaction"     color="#f59e0b"/>
          <KPICard label="Avg Rating"       value={`${s.avg_rating} ★`}      sub="all categories"      color="#ec4899"/>
        </div>

        {/* Empty state */}
        {turns.length === 0 && (
          <div style={{textAlign:"center",padding:"32px 0 20px"}}>
            <div style={{fontSize:15,color:"#8ba0c0",marginBottom:4}}>
              Welcome back, <strong style={{color:"#c8d8f0"}}>{firstName}</strong> 👋
            </div>
            <div style={{fontSize:13,color:"#2a4060",marginBottom:28}}>Ask anything about your Amazon Sales data</div>
            <div style={{display:"flex",gap:8,flexWrap:"wrap",justifyContent:"center",maxWidth:720,margin:"0 auto"}}>
              {SUGGESTIONS.map(s => <Chip key={s} text={s} onClick={() => ask(s)}/>)}
            </div>
          </div>
        )}

        {/* Conversation */}
        {turns.map((turn, ti) => (
          <div key={ti} className="fade-up" style={{marginBottom:24}}>
            {/* User bubble */}
            <div style={{display:"flex",justifyContent:"flex-end",marginBottom:14}}>
              <div style={{background:"#1e1a4a",border:"1px solid #2d2870",borderRadius:"16px 16px 4px 16px",padding:"10px 16px",maxWidth:600,fontSize:14,color:"#c8d8ff",lineHeight:1.5}}>
                {turn.query}
              </div>
            </div>

            {/* AI response */}
            {turn.result && !turn.result.error && (
              <div style={{background:"#0c1220",border:"1px solid #1a2540",borderRadius:14,padding:"20px 22px"}}>
                <div style={{fontFamily:"Syne,sans-serif",fontWeight:700,fontSize:16,color:"#e2e8f0",marginBottom:6}}>{turn.result.dashboard_title}</div>
                <div style={{fontSize:13,color:"#4a7090",marginBottom:18,lineHeight:1.6}}>{turn.result.summary_insight}</div>
                <div style={{display:"flex",gap:16,flexWrap:"wrap"}}>
                  {(turn.result.charts||[]).map((spec,ci) => (
                    <div key={ci} style={{flex:1,minWidth:280,background:"#080e1a",border:"1px solid #12213a",borderRadius:10,padding:"16px 16px 10px"}}>
                      <div style={{fontSize:12,fontWeight:600,color:"#8ba0c0",marginBottom:12}}>{spec.title}</div>
                      <ChartBlock spec={spec}/>
                      <div style={{fontSize:11,color:"#2a4060",marginTop:10,lineHeight:1.5,borderTop:"1px solid #0f1828",paddingTop:8}}>💡 {spec.insight}</div>
                    </div>
                  ))}
                </div>
                {turn.result.follow_up_suggestions?.length > 0 && (
                  <div style={{marginTop:16}}>
                    <div style={{fontSize:10,color:"#2a3d55",letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:8}}>Follow-up</div>
                    <div className="chip-row" style={{display:"flex",gap:8}}>
                      {turn.result.follow_up_suggestions.map(s => <Chip key={s} text={s} onClick={() => ask(s)}/>)}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Error */}
            {turn.result?.error && (
              <div style={{background:"#1a0c0c",border:"1px solid #3a1a1a",borderRadius:14,padding:"16px 20px",color:"#ef4444",fontSize:13,lineHeight:1.6}}>
                ⚠️ {turn.result.error}
              </div>
            )}
          </div>
        ))}

        {/* Loading dots */}
        {loading && (
          <div style={{display:"flex",alignItems:"center",gap:10,padding:"8px 0",marginBottom:16}}>
            <div style={{display:"flex",gap:4}}>
              {[0,1,2].map(i => <div key={i} className="dot" style={{width:7,height:7,borderRadius:"50%",background:"#6366f1"}}/>)}
            </div>
            <span style={{fontSize:12,color:"#2a4060"}}>Analyzing your data{dots}</span>
          </div>
        )}

        {/* Persistent chips */}
        {turns.length > 0 && !loading && (
          <div className="chip-row" style={{display:"flex",gap:8,marginBottom:12}}>
            {SUGGESTIONS.slice(0,4).map(s => <Chip key={s} text={s} onClick={() => ask(s)}/>)}
          </div>
        )}

        <div ref={bottomRef}/>
      </div>

      {/* ── Input bar ── */}
      <div style={{borderTop:"1px solid #0f1828",padding:"14px 24px 20px",flexShrink:0}}>
        <div style={{display:"flex",gap:10,alignItems:"flex-end",background:"#0c1220",border:"1px solid #1a2540",borderRadius:14,padding:"10px 12px 10px 16px"}}>
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();ask(input);} }}
            placeholder="Ask a question about your sales data… (Enter to send)"
            rows={1}
            style={{flex:1,background:"transparent",border:"none",color:"#c8d8f0",fontSize:14,resize:"none",lineHeight:1.5,maxHeight:120,outline:"none",fontFamily:"inherit"}}
            onInput={e=>{e.target.style.height="auto";e.target.style.height=Math.min(e.target.scrollHeight,120)+"px";}}
          />
          <button className="send-btn" onClick={() => ask(input)} disabled={loading||!input.trim()}
            style={{background:input.trim()&&!loading?"#4338ca":"#1a2540",border:"none",borderRadius:9,width:36,height:36,cursor:input.trim()&&!loading?"pointer":"default",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,transition:"background 0.15s"}}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={input.trim()&&!loading?"#fff":"#2a4060"} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
            </svg>
          </button>
        </div>
        <div style={{textAlign:"center",marginTop:8,fontSize:10,color:"#1a2d40"}}>
          DataTalk · Amazon Sales · 50,000 orders · Powered by Groq AI
        </div>
      </div>
    </div>
  );
}

// ── Root — Clerk handles auth state ──────────────────────────────────────────
export default function App() {
  return (
    <>
      <SignedOut>
        <SignInPage />
      </SignedOut>
      <SignedIn>
        <Dashboard />
      </SignedIn>
    </>
  );
}