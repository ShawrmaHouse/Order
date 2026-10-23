(function(){try{
var BASE="https://shawrmahouse.github.io/Order/";
var N=window.$nuxt,S=N&&N.$store;
if(!S||!S.state||!S.state.concept){alert("الاختصار ده بيشتغل على موقع بيت الشاورما.\nافتح order.shawarmahouse.com.sa واطلب، وبعدين دوسه.");return}
var st=S.state;
if(!st.concept.categoryItems||!st.concept.categoryItems.length){alert("المنيو لسه بيحمّل، استنى ثانية وجرب تاني");return}
var nm=function(x){if(x&&typeof x=="object"){return x["ar-sa"]||x.ar||x["en-us"]||x[Object.keys(x)[0]]||""}return x==null?"":String(x)};
var G={},M={},I={},C={};
st.concept.modifierGroups.forEach(function(g){G[g.id]=g.attributes});
st.concept.modifiers.forEach(function(m){M[m.id]=m.attributes});
st.concept.categoryItems.forEach(function(c,ci){(c.attributes.items||[]).forEach(function(i,ii){I[i.id]=i;C[i.id]=[c.id,nm((c.attributes.category||{}).name||c.attributes.name),ci,ii]})});
var groups=function(it){return(it["modifier-groups"]||[]).map(function(g){var o=typeof g=="object"?g:{id:g},gg=G[o.id]||{},own=o.modifiers&&o.modifiers.length;return{id:o.id,g:gg,min:o.min!=null?o.min:gg.minimum,max:o.max!=null?o.max:gg.maximum,ids:(own?o.modifiers:gg.modifiers||[]).map(function(x){return typeof x=="object"?x.id:x})}})};
var groupOf=function(igs,mid){for(var k=0;k<igs.length;k++){if(igs[k].ids.indexOf(mid)>-1)return igs[k]}return null};
var raw=(location.hash.match(/gx=([^&]+)/)||[])[1],data=null;
if(raw){try{data=JSON.parse(decodeURIComponent(raw))}catch(e){}}
if(!data&&!st.cart.items.length){var t=prompt("سلتك فاضية.\n\nاختار أكلك من الموقع وحطه في السلة، وبعدين دوس الاختصار تاني.\n\n(لو معاك كود الطلب الجماعي عشان تملا السلة، الصقه هنا)");if(!t)return;try{data=JSON.parse(t.trim())}catch(e){alert("الكود ده مش صحيح");return}}
if(!data){
var out=st.cart.items.map(function(ci){
var it=I[ci.id]||{},c=C[ci.id]||[0,"",999,0],igs=groups(it),base=it.price!=null?it.price:(ci.price||0),add=0,o=[];
(ci.modifiers||[]).forEach(function(m){var mm=M[m.id]||m,q=m.quantity||1,ig=groupOf(igs,m.id),size=m.isSize||(ig&&ig.g.type=="sizes"),p=mm.price!=null?mm.price:(m.price||0);if(size){base=p}else{add+=p*q}o.push([m.id,nm(mm.name||m.name),p,size?1:0,q])});
return[ci.id,nm(it.name||ci.name),c[0],c[1],c[2],c[3],ci.quantity||1,base+add,ci.notes||null,o]});
location.href=BASE+"#add="+encodeURIComponent(JSON.stringify(out));
return}
if(st.cart.items.length&&!confirm("السلة فيها أصناف دلوقتي. أمسحها وأحط الطلب الجماعي؟"))return;
S.commit("cart/EMPTY_CART");
var pcs=0,skip=[];
data.forEach(function(r){
var id=r[0],mods=r[1]||[],q=r[2]||1,note=r[3]||null,name=r[4]||String(id),it=I[id];
if(!it||it.enabled===false){skip.push(name);return}
var igs=groups(it),base=it.price,add=0,out=[],bad=false,idx=0,cnt={},ord=[];
mods.forEach(function(mid){if(!cnt[mid]){cnt[mid]=0;ord.push(mid)}cnt[mid]++});
ord.forEach(function(mid){var m=M[mid],ig=groupOf(igs,mid),n=cnt[mid];if(!m||!ig){bad=true;return}var g=ig.g;idx++;
if(g.type=="sizes"){base=m.price;out.push({id:mid,name:m.name,price:m.price,notes:"",quantity:1,isSize:true,prices:[]})}
else{add+=m.price*n;out.push({id:mid,name:m.name,price:m.price,notes:"",quantity:n,modifiers:[],isSize:false,maximum:ig.max,minimum:ig.min,modifier_group_id:ig.id,"free-modifiers-count":0,prices:[],originalPrice:m.price,index:idx})}});
if(bad){skip.push(name);return}
S.commit("cart/ADD_ITEM",{id:it.id,price:it.price,description:it.description,quantity:q,notes:note,name:it.name,imgUrl:it["image-uri"],discount:0,"combo-items":[],"excluded-locations":it["excluded-locations"]||[],"out-of-stock-locations":it["out-of-stock-locations"]||[],modifiers:out,ingredients:[],total:base+add,prices:[]});
pcs+=q});
localStorage.setItem("items",JSON.stringify(st.cart.items));
history.replaceState(null,"",location.pathname);
alert("اتضاف "+pcs+" صنف للسلة ✔"+(skip.length?"\n\nدول مش لاقيهم بنفس الاختيارات، ضيفهم بإيدك:\n- "+skip.join("\n- "):""));
var cb=[].slice.call(document.querySelectorAll("button,a")).find(function(b){return/عرض الطلبات|View/i.test(b.innerText||"")});
if(cb)cb.click();
}catch(e){alert("حصلت مشكلة: "+e.message)}})();
