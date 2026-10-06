const DFLT={gst:10,targetMargin:1500,minMargin:1200,removalRetail:200,jayCost:215,jayRetail:450,superCost:280,superRetail:500,merlinCost:420,merlinRetail:650,techRollerSmall:500,techRollerLarge:650,techSectionalSmall:550,techSectionalMed:650,techSectionalLarge:700,bneRollerInstall:450,bneRollerRemove:550,bneSingleInstall:500,bneSingleRemove:600,bneMotorLabour:75,bneDoubleInstall:700,bneDoubleRemove:850,bneSpecialLift:300,bneSiteMeasure:50,bneDoubleWidth:3000,businessName:"B.O.B Garage Doors",perthPhone:"08 6256 4417",perthEmail:"info@bobgaragedoorswa.com",perthWebsite:"bobgaragedoorswa.com",brisbanePhone:"",brisbaneEmail:"bobgaragedoors1@gmail.com",brisbaneWebsite:"bobgaragedoors.com",quoteValidity:14,adminPin:""};
let S=loadSettings();
const APP_VERSION="v14", DRAFT_KEY="bob_quote_draft_v10", QUOTES_KEY="bob_v3_quotes";
const ROLE_LOCK=["tech","admin"].includes(new URLSearchParams(location.search).get("role"))?new URLSearchParams(location.search).get("role"):"";
let currentExtras=[],quoteDoors=[];
const steelSec={w:[[1350,3000],[3005,3500],[3505,4500],[4505,5000],[5005,5300],[5305,5650],[5655,6200],[6205,6500]],h:[[0,2280],[2285,2440],[2445,2740],[2745,3400]],p:[[1047,1206,1359,1387,1422,1547,2037,2280],[1125,1269,1483,1510,1585,1739,2277,2538],[1200,1354,1635,1775,1824,1987,2475,3065],[1544,1829,2030,2336,2434,2814,3045,3278]]};
const centSec={w:[[1500,2450],[2451,3000],[3001,3500],[3501,4300],[4301,4800],[4801,4880],[4881,5150],[5151,5565],[5566,5960],[5961,6200]],h:[[1860,2330],[2331,2440],[2441,2730],[2731,2910],[2911,3170],[3171,3425]],p:[[992,1053,1079,1244,1316,1416,1510,1638,2153,2265],[995,1067,1144,1426,1503,1551,1596,1715,2188,2300],[1034,1098,1308,1478,1583,1623,1658,1768,2236,2352],[1299,1374,1665,1866,2118,2175,2278,2453,2866,3011],[1343,1424,1713,1913,2164,2220,2324,2499,2909,3056],[1596,1689,2032,2274,2571,2637,2759,2968,3461,3634]]};
const centA={w:[[900,1500],[1501,2000],[2001,2490],[2491,2650],[2651,2800],[2801,3100]],h:[2100,2200,2400,2600,3000],p:[[592,603,612,665,720,776],[612,630,663,720,780,836],[645,663,686,759,789,822],[674,687,740,833,879,928],[735,806,844,878,950,1024]]};
const centAA={w:[[3101,3400],[3401,3760],[3761,4370],[4371,5100],[5101,5400]],h:[2100,2400,2600,3000],p:[[1132,1191,1359,1494,1523],[1196,1258,1454,1574,1617],[1211,1275,1472,1592,1636],[1215,1293,1488,1608,1654]]};
const steelRoll={w:[[750,2150],[2155,2650],[2655,2850],[2855,3150],[3155,3250],[3255,3430],[3435,3760],[3765,4370],[4375,5100]],rows:[{h:2100,p:[591,682,810,877,null,null,null,null,null]},{h:2600,p:[674,739,924,963,1149,1279,1422,1483,1542]},{h:3000,p:[821,1012,1070,1101,1295,1462,1592,1722,1851]}]};
const $=id=>document.getElementById(id), money=n=>n==null?"—":"$"+Math.round(+n).toLocaleString("en-AU"), ceil50=n=>Math.ceil(n/50)*50, norm5=n=>Math.ceil(+n/5)*5;
function loadSettings(){
 try{
   const raw=JSON.parse(localStorage.getItem("bob_v3_settings")||"{}"),merged={...DFLT,...raw},migration=+(localStorage.getItem("bob_settings_migration_version")||0);
   if(migration<14){
     merged.minMargin=1200;
     if(raw.targetMargin===undefined||+raw.targetMargin===1350)merged.targetMargin=1500;
     if(raw.jayRetail===undefined)merged.jayRetail=450;
     if(raw.superRetail===undefined)merged.superRetail=500;
     if(raw.merlinRetail===undefined)merged.merlinRetail=650;
     localStorage.setItem("bob_v3_settings",JSON.stringify(merged));
     localStorage.setItem("bob_settings_migration_version","14");
   }
   return merged
 }catch(e){return {...DFLT}}
}
let deferredInstallPrompt=null;
window.addEventListener("beforeinstallprompt",e=>{e.preventDefault();deferredInstallPrompt=e});
const STANDARD_COLOURS=["","Basalt","Bluegum","Classic Cream","Cove","Deep Ocean","Dover White","Dune","Evening Haze","Gully","Hamptons White","Ironstone","Jasper","Monument","Night Sky","Paperbark","Shale Grey","Southerly","Surfmist","Wallaby","Windspray","Woodland Grey","Other / confirm with supplier"];
const PROFILES={
 "Steel-Line|Sectional":["","Stanford","Heritage","Ranch","Fineline","Ribline","Flatline"],
 "Centurion|Sectional":["","Georgian","Regency","Mediterranean","Cosmopolitan"],
 "Auto|Sectional":["","Steel-Line — Stanford","Steel-Line — Heritage","Steel-Line — Ranch","Steel-Line — Fineline","Steel-Line — Ribline","Steel-Line — Flatline","Centurion — Georgian","Centurion — Regency","Centurion — Mediterranean","Centurion — Cosmopolitan"],
 "Steel-Line|Roller":["","Roller Door"],
 "Centurion|Roller":["","Series A / AA Roller Door"],
 "Auto|Roller":["","Roller Door"]
};
function cityContact(city){
 return city==="Perth"
  ? {phone:S.perthPhone||"",email:S.perthEmail||"",website:S.perthWebsite||""}
  : {phone:S.brisbanePhone||"",email:S.brisbaneEmail||"",website:S.brisbaneWebsite||""};
}
function refreshHeaderContact(){
 const c=cityContact($("city")?.value||"Perth"),bits=[c.phone,c.email,c.website].filter(Boolean);
 if($("headerContact")) $("headerContact").textContent=bits.length?bits.join(" • "):"Verified supplier pricing • office & technician workflow";
}
function populateColourProfile(preserve=true){
 const oldColour=preserve&&$("doorColour")?$("doorColour").value:"";
 const oldProfile=preserve&&$("doorProfile")?$("doorProfile").value:"";
 if($("doorColour")){
   $("doorColour").innerHTML=STANDARD_COLOURS.map(x=>`<option value="${x}">${x||"Select colour"}</option>`).join("");
   if(STANDARD_COLOURS.includes(oldColour)) $("doorColour").value=oldColour;
 }
 if($("doorProfile")){
   const key=($("supplier")?.value||"Auto")+"|"+($("doorType")?.value||"Sectional");
   const arr=PROFILES[key]||[""];
   $("doorProfile").innerHTML=arr.map(x=>`<option value="${x}">${x||"Select profile / style"}</option>`).join("");
   if(arr.includes(oldProfile)) $("doorProfile").value=oldProfile;
 }
}
function validateRequiredSpecs(){
 const colour=$("doorColour")?.value.trim()||"",profile=$("doorProfile")?.value.trim()||"";
 return {ok:!!colour&&!!profile,colour,profile,reason:!colour&&!profile?"Select door colour and profile":!colour?"Select door colour":"Select door profile / style"};
}

