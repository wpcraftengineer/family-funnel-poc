'use strict';
const form=document.getElementById('lead-form');
if(form){const consult=document.getElementById('consult'), income=document.getElementById('income'),offer=document.getElementById('offer'),fields=document.getElementById('call-fields'),phone=document.getElementById('phone');
const toggle=()=>{const qualified=income.value==='over';offer.hidden=!qualified;if(!qualified)consult.checked=false;fields.hidden=!consult.checked;phone.required=consult.checked;if(!consult.checked){phone.value='';document.getElementById('time').value='';}};
consult.addEventListener('change',toggle);income.addEventListener('change',toggle);toggle();
form.addEventListener('submit',event=>{event.preventDefault();if(!form.reportValidity())return;const route=income.value==='over'?'qualified':'general';window.location.href='thank-you.html?route='+route+'&consult='+ (consult.checked?'yes':'no');});}
const result=document.getElementById('consult-status');
if(result){const params=new URLSearchParams(window.location.search),qualified=params.get('route')==='qualified',opted=qualified&&params.get('consult')==='yes';
result.textContent=opted?'Demo: qualified route + consultation requested. The live automation would send this request to advisor follow-up. No real call has been requested.':qualified?'Demo: qualified route + playbook only. This visitor did not request a call; do not send to advisor follow-up.':'Demo: general route + playbook only. Send the guide without advisor follow-up. Everyone receives the same download.';
document.getElementById('optional-next').hidden=!qualified||opted;}
