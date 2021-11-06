"use strict";(self.webpackChunk_dev_web=self.webpackChunk_dev_web||[]).push([[59],{3059:(e,n,t)=>{t.r(n),t.d(n,{default:()=>R});var o=t(2784),r=t(5992),l=t(1148),a=t(859),s=t(32),c=t(878),u=t(2779),m=t.n(u),i=t(6062),p=t.n(i),d=t(4036),E=t.n(d),A=t(6793),S=t.n(A),v=t(7892),g=t.n(v),b=t(1173),C=t.n(b),f=t(2464),h=t.n(f),w=t(5450),F={};F.styleTagTransform=h(),F.setAttributes=g(),F.insert=S().bind(null,"head"),F.domAPI=E(),F.insertStyleElement=C(),p()(w.Z,F);const T=w.Z&&w.Z.locals?w.Z.locals:void 0;function k(){return k=Object.assign||function(e){for(var n=1;n<arguments.length;n++){var t=arguments[n];for(var o in t)Object.prototype.hasOwnProperty.call(t,o)&&(e[o]=t[o])}return e},k.apply(this,arguments)}const x=(0,o.createContext)({});function y({...e}){return o.createElement(x.Provider,{value:{name}},o.createElement("form",k({},e,{className:m()(T.Form)})))}function I({...e}){return o.createElement("fieldset",e)}function L({...e}){return o.createElement("legend",e)}const P=(0,o.createContext)({});function B({name:e,...n}){return o.createElement(P.Provider,{value:{name:e}},o.createElement("div",n))}function Z({...e}){const{name:n}=(0,o.useContext)(P);return o.createElement("div",null,o.createElement("label",k({htmlFor:n},e)))}function G({...e}){const{name:n}=(0,o.useContext)(P);return o.createElement("div",null,o.createElement("input",k({name:n},e)))}function _({...e}){return o.createElement("div",null,o.createElement("span",e))}function N({...e}){return o.createElement("div",null,o.createElement("button",k({type:"submit",name:"action"},e)))}let j,U;!function(e){e.Step1="STEP_1",e.Step2="STEP_2",e.Step3="STEP_3"}(j||(j={})),function(e){e.Init="INIT",e.Next="NEXT",e.Back="BACK",e.Logout="LOGOUT"}(U||(U={}));var D=t(3827),O={};O.styleTagTransform=h(),O.setAttributes=g(),O.insert=S().bind(null,"head"),O.domAPI=E(),O.insertStyleElement=C(),p()(D.Z,O);const z=D.Z&&D.Z.locals?D.Z.locals:void 0,Q=(e=>e.join())`
  mutation Signin(
    $step: String
    $action: String
    $step1: LoginStep1Input
    $step2: LoginStep2Input
  ) {
    signin(step: $step, action: $action, step1: $step1, step2: $step2) {
      __typename
      step
      ... on LoginStep1 {
        username
        errors {
          username
        }
      }
      ... on LoginStep2 {
        password
        errors {
          password
        }
      }
    }
  }
`;function R(){const[e]=(0,r.Db)(Q),[n,t,u]=function(e,n,t){const[r,u]=(0,o.useState)((()=>({}))),m=(0,o.useMemo)((()=>new l.x),[]);(0,o.useEffect)((()=>{const n=m.pipe((0,s.g)(500),(0,c.z)((n=>(0,a.D)(e(n)))),(0,s.g)(500)).subscribe((e=>Boolean(console.log({mutate:e}))||u((({signin:e})=>n=>({...n,[e.step]:e}))(e.data))));return m.next({}),()=>n.unsubscribe()}),[m]);const i=(0,o.useCallback)((e=>(({target:{form:{name:e},name:n,value:t}})=>Boolean(console.log(["handleChange"],{step:e,name:n,value:t}))||u((o=>({...o,[e]:{...o[e],[n]:t}}))))(e)),[]),p=(0,o.useCallback)((e=>e.preventDefault()||(({target:{name:e},nativeEvent:{submitter:{value:n}}})=>Boolean(console.log(["handleSubmit"],{step:e,action:n}))||m.next(((e,n,t)=>({variables:Object.assign({step:e,action:n},{[j.Step1]:{[U.Next]:({username:e})=>({step1:{username:e}})},[j.Step2]:{[U.Back]:()=>({}),[U.Next]:({password:e})=>({step2:{password:e}})},[j.Step3]:{[U.Logout]:()=>({})}}[e][n](t[e]))}))(e,n,r)))(e)),[r]);return[r,i,p]}(e);return o.createElement("section",{className:z.Section},o.createElement("h2",null,"Forms"),n[j.Step1]&&o.createElement(y,{name:j.Step1,onChange:t,onSubmit:u},o.createElement(I,null,o.createElement(L,null,"Step1"),o.createElement(B,{name:"username"},o.createElement(Z,null,"Username"),o.createElement(G,{autoFocus:!0})),o.createElement(_,null),o.createElement(N,{value:U.Next},"Next"))),n[j.Step2]&&o.createElement(y,{name:j.Step2,onChange:t,onSubmit:u},o.createElement(I,null,o.createElement(L,null,"Step2"),o.createElement(B,{name:"password"},o.createElement(Z,null,"Password"),o.createElement(G,{autoFocus:!0})),o.createElement(_,null),o.createElement(N,{value:U.Next},"Next"),o.createElement(N,{value:U.Back},"Back"))),n[j.Step3]&&o.createElement(y,{name:j.Step3,onChange:t,onSubmit:u},o.createElement(I,null,o.createElement(L,null,"Step3"),o.createElement(B,{name:"password"},o.createElement(Z,null,"LoggedIn")),o.createElement(_,null),o.createElement(N,{value:U.Logout,autoFocus:!0},"Logout"))))}},5450:(e,n,t)=>{t.d(n,{Z:()=>s});var o=t(272),r=t.n(o),l=t(2609),a=t.n(l)()(r());a.push([e.id,".Y0oU17ATPuJ3r9UC_xZg{color:blue}.g4QOpCIIrfx1xI7gat6G.FkcPsz_TwMovCk7Gel3Q fieldset{border-color:red}.DXGw6UCkT0Ljh5PLAFlR.FkcPsz_TwMovCk7Gel3Q{color:red}","",{version:3,sources:["webpack://./src/components/styles.module.scss"],names:[],mappings:"AAAA,sBACE,UAAA,CAIE,oDACE,gBAAA,CAKJ,2CACE,SAAA",sourcesContent:[".Section {\n  color: blue;\n}\n.Form {\n  &.invalid {\n    fieldset {\n      border-color: red;\n    }\n  }\n}\n.Field {\n  &.invalid {\n    color: red;\n  }\n}\n"],sourceRoot:""}]),a.locals={Section:"Y0oU17ATPuJ3r9UC_xZg",Form:"g4QOpCIIrfx1xI7gat6G",invalid:"FkcPsz_TwMovCk7Gel3Q",Field:"DXGw6UCkT0Ljh5PLAFlR"};const s=a},3827:(e,n,t)=>{t.d(n,{Z:()=>s});var o=t(272),r=t.n(o),l=t(2609),a=t.n(l)()(r());a.push([e.id,".HHGfdvALL8opRFX4T2Dp{color:blue}.zmbUS4qY6hyGuScChGns.yjjddBYwRSMIzHy7W6JZ fieldset{border-color:red}.mrN0PYufDWOQtcym4TuQ.yjjddBYwRSMIzHy7W6JZ{color:red}","",{version:3,sources:["webpack://./src/containers/Forms.module.scss"],names:[],mappings:"AAAA,sBACE,UAAA,CAIE,oDACE,gBAAA,CAKJ,2CACE,SAAA",sourcesContent:[".Section {\n  color: blue;\n}\n.Form {\n  &.invalid {\n    fieldset {\n      border-color: red;\n    }\n  }\n}\n.Field {\n  &.invalid {\n    color: red;\n  }\n}\n"],sourceRoot:""}]),a.locals={Section:"HHGfdvALL8opRFX4T2Dp",Form:"zmbUS4qY6hyGuScChGns",invalid:"yjjddBYwRSMIzHy7W6JZ",Field:"mrN0PYufDWOQtcym4TuQ"};const s=a}}]);
//# sourceMappingURL=59.js.map