function idx(n,a){return a.findIndex(b=>n>=b[0]&&n<=b[1])} function ceilStd(h,a){return a.find(v=>h<=v)??null}
function matrixCost(M,w,h){w=norm5(w);h=norm5(h);const wi=idx(w,M.w),hi=idx(h,M.h);return wi<0||hi<0?null:{cost:M.p[hi][wi],chargedW:w,chargedH:h}}
function steelSecCost(w,h){return matrixCost(steelSec,w,h)} function centSecCost(w,h){return matrixCost(centSec,w,h)}
function steelRollCost(w,h){w=norm5(w);const wi=idx(w,steelRoll.w),r=steelRoll.rows.find(x=>h<=x.h);if(wi<0||!r||r.p[wi]==null)return null;return{cost:r.p[wi],chargedW:w,chargedH:r.h}}
function centRollCost(w,h){w=+w;h=+h;if(w<=3100){const wi=idx(w,centA.w),hh=ceilStd(h,centA.h);if(wi<0||!hh)return null;return{cost:centA.p[centA.h.indexOf(hh)][wi],chargedH:hh,series:"A"}}const wi=idx(w,centAA.w),hh=ceilStd(h,centAA.h);if(wi<0||!hh)return null;return{cost:centAA.p[centAA.h.indexOf(hh)][wi],chargedH:hh,series:"AA"}}
function costs(type,w,h){return type==="Sectional"?{"Steel-Line":steelSecCost(w,h),Centurion:centSecCost(w,h)}:{"Steel-Line":steelRollCost(w,h),Centurion:centRollCost(w,h)}}
function base(type,w,h,sup){const c=costs(type,w,h),a=Object.entries(c).filter(x=>x[1]);if(!a.length)return{ok:false,c};if(sup!=="Auto"){if(!c[sup])return{ok:false,c,reason:sup+" has no automatic table price for this size"};return{ok:true,c,cost:c[sup].cost,basis:sup,recommended:sup}}const hi=a.reduce((x,y)=>y[1].cost>x[1].cost?y:x),lo=a.reduce((x,y)=>y[1].cost<x[1].cost?y:x);return{ok:true,c,cost:hi[1].cost,basis:"Auto / higher cost",recommended:lo[0],recommendedCost:lo[1].cost,maxSupplier:hi[0]}}
function tech(type,w){if(type==="Roller")return w<=3100?S.techRollerSmall:S.techRollerLarge;if(w<=3000)return S.techSectionalSmall;if(w<=4800)return S.techSectionalMed;return S.techSectionalLarge}
function installationCost(city,type,w,h,removal,motorName,specialLift,siteMeasure){
 if(city!=="Brisbane")return{ok:true,cost:tech(type,w),label:"Perth technician allowance"};
 let cost=0,label="";
 if(type==="Roller"){
   if(w>3500||h>2700)return{ok:false,cost:null,label:"Sparrow Roller pricing only covers up to 3500W × 2700H"};
   cost=removal?S.bneRollerRemove:S.bneRollerInstall;
   label=removal?"Sparrow Roller remove + install":"Sparrow Roller install";
 }else{
   const isDouble=w>S.bneDoubleWidth;
   cost=isDouble?(removal?S.bneDoubleRemove:S.bneDoubleInstall):(removal?S.bneSingleRemove:S.bneSingleInstall);
   if(motorName!=="Manual")cost+=S.bneMotorLabour;
   label="Sparrow "+(isDouble?"Double":"Single")+" Sectional"+(removal?" remove + install":" install")+(motorName!=="Manual"?" + motor labour":"");
 }
 if(specialLift)cost+=S.bneSpecialLift;
 if(siteMeasure)cost+=S.bneSiteMeasure;
 return{ok:true,cost:cost,label:label}
}
function motor(city,m){if(m==="Manual")return{name:"Manual",cost:0,retail:0};if(m==="Merlin")return{name:"Merlin",cost:S.merlinCost,retail:S.merlinRetail};return city==="Perth"?{name:"JayTech",cost:S.jayCost,retail:S.jayRetail}:{name:"Superlift",cost:S.superCost,retail:S.superRetail}}
const lm=w=>w/1000,sqm=(w,h)=>w*h/1e6;
function insulation(w,h){let wi=w<=3000?0:w<=5500?1:w<=6700?2:-1,hi=h<=2285?0:h<=2850?1:h<=3415?2:-1;return wi<0||hi<0?null:[[818,1039,1195],[1007,1290,1510],[1195,1447,1699]][hi][wi]}
function boxCost(w){if(w<=2500)return 101;if(w<=2800)return 106;if(w<=3100)return 111;if(w<=3400)return 116;if(w<=3700)return 122;if(w<=4000)return 130;if(w<=4300)return 138;if(w<=4600)return 145;if(w<=4900)return 151;if(w<=5400)return 157;return null}
function defs(sup,type,w,h){
 if(sup==="Auto")return[];
 if(sup==="Steel-Line"&&type==="Sectional")return[
  ["matt","Colorbond Matt","check",()=>w<=3500?220:332],["wood","Colorbond Premium Woodlook","check",()=>w<=3500?220:368],["ranch","Ranch window insert","qty",()=>144],["stan","Stanford window insert","qty",()=>92],["herit","Heritage window insert","qty",()=>73],["tap","Taper","check",()=>w<=3500?159:258],["pel250","250mm × 55mm pelmet","check",()=>156],["pel200","200mm pelmet + Quick Closers","check",()=>220],["coast","Coastal upgrade","check",()=>557],["ins","Mammoth insulation","check",()=>insulation(w,h)],["j12524","Jamb pair 125×70×2400","check",()=>152],["j12530","Jamb pair 125×70×3000","check",()=>183],["j15024","Jamb pair 150×70×2400","check",()=>158],["j15030","Jamb pair 150×70×3000","check",()=>193],["c12524","Cover pair 125×70×2400","check",()=>83],["c12530","Cover pair 125×70×3000","check",()=>97],["c15024","Cover pair 150×70×2400","check",()=>86],["c15030","Cover pair 150×70×3000","check",()=>100]
 ];
 if(sup==="Centurion"&&type==="Sectional")return[
  ["side","Side track seals","check",()=>33],["reg","Regency window insert","qty",()=>86],["geo","Georgian window insert","qty",()=>170],["tap","Taper hinged >40mm","check",()=>134*lm(w)],["timba","Timbalook Premium finish","check",()=> (h<=2330?111:h<=2910?139:166)*lm(w)],["flex","Flexographic finish","check",()=>53*sqm(w,h)],["pow","Powdercoat finish","check",()=>53*sqm(w,h)],["weather","Oversize weather seal","check",()=>8*lm(w)],["lhr","Low headroom kit","check",()=>89],
  ["pel250","250mm × 55mm pelmet","check",()=>156,"Steel-Line"],["pel200","200mm pelmet + Quick Closers","check",()=>220,"Steel-Line"],
  ["j12524","Jamb pair 125×70×2400","check",()=>152,"Steel-Line"],["j12530","Jamb pair 125×70×3000","check",()=>183,"Steel-Line"],["j15024","Jamb pair 150×70×2400","check",()=>158,"Steel-Line"],["j15030","Jamb pair 150×70×3000","check",()=>193,"Steel-Line"]
 ];
 if(sup==="Steel-Line"&&type==="Roller")return[
  ["matt","Colorbond Matt","check",()=>w<=3100?184:272],["rev","Reverse rolled","check",()=>w<=3100?110:125],["aa","AA track upgrade","check",()=>w<=3100?174:null],["pel","300mm pelmet","check",()=>w<=3100?105:113],["tap","Taper","check",()=>w<=3000?189:262],["j12524","Jamb pair 125×70×2400","check",()=>152],["j12530","Jamb pair 125×70×3000","check",()=>183],["j15024","Jamb pair 150×70×2400","check",()=>158],["j15030","Jamb pair 150×70×3000","check",()=>193],["c12524","Cover pair 125×70×2400","check",()=>83],["c12530","Cover pair 125×70×3000","check",()=>97],["c15024","Cover pair 150×70×2400","check",()=>86],["c15030","Cover pair 150×70×3000","check",()=>100],["shoot","Shoot bolts pair","check",()=>37],["lock","Centre lock","check",()=>48],["ember","Ember brush seal top","check",()=>201]
 ];
 if(sup==="Centurion"&&type==="Roller")return[
  ["matt","Premium Matt Colorbond","check",()=> (h<=2200?104:h<=2600?114:h<=3600?142:199)*lm(w)],["tap","Taper","check",()=>42*lm(w)],["rev","Reverse rolled","check",()=>w<=3100?105:149],["weather","Oversize weather seal","check",()=>8*lm(w)],["card","Hard cardboard cylinder stretch","check",()=>20*lm(w)],["shrink","Hard cardboard cylinder shrink","check",()=>27*lm(w)],["box","Box a Door packaging","check",()=>boxCost(w)]
 ];return[]
}
function addonSuggestedRetail(cost){if(cost==null||!Number.isFinite(+cost))return 0;return Math.ceil((+cost)*(1+S.addonMarkup/100)*(1+S.gst/100)/10)*10}
function effectiveAddonSupplier(sup,type,w,h){
 if(sup!=="Auto")return sup;
 const b=base(type,w,h,"Auto");
 if(b.ok&&b.recommended)return b.recommended;
 const c=costs(type,w,h);
 if(c["Steel-Line"])return "Steel-Line";
 if(c.Centurion)return "Centurion";
 return "Steel-Line";
}

function uid(){return Date.now().toString(36)+Math.random().toString(36).slice(2,8)}
function activeAddonDefs(sourceSupplier){
 const type=$("doorType").value,w=+$("width").value||0,h=+$("height").value||0;
 return defs(sourceSupplier||effectiveAddonSupplier($("supplier").value,type,w,h),type,w,h)
}
function repriceCurrentExtras(){
 const type=$("doorType").value,w=+$("width").value||0,h=+$("height").value||0;
 currentExtras=currentExtras.map(function(item){
   if(!item.presetId)return item;
   const source=item.sourceSupplier||effectiveAddonSupplier($("supplier").value,type,w,h);
   const d=defs(source,type,w,h).find(function(x){return x[0]===item.presetId});
   if(!d)return Object.assign({},item,{unitCost:null,needsReview:true});
   const c=d[3]();
   return Object.assign({},item,{name:d[1],sourceSupplier:d[4]||source,unitCost:c,needsReview:c==null})
 })
}
function renderAddons(preserve){
 if(preserve===undefined)preserve=true;
 if(!$("extraChoice"))return;
 const selectedSup=$("supplier").value,type=$("doorType").value,w=+$("width").value||0,h=+$("height").value||0,sup=effectiveAddonSupplier(selectedSup,type,w,h);
 repriceCurrentExtras();
 const oldChoice=preserve?$("extraChoice").value:"",ds=defs(sup,type,w,h);
 $("addonMessage").textContent=selectedSup==="Auto" ? "Auto mode is using "+sup+" internal cost pricing for this "+(w||"—")+" × "+(h||"—")+" mm door. Customer price must be entered manually." : sup+" internal add-on costs recalculate live from the current "+(w||"—")+" × "+(h||"—")+" mm door size. Customer price must be entered manually.";
 $("extraChoice").innerHTML='<option value="">Select extra</option>'+ds.map(function(d){return '<option value="'+d[0]+'">'+d[1]+(d[4]?" — "+d[4]+" accessory":"")+'</option>'}).join("")+'<option value="__custom">Custom extra / product</option>';
 if(Array.from($("extraChoice").options).some(function(o){return o.value===oldChoice}))$("extraChoice").value=oldChoice;
 $("extraChoice").onchange=refreshExtraComposerCost;
 refreshExtraComposerCost();
 renderExtraItems()
}
function refreshExtraComposerCost(){
 if(!$("extraChoice"))return;
 const choice=$("extraChoice").value;
 $("extraCost").readOnly=true;
 if(!choice){$("extraCost").value="";return}
 if(choice==="__custom"){$("extraCost").readOnly=false;$("extraCost").value="";return}
 const type=$("doorType").value,w=+$("width").value||0,h=+$("height").value||0,sup=effectiveAddonSupplier($("supplier").value,type,w,h),d=defs(sup,type,w,h).find(function(x){return x[0]===choice});
 $("extraCost").value=d&&d[3]()!=null?Math.round(d[3]()):""
}
function addExtraItem(){
 const choice=$("extraChoice").value,qty=Math.max(1,+$("extraQty").value||1),measure=$("extraMeasure").value.trim(),unitRetail=+$("extraPrice").value||0,enteredCost=+$("extraCost").value||0;
 if(!choice)return toast("Choose an extra first");
 if(unitRetail<=0)return toast("Technician must enter the customer price");
 const type=$("doorType").value,w=+$("width").value||0,h=+$("height").value||0,sup=effectiveAddonSupplier($("supplier").value,type,w,h);
 let item;
 if(choice==="__custom"){
   const name=$("extraDescription").value.trim();if(!name)return toast("Enter a description for the custom extra");
   item={uid:uid(),presetId:null,name:name,measure:measure,qty:qty,unitCost:enteredCost,unitRetail:unitRetail,sourceSupplier:null,needsReview:false}
 }else{
   const d=defs(sup,type,w,h).find(function(x){return x[0]===choice});if(!d)return toast("Extra is not available for this door");
   const c=d[3]();if(c==null)return toast("This extra needs office pricing review");
   item={uid:uid(),presetId:d[0],name:d[1],measure:measure,qty:qty,unitCost:c,unitRetail:unitRetail,sourceSupplier:d[4]||sup,needsReview:false}
 }
 currentExtras.push(item);
 $("extraChoice").value="";$("extraDescription").value="";$("extraMeasure").value="";$("extraQty").value=1;$("extraCost").value="";$("extraPrice").value="";
 renderAddons(false);calc();saveDraft();toast("Extra added")
}
function renderExtraItems(){
 if(!$("extraItemsList"))return;
 if(!currentExtras.length){$("extraItemsList").innerHTML='<div class="hint">No extras added to this door yet.</div>';return}
 $("extraItemsList").innerHTML=currentExtras.map(function(i){
   return '<div class="extra-item"><div><div class="extra-title">'+safe(i.name)+'</div><div class="extra-meta">'+(i.measure?safe(i.measure)+" • ":"")+(i.sourceSupplier?safe(i.sourceSupplier)+" • ":"")+"Internal cost "+money(i.unitCost||0)+" ex GST"+'</div></div><input data-extra-field="measure" data-extra-id="'+i.uid+'" aria-label="Size or measure" value="'+safe(i.measure||"")+'"><input data-extra-field="qty" data-extra-id="'+i.uid+'" aria-label="Quantity" type="number" min="1" step="1" value="'+(i.qty||1)+'"><input data-extra-field="unitRetail" data-extra-id="'+i.uid+'" aria-label="Customer price" type="number" min="0" step="10" value="'+(i.unitRetail||0)+'"><button class="remove-extra" data-remove-extra="'+i.uid+'" title="Remove extra">×</button></div>'
 }).join("");
 document.querySelectorAll("[data-extra-field]").forEach(function(el){el.addEventListener("change",function(){updateExtraItem(el.dataset.extraId,el.dataset.extraField,el.value)})});
 document.querySelectorAll("[data-remove-extra]").forEach(function(el){el.addEventListener("click",function(){removeExtraItem(el.dataset.removeExtra)})})
}
function updateExtraItem(id,field,value){
 const i=currentExtras.find(function(x){return x.uid===id});if(!i)return;
 if(field==="qty")i.qty=Math.max(1,+value||1);else if(field==="unitRetail")i.unitRetail=+value||0;else i[field]=value;
 calc();saveDraft()
}
function removeExtraItem(id){currentExtras=currentExtras.filter(function(x){return x.uid!==id});renderExtraItems();calc();saveDraft()}
function selectedAddons(){
 repriceCurrentExtras();let costTotal=0,retailTotal=0,names=[],items=[],review=false;
 currentExtras.forEach(function(i){
   const qty=Math.max(1,+i.qty||1),c=i.unitCost,unitRetail=+i.unitRetail||0,itemCost=c==null?0:c*qty,totalRetail=unitRetail*qty;
   if(c==null||i.needsReview||unitRetail<=0)review=true;
   costTotal+=itemCost;retailTotal+=totalRetail;
   const display=i.name+(i.measure?" — "+i.measure:"");names.push(display+(qty>1?" ×"+qty:""));
   items.push(Object.assign({},i,{qty:qty,totalCost:c==null?null:itemCost,totalRetail:totalRetail,displayName:display}))
 });
 return{total:costTotal,costTotal:costTotal,retailTotal:retailTotal,names:names,items:items,review:review}
}
function qno(){const d=new Date(),p=n=>String(n).padStart(2,"0");return`BOB-${d.getFullYear()}${p(d.getMonth()+1)}${p(d.getDate())}-${p(d.getHours())}${p(d.getMinutes())}`}

function structuredCloneSafe(v){return JSON.parse(JSON.stringify(v))}
function doorStarted(q){return !!(q&&(q.w||q.h||q.colour||q.profile||q.notes||(q.addonItems&&q.addonItems.length)))}
function composeQuote(current){
 const doors=quoteDoors.map(structuredCloneSafe);
 if(doorStarted(current))doors.push(structuredCloneSafe(current));
 const contact=cityContact($("city").value),issue=doors.reduce(function(a,d){return a+(+d.issue||0)},0),minimum=doors.reduce(function(a,d){return a+(+d.minimum||0)},0),recommended=doors.reduce(function(a,d){return a+(+d.recommended||0)},0);
 const status=doors.length&&doors.every(function(d){return d.status==="APPROVED"})?"APPROVED":"CALL OFFICE";
 return{quoteNo:$("quoteNo").value.trim(),customer:$("customer").value.trim(),phone:$("phone").value.trim(),email:$("email").value.trim(),suburb:$("suburb").value.trim(),city:$("city").value,doors:doors,issue:issue,minimum:minimum,recommended:recommended,status:status,businessName:S.businessName,businessPhone:contact.phone,businessEmail:contact.email,businessWebsite:contact.website,quoteValidity:S.quoteValidity}
}
function quoteSummary(q){
 const lines=[S.businessName.toUpperCase(),q.businessPhone?"Phone: "+q.businessPhone:null,q.businessEmail?"Email: "+q.businessEmail:null,q.businessWebsite?"Web: "+q.businessWebsite:null,q.quoteNo?"Quote: "+q.quoteNo:null,q.customer?"Customer: "+q.customer:null,q.suburb?"Location: "+q.suburb:null,""];
 q.doors.forEach(function(d,i){
   lines.push("DOOR "+(i+1)+" — "+d.type.toUpperCase(),"Width: "+d.w+" mm","Height: "+d.h+" mm","Colour: "+(d.colour||"—"),"Profile: "+(d.profile||"—"),"Motor: "+d.motor,"Removal of existing door: "+(d.removal?"Yes":"No"));
   if(d.addonItems&&d.addonItems.length)lines.push("Extras: "+d.addonItems.map(function(x){return (x.displayName||x.name)+(x.qty>1?" ×"+x.qty:"")}).join(", "));
   if(d.notes)lines.push("Notes: "+d.notes);
   lines.push("Door total: "+money(d.issue)+" incl. GST","")
 });
 lines.push(q.issue?"QUOTE TOTAL: "+money(q.issue)+" incl. GST":"PRICE: Office review required",q.status==="APPROVED"?"Price includes GST. Valid for "+S.quoteValidity+" days.":"Office approval required before issuing quote.");
 return lines.filter(function(x){return x!==null}).join("\n")
}
function renderDoorItems(){
 if(!$("doorItems"))return;
 if(!quoteDoors.length)$("doorItems").innerHTML='<div class="hint">No completed doors added yet. The current door is included automatically until you add it and start another.</div>';
 else $("doorItems").innerHTML=quoteDoors.map(function(d,i){
   return '<div class="door-item"><div class="door-no">'+(i+1)+'</div><div class="door-main"><b>'+safe(d.type)+' — Width '+d.w+' mm × Height '+d.h+' mm</b><small>'+safe(d.colour||"")+' • '+safe(d.profile||"")+' • '+safe(d.motor||"")+'</small></div><div class="door-price">'+money(d.issue)+'</div><button class="door-edit" onclick="editDoor('+i+')">Edit</button><button class="door-remove" onclick="removeDoor('+i+')">Remove</button></div>'
 }).join("")
}
function calc(){
 const city=$("city").value,type=$("doorType").value,sup=$("supplier").value,w=+$("width").value||0,h=+$("height").value||0,hasSize=w>0&&h>0,b=hasSize?base(type,w,h,sup):{ok:false,c:{}},mi=motor(city,$("motor").value),ad=selectedAddons(),rem=$("removal").value==="Yes",specialLift=$("specialLift")&&$("specialLift").value==="Yes",siteMeasure=$("siteMeasure")&&$("siteMeasure").value==="Yes",labour=installationCost(city,type,w,h,rem,mi.name,specialLift,siteMeasure),ta=labour.ok?labour.cost:0,spec=validateRequiredSpecs(),contact=cityContact(city);
 let review=hasSize&&(!b.ok||!labour.ok||ad.review||!spec.ok),reason=!hasSize?"Enter door width and height":(!spec.ok?spec.reason:(!b.ok?(b.reason||"Size is outside automatic supplier pricing"):(!labour.ok?labour.label:(ad.review?"Selected extra needs cost/customer price review":""))));
 let rec=0,min=0;
 if(hasSize&&b.ok){
   const gst=1+S.gst/100,costTarget=(b.cost+ad.costTotal+mi.cost+ta+S.targetMargin)*gst,salesTarget=(b.cost+ta+S.targetMargin)*gst+ad.retailTotal+mi.retail;
   rec=ceil50(Math.max(costTarget,salesTarget)+(city==="Perth"&&rem?S.removalRetail:0));
   min=ceil50((b.cost+ad.costTotal+mi.cost+ta+S.minMargin)*gst+(city==="Perth"&&rem?S.removalRetail:0))
 }
 const ftxt=$("finalOffer").value.trim(),f=ftxt?+$("finalOffer").value:0,issue=f||rec;
 if(f&&f<min){review=true;reason="Final offer is below the authorised minimum"}
 const margin=hasSize&&b.ok&&issue?((issue-(city==="Perth"&&rem?S.removalRetail:0))/(1+S.gst/100)-b.cost-ad.costTotal-mi.cost-ta):null;
 const q={quoteNo:$("quoteNo").value.trim(),customer:$("customer").value.trim(),phone:$("phone").value.trim(),email:$("email").value.trim(),suburb:$("suburb").value.trim(),city:city,type:type,supplier:sup,w:w,h:h,colour:spec.colour,profile:spec.profile,motor:mi.name,addons:ad.names.join("; "),addonItems:ad.items,addonCostTotal:ad.costTotal,addonRetailTotal:ad.retailTotal,removal:rem,removalRetail:(city==="Perth"&&rem)?S.removalRetail:0,specialLift:specialLift,siteMeasure:siteMeasure,installationCost:ta,installationLabel:labour.label,motorRetail:mi.retail,customExtra:0,notes:$("notes").value.trim(),recommended:rec,minimum:min,issue:issue,status:hasSize&&!review?"APPROVED":"CALL OFFICE",margin:margin,businessName:S.businessName,businessPhone:contact.phone,businessEmail:contact.email,businessWebsite:contact.website,quoteValidity:S.quoteValidity};
 $("recommended").textContent=hasSize?(rec?money(rec):"REVIEW"):"—";$("minimum").textContent=min?money(min):"—";$("issue").textContent=issue?money(issue):"—";$("basisSupplier").textContent=hasSize&&b.ok?b.basis:"—";$("motorName").textContent=mi.name;
 $("steelCost").textContent=b.c&&b.c["Steel-Line"]?money(b.c["Steel-Line"].cost):"—";$("centCost").textContent=b.c&&b.c.Centurion?money(b.c.Centurion.cost):"—";$("addonCost").textContent=money(ad.costTotal);$("techCost").textContent=hasSize&&labour.ok?money(ta):"REVIEW";$("motorCost").textContent=money(mi.cost);$("margin").textContent=margin==null?"—":money(margin);$("margin").style.color=margin==null?"":margin<S.minMargin?"#b42318":margin<=1500?"#177a3d":"#0b1f33";
 const st=$("status");st.className="status "+(hasSize?(review?"bad":"good"):(quoteDoors.length?"good":"bad"));st.textContent=hasSize?(review?"CALL OFFICE — "+reason:"READY — current door can be quoted"):(quoteDoors.length?"READY — "+quoteDoors.length+" completed door(s) in quote":"ENTER CURRENT DOOR DETAILS");
 $("supplierAdvice").textContent=hasSize&&b.ok?(sup==="Auto"?"Auto uses the higher available supplier cost for safe pricing. Cheaper current base supplier: "+b.recommended+" "+money(b.recommendedCost)+" ex GST.":"Pricing basis: "+sup+" "+money(b.cost)+" ex GST. Selected extras supplier cost: "+money(ad.costTotal)+" ex GST; quoted extras: "+money(ad.retailTotal)+" incl. GST."):"";
 const full=composeQuote(q);
 if($("wholeQuoteTotal"))$("wholeQuoteTotal").textContent=full.issue?money(full.issue):"—";if($("quoteTotal"))$("quoteTotal").textContent=money(full.issue||0);if($("quoteDoorsCount"))$("quoteDoorsCount").textContent=full.doors.length+" door"+(full.doors.length===1?"":"s")+" in quote";$("summary").textContent=quoteSummary(full);renderDoorItems();
 return q
}
function getFullQuote(){return composeQuote(calc())}
function addCurrentDoor(){
 const q=calc();if(!doorStarted(q)||q.status!=="APPROVED")return toast("Complete the current door before adding another");
 quoteDoors.push(structuredCloneSafe(q));clearCurrentDoor();saveDraft();calc();toast("Door added — start the next door")
}
function clearCurrentDoor(){
 $("doorType").value="Sectional";$("supplier").value="Auto";$("width").value="";$("height").value="";$("motor").value="Standard Motor";$("removal").value="No";if($("specialLift"))$("specialLift").value="No";if($("siteMeasure"))$("siteMeasure").value="No";$("notes").value="";$("finalOffer").value="";
 currentExtras=[];populateColourProfile(false);renderAddons(false)
}
function editDoor(i){
 const d=quoteDoors[i];if(!d)return;
 const current=calc();if(doorStarted(current)&&!confirm("Replace the current unfinished door with Door "+(i+1)+"?"))return;
 quoteDoors.splice(i,1);$("doorType").value=d.type;$("supplier").value=d.supplier;$("width").value=d.w;$("height").value=d.h;$("motor").value=(d.motor==="JayTech"||d.motor==="Superlift")?"Standard Motor":d.motor;$("removal").value=d.removal?"Yes":"No";if($("specialLift"))$("specialLift").value=d.specialLift?"Yes":"No";if($("siteMeasure"))$("siteMeasure").value=d.siteMeasure?"Yes":"No";$("notes").value=d.notes||"";$("finalOffer").value=d.issue&&d.issue!==d.recommended?d.issue:"";
 populateColourProfile(false);$("doorColour").value=d.colour||"";$("doorProfile").value=d.profile||"";
 currentExtras=(d.addonItems||[]).map(function(x){return Object.assign({},x,{uid:x.uid||uid()})});
 renderAddons(false);saveDraft();calc();window.scrollTo({top:0,behavior:"smooth"})
}
function removeDoor(i){if(!quoteDoors[i])return;if(confirm("Remove Door "+(i+1)+" from this quote?")){quoteDoors.splice(i,1);saveDraft();calc()}}
function safeWrite(key,value){try{const prev=localStorage.getItem(key);if(prev!==null)localStorage.setItem(key+"_backup",prev);localStorage.setItem(key,value)}catch(e){}}
function saveDraft(){
 if(new URLSearchParams(location.search).get("quote"))return;
 const ids=["quoteNo","customer","phone","email","suburb","city","doorType","supplier","width","height","doorColour","doorProfile","motor","removal","specialLift","siteMeasure","notes","finalOffer"],fields={};
 ids.forEach(function(id){if($(id))fields[id]=$(id).value});
 safeWrite(DRAFT_KEY,JSON.stringify({version:APP_VERSION,fields:fields,currentExtras:currentExtras,quoteDoors:quoteDoors,updatedAt:new Date().toISOString()}))
}
function restoreDraft(){
 try{
  const d=JSON.parse(localStorage.getItem(DRAFT_KEY)||"null");if(!d||!d.fields)return false;
  ["quoteNo","customer","phone","email","suburb","city","doorType","supplier","width","height","motor","removal","specialLift","siteMeasure","notes","finalOffer"].forEach(function(id){if($(id)&&d.fields[id]!==undefined)$(id).value=d.fields[id]});
  populateColourProfile(false);if(d.fields.doorColour!==undefined)$("doorColour").value=d.fields.doorColour;if(d.fields.doorProfile!==undefined)$("doorProfile").value=d.fields.doorProfile;
  currentExtras=Array.isArray(d.currentExtras)?d.currentExtras:[];quoteDoors=Array.isArray(d.quoteDoors)?d.quoteDoors:[];
  return true
 }catch(e){return false}
}
function toast(t){const x=$("toast");x.textContent=t;x.classList.add("show");setTimeout(()=>x.classList.remove("show"),1800)}
function phone(p){let x=(p||"").replace(/\D/g,"");if(x.startsWith("0"))x="61"+x.slice(1);return x}

function shareWhatsApp(){
 const q=getFullQuote();if(q.status!=="APPROVED")return toast("Complete all doors before sharing");
 const msg="Hi "+(q.customer||"")+", your "+S.businessName+" quotation "+q.quoteNo+" totals "+money(q.issue)+" incl. GST. I am sending the professional PDF separately.";
 window.open("https://wa.me/"+phone(q.phone)+"?text="+encodeURIComponent(msg),"_blank")
}
function shareEmail(){
 const q=getFullQuote();if(q.status!=="APPROVED")return toast("Complete all doors before emailing");
 location.href="mailto:"+(q.email||"")+"?subject="+encodeURIComponent(S.businessName+" Quote "+q.quoteNo)+"&body="+encodeURIComponent("Hi "+(q.customer||"")+",\n\nPlease find your professional quotation attached. Use the Share PDF button to attach the PDF.\n\nRegards,\n"+S.businessName)
}
function safe(v){return String(v||"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[m]))}
async function logoPngData(){
 try{
   const svg=await fetch("brand-logo.svg").then(r=>r.text()),blob=new Blob([svg],{type:"image/svg+xml"}),url=URL.createObjectURL(blob),img=new Image();
   const data=await new Promise((resolve,reject)=>{img.onload=()=>{const c=document.createElement("canvas");c.width=760;c.height=300;const x=c.getContext("2d");x.fillStyle="#0b1f33";x.fillRect(0,0,c.width,c.height);x.drawImage(img,0,0,c.width,c.height);URL.revokeObjectURL(url);resolve(c.toDataURL("image/png"))};img.onerror=reject;img.src=url});
   return data
 }catch(e){return null}
}
function pdfFileName(q){return `${(q.quoteNo||"BOB-Quote").replace(/[^a-z0-9_-]/gi,"-")}.pdf`}
function pdfMoney(n){return "$"+Number(n||0).toLocaleString("en-AU",{minimumFractionDigits:2,maximumFractionDigits:2})}

async function buildPdfQuote(){
 const q=getFullQuote();if(q.status!=="APPROVED"||!q.doors.length){toast("Complete all doors and required fields first");return null}
 if(!window.jspdf||!window.jspdf.jsPDF){toast("PDF engine is still loading. Try again in a moment.");return null}
 const jsPDF=window.jspdf.jsPDF,doc=new jsPDF({unit:"mm",format:"a4",compress:true}),PW=210,M=15,gst=1+S.gst/100;
 const navy=[11,31,51],yellow=[247,190,35],ink=[26,38,50],muted=[100,112,126],line=[222,228,235],light=[247,249,252],logo=await logoPngData();
 function header(){
   doc.setFillColor.apply(doc,navy);doc.rect(0,0,PW,48,"F");
   if(logo)doc.addImage(logo,"PNG",M,5,67,28);else{doc.setTextColor(255,255,255);doc.setFont("helvetica","bold");doc.setFontSize(20);doc.text("B.O.B GARAGE DOORS",M,24)}
   doc.setTextColor(255,255,255);doc.setFont("helvetica","bold");doc.setFontSize(18);doc.text("QUOTATION",PW-M,17,{align:"right"});
   doc.setFont("helvetica","normal");doc.setFontSize(9);doc.text(q.city+" Service",PW-M,25,{align:"right"});doc.setDrawColor.apply(doc,yellow);doc.setLineWidth(1.6);doc.line(0,48,PW,48)
 }
 function newPage(){doc.addPage();header();return 59}
 header();let y=59;
 function ensure(h){if(y+h>267)y=newPage()}
 doc.setTextColor.apply(doc,ink);doc.setFont("helvetica","bold");doc.setFontSize(10);doc.text("QUOTE DETAILS",M,y);y+=5;doc.setFillColor.apply(doc,light);doc.roundedRect(M,y,PW-2*M,30,3,3,"F");
 const detail=[["Quote #",q.quoteNo||"-"],["Date",new Date().toLocaleDateString("en-AU")],["Valid for",q.quoteValidity+" days"],["Customer",q.customer||"-"],["Phone",q.phone||"-"],["Email",q.email||"-"],["Location",q.suburb||q.city],["Doors",String(q.doors.length)]];
 detail.forEach(function(r,i){const col=i%4,row=Math.floor(i/4),x=M+5+col*43.5,yy=y+7+row*12;doc.setFont("helvetica","normal");doc.setFontSize(7.5);doc.setTextColor.apply(doc,muted);doc.text(r[0],x,yy);doc.setFont("helvetica","bold");doc.setFontSize(8.4);doc.setTextColor.apply(doc,ink);doc.text(String(r[1]).slice(0,23),x,yy+4.5)});y+=39;
 q.doors.forEach(function(d,i){
   ensure(49);doc.setFillColor.apply(doc,navy);doc.roundedRect(M,y,PW-2*M,8,2,2,"F");doc.setTextColor(255,255,255);doc.setFont("helvetica","bold");doc.setFontSize(9);doc.text("DOOR "+(i+1)+" — "+String(d.type||"").toUpperCase(),M+4,y+5.5);doc.setTextColor.apply(doc,yellow);doc.text(pdfMoney(d.issue)+" incl. GST",PW-M-4,y+5.5,{align:"right"});y+=11;
   doc.setDrawColor.apply(doc,line);doc.setFillColor(255,255,255);doc.roundedRect(M,y,PW-2*M,31,2,2,"FD");
   const left=M+5,right=M+95,rowsL=[["Width",d.w+" mm"],["Height",d.h+" mm"],["Colour",d.colour],["Profile / style",d.profile]],rowsR=[["Motor",d.motor],["Removal",d.removal?"Included":"Not included"],["Extras",(d.addonItems||[]).length+" item(s)"],["Installation","Supply & install"]];
   rowsL.forEach(function(r,j){const yy=y+6+j*6.3;doc.setFont("helvetica","normal");doc.setFontSize(7.6);doc.setTextColor.apply(doc,muted);doc.text(r[0],left,yy);doc.setFont("helvetica","bold");doc.setTextColor.apply(doc,ink);doc.text(String(r[1]||"-").slice(0,38),left+25,yy)});
   rowsR.forEach(function(r,j){const yy=y+6+j*6.3;doc.setFont("helvetica","normal");doc.setFontSize(7.6);doc.setTextColor.apply(doc,muted);doc.text(r[0],right,yy);doc.setFont("helvetica","bold");doc.setTextColor.apply(doc,ink);doc.text(String(r[1]||"-").slice(0,31),right+28,yy)});y+=37
 });
 ensure(20);doc.setTextColor.apply(doc,ink);doc.setFont("helvetica","bold");doc.setFontSize(10);doc.text("QUOTE ITEMS",M,y);y+=5;
 const cols={desc:M,qty:148,amt:PW-M};
 function tableHead(){doc.setFillColor.apply(doc,navy);doc.rect(M,y,PW-2*M,9,"F");doc.setTextColor(255,255,255);doc.setFont("helvetica","bold");doc.setFontSize(8.3);doc.text("DESCRIPTION",M+4,y+6);doc.text("QTY",cols.qty,y+6,{align:"center"});doc.text("AMOUNT",cols.amt-4,y+6,{align:"right"});y+=9}
 function tableEnsure(h){if(y+h>255){y=newPage();tableHead()}}
 tableHead();let rowNo=0;
 q.doors.forEach(function(d,di){
   const extraRetail=(d.addonItems||[]).reduce(function(a,i){return a+(+i.totalRetail||0)},0)+(d.removalRetail||0),baseRetail=Math.max(0,d.issue-extraRetail),rows=[{d:"Door "+(di+1)+" — "+d.type+" garage door supply & installation",q:1,a:baseRetail}];
   (d.addonItems||[]).forEach(function(i){rows.push({d:"Door "+(di+1)+" extra — "+(i.displayName||i.name),q:i.qty||1,a:i.totalRetail||0})});
   if(d.removalRetail)rows.push({d:"Door "+(di+1)+" — removal & disposal of existing garage door",q:1,a:d.removalRetail});
   rows.forEach(function(r){tableEnsure(11);if(rowNo++%2===0){doc.setFillColor.apply(doc,light);doc.rect(M,y,PW-2*M,10,"F")}doc.setTextColor.apply(doc,ink);doc.setFont("helvetica","normal");doc.setFontSize(8.2);const desc=doc.splitTextToSize(r.d,116);doc.text(desc,M+4,y+6);doc.text(String(r.q),cols.qty,y+6,{align:"center"});doc.setFont("helvetica","bold");doc.text(pdfMoney(r.a),cols.amt-4,y+6,{align:"right"});y+=Math.max(10,desc.length*4+3)})
 });
 ensure(38);y+=4;const ex=q.issue/gst,gstAmt=q.issue-ex;doc.setDrawColor.apply(doc,line);doc.line(120,y,PW-M,y);y+=7;doc.setFont("helvetica","normal");doc.setFontSize(9);doc.setTextColor.apply(doc,muted);doc.text("Subtotal ex GST",153,y,{align:"right"});doc.setTextColor.apply(doc,ink);doc.text(pdfMoney(ex),PW-M,y,{align:"right"});y+=7;doc.setTextColor.apply(doc,muted);doc.text("GST",153,y,{align:"right"});doc.setTextColor.apply(doc,ink);doc.text(pdfMoney(gstAmt),PW-M,y,{align:"right"});y+=8;doc.setFillColor.apply(doc,yellow);doc.roundedRect(119,y-5,PW-M-119,14,2,2,"F");doc.setTextColor.apply(doc,navy);doc.setFont("helvetica","bold");doc.setFontSize(12);doc.text("TOTAL",153,y+3.5,{align:"right"});doc.text(pdfMoney(q.issue),PW-M,y+3.5,{align:"right"});y+=22;
 const notes=q.doors.map(function(d,i){return d.notes?"Door "+(i+1)+": "+d.notes:""}).filter(Boolean);
 if(notes.length){ensure(28);doc.setTextColor.apply(doc,ink);doc.setFont("helvetica","bold");doc.setFontSize(10);doc.text("NOTES",M,y);y+=5;doc.setFont("helvetica","normal");doc.setFontSize(8.4);doc.setTextColor.apply(doc,muted);notes.forEach(function(n){const a=doc.splitTextToSize("• "+n,PW-2*M);doc.text(a,M,y);y+=a.length*4.1+2})}
 ensure(38);doc.setTextColor.apply(doc,ink);doc.setFont("helvetica","bold");doc.setFontSize(10);doc.text("QUOTE INFORMATION",M,y);y+=6;doc.setFont("helvetica","normal");doc.setFontSize(8.2);doc.setTextColor.apply(doc,muted);
 ["This quotation is valid for "+q.quoteValidity+" days.","All prices shown include GST unless stated otherwise.","Final manufacture/order is based on the confirmed width, height, colour and profile shown for each door.","Any additional work not listed in this quotation requires approval before proceeding."].forEach(function(t){const a=doc.splitTextToSize("• "+t,PW-2*M);doc.text(a,M,y);y+=a.length*4.1+2});
 doc.setDrawColor.apply(doc,yellow);doc.setLineWidth(.8);doc.line(M,279,PW-M,279);doc.setFont("helvetica","bold");doc.setFontSize(8.5);doc.setTextColor.apply(doc,ink);doc.text(S.businessName,M,285);doc.setFont("helvetica","normal");doc.setTextColor.apply(doc,muted);doc.text([q.businessPhone,q.businessEmail,q.businessWebsite].filter(Boolean).join(" • ").slice(0,105),M,290);
 return doc.output("blob")
}
function downloadBlob(blob,name){const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1500)}
async function downloadPdfQuote(){const q=getFullQuote(),blob=await buildPdfQuote();if(!blob)return;downloadBlob(blob,pdfFileName(q));toast("PDF downloaded")}
async function sharePdfQuote(){const q=getFullQuote(),blob=await buildPdfQuote();if(!blob)return;const file=new File([blob],pdfFileName(q),{type:"application/pdf"});if(navigator.share&&(!navigator.canShare||navigator.canShare({files:[file]}))){try{await navigator.share({title:`${S.businessName} Quote ${q.quoteNo}`,files:[file]});return}catch(e){if(e?.name==="AbortError")return}}downloadBlob(blob,pdfFileName(q));toast("PDF downloaded - attach it to WhatsApp or email")}
function printable(autoPrint=true){const q=calc(),scr=safe($("summary").textContent),contact=[q.businessPhone,q.businessEmail,q.businessWebsite].filter(Boolean).map(safe).join(" • ");return`<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${safe(q.quoteNo)}</title><style>body{font-family:Arial;color:#152536;padding:40px;max-width:820px;margin:auto}.head{background:#0b1f33;color:white;padding:24px;border-radius:16px}.contact{opacity:.8;margin-top:6px}.price{font-size:36px;font-weight:900;margin:26px 0;color:#174b2d}.box{border:1px solid #d8e0ea;border-radius:12px;padding:20px;line-height:1.7;white-space:pre-wrap}.foot{margin-top:25px;color:#687386;font-size:12px}@media(max-width:600px){body{padding:18px}}</style></head><body><div class="head"><img src="brand-logo.svg" style="width:210px;max-width:60%;height:auto"><div style="font-size:24px;font-weight:900;margin-top:8px">${safe(S.businessName)}</div><div>Supply & Installation Quote • ${safe(q.city)}</div><div class="contact">${contact}</div></div><div class="price">${q.issue?money(q.issue)+" incl. GST":"Office review required"}</div><div class="box">${scr}</div><div class="foot">Quote valid for ${safe(S.quoteValidity)} days.</div>${autoPrint?'<script>window.onload=()=>window.print()<\\/script>':""}</body></html>`}
function printQuote(){const w=window.open("","_blank");if(!w)return toast("Allow pop-ups");w.document.write(printable(true));w.document.close()}

function saveQuote(){
 const q=getFullQuote();if(!q.doors.length)return toast("Add at least one door first");
 const a=JSON.parse(localStorage.getItem(QUOTES_KEY)||"[]");a.unshift(Object.assign({},q,{date:new Date().toISOString()}));safeWrite(QUOTES_KEY,JSON.stringify(a.slice(0,300)));toast("Quote saved")
}
function newQuote(){
 if((quoteDoors.length||doorStarted(calc()))&&!confirm("Start a new quote? The current draft will be cleared."))return;
 quoteDoors=[];currentExtras=[];["customer","phone","email","suburb","notes","finalOffer"].forEach(function(x){if($(x))$(x).value=""});
 $("quoteNo").value=qno();$("city").value="Perth";clearCurrentDoor();localStorage.removeItem(DRAFT_KEY);refreshHeaderContact();calc();saveDraft()
}
function setMode(m,boot){
 if(boot===undefined)boot=false;
 if(ROLE_LOCK&&m!==ROLE_LOCK)return;
 if(m==="admin"&&S.adminPin){const p=prompt("Enter Admin PIN");if(p!==String(S.adminPin)){if(ROLE_LOCK){document.body.className="tech role-locked";return}return toast("Incorrect PIN")}}
 document.body.className=m+(ROLE_LOCK?" role-locked":"");localStorage.setItem("bob_v3_mode",m);
 if(m!=="admin"&&$("settings")&&!$("settings").classList.contains("hidden"))showTab("builder",document.querySelector(".tab"))
}
function showTab(id,e){document.querySelectorAll(".page").forEach(x=>x.classList.add("hidden"));$(id).classList.remove("hidden");document.querySelectorAll(".tab").forEach(x=>x.classList.remove("active"));if(e)e.classList.add("active");if(id==="history")renderHistory();if(id==="prices")renderPrices();if(id==="addons")renderCatalog()}
function renderHistory(){const a=JSON.parse(localStorage.getItem("bob_v3_quotes")||"[]");$("historyTable").innerHTML="<tr><th>Date</th><th>Quote</th><th>Customer</th><th>Job</th><th>Price</th><th>Status</th></tr>"+(a.length?a.map(x=>`<tr><td>${new Date(x.date).toLocaleDateString("en-AU")}</td><td>${x.quoteNo}</td><td>${x.customer||"—"}<br><small>${x.suburb||""}</small></td><td>${x.doors?.length||1} door(s)<br><small>${x.doors?.[0]?(x.doors[0].type+" "+x.doors[0].w+"×"+x.doors[0].h):(x.type+" "+x.w+"×"+x.h)}</small></td><td><b>${money(x.issue)}</b></td><td>${x.status}</td></tr>`).join(""):`<tr><td colspan="6">No saved quotes.</td></tr>`)}
function clearHistory(){if(confirm("Clear saved quotes?")){localStorage.removeItem("bob_v3_quotes");renderHistory()}}
function exportCSV(){const a=JSON.parse(localStorage.getItem("bob_v3_quotes")||"[]");if(!a.length)return toast("No saved quotes");const rows=[["Date","Quote","Customer","Phone","Email","Suburb","City","Door","Supplier","Width","Height","Motor","Add-ons","Notes","Price","Status","Margin"],...a.map(x=>[x.date,x.quoteNo,x.customer,x.phone,x.email,x.suburb,x.city,x.type,x.supplier,x.w,x.h,x.motor,x.addons,x.notes,x.issue,x.status,x.margin])],csv=rows.map(r=>r.map(v=>`"${String(v??"").replaceAll('"','""')}"`).join(",")).join("\n"),b=new Blob([csv],{type:"text/csv"}),l=document.createElement("a");l.href=URL.createObjectURL(b);l.download="BOB_Quotes.csv";l.click()}
function widths(type,sup){if(type==="Sectional")return sup==="Steel-Line"?[2400,3000,3500,4500,4800,5000,5300,5650,6200]:sup==="Centurion"?[2400,3000,3500,4300,4800,5150,5565,5960,6200]:[2400,3000,3500,4300,4500,4800,5000,5300,5650,5960,6200];return sup==="Steel-Line"?[1500,2150,2650,2850,3150,3250,3430,3760,4370,5100]:sup==="Centurion"?[1500,2000,2490,2650,2800,3100,3400,3760,4370,5100,5400]:[1500,2000,2150,2490,2650,2800,3100,3400,3760,4370,5100,5400]}
function heights(type,sup){return type==="Sectional"?(sup==="Steel-Line"?[2100,2400,2700,3200]:[2100,2400,2700,2900,3150,3400]):[2100,2200,2400,2600,3000]}
function recFor(city,type,sup,w,h,m){const b=base(type,w,h,sup);if(!b.ok)return null;const mi=motor(city,m),lab=installationCost(city,type,w,h,false,mi.name,false,false);if(!lab.ok)return null;const gst=1+S.gst/100,costTarget=(b.cost+mi.cost+lab.cost+S.targetMargin)*gst,salesTarget=(b.cost+lab.cost+S.targetMargin)*gst+mi.retail;return{price:ceil50(Math.max(costTarget,salesTarget)),cost:b.cost,basis:b.basis}}
function renderPrices(){const city=$("plCity").value,type=$("plDoor").value,sup=$("plSupplier").value,m=$("plMotor").value;let r="<tr><th>Height</th><th>Width</th><th>Customer price incl GST</th><th>Supplier basis</th><th class='admin-only'>Door cost ex GST</th></tr>";heights(type,sup).forEach(h=>widths(type,sup).forEach(w=>{const x=recFor(city,type,sup,w,h,m);if(x)r+=`<tr><td><b>${h} mm</b></td><td>${w} mm</td><td><b>${money(x.price)}</b></td><td>${x.basis}</td><td class="admin-only">${money(x.cost)}</td></tr>`}));$("priceTable").innerHTML=r}
const CAT={"Steel-Line|Sectional":[["Colorbond Premium woodlook","$220 ≤3500W / $368 >3500W","Per door"],["Colorbond Matt","$220 ≤3500W / $332 >3500W","Per door"],["Coastal upgrade","$557","Per door"],["Ranch window","$144","Per insert"],["Stanford window","$92","Per insert"],["Heritage window","$73","Per insert"],["Taper","$159 ≤3500W / $258 >3500W","Per door"],["Pelmet 250×55","$156","Each"],["200mm pelmet + Quick Closers","$220","Pair"],["Jamb pairs","$152–$193","By size"],["Cover pairs","$83–$100","By size"],["Mammoth insulation","$818–$1,699","By width/height"]],"Centurion|Sectional":[["Side track seals","$33","Per door"],["Regency window","$86","Per window"],["Georgian window","$170","Per window"],["Taper hinged >40mm","$134","Per lineal metre by width"],["Timbalook Premium","$111 / $139 / $166","Per lineal metre by width, height band"],["Flexographic finish","$53","Per m²"],["Powdercoat finish","$53","Per m²"],["Oversize weather seal","$8","Per lineal metre by width"],["Low headroom kit","$89","Per door"]],"Steel-Line|Roller":[["Colorbond Matt","$184 ≤3100W / $272 >3100W","Per door"],["Reverse rolled","$110 ≤3100W / $125 >3100W","Per door"],["AA track upgrade","$174","≤3100W"],["300mm pelmet","$105 ≤3100W / $113 >3100W","Per door"],["Taper","$189 ≤3000W / $262 >3000W","Per door"],["Jamb pairs","$152–$193","By size"],["Cover pairs","$83–$100","By size"],["Shoot bolts","$37","Pair"],["Centre lock","$48","Each"],["Ember brush seal","$201","Top only"]],"Centurion|Roller":[["Hard cardboard cylinder stretch","$20","Per lineal metre by width"],["Hard cardboard cylinder shrink","$27","Per lineal metre by width"],["Box a Door","$101–$157","By width"],["Premium Matt","$104 / $114 / $142 / $199","Per lineal metre by width, height band"],["Taper","$42","Per lineal metre by width"],["Reverse rolled","$105 Series A / $149 Series AA","Per door"],["Oversize weather seal","$8","Per lineal metre by width"]]};
function renderCatalog(){
 const sup=$("catSupplier").value,type=$("catDoor").value,w=+$("catWidth").value||0,h=+$("catHeight").value||0,ds=defs(sup,type,w,h);
 $("catalogNote").textContent=`Internal supplier cost preview for ${sup} ${type} at ${w} × ${h} mm. These costs never appear on the customer quote; the technician enters the customer price manually.`;
 $("addonTable").innerHTML="<tr><th>Add-on</th><th>Internal cost ex GST</th><th>Pricing basis</th></tr>"+ds.map(d=>{const c=d[3](),basis=d[2]==="qty"?"Per item / quantity":"Per selected add-on";return `<tr><td><b>${d[1]}</b></td><td><b>${c==null?"Office review":money(c)}</b></td><td>${basis} • current size ${w} × ${h} mm${d[4]?" • "+d[4]+" accessory":""}</td></tr>`}).join("")
}

function loadSettingsUI(){Object.keys(DFLT).forEach(function(k){const e=$("s_"+k);if(e)e.value=S[k]})}
function saveSettings(){
 Object.keys(DFLT).forEach(function(k){const e=$("s_"+k);if(!e)return;S[k]=typeof DFLT[k]==="number"?(+e.value||0):e.value});
 safeWrite("bob_v3_settings",JSON.stringify(S));renderAddons(true);renderPrices();renderCatalog();refreshHeaderContact();calc();saveDraft();toast("Settings saved")
}
function resetSettings(){
 if(confirm("Reset business settings to defaults? Quote drafts and saved quotes will stay.")){S=Object.assign({},DFLT);safeWrite("bob_v3_settings",JSON.stringify(S));loadSettingsUI();renderAddons(true);renderPrices();renderCatalog();refreshHeaderContact();calc()}
}
async function repairApp(){
 document.body.classList.add("repairing");saveDraft();
 try{
   if("caches" in window){const keys=await caches.keys();for(const k of keys)if(k.indexOf("bob-")===0)await caches.delete(k)}
   if("serviceWorker" in navigator){const regs=await navigator.serviceWorker.getRegistrations();for(const r of regs)await r.unregister()}
 }catch(e){}
 const p=new URLSearchParams(location.search);p.delete("quote");p.set("fresh",Date.now());if(ROLE_LOCK)p.set("role",ROLE_LOCK);location.replace(location.pathname+"?"+p.toString())
}
function toggleBrisbaneInstallFields(){document.querySelectorAll(".brisbane-install").forEach(function(el){el.style.display=$("city")&&$("city").value==="Brisbane"?"flex":"none"})}
function healthCheck(){
 const ids=["builder","prices","addons","extraChoice","extraCost","extraPrice","doorItems","summary","recommended"],missing=ids.filter(function(id){return !$(id)});
 if(missing.length){localStorage.setItem("bob_last_error","Missing UI: "+missing.join(","));return false}
 return true
}
function bindInputs(){
 ["plCity","plDoor","plSupplier","plMotor"].forEach(function(x){if($(x))$(x).addEventListener("change",renderPrices)});
 ["catSupplier","catDoor","catWidth","catHeight"].forEach(function(x){if($(x))$(x).addEventListener("input",renderCatalog)});
 ["city","doorType","supplier","width","height","doorColour","doorProfile","motor","removal","specialLift","siteMeasure","notes","finalOffer","customer","phone","email","suburb","quoteNo"].forEach(function(x){if($(x))$(x).addEventListener("input",function(){
   if(["doorType","supplier","width","height"].includes(x)){populateColourProfile(true);renderAddons(true)}
   if(x==="city"){refreshHeaderContact();toggleBrisbaneInstallFields()}calc();saveDraft()
 })})
}
async function registerAppWorker(){
 if(!("serviceWorker" in navigator)||location.protocol==="file:")return;
 try{
   const reg=await navigator.serviceWorker.register("./sw.js?v=14");await reg.update();
   let reloading=false;navigator.serviceWorker.addEventListener("controllerchange",function(){if(reloading)return;reloading=true;location.reload()})
 }catch(e){}
}
function bootApp(){
 if(new URLSearchParams(location.search).get("quote"))return;
 if(!healthCheck())return;
 loadSettingsUI();const restored=restoreDraft();
 if(!restored){$("quoteNo").value=qno();$("city").value="Perth";populateColourProfile(false)}else populateColourProfile(true);
 const initialMode=ROLE_LOCK||localStorage.getItem("bob_v3_mode")||"office";setMode(initialMode,true);
 bindInputs();toggleBrisbaneInstallFields();renderAddons(false);renderPrices();renderCatalog();refreshHeaderContact();calc();saveDraft();registerAppWorker()
}
function encodeQuote(q){const raw=encodeURIComponent(JSON.stringify(q));return btoa(unescape(raw)).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"")}
function decodeQuote(x){try{let v=x.replace(/-/g,"+").replace(/_/g,"/");while(v.length%4)v+="=";return JSON.parse(decodeURIComponent(escape(atob(v))))}catch(e){return null}}

function customerUrl(){
 const q=getFullQuote();if(q.status!=="APPROVED"||!q.doors.length){toast("Complete all doors before sharing");return""}
 const publicQ={quoteNo:q.quoteNo,customer:q.customer,suburb:q.suburb,city:q.city,doors:q.doors.map(function(d){return{type:d.type,w:d.w,h:d.h,colour:d.colour,profile:d.profile,motor:d.motor,removal:d.removal,addonItems:(d.addonItems||[]).map(function(i){return{name:i.name,displayName:i.displayName,measure:i.measure,qty:i.qty,totalRetail:i.totalRetail}}),notes:d.notes,issue:d.issue}}),issue:q.issue,businessName:S.businessName,businessPhone:q.businessPhone,businessEmail:q.businessEmail,businessWebsite:q.businessWebsite,quoteValidity:S.quoteValidity,created:new Date().toISOString()};
 const url=location.origin+location.pathname+"?quote="+encodeURIComponent(encodeQuote(publicQ));if(url.length>7000){toast("This quote is too large for a customer link — use Share PDF");return""}return url
}
async function shareCustomerLink(){
 const url=customerUrl(),q=getFullQuote();if(!url)return;const txt="Your "+S.businessName+" quote: "+url;
 if(navigator.share){try{await navigator.share({title:"Quote "+q.quoteNo,text:txt,url:url});return}catch(e){}}
 try{await navigator.clipboard.writeText(url);toast("Customer link copied")}catch(e){prompt("Copy customer link",url)}
}
function installApp(){if(deferredInstallPrompt){deferredInstallPrompt.prompt();deferredInstallPrompt.userChoice.finally(function(){deferredInstallPrompt=null});return}const ios=/iphone|ipad|ipod/i.test(navigator.userAgent);alert(ios?"On iPhone: tap Share in Safari, then Add to Home Screen.":"Use your browser menu and choose Install app / Add to Home Screen.")}
function renderPublicQuote(q){
 if(!q||!q.issue||!q.doors||!q.doors.length)return;const esc=safe,contact=[q.businessPhone,q.businessEmail,q.businessWebsite].filter(Boolean).map(esc).join(" • ");
 const doors=q.doors.map(function(d,i){
   return '<section class="public-door"><h2>Door '+(i+1)+' — '+esc(d.type)+'</h2><div class="public-grid"><div><b>Width</b><span>'+esc(d.w)+' mm</span></div><div><b>Height</b><span>'+esc(d.h)+' mm</span></div><div><b>Colour</b><span>'+esc(d.colour||"")+'</span></div><div><b>Profile / Style</b><span>'+esc(d.profile||"")+'</span></div><div><b>Motor</b><span>'+esc(d.motor||"")+'</span></div><div><b>Removal</b><span>'+(d.removal?"Included":"Not included")+'</span></div></div>'+((d.addonItems||[]).length?'<div class="public-notes"><b>Extras</b><p>'+d.addonItems.map(function(x){return esc(x.displayName||x.name)+(x.qty>1?" ×"+x.qty:"")}).join("<br>")+'</p></div>':"")+(d.notes?'<div class="public-notes"><b>Notes</b><p>'+esc(d.notes)+'</p></div>':"")+'<div class="public-door-total">Door total: '+money(d.issue)+' incl. GST</div></section>'
 }).join("");
 document.body.className="public-quote";document.body.innerHTML='<main class="public-card"><div class="public-head"><img class="public-brand-logo" src="brand-logo.svg?v=10" alt="B.O.B Garage Doors"><div><h1>'+esc(q.businessName||"B.O.B Garage Doors")+'</h1><p>Supply & Installation Quote • '+esc(q.city||"")+'</p></div></div><div class="public-price">'+money(q.issue)+' <span>quote total incl. GST</span></div><div class="public-grid"><div><b>Quote</b><span>'+esc(q.quoteNo||"")+'</span></div><div><b>Customer</b><span>'+esc(q.customer||"")+'</span></div><div><b>Location</b><span>'+esc(q.suburb||"")+'</span></div><div><b>Number of doors</b><span>'+q.doors.length+'</span></div></div>'+doors+'<div class="public-valid">Valid for '+esc(q.quoteValidity||14)+' days from issue date.</div><div class="public-actions"><button onclick="window.print()">Save / Print PDF</button>'+(q.businessPhone?'<a href="tel:'+esc(q.businessPhone)+'">Call us</a>':"")+(q.businessEmail?'<a href="mailto:'+esc(q.businessEmail)+'">Email us</a>':"")+(q.businessWebsite?'<a href="https://'+esc(q.businessWebsite.replace(/^https?:\/\//,""))+'" target="_blank">Website</a>':"")+'</div><div class="public-contact">'+contact+'</div></main>'
}
const publicParam=new URLSearchParams(location.search).get("quote");if(publicParam){const pq=decodeQuote(publicParam);if(pq)renderPublicQuote(pq)}else{bootApp()}
